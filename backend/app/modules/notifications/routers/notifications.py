from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User

from app.modules.notifications.schemas.notification import NotificationResponse
from app.modules.notifications.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    return await service.get_notifications(current_user.id, skip=skip, limit=limit)

@router.get("/unread", response_model=List[NotificationResponse])
async def get_unread_notifications(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    return await service.get_unread(current_user.id, skip=skip, limit=limit)

@router.post("/read/{notification_id}", response_model=NotificationResponse)
async def mark_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    return await service.mark_read(current_user.id, notification_id)

@router.post("/read-all", status_code=status.HTTP_204_NO_CONTENT)
async def mark_all_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    await service.mark_all_read(current_user.id)

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    await service.delete_notification(current_user.id, notification_id)
