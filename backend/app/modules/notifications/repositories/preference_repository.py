from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.repository import BaseRepository
from app.modules.notifications.models import NotificationPreference

class PreferenceRepository(BaseRepository[NotificationPreference]):
    def __init__(self, session: AsyncSession):
        super().__init__(NotificationPreference, session)

    async def get_by_user(self, user_id: str) -> NotificationPreference | None:
        stmt = select(self.model).where(self.model.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
