"""
app/modules/community/models/adoption.py
"""
from typing import Optional
from sqlalchemy import String, Text, ForeignKey, Numeric, Boolean, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin
from .enums import AdoptionStatus

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
    
    gallery: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
