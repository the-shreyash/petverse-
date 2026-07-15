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


class Gender(str, Enum):
    """Self-identified gender, shown on the profile. Optional everywhere."""

    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"
    PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY"


class ThemePreference(str, Enum):
    """UI theme preference (Phase B3 — Account Preferences)."""

    LIGHT = "LIGHT"
    DARK = "DARK"
    SYSTEM = "SYSTEM"


class ProfileVisibility(str, Enum):
    """Who can view a user's profile (Phase B3 — Privacy Settings)."""

    PUBLIC = "PUBLIC"
    PRIVATE = "PRIVATE"


class PetSpecies(str, Enum):
    """
    Species of a pet (Phase B4 — Pet Management).

    Kept as a closed enum rather than free text so every future module
    (Health, AI, Shop) can branch on species without fuzzy string matching.
    ``OTHER`` covers anything not yet modelled explicitly.
    """

    DOG = "DOG"
    CAT = "CAT"
    BIRD = "BIRD"
    RABBIT = "RABBIT"
    FISH = "FISH"
    REPTILE = "REPTILE"
    RODENT = "RODENT"
    HORSE = "HORSE"
    OTHER = "OTHER"


class PetGender(str, Enum):
    """
    Biological sex of a pet.

    A separate enum from ``Gender`` (used for human users) — pets don't have
    a self-identified gender or a "prefer not to say" option, and conflating
    the two enums would let an unrelated future change to human ``Gender``
    accidentally ripple into the Pet domain.
    """

    MALE = "MALE"
    FEMALE = "FEMALE"
    UNKNOWN = "UNKNOWN"


class PetStatus(str, Enum):
    """
    Real-world life/adoption status of a pet.

    Distinct from ``Pet.is_active`` (a simple visibility toggle the owner can
    flip at will): ``status`` reflects a fact about the pet itself that other
    modules make decisions on — e.g. Health should stop sending vaccination
    reminders for a ``DECEASED`` pet regardless of ``is_active``.
    """

    ACTIVE = "ACTIVE"
    LOST = "LOST"
    DECEASED = "DECEASED"
    GIVEN_UP = "GIVEN_UP"
