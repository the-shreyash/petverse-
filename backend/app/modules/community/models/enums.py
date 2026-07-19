"""
app/modules/community/models/enums.py
Domain specific enums.
"""
from enum import Enum

class PostVisibility(str, Enum):
    PUBLIC = "PUBLIC"
    PRIVATE = "PRIVATE"
    FRIENDS = "FRIENDS"

class AdoptionStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    PENDING = "PENDING"
    ADOPTED = "ADOPTED"

class LostPetStatus(str, Enum):
    LOST = "LOST"
    FOUND = "FOUND"

class StoryMediaType(str, Enum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"

class AdoptionRequestStatus(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"
