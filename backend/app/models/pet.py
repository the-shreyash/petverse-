"""
app/models/pet.py

The ``Pet`` ORM model — the core domain entity of PetVerse (Phase B4).

Every future module (Health, Vaccinations, Appointments, Feeding, Documents,
AI, Orders, Community, Notifications) hangs off this table via a ``pet_id``
foreign key. Pet data itself is never duplicated into those modules — they
reference this row instead.

Design decisions:
  - ``age`` is deliberately NOT a stored column. It is derived from
    ``birth_date`` (see ``PetResponse.age`` in ``app/schemas/pet.py``) so it
    can never drift out of sync with the date it's computed from.
  - ``status`` (real-world life/adoption status) is distinct from
    ``is_active`` (owner-controlled visibility toggle) — see ``PetStatus``
    in ``app/models/enums.py`` for the rationale.
  - Soft delete mirrors ``User``: ``is_deleted`` + ``deleted_at``. Every
    future module keys off ``pet_id``, so rows are never hard-deleted.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.enums import PetGender, PetSpecies, PetStatus
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Pet(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A pet profile owned by a :class:`~app.models.user.User`."""

    __tablename__ = "pets"

    # ─── Ownership ────────────────────────────────────────────────────────────
    owner_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    # ─── Identity ─────────────────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    species: Mapped[PetSpecies] = mapped_column(
        Enum(PetSpecies, native_enum=False, length=32), nullable=False, index=True
    )
    breed: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    gender: Mapped[Optional[PetGender]] = mapped_column(
        Enum(PetGender, native_enum=False, length=16), nullable=True
    )
    birth_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # ─── Physical attributes ──────────────────────────────────────────────────
    # Numeric(6,2): up to 4 whole digits + 2 decimal places — comfortably
    # covers everything from a goldfish (grams) to a horse (~700kg).
    weight: Mapped[Optional[float]] = mapped_column(Numeric(6, 2), nullable=True)
    height: Mapped[Optional[float]] = mapped_column(Numeric(6, 2), nullable=True)
    color: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # ─── Medical identity ─────────────────────────────────────────────────────
    # ISO 11784/11785 microchips are 15 digits, but legacy/regional chips vary
    # (9-15 alphanumeric) — validated in the schema layer, stored as a string.
    microchip_number: Mapped[Optional[str]] = mapped_column(
        String(50), unique=True, nullable=True
    )
    sterilized: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # Free text: blood typing systems differ by species (canine DEA, feline
    # A/B/AB, ...) — a closed enum would need a species-aware taxonomy that is
    # out of scope for Pet Management and belongs to the future Health module.
    blood_group: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    # ─── Media ────────────────────────────────────────────────────────────────
    profile_image: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    cover_image: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    # ─── Profile ──────────────────────────────────────────────────────────────
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # ─── Status ───────────────────────────────────────────────────────────────
    status: Mapped[PetStatus] = mapped_column(
        Enum(PetStatus, native_enum=False, length=16),
        default=PetStatus.ACTIVE,
        nullable=False,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False,
        doc="Owner-controlled visibility toggle, independent of ``status``.",
    )

    # ─── Soft delete ──────────────────────────────────────────────────────────
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<Pet id={self.id} name={self.name!r} owner_id={self.owner_id}>"
