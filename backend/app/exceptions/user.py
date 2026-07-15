"""
app/exceptions/user.py

Domain exceptions specific to the User Account Management module (Phase B3).

Uniqueness (``EmailAlreadyExistsException`` / ``UsernameAlreadyExistsException``),
bad-credential (``InvalidCredentialsException``) and auth (``Unauthorized`` /
``Forbidden``) errors are already defined in ``app/exceptions/auth.py`` and
``app/exceptions/http.py`` — this module re-uses those rather than redefining
them, so every module shares one error taxonomy.
"""

from __future__ import annotations

from fastapi import status

from app.exceptions.http import PetVerseException


class ProfileNotFoundException(PetVerseException):
    """The requested user profile does not exist (or was soft-deleted)."""

    error_code = "ProfileNotFound"

    def __init__(self, message: str = "User profile not found."):
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)


class InvalidAvatarException(PetVerseException):
    """The uploaded avatar failed type/size validation."""

    error_code = "InvalidAvatar"

    def __init__(self, message: str = "The uploaded file is not a valid avatar image."):
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
