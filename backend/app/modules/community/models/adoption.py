"""
app/modules/community/models/adoption.py
"""
from typing import Optional
from sqlalchemy import String, Text, ForeignKey, Numeric, Boolean, Enum, JSON, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin
from .enums import AdoptionStatus, AdoptionRequestStatus

class AdoptionListing(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "community_adoptions"

    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    pet_id: Mapped[str] = mapped_column(String(36), ForeignKey("pets.id", ondelete="CASCADE"), index=True, nullable=False)
    
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[AdoptionStatus] = mapped_column(Enum(AdoptionStatus, native_enum=False, length=16), default=AdoptionStatus.AVAILABLE, nullable=False)
    adoption_fee: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Coordinates power radius search. Nullable because location is optional:
    # a user may decline the browser permission and type a city instead.
    latitude: Mapped[Optional[float]] = mapped_column(Numeric(9, 6), index=True, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Numeric(9, 6), index=True, nullable=True)

    gallery: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    requests: Mapped[list["AdoptionRequest"]] = relationship(
        "AdoptionRequest", back_populates="listing", cascade="all, delete-orphan"
    )


class AdoptionRequest(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A user's expression of interest in a listing, with its own lifecycle."""
    __tablename__ = "community_adoption_requests"
    __table_args__ = (UniqueConstraint("listing_id", "applicant_id", name="uq_adoption_request"),)

    listing_id: Mapped[str] = mapped_column(String(36), ForeignKey("community_adoptions.id", ondelete="CASCADE"), index=True, nullable=False)
    applicant_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[AdoptionRequestStatus] = mapped_column(
        Enum(AdoptionRequestStatus, native_enum=False, length=16),
        default=AdoptionRequestStatus.PENDING,
        nullable=False,
    )

    listing: Mapped["AdoptionListing"] = relationship("AdoptionListing", back_populates="requests")
    applicant = relationship("User", foreign_keys=[applicant_id])
