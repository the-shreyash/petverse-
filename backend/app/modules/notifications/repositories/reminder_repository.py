from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.repository import BaseRepository
from app.modules.notifications.models import Reminder

class ReminderRepository(BaseRepository[Reminder]):
    def __init__(self, session: AsyncSession):
        super().__init__(Reminder, session)

    async def get_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Reminder]:
        stmt = select(self.model).where(
            self.model.user_id == user_id
        ).order_by(self.model.scheduled_at.asc()).offset(skip).limit(limit)
        
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
