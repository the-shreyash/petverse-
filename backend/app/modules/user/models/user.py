"""
app/models/user.py

The ``User`` ORM model — the root identity entity of PetVerse.

Every future module (Pets, Health, Shop, Community, Notifications, Admin)
references this table via ``user_id`` foreign keys, so the schema here is the
foundation of the whole data model. Changes must be made deliberately and
always through an Alembic migration.

Security notes:
  - Only ``password_hash`` is ever stored — never the plaintext password.
  - ``password_hash`` is nullable so social-login accounts (provider != LOCAL,
    added later) can exist without a password.
  - The model deliberately has NO method that serialises the hash. Serialisation
    goes through ``app/schemas/user.py`` which omits the hash by construction.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.enums import AuthProvider, Gender, UserRole
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A PetVerse user account."""

    __tablename__ = "users"

    # ─── Identity ─────────────────────────────────────────────────────────────
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)

    # Unique, case-insensitive-in-practice handle. We store it lowercased.
    username: Mapped[str] = mapped_column(
        String(50), unique=True, index=True, nullable=False
    )

    # Unique login identifier. Stored lowercased so lookups are deterministic.
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )

    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    # ─── Credentials ──────────────────────────────────────────────────────────
    # Nullable: OAuth accounts (future) have no local password.
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # ─── Profile ──────────────────────────────────────────────────────────────
    # (Phase B3 — Account Management). Kept on the ``users`` row rather than a
    # separate profile table: they are 1:1, always fetched together with the
    # rest of the identity, and a second table would just duplicate the same
    # user for no query-planning benefit.
    profile_image: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    date_of_birth: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    gender: Mapped[Optional[Gender]] = mapped_column(
        Enum(Gender, native_enum=False, length=32), nullable=True
    )
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    # Display/formatting locale — distinct from UserPreference, which holds
    # notification/theme toggles. Kept here since every module that renders a
    # date or a name for this user needs it, not just the preferences screen.
    timezone: Mapped[str] = mapped_column(String(64), default="UTC", nullable=False)
    language: Mapped[str] = mapped_column(String(10), default="en", nullable=False)

    # ─── Status flags ─────────────────────────────────────────────────────────
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False,
        doc="Soft-disable switch. Inactive users cannot authenticate.",
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False,
        doc="True once the user has confirmed their email address.",
    )

    # ─── Soft delete (Phase B3) ───────────────────────────────────────────────
    # We never hard-delete a user — every other module keys off ``user_id``,
    # and future GDPR/export tooling needs the row to still exist. Deletion is
    # modelled as a flag + timestamp; ``get_current_user`` rejects deleted
    # accounts exactly like inactive ones.
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # ─── Authorization ────────────────────────────────────────────────────────
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, native_enum=False, length=32),
        default=UserRole.USER,
        nullable=False,
        index=True,
    )

    # ─── Provenance ───────────────────────────────────────────────────────────
    provider: Mapped[AuthProvider] = mapped_column(
        Enum(AuthProvider, native_enum=False, length=32),
        default=AuthProvider.LOCAL,
        nullable=False,
    )

    # ─── Activity ─────────────────────────────────────────────────────────────
    last_login: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # ─── Convenience ──────────────────────────────────────────────────────────
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<User id={self.id} email={self.email!r} role={self.role}>"
