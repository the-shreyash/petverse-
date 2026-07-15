from app.core.events.base import DomainEvent

class PostCreatedEvent(DomainEvent):
    event_type: str = "community.post_created"

class CommentAddedEvent(DomainEvent):
    event_type: str = "community.comment_added"

class LikeAddedEvent(DomainEvent):
    event_type: str = "community.like_added"

class AdoptionRequestEvent(DomainEvent):
    event_type: str = "community.adoption_request_created"

class LostPetReportedEvent(DomainEvent):
    event_type: str = "community.lost_pet_reported"
