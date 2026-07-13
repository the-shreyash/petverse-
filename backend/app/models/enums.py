"""
app/models/enums.py

Shared enumerations used across the Identity module (and future modules).

Why a dedicated module:
  - Enums are imported by models, schemas, AND dependencies (role checks).
    Keeping them in one dependency-free module avoids circular imports.
  - New roles/providers are added in exactly one place.

All enum *values* are stored as their string name in the database, so adding
a new member is backward compatible as long as existing names are unchanged.
"""

from __future__ import annotations

from enum import Enum


class UserRole(str, Enum):
    """
    Authorization role for a user.

    Inheriting from ``str`` makes the members JSON-serialisable and lets us
    compare directly against plain strings coming from JWT claims.

    Adding a future role (e.g. ``STAFF``) is a one-line change here plus a
    database migration to widen the ENUM — no code elsewhere needs editing.
    """

    USER = "USER"
    ADMIN = "ADMIN"
    VETERINARIAN = "VETERINARIAN"
    SHELTER = "SHELTER"


class AuthProvider(str, Enum):
    """
    How the account was created / authenticates.

    ``LOCAL`` = email + password (Phase B2).
    The OAuth providers are declared now so the column never needs a migration
    when social login lands in a later phase.
    """

    LOCAL = "LOCAL"
    GOOGLE = "GOOGLE"
    APPLE = "APPLE"
    FACEBOOK = "FACEBOOK"


class VerificationTokenType(str, Enum):
    """Purpose of a single-use verification token."""

    EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
    PASSWORD_RESET = "PASSWORD_RESET"
