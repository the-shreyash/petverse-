"""
app/repositories/user_preference_repository.py

Data-access layer for the ``user_preferences`` table. Mirrors the shape of
``UserRepository`` — the only place that talks to SQLAlchemy for preferences.
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.user.models.user_preference import UserPreference


from app.core.repository import BaseRepository

class UserPreferenceRepository(BaseRepository[UserPreference]):
    """CRUD operations for :class:`UserPreference`."""

    def __init__(self, session: AsyncSession):
        super().__init__(UserPreference, session)

    async def get_by_user_id(self, user_id: str) -> Optional[UserPreference]:
        result = await self.session.execute(
            select(UserPreference).where(UserPreference.user_id == user_id)
        )
        return result.scalar_one_or_none()

