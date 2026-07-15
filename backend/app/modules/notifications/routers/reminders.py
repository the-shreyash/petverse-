from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User

from app.modules.notifications.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderResponse
from app.modules.notifications.services.reminder_service import ReminderService

router = APIRouter(prefix="/reminders", tags=["Notifications - Reminders"])

@router.post("", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    data: ReminderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    return await service.create_reminder(current_user.id, data)

@router.get("", response_model=List[ReminderResponse])
async def get_reminders(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    return await service.get_reminders(current_user.id, skip=skip, limit=limit)

@router.put("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(
    reminder_id: str,
    data: ReminderUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    return await service.update_reminder(current_user.id, reminder_id, data)

@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    await service.delete_reminder(current_user.id, reminder_id)
