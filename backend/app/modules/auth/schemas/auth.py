"""
app/schemas/auth.py

Request and response schemas for the authentication endpoints.

Validation philosophy:
  - Structural/format validation (email shape, length, required fields, password
    strength) lives HERE so bad input is rejected before it reaches the service
    layer and is reported through the standard 422 validation envelope with
    per-field detail.
  - Uniqueness and credential checks are business rules and live in the service
    layer (they need the database).

Normalisation: emails and usernames are lower-cased/stripped at the edge so the
rest of the system only ever deals with canonical values.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from app.core.schema import PetVerseBaseModel

from app.modules.user.schemas.user import UserResponse
from app.utils.password import (
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH,
    PasswordPolicyError,
    validate_password_strength,
)


# ─── Reusable field validators ────────────────────────────────────────────────

def _normalise_email(value: str) -> str:
    return value.strip().lower()


def _validate_strength(value: str) -> str:
    try:
        validate_password_strength(value)
    except PasswordPolicyError as exc:
        # Re-raised as ValueError so Pydantic renders it as a 422 field error.
        raise ValueError(str(exc)) from exc
    return value


# ─── Registration ─────────────────────────────────────────────────────────────

class RegisterRequest(PetVerseBaseModel):
    """Payload for ``POST /auth/register``."""

    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
        pattern=r"^[a-zA-Z0-9._-]+$",
        description="Letters, numbers, dot, underscore and hyphen only.",
    )
    email: EmailStr
    password: str = Field(
        ...,
        min_length=MIN_PASSWORD_LENGTH,
        max_length=MAX_PASSWORD_LENGTH,
        description="8–72 chars with upper, lower, number and special character.",
    )
    phone_number: Optional[str] = Field(default=None, max_length=20)

    _norm_email = field_validator("email", mode="before")(lambda v: _normalise_email(v) if isinstance(v, str) else v)

    @field_validator("username")
    @classmethod
    def normalise_username(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        return _validate_strength(v)


# ─── Login ────────────────────────────────────────────────────────────────────

class LoginRequest(PetVerseBaseModel):
    """Payload for ``POST /auth/login``."""

    email: EmailStr
    password: str = Field(..., min_length=1)

    _norm_email = field_validator("email", mode="before")(lambda v: _normalise_email(v) if isinstance(v, str) else v)


# ─── Tokens ───────────────────────────────────────────────────────────────────

class TokenPair(PetVerseBaseModel):
    """Access + refresh token pair returned by login/refresh."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Access-token lifetime in seconds.")


class AuthResponse(PetVerseBaseModel):
    """Login/registration result: the token pair plus the user profile."""

    user: UserResponse
    tokens: TokenPair


class RefreshRequest(PetVerseBaseModel):
    """Payload for ``POST /auth/refresh``."""

    refresh_token: str = Field(..., min_length=1)


class LogoutRequest(PetVerseBaseModel):
    """Payload for ``POST /auth/logout``."""

    refresh_token: str = Field(..., min_length=1)


# ─── Password reset ───────────────────────────────────────────────────────────

class ForgotPasswordRequest(PetVerseBaseModel):
    """Payload for ``POST /auth/forgot-password``."""

    email: EmailStr

    _norm_email = field_validator("email", mode="before")(lambda v: _normalise_email(v) if isinstance(v, str) else v)


class ResetPasswordRequest(PetVerseBaseModel):
    """Payload for ``POST /auth/reset-password``."""

    token: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=MIN_PASSWORD_LENGTH, max_length=MAX_PASSWORD_LENGTH)

    @field_validator("new_password")
    @classmethod
    def check_password(cls, v: str) -> str:
        return _validate_strength(v)


class ChangePasswordRequest(PetVerseBaseModel):
    """Payload for ``POST /auth/change-password`` (authenticated)."""

    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=MIN_PASSWORD_LENGTH, max_length=MAX_PASSWORD_LENGTH)

    @field_validator("new_password")
    @classmethod
    def check_password(cls, v: str) -> str:
        return _validate_strength(v)


# ─── Email verification ───────────────────────────────────────────────────────

class VerifyEmailRequest(PetVerseBaseModel):
    """Payload for ``POST /auth/verify-email``."""

    token: str = Field(..., min_length=1)


class ResendVerificationRequest(PetVerseBaseModel):
    """Payload for ``POST /auth/resend-verification``."""

    email: EmailStr

    _norm_email = field_validator("email", mode="before")(lambda v: _normalise_email(v) if isinstance(v, str) else v)


# ─── Generic message ──────────────────────────────────────────────────────────

class MessageResponse(PetVerseBaseModel):
    """A simple ``{"detail": ...}`` acknowledgement body."""

    model_config = ConfigDict(extra="forbid")

    detail: str
