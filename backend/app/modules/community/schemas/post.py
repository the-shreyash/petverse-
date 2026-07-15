from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.modules.community.models.enums import PostVisibility

class PostBase(BaseModel):
    content: str
    media_urls: List[str] = []
    visibility: PostVisibility = PostVisibility.PUBLIC
    location: Optional[str] = None
    pet_id: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    content: Optional[str] = None
    media_urls: Optional[List[str]] = None
    visibility: Optional[PostVisibility] = None
    location: Optional[str] = None

class PostResponse(PostBase):
    id: str
    author_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
