from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User
from app.modules.community.schemas.post import PostResponse
from app.modules.community.services.post_service import PostService

router = APIRouter(prefix="/feed", tags=["Community - Feed"])

@router.get("", response_model=List[PostResponse])
async def get_feed(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the community feed.
    """
    service = PostService(db)
    return await service.get_feed(skip=skip, limit=limit)
