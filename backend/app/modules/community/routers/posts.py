from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User

from app.modules.community.schemas.post import PostCreate, PostUpdate, PostResponse
from app.modules.community.schemas.comment import CommentCreate, CommentResponse
from app.modules.community.schemas.engagement import LikeResponse, BookmarkResponse

from app.modules.community.services.post_service import PostService
from app.modules.community.services.comment_service import CommentService
from app.modules.community.services.engagement_service import EngagementService

router = APIRouter(prefix="/posts", tags=["Community - Posts"])

# --- Posts ---

@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    data: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = PostService(db)
    return await service.create_post(current_user.id, data)

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user) # Authentication required
):
    service = PostService(db)
    return await service.get_post(post_id)

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    data: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = PostService(db)
    return await service.update_post(current_user.id, post_id, data)

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = PostService(db)
    await service.delete_post(current_user.id, post_id)


# --- Comments ---

@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def add_comment(
    post_id: str,
    data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CommentService(db)
    return await service.add_comment(current_user.id, post_id, data)

@router.get("/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(
    post_id: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CommentService(db)
    return await service.get_comments_for_post(post_id, skip=skip, limit=limit)


# --- Likes ---

@router.post("/{post_id}/like", response_model=LikeResponse, status_code=status.HTTP_201_CREATED)
async def add_like(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = EngagementService(db)
    return await service.add_like(current_user.id, post_id)

@router.delete("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def remove_like(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = EngagementService(db)
    await service.remove_like(current_user.id, post_id)


# --- Bookmarks ---

@router.post("/{post_id}/bookmark", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
async def add_bookmark(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = EngagementService(db)
    return await service.add_bookmark(current_user.id, post_id)

@router.delete("/{post_id}/bookmark", status_code=status.HTTP_204_NO_CONTENT)
async def remove_bookmark(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = EngagementService(db)
    await service.remove_bookmark(current_user.id, post_id)
