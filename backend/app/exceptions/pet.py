"""
app/exceptions/pet.py

Domain exceptions specific to the Pet Management module (Phase B4).

Unauthorized/Forbidden access is already defined in ``app/exceptions/http.py``
(``ForbiddenException``) — reused directly rather than redefined, so every
module shares one error taxonomy. Species/gender/status are closed enums, so
an invalid value is already rejected by Pydantic as a 422 ``ValidationError``
before it ever reaches a service — no separate ``InvalidSpecies`` exception is
needed for those.
"""

from __future__ import annotations

from fastapi import status

from app.exceptions.http import PetVerseException


class PetNotFoundException(PetVerseException):
    """The requested pet does not exist (or was soft-deleted)."""

    error_code = "PetNotFound"

    def __init__(self, message: str = "Pet not found."):
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)


class DuplicateMicrochipException(PetVerseException):
    """The supplied microchip number is already registered to another pet."""

    error_code = "DuplicateMicrochip"

    def __init__(self, message: str = "This microchip number is already registered."):
        super().__init__(message=message, status_code=status.HTTP_409_CONFLICT)


class InvalidPetImageException(PetVerseException):
    """The uploaded profile/cover/gallery image failed type/size validation."""

    error_code = "InvalidPetImage"

    def __init__(self, message: str = "The uploaded file is not a valid image."):
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


class GalleryImageNotFoundException(PetVerseException):
    """The requested gallery image does not exist on this pet."""

    error_code = "GalleryImageNotFound"

    def __init__(self, message: str = "Gallery image not found."):
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)


class GalleryLimitExceededException(PetVerseException):
    """The pet's gallery has reached its maximum number of images."""

    error_code = "GalleryLimitExceeded"

    def __init__(self, message: str = "This pet's gallery is full."):
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
