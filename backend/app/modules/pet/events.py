from app.core.events.base import DomainEvent

class PetCreatedEvent(DomainEvent):
    event_type: str = "pet.created"

class PetUpdatedEvent(DomainEvent):
    event_type: str = "pet.updated"
