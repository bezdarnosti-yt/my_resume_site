"""FastAPI entry point."""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import contact, github, me, skills
from app.config import get_settings

settings = get_settings()

logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

app = FastAPI(
    title="Denis Sorokin · Resume API",
    description="Backend powering the interactive resume site.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

API_V1 = "/api/v1"
app.include_router(me.router,       prefix=API_V1)
app.include_router(skills.router,   prefix=API_V1)
app.include_router(contact.router,  prefix=API_V1)
app.include_router(github.router,   prefix=API_V1)


@app.get("/", tags=["meta"])
async def root() -> dict[str, str]:
    return {
        "service": "cv-resume-api",
        "version": app.version,
        "docs": "/docs",
    }


@app.get("/health", tags=["meta"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
