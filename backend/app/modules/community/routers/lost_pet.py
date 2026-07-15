from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User

from app.modules.community.schemas.lost_pet import LostPetCreate, LostPetUpdate, LostPetResponse
from app.modules.community.services.lost_pet_service import LostPetService

router = APIRouter(prefix="/lost-found", tags=["Community - Lost & Found"])

@router.post("", response_model=LostPetResponse, status_code=status.HTTP_201_CREATED)
async def report_lost_pet(
    data: LostPetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = LostPetService(db)
    return await service.report_lost_pet(current_user.id, data)

@router.get("", response_model=List[LostPetResponse])
async def get_lost_pets(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = LostPetService(db)
    return await service.get_all(skip=skip, limit=limit)
