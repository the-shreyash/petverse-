from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User

from app.modules.notifications.schemas.preference import NotificationPreferenceResponse, NotificationPreferenceUpdate
from app.modules.notifications.services.preference_service import PreferenceService

router = APIRouter(prefix="/notifications/preferences", tags=["Notifications - Preferences"])

@router.get("", response_model=NotificationPreferenceResponse)
async def get_preferences(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = PreferenceService(db)
    return await service.get_preferences(current_user.id)

@router.put("", response_model=NotificationPreferenceResponse)
async def update_preferences(
    data: NotificationPreferenceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = PreferenceService(db)
    return await service.update_preferences(current_user.id, data)
