"""
app/services/pet_image_service.py

Profile/cover image orchestration for pets, on top of the generic
``UploadService`` — mirrors ``AvatarService`` for users. Only the resulting
URL is ever stored on ``Pet.profile_image`` / ``Pet.cover_image``; the file
itself lives on disk (or, later, object storage).
"""

from __future__ import annotations

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.exceptions.pet import InvalidPetImageException
from app.models.pet import Pet
from app.repositories.pet_repository import PetRepository
from app.services.upload_service import UploadService

_PROFILE_SUBDIR = "pets/profile"
_COVER_SUBDIR = "pets/cover"


class PetImageService:
    """Upload and delete a pet's profile and cover images."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.pets = PetRepository(session)
        self.settings = get_settings()
        self.uploads = UploadService()

    async def _save(self, file: UploadFile, subdir: str) -> str:
        try:
            return await self.uploads.save_image(
                file,
                subdir=subdir,
                allowed_content_types=self.settings.allowed_pet_image_content_types_set,
                max_size_bytes=self.settings.max_pet_image_size_bytes,
            )
        except ValueError as exc:
            raise InvalidPetImageException(str(exc)) from exc

    async def upload_profile_image(self, pet: Pet, file: UploadFile) -> Pet:
        url = await self._save(file, _PROFILE_SUBDIR)
        old_url = pet.profile_image
        pet.profile_image = url
        pet = await self.pets.save(pet)
        if old_url:
            self.uploads.delete(old_url)
        return pet

    async def upload_cover_image(self, pet: Pet, file: UploadFile) -> Pet:
        url = await self._save(file, _COVER_SUBDIR)
        old_url = pet.cover_image
        pet.cover_image = url
        pet = await self.pets.save(pet)
        if old_url:
            self.uploads.delete(old_url)
        return pet
