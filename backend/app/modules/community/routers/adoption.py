from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.dependencies.common import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User

from typing import Optional

from app.modules.community.schemas.adoption import (
    AdoptionListingCreate,
    AdoptionListingUpdate,
    AdoptionListingResponse,
    AdoptionListingDetailResponse,
    AdoptionApplyRequest,
    AdoptionRequestResponse,
)
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
    species: Optional[str] = None,
    city: Optional[str] = None,
    listing_status: Optional[str] = Query(None, alias="status"),
    lat: Optional[float] = Query(None, ge=-90, le=90, description="Viewer latitude"),
    lng: Optional[float] = Query(None, ge=-180, le=180, description="Viewer longitude"),
    radius_km: Optional[float] = Query(None, gt=0, le=20000, description="Limit to this radius"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Browse listings. Supplying lat/lng sorts nearest-first and returns
    `distance_km`; `radius_km` additionally constrains the result set."""
    service = AdoptionService(db)
    return await service.search(
        skip=skip,
        limit=limit,
        species=species,
        city=city,
        status=listing_status,
        lat=lat,
        lng=lng,
        radius_km=radius_km,
    )


# ── Requests ───────────────────────────────────────────────────────────────
# Declared before /{listing_id} so these literal paths are not captured by it.

@router.get("/requests/incoming", response_model=List[AdoptionRequestResponse])
async def incoming_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Requests on listings owned by the current user."""
    service = AdoptionService(db)
    return await service.list_incoming_requests(current_user.id)


@router.get("/requests/mine", response_model=List[AdoptionRequestResponse])
async def my_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.list_my_requests(current_user.id)


@router.post("/requests/{request_id}/accept", response_model=AdoptionRequestResponse)
async def accept_request(
    request_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.respond_to_request(current_user.id, request_id, accept=True)


@router.post("/requests/{request_id}/reject", response_model=AdoptionRequestResponse)
async def reject_request(
    request_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.respond_to_request(current_user.id, request_id, accept=False)


@router.get("/{listing_id}/requests", response_model=List[AdoptionRequestResponse])
async def listing_requests(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.list_requests_for_listing(current_user.id, listing_id)


@router.get("/{listing_id}", response_model=AdoptionListingDetailResponse)
async def get_listing(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.get_detail(listing_id)

@router.put("/{listing_id}", response_model=AdoptionListingResponse)
async def update_listing(
    listing_id: str,
    data: AdoptionListingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.update_listing(current_user.id, listing_id, data)

@router.post("/{listing_id}/apply", response_model=AdoptionRequestResponse, status_code=status.HTTP_201_CREATED)
async def apply_to_listing(
    listing_id: str,
    data: AdoptionApplyRequest = AdoptionApplyRequest(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    return await service.apply_to_listing(current_user.id, listing_id, data.message)


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AdoptionService(db)
    await service.delete_listing(current_user.id, listing_id)
