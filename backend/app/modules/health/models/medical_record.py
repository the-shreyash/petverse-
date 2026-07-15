"""
app/modules/health/models/medical_record.py

Medical Record model.
"""

from datetime import date, datetime
from typing import Optional
from sqlalchemy import String, Date, DateTime, Text, ForeignKey, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import UUIDPrimaryKeyMixin, TimestampMixin


class MedicalRecord(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "medical_records"

    pet_id: Mapped[str] = mapped_column(ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    visit_date: Mapped[date] = mapped_column(Date, nullable=False)
    diagnosis: Mapped[str] = mapped_column(String(255), nullable=False)
    symptoms: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    treatment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    follow_up_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, server_default="0", nullable=False)


    pet: Mapped["Pet"] = relationship("Pet", back_populates="medical_records", lazy="selectin")  # type: ignore
