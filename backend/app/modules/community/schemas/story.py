from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.modules.community.models.enums import StoryMediaType
from .post import AuthorResponse


class StoryCreate(BaseModel):
    media_url: str
    media_type: StoryMediaType = StoryMediaType.IMAGE
    caption: Optional[str] = None
    pet_id: Optional[str] = None


class StoryResponse(BaseModel):
    id: str
    author_id: str
    author: Optional[AuthorResponse] = None
    pet_id: Optional[str] = None
    media_url: str
    media_type: StoryMediaType
    caption: Optional[str] = None
    created_at: datetime
    expires_at: datetime
    views_count: int = 0
    seen_by_me: bool = False

    model_config = ConfigDict(from_attributes=True)


class StoryGroupResponse(BaseModel):
    """Stories grouped per author, which is how the story rail renders them."""
    author_id: str
    author: Optional[AuthorResponse] = None
    stories: List[StoryResponse] = []
    all_seen: bool = False
    latest_at: datetime
