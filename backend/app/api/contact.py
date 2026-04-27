import logging
import uuid
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, HTTPException, status

from app.schemas import ContactIn, ContactOut
from app.config import get_settings

router = APIRouter(tags=["contact"])
log = logging.getLogger(__name__)


@router.post(
        "/contact",
        response_model=ContactOut,
        status_code=status.HTTP_201_CREATED,
        summary="Send a contact message",
)
async def send_contact(payload: ContactIn) -> ContactOut:
    settings = get_settings()
    message_id = f"msg_{uuid.uuid4().hex[:8]}"

    if not settings.tg_bot_token or not settings.tg_chat_id:
        log.warning("TG credentials missing - accepting message without delivery")
        return ContactOut(
            message_id=message_id,
            delivered=False,
            channel="dev-noop",
            will_reply_within="4h",
            timestamp=datetime.now(timezone.utc)
        )
    
    text = (
        f"New message from {payload.name} <{payload.email}>\n\n"
        f"{payload.message}\n\n"
        f"id: {message_id}"
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(
                f"https://api.telegram.org/bot{settings.tg_bot_token}/sendMessage",
                json={"chat_id": settings.tg_chat_id, "text": text},
            )
        if r.status_code != 200:
            log.error("Telegram API error: %s %s", r.status_code, r.text)
            raise HTTPException(status_code=502, detail="message delivery failed")
    except httpx.RequestError as e:
        log.exception("Telegram request failed")
        raise HTTPException(status_code=502, detail="upstream unreachable") from e
    
    return ContactOut(
        message_id=message_id,
        delivered=True,
        channel="telegram",
        will_reply_within="4h",
        timestamp=datetime.now(timezone.utc),
    )