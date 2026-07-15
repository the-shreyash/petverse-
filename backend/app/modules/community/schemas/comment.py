from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    parent_comment_id: Optional[str] = None

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: str
    post_id: str
    author_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
