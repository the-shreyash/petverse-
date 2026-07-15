from pydantic import BaseModel, ConfigDict
from datetime import datetime

class LikeResponse(BaseModel):
    id: str
    post_id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BookmarkResponse(BaseModel):
    id: str
    post_id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
