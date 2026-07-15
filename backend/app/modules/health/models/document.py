"""
app/modules/health/models/document.py

Health Document model.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import UUIDPrimaryKeyMixin, TimestampMixin


class HealthDocument(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "health_documents"

    pet_id: Mapped[str] = mapped_column(ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False) # E.g., 'lab_result', 'prescription', 'xray'
    file_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), nullable=False)

    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, server_default="0", nullable=False)


    pet: Mapped["Pet"] = relationship("Pet", back_populates="health_documents", lazy="selectin")  # type: ignore
