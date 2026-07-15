"""
app/api/v1/routers/pets.py

HTTP layer for the Pet Management module (Phase B4).

Every route depends on ``get_current_user`` — authentication is never
re-implemented here. Pet-scoped routes (``/{pet_id}`` and below) depend on
``get_owned_pet``, which resolves the pet AND enforces ownership in one
place. Routers stay thin: validate input, call the relevant service, wrap
the result in the standard ``success_response`` envelope. No direct
database access.

Route ordering note: ``GET /search`` is declared before ``GET /{pet_id}`` so
FastAPI matches the literal path first — otherwise "/pets/search" would be
swallowed by the ``{pet_id}`` path parameter.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.responses import JSONResponse

from app.dependencies.auth import get_current_user
from app.dependencies.pets import (
    get_owned_pet,
    get_pet_gallery_service,
    get_pet_image_service,
    get_pet_search_service,
    get_pet_service,
)
from app.database.enums import PetGender, PetSpecies, PetStatus
from app.modules.pet.models.pet import Pet
from app.modules.user.models.user import User
from app.modules.pet.schemas.pet import (
    PetCoverImageResponse,
    PetCreateRequest,
    PetGalleryImageResponse,
    PetProfileImageResponse,
    PetReplaceRequest,
    PetResponse,
    PetUpdateRequest,
)
from app.modules.pet.services.pet_gallery_service import PetGalleryService
from app.modules.pet.services.pet_image_service import PetImageService
from app.modules.pet.services.pet_search_service import PetSearchService
from app.modules.pet.services.pet_service import PetService
from app.utils.response import created_response, paginated_response, success_response

router = APIRouter()


def _pet_data(pet: Pet) -> dict:
    return PetResponse.model_validate(pet).model_dump(mode="json")


# ─── Create ───────────────────────────────────────────────────────────────────

@router.post("", summary="Create a new pet", status_code=201)
async def create_pet(
    payload: PetCreateRequest,
    current_user: User = Depends(get_current_user),
    pets: PetService = Depends(get_pet_service),
) -> JSONResponse:
    pet = await pets.create_pet(current_user, payload)
    return created_response(data=_pet_data(pet), message="Pet created.")


# ─── List (my pets) ─────────────────────────────────────────────────────────────

@router.get("", summary="List the current user's pets")
async def list_my_pets(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    pets: PetService = Depends(get_pet_service),
) -> JSONResponse:
    items, total = await pets.list_my_pets(current_user, page=page, per_page=per_page)
    return paginated_response(
        data=[_pet_data(p) for p in items],
        total=total,
        page=page,
        per_page=per_page,
        message="Pets retrieved.",
    )


# ─── Search ───────────────────────────────────────────────────────────────────

@router.get("/search", summary="Search the current user's pets")
async def search_pets(
    name: Optional[str] = None,
    species: Optional[PetSpecies] = None,
    breed: Optional[str] = None,
    gender: Optional[PetGender] = None,
    status: Optional[PetStatus] = None,
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    current_user: User = Depends(get_current_user),
    search: PetSearchService = Depends(get_pet_search_service),
) -> JSONResponse:
    items, total = await search.search(
        current_user,
        name=name,
        species=species,
        breed=breed,
        gender=gender,
        status=status,
        page=page,
        per_page=per_page,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return paginated_response(
        data=[_pet_data(p) for p in items],
        total=total,
        page=page,
        per_page=per_page,
        message="Search results retrieved.",
    )


# ─── Detail / update / delete ──────────────────────────────────────────────────

@router.get("/{pet_id}", summary="Get pet details")
async def get_pet(pet: Pet = Depends(get_owned_pet)) -> JSONResponse:
    return success_response(data=_pet_data(pet), message="Pet retrieved.")


@router.put("/{pet_id}", summary="Replace a pet's editable fields")
async def replace_pet(
    payload: PetReplaceRequest,
    pet: Pet = Depends(get_owned_pet),
    pets: PetService = Depends(get_pet_service),
) -> JSONResponse:
    pet = await pets.replace_pet(pet, payload)
    return success_response(data=_pet_data(pet), message="Pet updated.")


@router.patch("/{pet_id}", summary="Partially update a pet")
async def update_pet(
    payload: PetUpdateRequest,
    pet: Pet = Depends(get_owned_pet),
    pets: PetService = Depends(get_pet_service),
) -> JSONResponse:
    pet = await pets.update_pet(pet, payload)
    return success_response(data=_pet_data(pet), message="Pet updated.")


@router.delete("/{pet_id}", summary="Soft-delete a pet")
async def delete_pet(
    pet: Pet = Depends(get_owned_pet),
    pets: PetService = Depends(get_pet_service),
) -> JSONResponse:
    await pets.delete_pet(pet)
    return success_response(data=None, message="Pet deleted.")


# ─── Images ───────────────────────────────────────────────────────────────────

@router.post("/{pet_id}/profile-image", summary="Upload a pet's profile image")
async def upload_profile_image(
    file: UploadFile = File(...),
    pet: Pet = Depends(get_owned_pet),
    images: PetImageService = Depends(get_pet_image_service),
) -> JSONResponse:
    pet = await images.upload_profile_image(pet, file)
    return success_response(
        data=PetProfileImageResponse.model_validate(pet).model_dump(mode="json"),
        message="Profile image uploaded.",
    )


@router.post("/{pet_id}/cover-image", summary="Upload a pet's cover image")
async def upload_cover_image(
    file: UploadFile = File(...),
    pet: Pet = Depends(get_owned_pet),
    images: PetImageService = Depends(get_pet_image_service),
) -> JSONResponse:
    pet = await images.upload_cover_image(pet, file)
    return success_response(
        data=PetCoverImageResponse.model_validate(pet).model_dump(mode="json"),
        message="Cover image uploaded.",
    )


# ─── Gallery ──────────────────────────────────────────────────────────────────

@router.get("/{pet_id}/gallery", summary="List a pet's gallery images")
async def list_gallery(
    pet: Pet = Depends(get_owned_pet),
    gallery: PetGalleryService = Depends(get_pet_gallery_service),
) -> JSONResponse:
    images = await gallery.list_images(pet)
    return success_response(
        data=[
            PetGalleryImageResponse.model_validate(img).model_dump(mode="json")
            for img in images
        ],
        message="Gallery retrieved.",
    )


@router.post("/{pet_id}/gallery", summary="Add an image to a pet's gallery")
async def add_gallery_image(
    file: UploadFile = File(...),
    pet: Pet = Depends(get_owned_pet),
    gallery: PetGalleryService = Depends(get_pet_gallery_service),
) -> JSONResponse:
    image = await gallery.add_image(pet, file)
    return created_response(
        data=PetGalleryImageResponse.model_validate(image).model_dump(mode="json"),
        message="Gallery image added.",
    )


@router.delete("/{pet_id}/gallery/{image_id}", summary="Remove a gallery image")
async def delete_gallery_image(
    image_id: str,
    pet: Pet = Depends(get_owned_pet),
    gallery: PetGalleryService = Depends(get_pet_gallery_service),
) -> JSONResponse:
    await gallery.delete_image(pet, image_id)
    return success_response(data=None, message="Gallery image removed.")
