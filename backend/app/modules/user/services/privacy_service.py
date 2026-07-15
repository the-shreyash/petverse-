"""
app/services/privacy_service.py

Business logic for profile visibility / search-discoverability settings.

Rows are created lazily, same rationale as ``PreferenceService``.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.user.models.user_privacy import UserPrivacySetting
from app.modules.user.repositories.user_privacy_repository import UserPrivacyRepository
from app.modules.user.schemas.user import PrivacyUpdateRequest


class PrivacyService:
    """Read/update the current user's privacy settings, creating defaults lazily."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.privacy = UserPrivacyRepository(session)

    async def get_or_create(self, user_id: str) -> UserPrivacySetting:
        privacy = await self.privacy.get_by_user_id(user_id)
        if privacy is None:
            privacy = await self.privacy.add(UserPrivacySetting(user_id=user_id))
        return privacy

    async def update(
        self, user_id: str, payload: PrivacyUpdateRequest
    ) -> UserPrivacySetting:
        privacy = await self.get_or_create(user_id)
        for field, value in payload.model_dump().items():
            setattr(privacy, field, value)
        return await self.privacy.save(privacy)
