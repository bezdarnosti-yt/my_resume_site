from fastapi import APIRouter

from app.data import RESUME
from app.schemas import Skills

router = APIRouter(tags=["skills"])


@router.get("/skills", response_model=Skills, summary="Full tech stack")
async def get_skills() -> Skills:
    return Skills(**RESUME["skills"])