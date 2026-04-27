from fastapi import APIRouter

from app.schemas import Me
from app.data import RESUME

router = APIRouter(tags=["me"])


@router.get("/me", response_model=Me, summary="Developer profile")
async def get_me() -> Me:
    return Me(**RESUME["me"])