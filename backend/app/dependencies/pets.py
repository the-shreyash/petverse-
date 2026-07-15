"""
app/dependencies/pets.py

Service providers and the shared "owned pet" resolver for the Pet Management
module (Phase B4). Follows the same pattern as ``app/dependencies/users.py``:
one small factory per service, bound to the request-scoped DB session.

``get_owned_pet`` is exported here so every future module that adds
pet-scoped endpoints (Health, Appointments, ...) can depend on it directly
instead of re-implementing the "load pet + check ownership" dance.
"""

from __future__ import annotations

from fastapi import Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user
from app.dependencies.common import get_db
from app.models.pet import Pet
from app.models.user import User
from app.services.pet_gallery_service import PetGalleryService
from app.services.pet_image_service import PetImageService
from app.services.pet_search_service import PetSearchService
from app.services.pet_service import PetService


def get_pet_service(db: AsyncSession = Depends(get_db)) -> PetService:
    return PetService(db)


def get_pet_image_service(db: AsyncSession = Depends(get_db)) -> PetImageService:
    return PetImageService(db)


def get_pet_gallery_service(db: AsyncSession = Depends(get_db)) -> PetGalleryService:
    return PetGalleryService(db)


def get_pet_search_service(db: AsyncSession = Depends(get_db)) -> PetSearchService:
    return PetSearchService(db)


async def get_owned_pet(
    pet_id: str = Path(...),
    current_user: User = Depends(get_current_user),
    pets: PetService = Depends(get_pet_service),
) -> Pet:
    """
    Resolve ``{pet_id}`` from the path and enforce that it belongs to the
    authenticated user. Raises 404 if missing/deleted, 403 if owned by
    someone else. Reuse this dependency on any route shaped
    ``/pets/{pet_id}/...``.
    """
    return await pets.get_owned_pet(pet_id, current_user)
