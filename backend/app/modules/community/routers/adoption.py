from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User

from app.modules.community.schemas.adoption import AdoptionListingCreate, AdoptionListingUpdate, AdoptionListingResponse
from app.modules.community.services.adoption_service import AdoptionService

router = APIRouter(prefix="/adoption", tags=["Community - Adoption"])

@router.post("", response_model=AdoptionListingResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(
    data: AdoptionListingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.create_listing(current_user.id, data)

@router.get("", response_model=List[AdoptionListingResponse])
async def get_listings(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.get_all(skip=skip, limit=limit)

@router.get("/{listing_id}", response_model=AdoptionListingResponse)
async def get_listing(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.get_by_id(listing_id)

@router.put("/{listing_id}", response_model=AdoptionListingResponse)
async def update_listing(
    listing_id: str,
    data: AdoptionListingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.update_listing(current_user.id, listing_id, data)

@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    await service.delete_listing(current_user.id, listing_id)
