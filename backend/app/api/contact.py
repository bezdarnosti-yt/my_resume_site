import asyncio
import logging
import smtplib
import uuid
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from fastapi import APIRouter, HTTPException, status

from app.config import get_settings
from app.schemas import ContactIn, ContactOut

router = APIRouter(tags=["contact"])
log = logging.getLogger(__name__)


def _send_email(smtp_host: str, smtp_port: int, smtp_user: str,
                smtp_password: str, notify_email: str, msg: MIMEMultipart) -> None:
    with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)


@router.post(
    "/contact",
    response_model=ContactOut,
    status_code=status.HTTP_201_CREATED,
    summary="Send a contact message",
)
async def send_contact(payload: ContactIn) -> ContactOut:
    settings = get_settings()
    message_id = f"msg_{uuid.uuid4().hex[:8]}"

    if not settings.smtp_user or not settings.smtp_password or not settings.notify_email:
        log.warning("Email credentials missing — accepting message without delivery")
        return ContactOut(
            message_id=message_id,
            delivered=False,
            channel="dev-noop",
            will_reply_within="4h",
            timestamp=datetime.now(timezone.utc),
        )

    msg = MIMEMultipart()
    msg["From"] = settings.smtp_user
    msg["To"] = settings.notify_email
    msg["Subject"] = f"CV Site: message from {payload.name}"
    body = (
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n\n"
        f"Message:\n{payload.message}\n\n"
        f"ID: {message_id}"
    )
    msg.attach(MIMEText(body, "plain"))

    try:
        await asyncio.to_thread(
            _send_email,
            settings.smtp_host,
            settings.smtp_port,
            settings.smtp_user,
            settings.smtp_password,
            settings.notify_email,
            msg,
        )
    except Exception as e:
        log.exception("Email delivery failed")
        raise HTTPException(status_code=502, detail="message delivery failed") from e

    return ContactOut(
        message_id=message_id,
        delivered=True,
        channel="email",
        will_reply_within="4h",
        timestamp=datetime.now(timezone.utc),
    )
