"""
app/exceptions/http.py

Domain-specific HTTP exception classes for PetVerse.

These are thin wrappers around FastAPI's HTTPException that carry:
  - A machine-readable error_code (used by the exception handler)
  - Semantic status codes as defaults
  - Meaningful default messages

Usage:
    from app.exceptions.http import NotFoundException
    raise NotFoundException("Pet not found")
"""

from __future__ import annotations

from fastapi import HTTPException, status


class PetVerseException(HTTPException):
    """Base exception for all PetVerse domain errors."""
    error_code: str = "PetVerseError"

    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=message)


class NotFoundException(PetVerseException):
    """Resource does not exist."""
    error_code = "NotFound"

    def __init__(self, message: str = "The requested resource was not found."):
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)


class ConflictException(PetVerseException):
    """Resource already exists / conflict."""
    error_code = "Conflict"

    def __init__(self, message: str = "A conflict occurred with the current state."):
        super().__init__(message=message, status_code=status.HTTP_409_CONFLICT)


class UnauthorizedException(PetVerseException):
    """Authentication required or credentials invalid."""
    error_code = "Unauthorized"

    def __init__(self, message: str = "Authentication is required."):
        super().__init__(message=message, status_code=status.HTTP_401_UNAUTHORIZED)


class ForbiddenException(PetVerseException):
    """Authenticated but not permitted to access this resource."""
    error_code = "Forbidden"

    def __init__(self, message: str = "You do not have permission to access this resource."):
        super().__init__(message=message, status_code=status.HTTP_403_FORBIDDEN)


class DatabaseException(PetVerseException):
    """Database operation failed."""
    error_code = "DatabaseError"

    def __init__(self, message: str = "A database error occurred."):
        super().__init__(message=message, status_code=status.HTTP_503_SERVICE_UNAVAILABLE)


class UnprocessableException(PetVerseException):
    """Business rule validation failure (distinct from schema validation)."""
    error_code = "UnprocessableEntity"

    def __init__(self, message: str = "The request could not be processed."):
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
