from typing import Any

RESUME: dict[str, Any] = {
    "me": {
        "id": "0",
        "name": "Denis Sorokin",
        "role": "Python Backend Developer",
        "location": "Chelyabinsk, RU",
        "timezone": "UTC+5",
        "years_of_experience": 1,
        "primary_language": "python",
        "available_for_hire": True,
        "remote_friendly": True,
        "languages_spoken": ["ru", "en"],
    },
    "skills": {
        "backend": {
            "frameworks": ["FastAPI", "Flask"],
            "orm": ["SQLAlchemy"],
            "validation": ["pydantic"],
        },
        "databases": ["PostgreSQL", "Redis"],
        "message_brokers": ["Kafka"],
        "frontend": ["React", "TypeScript"],
        "devops": ["Docker", "Git", "CI/CD"],
        "total_skills": 12,
    },
}