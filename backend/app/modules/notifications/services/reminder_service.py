from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ForbiddenException
from app.modules.notifications.models import Reminder
from app.modules.notifications.schemas.reminder import ReminderCreate, ReminderUpdate
from app.modules.notifications.repositories.reminder_repository import ReminderRepository

class ReminderService:
    def __init__(self, session: AsyncSession):
        self.repo = ReminderRepository(session)

    async def create_reminder(self, user_id: str, data: ReminderCreate) -> Reminder:
        reminder = Reminder(**data.model_dump(), user_id=user_id)
        return await self.repo.add(reminder)

    async def get_reminders(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Reminder]:
        return await self.repo.get_by_user(user_id, skip=skip, limit=limit)

    async def update_reminder(self, user_id: str, reminder_id: str, data: ReminderUpdate) -> Reminder:
        reminder = await self.repo.get_by_id(reminder_id)
        if not reminder:
            raise NotFoundException("Reminder not found")
        if reminder.user_id != user_id:
            raise ForbiddenException("You can only access your own reminders")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(reminder, key, value)
            
        return await self.repo.save(reminder)

    async def delete_reminder(self, user_id: str, reminder_id: str) -> None:
        reminder = await self.repo.get_by_id(reminder_id)
        if not reminder:
            raise NotFoundException("Reminder not found")
        if reminder.user_id != user_id:
            raise ForbiddenException("You can only access your own reminders")

        await self.repo.delete(reminder, hard=True)
