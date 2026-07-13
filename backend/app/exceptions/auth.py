"""
app/exceptions/auth.py

Authentication & authorization domain exceptions.

These subclass the shared ``PetVerseException`` hierarchy from ``http.py`` so
they are rendered by the same global exception handler into the standard error
envelope — no per-route error handling required.

Design choices:
  - ``InvalidCredentialsException`` is deliberately vague ("Invalid email or
    password"). We never reveal whether the email exists — that would let an
    attacker enumerate registered accounts.
  - ``EmailAlreadyExists`` / ``UsernameAlreadyExists`` are 409 Conflict and DO
    name the field, because these fire during registration where the user is
    acting on their own data (no enumeration benefit beyond what "sign in"
    already reveals) and clear feedback is important UX.
"""

from __future__ import annotations

from fastapi import status

from app.exceptions.http import PetVerseException


class InvalidCredentialsException(PetVerseException):
    """Email/password (or refresh credentials) did not match."""

    error_code = "InvalidCredentials"

    def __init__(self, message: str = "Invalid email or password."):
        super().__init__(message=message, status_code=status.HTTP_401_UNAUTHORIZED)


class EmailAlreadyExistsException(PetVerseException):
    """Registration attempted with an email that is already in use."""

    error_code = "EmailAlreadyExists"

    def __init__(self, message: str = "An account with this email already exists."):
        super().__init__(message=message, status_code=status.HTTP_409_CONFLICT)


class UsernameAlreadyExistsException(PetVerseException):
    """Registration attempted with a username that is already taken."""

    error_code = "UsernameAlreadyExists"

    def __init__(self, message: str = "This username is already taken."):
        super().__init__(message=message, status_code=status.HTTP_409_CONFLICT)


class InvalidTokenException(PetVerseException):
    """Token is malformed, has the wrong type, was revoked, or the signature failed."""

    error_code = "InvalidToken"

    def __init__(self, message: str = "The provided token is invalid."):
        super().__init__(message=message, status_code=status.HTTP_401_UNAUTHORIZED)


class ExpiredTokenException(PetVerseException):
    """Token signature was valid but the token has expired."""

    error_code = "ExpiredToken"

    def __init__(self, message: str = "The provided token has expired."):
        super().__init__(message=message, status_code=status.HTTP_401_UNAUTHORIZED)


class InactiveUserException(PetVerseException):
    """The account exists but has been deactivated."""

    error_code = "InactiveUser"

    def __init__(self, message: str = "This account has been deactivated."):
        super().__init__(message=message, status_code=status.HTTP_403_FORBIDDEN)


class UnverifiedUserException(PetVerseException):
    """The account has not completed email verification."""

    error_code = "UnverifiedUser"

    def __init__(self, message: str = "Please verify your email address to continue."):
        super().__init__(message=message, status_code=status.HTTP_403_FORBIDDEN)


class WeakPasswordException(PetVerseException):
    """A supplied password failed the strength policy."""

    error_code = "WeakPassword"

    def __init__(self, message: str = "Password does not meet the security requirements."):
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
