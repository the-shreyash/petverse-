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

class AuthorResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PostCommentResponse(BaseModel):
    id: str
    post_id: str
    author_id: str
    content: str
    parent_comment_id: Optional[str] = None
    created_at: datetime
    author: Optional[AuthorResponse] = None

    model_config = ConfigDict(from_attributes=True)

class PostResponse(PostBase):
    id: str
    author_id: str
    author: Optional[AuthorResponse] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    likes_count: int = 0
    comments_count: int = 0
    liked_by_me: bool = False
    bookmarked_by_me: bool = False

    model_config = ConfigDict(from_attributes=True)

class PostDetailResponse(PostResponse):
    comments: List[PostCommentResponse] = []
