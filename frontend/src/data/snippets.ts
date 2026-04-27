/* ============================================
   Python code snippets for the playground
   ============================================ */
import type { Lang } from "../hooks/useLang";

export interface Snippet {
  id: string;
  file: string;
  title: string;
  tags: string[];
  desc: Record<Lang, string>;
  code: string;
}

export const SNIPPETS: Snippet[] = [
  {
    id: "fastapi-di",
    file: "app/api/users.py",
    title: "FastAPI dependency injection",
    tags: ["FastAPI", "pydantic", "async"],
    desc: {
      ru: "Чистый эндпоинт: pydantic-валидация, DI для сервиса и юнит-оф-уорка.",
      en: "Clean endpoint: pydantic validation, DI for service and unit-of-work.",
    },
    code: `from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from app.deps import get_user_service, CurrentUser
from app.services.users import UserService, UserAlreadyExists

router = APIRouter(prefix="/users", tags=["users"])


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    role: str = Field(default="member", pattern="^(member|admin)$")


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str

    model_config = {"from_attributes": True}


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    service: UserService = Depends(get_user_service),
    current: CurrentUser = Depends(),
) -> UserOut:
    """Create a new user. Admins only."""
    if current.role != "admin":
        raise HTTPException(403, "admins only")

    try:
        user = await service.create(payload)
    except UserAlreadyExists as e:
        raise HTTPException(409, str(e))

    return UserOut.model_validate(user)
`,
  },
  {
    id: "sqlalchemy",
    file: "app/db/repository.py",
    title: "SQLAlchemy 2.0 async repository",
    tags: ["SQLAlchemy", "async", "PostgreSQL"],
    desc: {
      ru: "Generic-репозиторий с асинхронной сессией. Чистая граница между ORM и доменом.",
      en: "Generic repository with an async session. Clean boundary between ORM and domain.",
    },
    code: `from typing import Generic, TypeVar
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase

T = TypeVar("T", bound=DeclarativeBase)


class Repository(Generic[T]):
    """Thin async repository over SQLAlchemy 2.0."""

    model: type[T]

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get(self, id_: int) -> T | None:
        return await self.session.get(self.model, id_)

    async def find_by(self, **kwargs) -> list[T]:
        stmt = select(self.model).filter_by(**kwargs)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def add(self, entity: T) -> T:
        self.session.add(entity)
        await self.session.flush()
        return entity
`,
  },
  {
    id: "kafka",
    file: "app/workers/events.py",
    title: "Async Kafka consumer",
    tags: ["Kafka", "aiokafka", "async"],
    desc: {
      ru: "Idempotent-обработчик с back-pressure и graceful shutdown.",
      en: "Idempotent handler with back-pressure and graceful shutdown.",
    },
    code: `import asyncio
import logging

from aiokafka import AIOKafkaConsumer
from app.events import EventEnvelope, dispatch

log = logging.getLogger(__name__)


async def run_consumer(topic: str, group_id: str) -> None:
    consumer = AIOKafkaConsumer(
        topic,
        bootstrap_servers="kafka:9092",
        group_id=group_id,
        enable_auto_commit=False,
        max_poll_records=64,
    )
    await consumer.start()
    log.info("consumer started for %s", topic)

    try:
        async for msg in consumer:
            try:
                event = EventEnvelope.model_validate_json(msg.value)
                await dispatch(event)
                await consumer.commit()
            except Exception:
                log.exception("event %s failed, will retry", msg.offset)
                await asyncio.sleep(0.5)
    finally:
        await consumer.stop()
        log.info("consumer stopped cleanly")
`,
  },
  {
    id: "pydantic",
    file: "app/config.py",
    title: "Pydantic settings — typed config",
    tags: ["pydantic", "12-factor"],
    desc: {
      ru: "Конфиг из переменных окружения с валидацией и кэшированием.",
      en: "Environment-driven config with validation and caching.",
    },
    code: `from functools import lru_cache
from pydantic import Field, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment."""

    env: str = Field(default="dev", pattern="^(dev|stage|prod)$")
    debug: bool = False

    database_url: PostgresDsn
    redis_url: RedisDsn

    jwt_secret: str = Field(min_length=32)
    jwt_ttl_minutes: int = 60

    kafka_brokers: list[str] = ["kafka:9092"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()  # validated at startup
`,
  },
  {
    id: "redis",
    file: "app/services/rate_limit.py",
    title: "Sliding-window rate limiter",
    tags: ["Redis", "algorithms"],
    desc: {
      ru: "Sliding-window лимитер на Redis sorted sets — O(log N).",
      en: "Sliding-window limiter on Redis sorted sets — O(log N).",
    },
    code: `import time
from redis.asyncio import Redis


class RateLimiter:
    """Sliding-window rate limiter backed by Redis ZSET."""

    def __init__(self, redis: Redis, *, limit: int, window_sec: int) -> None:
        self.redis = redis
        self.limit = limit
        self.window = window_sec

    async def hit(self, key: str) -> bool:
        now = time.time()
        cutoff = now - self.window
        bucket = f"rl:{key}"

        async with self.redis.pipeline(transaction=True) as pipe:
            pipe.zremrangebyscore(bucket, 0, cutoff)
            pipe.zadd(bucket, {str(now): now})
            pipe.zcard(bucket)
            pipe.expire(bucket, self.window)
            _, _, count, _ = await pipe.execute()

        return count <= self.limit
`,
  },
];
