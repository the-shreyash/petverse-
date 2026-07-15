"""
app/core/events/base.py

Provides the base DomainEvent class for the event-driven architecture.
"""

from datetime import datetime, timezone
from typing import Any, Dict
from pydantic import BaseModel, Field
import uuid

class DomainEvent(BaseModel):
    """
    Base class for all domain events in PetVerse.
    Every significant action should emit an event derived from this class.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    event_type: str
    
    # Generic payload, though subclasses can define strongly typed fields
    payload: Dict[str, Any] = Field(default_factory=dict)
