from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, ConfigDict


# /me
class Me(BaseModel):
    id: str
    name: str
    role: str
    location: str
    timezone: str
    years_of_experience: int
    primary_language: str
    available_for_hire: bool
    remote_friendly: bool
    languages_spoken: list[str]


# /skills
class SkillsBackend(BaseModel):
    frameworks: list[str]
    orm: list[str]
    validation: list[str]


class Skills(BaseModel):
    backend: SkillsBackend
    databases: list[str]
    message_brokers: list[str]
    frontend: list[str]
    devops: list[str]
    total_skills: int


# /contact
class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    message: str = Field(min_length=10, max_length=2000)


class ContactOut(BaseModel):
    message_id: str
    delivered: bool
    channel: str
    will_reply_within: str
    timestamp: datetime


# /github
class GithubProfile(BaseModel):
    username: str
    url: str
    public_repos: int
    primary_languages: list[str]
    contribution_last_year: int

    model_config = ConfigDict(extra="ignore")
