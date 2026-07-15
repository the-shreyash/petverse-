"""
app/modules/health/models/vaccination.py

Vaccination model.
"""

from datetime import date, datetime
from typing import Optional
from sqlalchemy import String, Date, DateTime, Text, ForeignKey, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import UUIDPrimaryKeyMixin, TimestampMixin


class Vaccination(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "vaccinations"

    pet_id: Mapped[str] = mapped_column(ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    
    vaccine_name: Mapped[str] = mapped_column(String(255), nullable=False)
    manufacturer: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    batch_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    dose: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    administration_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    expiry_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    next_due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="administered")
    certificate_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)

    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, server_default="0", nullable=False)


    pet: Mapped["Pet"] = relationship("Pet", back_populates="vaccinations", lazy="selectin")  # type: ignore
