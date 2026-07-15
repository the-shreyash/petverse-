"""
app/modules/health/models/weight.py

Weight model.
"""

from datetime import date, datetime
from typing import Optional
from sqlalchemy import String, Float, DateTime, Text, ForeignKey, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import UUIDPrimaryKeyMixin, TimestampMixin


class WeightHistory(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "weight_histories"

    pet_id: Mapped[str] = mapped_column(ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    height: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, server_default="0", nullable=False)


    pet: Mapped["Pet"] = relationship("Pet", back_populates="weight_histories", lazy="selectin")  # type: ignore
