from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User

from app.core.upload import UploadService, IMAGE_CONTENT_TYPES, VIDEO_CONTENT_TYPES
from app.modules.community.schemas.story import StoryCreate, StoryResponse, StoryGroupResponse
from app.modules.community.services.story_service import StoryService

router = APIRouter(prefix="/stories", tags=["Community - Stories"])

MAX_STORY_BYTES = 25 * 1024 * 1024


@router.post("/media", status_code=status.HTTP_201_CREATED)
async def upload_story_media(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload story media (image or video) and return its URL for StoryCreate."""
    try:
        url = await UploadService().save_media(
            file,
            subdir="stories",
            allowed_content_types=IMAGE_CONTENT_TYPES | VIDEO_CONTENT_TYPES,
            max_size_bytes=MAX_STORY_BYTES,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    media_type = "VIDEO" if (file.content_type or "") in VIDEO_CONTENT_TYPES else "IMAGE"
    return {"media_url": url, "media_type": media_type}


@router.post("", response_model=StoryResponse, status_code=status.HTTP_201_CREATED)
async def create_story(
    data: StoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = StoryService(db)
    return await service.create_story(current_user.id, data)


@router.get("", response_model=List[StoryGroupResponse])
async def list_stories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active (unexpired) stories from all users, grouped by author, unseen first."""
    service = StoryService(db)
    return await service.get_grouped_stories(current_user_id=current_user.id)


@router.post("/{story_id}/view", response_model=StoryResponse)
async def mark_story_seen(
    story_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = StoryService(db)
    return await service.mark_seen(story_id, current_user.id)


@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(
    story_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = StoryService(db)
    await service.delete_story(current_user.id, story_id)
