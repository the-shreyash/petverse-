"""
app/services/pet_gallery_service.py

Business logic for a pet's photo gallery — additional images beyond the
single profile/cover image, capped at ``settings.PET_GALLERY_MAX_IMAGES`` per
pet so an owner can't unboundedly grow disk usage on one record.
"""

from __future__ import annotations

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.exceptions.pet import (
    GalleryImageNotFoundException,
    GalleryLimitExceededException,
    InvalidPetImageException,
)
from app.modules.pet.models.pet import Pet
from app.modules.pet.models.pet_gallery_image import PetGalleryImage
from app.modules.pet.repositories.pet_gallery_repository import PetGalleryRepository
from app.core.upload import UploadService

_GALLERY_SUBDIR = "pets/gallery"


class PetGalleryService:
    """Add, list, and remove images in a pet's gallery."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.gallery = PetGalleryRepository(session)
        self.settings = get_settings()
        self.uploads = UploadService()

    async def list_images(self, pet: Pet):
        return await self.gallery.list_by_pet(pet.id)

    async def add_image(self, pet: Pet, file: UploadFile) -> PetGalleryImage:
        count = await self.gallery.count_by_pet(pet.id)
        if count >= self.settings.PET_GALLERY_MAX_IMAGES:
            raise GalleryLimitExceededException(
                f"A pet's gallery is limited to {self.settings.PET_GALLERY_MAX_IMAGES} images."
            )

        try:
            url = await self.uploads.save_image(
                file,
                subdir=_GALLERY_SUBDIR,
                allowed_content_types=self.settings.allowed_pet_image_content_types_set,
                max_size_bytes=self.settings.max_pet_image_size_bytes,
            )
        except ValueError as exc:
            raise InvalidPetImageException(str(exc)) from exc

        image = PetGalleryImage(pet_id=pet.id, image_url=url, position=count)
        return await self.gallery.add(image)

    async def delete_image(self, pet: Pet, image_id: str) -> None:
        image = await self.gallery.get_by_id(image_id, pet.id)
        if image is None:
            raise GalleryImageNotFoundException()

        url = image.image_url
        await self.gallery.delete(image)
        self.uploads.delete(url)
