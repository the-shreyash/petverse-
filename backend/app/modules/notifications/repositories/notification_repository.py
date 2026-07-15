from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.core.repository import BaseRepository
from app.modules.notifications.models import Notification
from app.modules.notifications.models.enums import NotificationStatus

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, session: AsyncSession):
        super().__init__(Notification, session)

    async def get_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Notification]:
        stmt = self._not_deleted().where(
            self.model.user_id == user_id
        ).order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_unread_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Notification]:
        stmt = self._not_deleted().where(
            self.model.user_id == user_id,
            self.model.status == NotificationStatus.UNREAD
        ).order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def mark_all_read(self, user_id: str) -> None:
        from datetime import datetime, timezone
        stmt = update(self.model).where(
            self.model.user_id == user_id,
            self.model.status == NotificationStatus.UNREAD,
            self.model.is_deleted.is_(False)
        ).values(
            status=NotificationStatus.READ,
            read_at=datetime.now(timezone.utc)
        )
        await self.session.execute(stmt)
        await self.session.flush()
