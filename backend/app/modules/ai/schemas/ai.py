"""
app/modules/ai/schemas/ai.py

Pydantic schemas for the AI Engine.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from app.core.schema import PetVerseBaseModel


class ChatMessageRequest(PetVerseBaseModel):
    pet_id: Optional[str] = Field(None, description="Optional ID of the pet to give context for this chat")
    message: str = Field(..., description="User's input message")
    conversation_id: Optional[str] = Field(None, description="Optional conversation ID to continue an existing chat")
    provider: Optional[str] = Field("gemini", description="AI provider to use (e.g. gemini, openai)")


class AIMessageSchema(PetVerseBaseModel):
    id: str
    role: str
    content: str
    created_at: datetime


class AIConversationSchema(PetVerseBaseModel):
    id: str
    user_id: str
    pet_id: Optional[str]
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: List[AIMessageSchema] = []


class ChatResponse(PetVerseBaseModel):
    conversation_id: str
    message: str
    provider: str
    tokens_used: int


class RecommendationRequest(PetVerseBaseModel):
    pet_id: str = Field(..., description="ID of the pet to get recommendations for")
    category: Optional[str] = Field(None, description="Optional specific category of recommendations (e.g., FOOD, TOYS)")


class RecommendationItem(PetVerseBaseModel):
    priority: str = Field(..., description="HIGH, MEDIUM, LOW")
    confidence: float = Field(..., description="Score from 0.0 to 1.0")
    reason: str = Field(..., description="Reason for the recommendation")
    recommended_actions: List[str] = Field(..., description="Actionable advice")
    category: str = Field(..., description="Category like NUTRITION, HEALTH, TOYS")


class RecommendationResponse(PetVerseBaseModel):
    pet_id: str
    recommendations: List[RecommendationItem]
