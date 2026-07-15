from sqlalchemy.ext.asyncio import AsyncSession

from app.core.events.base import DomainEvent
from app.modules.community.events import PostCreatedEvent, CommentAddedEvent, LikeAddedEvent
from app.modules.notifications.models.enums import NotificationType, NotificationPriority
from app.modules.notifications.schemas.notification import NotificationCreate
from app.modules.notifications.services.notification_service import NotificationService

class AutomationEngine:
    """
    Consumes events and applies rules to generate Reminders or Notifications.
    """
    def __init__(self, session: AsyncSession):
        self.session = session
        self.notif_service = NotificationService(session)

    async def process_event(self, event: DomainEvent):
        # We can implement a Rule-based system here. For now, we hardcode the rules based on event types.
        if isinstance(event, CommentAddedEvent):
            await self._handle_comment(event)
        elif isinstance(event, LikeAddedEvent):
            await self._handle_like(event)
        # Add Health events (VaccinationDue, etc) here later

    async def _handle_comment(self, event: CommentAddedEvent):
        payload = event.payload
        if payload["author_id"] == payload["post_author_id"]:
            return # Don't notify self

        notif = NotificationCreate(
            user_id=payload["post_author_id"],
            type=NotificationType.SOCIAL,
            priority=NotificationPriority.NORMAL,
            title="New Comment",
            message="Someone commented on your post.",
            entity_type="Comment",
            entity_id=payload["comment_id"],
            meta_data={"post_id": payload["post_id"], "commenter_id": payload["author_id"]}
        )
        await self.notif_service.create_notification(notif)
        await self.session.commit()

    async def _handle_like(self, event: LikeAddedEvent):
        payload = event.payload
        if payload["user_id"] == payload["post_author_id"]:
            return

        notif = NotificationCreate(
            user_id=payload["post_author_id"],
            type=NotificationType.SOCIAL,
            priority=NotificationPriority.LOW,
            title="New Like",
            message="Someone liked your post.",
            entity_type="Like",
            entity_id=payload["like_id"],
            meta_data={"post_id": payload["post_id"], "liker_id": payload["user_id"]}
        )
        await self.notif_service.create_notification(notif)
        await self.session.commit()
