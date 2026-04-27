"""Application configuration loaded from environment."""
from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed app settings — validated at startup."""

    env: str = Field(default="dev", pattern="^(dev|stage|prod)$")
    debug: bool = False

    # NB: stored as a single string in .env (CSV or JSON) and split below.
    # Using `str` here avoids pydantic-settings trying to JSON-decode the env value.
    cors_origins: str = "http://localhost:5173"

    tg_bot_token: str = ""
    tg_chat_id: str = ""

    github_username: str = "bezdarnosti-yt"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS as either JSON array or comma-separated list."""
        raw = self.cors_origins.strip()
        if not raw:
            return []
        if raw.startswith("["):
            import json
            return [str(o).strip() for o in json.loads(raw)]
        return [o.strip() for o in raw.split(",") if o.strip()]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _coerce_cors(cls, v: object) -> str:
        # Allow passing a Python list at construction time too.
        if isinstance(v, list):
            return ",".join(str(x) for x in v)
        return str(v) if v is not None else ""


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor — call once per process."""
    return Settings()
