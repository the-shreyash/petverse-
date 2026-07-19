from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ParticipantResponse(BaseModel):
    id: str
    first_name: str = ""
    last_name: str = ""
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MessageCreate(BaseModel):
    content: Optional[str] = None
    media_url: Optional[str] = None


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    sender: Optional[ParticipantResponse] = None
    content: Optional[str] = None
    media_url: Optional[str] = None
    created_at: datetime
    is_mine: bool = False
    read_by_other: bool = False

    model_config = ConfigDict(from_attributes=True)


class ConversationCreate(BaseModel):
    participant_id: str
    listing_id: Optional[str] = None
    pet_id: Optional[str] = None
    # Optional opening message, so "Message Owner" is a single round-trip.
    message: Optional[str] = None


class ConversationResponse(BaseModel):
    id: str
    other_user: Optional[ParticipantResponse] = None
    listing_id: Optional[str] = None
    pet_id: Optional[str] = None
    last_message: Optional[MessageResponse] = None
    last_message_at: Optional[datetime] = None
    unread_count: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationDetailResponse(ConversationResponse):
    messages: List[MessageResponse] = []
