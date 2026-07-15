"""
app/modules/health/schemas/health_score.py
"""

from typing import Optional
from pydantic import BaseModel, Field
from app.core.schema import PetVerseBaseModel


class HealthScoreResponse(PetVerseBaseModel):
    pet_id: str
    overall_score: int = Field(..., ge=0, le=100)
    nutrition_score: int = Field(..., ge=0, le=100)
    vaccination_score: int = Field(..., ge=0, le=100)
    weight_score: int = Field(..., ge=0, le=100)
    activity_score: int = Field(..., ge=0, le=100)
    recommendations_placeholder: list[str] = Field(default_factory=list)
