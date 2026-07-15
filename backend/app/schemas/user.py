"""
app/schemas/user.py

User-facing serialisation schemas.

``UserResponse`` is the ONLY shape in which a user is ever returned to clients.
It has no ``password_hash`` field, so the hash is impossible to leak through the
API by construction — even if a raw ORM object is accidentally passed in,
Pydantic drops unlisted attributes.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.enums import (
    AuthProvider,
    Gender,
    ProfileVisibility,
    ThemePreference,
    UserRole,
)


class UserResponse(BaseModel):
    """Public representation of a user account."""

    # ``from_attributes`` lets us build this straight from an ORM ``User``.
    model_config = ConfigDict(from_attributes=True)

    id: str
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    country: Optional[str] = None
    city: Optional[str] = None
    timezone: str
    language: str
    profile_image: Optional[str] = None
    is_active: bool
    is_verified: bool
    role: UserRole
    provider: AuthProvider
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None


# ─── Profile update (PUT — full replace of every editable field) ──────────────

class ProfileReplaceRequest(BaseModel):
    """Payload for ``PUT /users/me`` — replaces every editable profile field."""

    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    username: str = Field(
        ..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9._-]+$"
    )
    phone_number: Optional[str] = Field(default=None, max_length=20)
    bio: Optional[str] = Field(default=None, max_length=1000)
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    country: Optional[str] = Field(default=None, max_length=100)
    city: Optional[str] = Field(default=None, max_length=100)
    timezone: str = Field(default="UTC", max_length=64)
    language: str = Field(default="en", max_length=10)

    @field_validator("username")
    @classmethod
    def normalise_username(cls, v: str) -> str:
        return v.strip().lower()


# ─── Profile update (PATCH — partial update) ───────────────────────────────────

class ProfileUpdateRequest(BaseModel):
    """Payload for ``PATCH /users/me`` — only provided fields are updated."""

    first_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    username: Optional[str] = Field(
        default=None, min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9._-]+$"
    )
    phone_number: Optional[str] = Field(default=None, max_length=20)
    bio: Optional[str] = Field(default=None, max_length=1000)
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    country: Optional[str] = Field(default=None, max_length=100)
    city: Optional[str] = Field(default=None, max_length=100)
    timezone: Optional[str] = Field(default=None, max_length=64)
    language: Optional[str] = Field(default=None, max_length=10)

    @field_validator("username")
    @classmethod
    def normalise_username(cls, v: Optional[str]) -> Optional[str]:
        return v.strip().lower() if v is not None else v


# ─── Avatar ─────────────────────────────────────────────────────────────────────

class AvatarResponse(BaseModel):
    """Response for avatar upload/delete — the URL stored in ``profile_image``."""

    model_config = ConfigDict(from_attributes=True)

    profile_image: Optional[str] = None


# ─── Preferences ────────────────────────────────────────────────────────────────

class PreferencesResponse(BaseModel):
    """Response for ``GET/PUT /users/preferences``."""

    model_config = ConfigDict(from_attributes=True)

    theme: ThemePreference
    email_notifications: bool
    push_notifications: bool
    marketing_emails: bool
    ai_notifications: bool
    community_notifications: bool
    order_notifications: bool
    health_notifications: bool


class PreferencesUpdateRequest(BaseModel):
    """Payload for ``PUT /users/preferences`` — full replace with sane defaults."""

    theme: ThemePreference = ThemePreference.SYSTEM
    email_notifications: bool = True
    push_notifications: bool = True
    marketing_emails: bool = False
    ai_notifications: bool = True
    community_notifications: bool = True
    order_notifications: bool = True
    health_notifications: bool = True


# ─── Privacy ────────────────────────────────────────────────────────────────────

class PrivacyResponse(BaseModel):
    """Response for ``GET/PUT /users/privacy``."""

    model_config = ConfigDict(from_attributes=True)

    profile_visibility: ProfileVisibility
    search_visibility: bool


class PrivacyUpdateRequest(BaseModel):
    """Payload for ``PUT /users/privacy`` — full replace with sane defaults."""

    profile_visibility: ProfileVisibility = ProfileVisibility.PUBLIC
    search_visibility: bool = True


# ─── Account lifecycle (deactivate / delete) ───────────────────────────────────

class AccountActionRequest(BaseModel):
    """
    Payload for ``DELETE /users/deactivate`` and ``DELETE /users/delete-account``.

    Both are irreversible-ish, high-blast-radius actions, so we require the
    current password as a re-authentication step — the same defence-in-depth
    principle already used for ``change-password``.
    """

    password: str = Field(..., min_length=1)
