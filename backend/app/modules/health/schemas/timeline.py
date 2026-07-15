"""
app/modules/health/schemas/timeline.py
"""

from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field
from app.core.schema import PetVerseBaseModel


class TimelineEvent(PetVerseBaseModel):
    id: str
    event_type: str = Field(..., description="E.g., vaccination, weight, medication, medical_record")
    title: str
    description: Optional[str] = None
    date: datetime
    metadata: dict[str, Any] = Field(default_factory=dict)


class TimelineResponse(PetVerseBaseModel):
    pet_id: str
    events: list[TimelineEvent]
