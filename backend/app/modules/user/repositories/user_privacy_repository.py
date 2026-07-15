"""
app/repositories/user_privacy_repository.py

Data-access layer for the ``user_privacy_settings`` table.
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.user.models.user_privacy import UserPrivacySetting


from app.core.repository import BaseRepository

class UserPrivacyRepository(BaseRepository[UserPrivacySetting]):
    """CRUD operations for :class:`UserPrivacySetting`."""

    def __init__(self, session: AsyncSession):
        super().__init__(UserPrivacySetting, session)

    async def get_by_user_id(self, user_id: str) -> Optional[UserPrivacySetting]:
        result = await self.session.execute(
            select(UserPrivacySetting).where(UserPrivacySetting.user_id == user_id)
        )
        return result.scalar_one_or_none()

