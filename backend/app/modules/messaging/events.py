from app.core.events.base import DomainEvent


class MessageSentEvent(DomainEvent):
    event_type: str = "messaging.message_sent"
