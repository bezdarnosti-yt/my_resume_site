import logging

import httpx
from fastapi import APIRouter, HTTPException

from app.config import get_settings
from app.schemas import GithubProfile

router = APIRouter(tags=["github"])
log = logging.getLogger(__name__)


@router.get("/github", response_model=GithubProfile, summary="GitHub profile")
async def get_github() -> GithubProfile:
    settings = get_settings()
    user = settings.github_username

    try:
        async with httpx.AsyncClient(timeout=8.0, headers={"User-Agent": "cv-resume"}) as c:
            user_resp = await c.get(f"https://api.github.com/users/{user}")
            repos_resp = await c.get(
                f"https://api.github.com/users/{user}/repos",
                params={"per_page": 100, "type": "owner"},
            )
    except httpx.RequestError as e:
        log.exception("GitHub request failed")
        raise HTTPException(status_code=502, detail="github unreachable") from e
    
    if user_resp.status_code != 200:
        raise HTTPException(status_code=user_resp.status_code, detail="github user not found")
    
    user_data = user_resp.json()
    repos = repos_resp.json() if repos_resp.status_code == 200 else []

    languages: dict[str, int] = {}
    for repo in repos:
        lang = repo.get("language")
        if lang:
            languages[lang] = languages.get(lang, 0) + 1
    primary = sorted(languages, key=languages.get, reverse=True)[:3]

    return GithubProfile(
        username=user_data["login"],
        url=user_data["html_url"],
        public_repos=user_data.get("public_repos", 0),
        primary_languages=primary or ["Python"],
        contribution_last_year=327, # TODO: contributions API requires GraphQL + token
    )