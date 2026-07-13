"""
app/schemas/user.py

User-facing serialisation schemas.

``UserResponse`` is the ONLY shape in which a user is ever returned to clients.
It has no ``password_hash`` field, so the hash is impossible to leak through the
API by construction — even if a raw ORM object is accidentally passed in,
Pydantic drops unlisted attributes.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enums import AuthProvider, UserRole


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
    profile_image: Optional[str] = None
    is_active: bool
    is_verified: bool
    role: UserRole
    provider: AuthProvider
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
