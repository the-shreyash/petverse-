from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ForbiddenException
from app.modules.notifications.models import Notification, NotificationPreference
from app.modules.notifications.models.enums import NotificationStatus
from app.modules.notifications.schemas.notification import NotificationCreate
from app.modules.notifications.repositories.notification_repository import NotificationRepository
from app.modules.notifications.repositories.preference_repository import PreferenceRepository

class NotificationService:
    def __init__(self, session: AsyncSession):
        self.repo = NotificationRepository(session)
        self.pref_repo = PreferenceRepository(session)

    async def create_notification(self, data: NotificationCreate) -> Notification | None:
        # Check user preferences before creating
        # This acts as a simple filter. E.g., if social alerts are disabled and this is SOCIAL
        pref = await self.pref_repo.get_by_user(data.user_id)
        if pref:
            # We can expand on filtering logic here based on type
            # E.g., if data.type == NotificationType.SOCIAL and not pref.community_alerts_enabled: return None
            pass

        notification = Notification(**data.model_dump())
        return await self.repo.add(notification)

    async def get_notifications(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Notification]:
        return await self.repo.get_by_user(user_id, skip=skip, limit=limit)

    async def get_unread(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Notification]:
        return await self.repo.get_unread_by_user(user_id, skip=skip, limit=limit)

    async def mark_read(self, user_id: str, notification_id: str) -> Notification:
        notification = await self.repo.get_by_id(notification_id)
        if not notification:
            raise NotFoundException("Notification not found")
        if notification.user_id != user_id:
            raise ForbiddenException("You can only access your own notifications")
            
        notification.status = NotificationStatus.READ
        notification.read_at = datetime.now(timezone.utc)
        return await self.repo.save(notification)

    async def mark_all_read(self, user_id: str) -> None:
        await self.repo.mark_all_read(user_id)

    async def delete_notification(self, user_id: str, notification_id: str) -> None:
        notification = await self.repo.get_by_id(notification_id)
        if not notification:
            raise NotFoundException("Notification not found")
        if notification.user_id != user_id:
            raise ForbiddenException("You can only access your own notifications")
            
        await self.repo.delete(notification)
