from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User

from app.core.upload import UploadService, IMAGE_CONTENT_TYPES
from app.modules.messaging.schemas.message import (
    ConversationCreate,
    ConversationResponse,
    ConversationDetailResponse,
    MessageCreate,
    MessageResponse,
)
from app.modules.messaging.services.messaging_service import MessagingService

router = APIRouter(prefix="/messaging", tags=["Messaging"])

MAX_MESSAGE_IMAGE_BYTES = 10 * 1024 * 1024


@router.post("/media", status_code=status.HTTP_201_CREATED)
async def upload_message_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    try:
        url = await UploadService().save_image(
            file,
            subdir="messages",
            allowed_content_types=IMAGE_CONTENT_TYPES,
            max_size_bytes=MAX_MESSAGE_IMAGE_BYTES,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return {"media_url": url}


@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def start_conversation(
    data: ConversationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get-or-create a private 1:1 conversation. Safe to call repeatedly."""
    service = MessagingService(db)
    return await service.get_or_create_direct(current_user.id, data)


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = MessagingService(db)
    return await service.list_conversations(current_user.id)


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = MessagingService(db)
    return await service.get_conversation(current_user.id, conversation_id)


@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: str,
    data: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = MessagingService(db)
    return await service.send_message(current_user.id, conversation_id, data)


@router.post("/conversations/{conversation_id}/read", response_model=ConversationResponse)
async def mark_read(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = MessagingService(db)
    return await service.mark_read(current_user.id, conversation_id)
