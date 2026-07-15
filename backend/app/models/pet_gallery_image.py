"""
app/models/pet_gallery_image.py

The ``PetGalleryImage`` ORM model — additional photos attached to a pet,
beyond the single ``profile_image`` / ``cover_image`` on ``Pet``.

A dedicated table (not a JSON column on ``Pet``) because gallery images are a
1:many, independently-created/deleted collection — modelling them as rows
lets each image carry its own id, ordering, and timestamp, and keeps ``Pet``
itself lean.
"""

from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class PetGalleryImage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A single photo in a pet's gallery."""

    __tablename__ = "pet_gallery_images"

    pet_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("pets.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    image_url: Mapped[str] = mapped_column(String(512), nullable=False)
    # Display order within the gallery; set to the current image count on
    # insert so images render in upload order without a client-supplied index.
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<PetGalleryImage id={self.id} pet_id={self.pet_id}>"
