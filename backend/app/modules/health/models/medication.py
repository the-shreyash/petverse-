"""
app/modules/health/models/medication.py

Medication model.
"""

from datetime import date, datetime
from typing import Optional
from sqlalchemy import String, Date, DateTime, Text, ForeignKey, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import UUIDPrimaryKeyMixin, TimestampMixin


class Medication(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "medications"

    pet_id: Mapped[str] = mapped_column(ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    
    medicine_name: Mapped[str] = mapped_column(String(255), nullable=False)
    dosage: Mapped[str] = mapped_column(String(100), nullable=False)
    frequency: Mapped[str] = mapped_column(String(100), nullable=False)
    duration: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="active")

    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, server_default="0", nullable=False)


    pet: Mapped["Pet"] = relationship("Pet", back_populates="medications", lazy="selectin")  # type: ignore
