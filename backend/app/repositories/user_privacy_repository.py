"""
app/repositories/user_privacy_repository.py

Data-access layer for the ``user_privacy_settings`` table.
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_privacy import UserPrivacySetting


class UserPrivacyRepository:
    """CRUD operations for :class:`UserPrivacySetting`."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_user_id(self, user_id: str) -> Optional[UserPrivacySetting]:
        result = await self.session.execute(
            select(UserPrivacySetting).where(UserPrivacySetting.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def add(self, privacy: UserPrivacySetting) -> UserPrivacySetting:
        self.session.add(privacy)
        await self.session.flush()
        await self.session.refresh(privacy)
        return privacy

    async def save(self, privacy: UserPrivacySetting) -> UserPrivacySetting:
        self.session.add(privacy)
        await self.session.flush()
        await self.session.refresh(privacy)
        return privacy
