"""
app/repositories/pet_gallery_repository.py

Data-access layer for the ``pet_gallery_images`` table. Mirrors the shape of
``PetRepository`` — the only place that talks to SQLAlchemy for gallery
images.
"""

from __future__ import annotations

from typing import Optional, Sequence

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.pet.models.pet_gallery_image import PetGalleryImage


from app.core.repository import BaseRepository

class PetGalleryRepository(BaseRepository[PetGalleryImage]):
    """CRUD operations for :class:`PetGalleryImage`."""

    def __init__(self, session: AsyncSession):
        super().__init__(PetGalleryImage, session)

    async def list_by_pet(self, pet_id: str) -> Sequence[PetGalleryImage]:
        result = await self.session.execute(
            select(PetGalleryImage)
            .where(PetGalleryImage.pet_id == pet_id)
            .order_by(PetGalleryImage.position.asc())
        )
        return result.scalars().all()

    async def count_by_pet(self, pet_id: str) -> int:
        return await self.session.scalar(
            select(func.count()).where(PetGalleryImage.pet_id == pet_id)
        ) or 0

    async def get_by_id(self, image_id: str, pet_id: str) -> Optional[PetGalleryImage]:
        result = await self.session.execute(
            select(PetGalleryImage).where(
                PetGalleryImage.id == image_id, PetGalleryImage.pet_id == pet_id
            )
        )
        return result.scalar_one_or_none()

