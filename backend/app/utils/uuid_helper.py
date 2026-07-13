"""
app/utils/uuid_helper.py

UUID utilities for PetVerse.

Using UUID4 as primary identifiers for:
  - Request tracing
  - Future entity IDs (Phase B2+)
  - Upload file names (prevent enumeration)
"""

from __future__ import annotations

import uuid


def generate_uuid() -> str:
    """Generate a new UUID4 as a lowercase hyphenated string."""
    return str(uuid.uuid4())


def generate_uuid_hex() -> str:
    """Generate a new UUID4 without hyphens (useful for file names)."""
    return uuid.uuid4().hex


def is_valid_uuid(value: str) -> bool:
    """Check if a string is a valid UUID (any version)."""
    try:
        uuid.UUID(str(value))
        return True
    except (ValueError, AttributeError):
        return False
