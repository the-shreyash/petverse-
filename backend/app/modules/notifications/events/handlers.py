import logging
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.events.bus import bus, DomainEvent
from app.modules.community.events import PostCreatedEvent, CommentAddedEvent, LikeAddedEvent
from app.modules.messaging.events import MessageSentEvent
from app.database.engine import get_session_factory
from app.modules.notifications.automation.engine import AutomationEngine

logger = logging.getLogger(__name__)

async def handle_post_created(event: DomainEvent):
    # This might notify followers in the future.
    # For now, maybe just log or handle via automation engine.
    async with get_session_factory()() as session:
        engine = AutomationEngine(session)
        await engine.process_event(event)

async def handle_comment_added(event: DomainEvent):
    # Notify post author
    async with get_session_factory()() as session:
        engine = AutomationEngine(session)
        await engine.process_event(event)

async def handle_like_added(event: DomainEvent):
    # Notify post author
    async with get_session_factory()() as session:
        engine = AutomationEngine(session)
        await engine.process_event(event)

async def handle_message_sent(event: DomainEvent):
    # Notify the recipient of a direct message
    async with get_session_factory()() as session:
        engine = AutomationEngine(session)
        await engine.process_event(event)

# In a real app, we would dynamically load these or have a dedicated registry
def register_handlers():
    bus.subscribe(PostCreatedEvent, handle_post_created)
    bus.subscribe(CommentAddedEvent, handle_comment_added)
    bus.subscribe(LikeAddedEvent, handle_like_added)
    bus.subscribe(MessageSentEvent, handle_message_sent)
    logger.info("Notification event handlers registered.")
