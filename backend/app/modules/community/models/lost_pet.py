"""
app/modules/community/models/lost_pet.py
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, ForeignKey, DateTime, Enum, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin
from .enums import LostPetStatus

class LostPet(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "community_lost_pets"

    pet_id: Mapped[str] = mapped_column(String(36), ForeignKey("pets.id", ondelete="CASCADE"), index=True, nullable=False)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    last_seen_location: Mapped[str] = mapped_column(String(255), nullable=False)
    last_seen_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    reward: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    contact_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    status: Mapped[LostPetStatus] = mapped_column(Enum(LostPetStatus, native_enum=False, length=16), default=LostPetStatus.LOST, nullable=False)
