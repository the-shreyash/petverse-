"""
app/utils/datetime_helper.py

Date and time utilities for PetVerse.

Philosophy:
  - All datetimes stored in UTC
  - All datetimes serialised as ISO 8601 strings
  - Timezone-aware throughout — no naive datetimes in business logic
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Optional


def utcnow() -> datetime:
    """Return the current UTC datetime (timezone-aware)."""
    return datetime.now(tz=timezone.utc)


def to_iso(dt: Optional[datetime]) -> Optional[str]:
    """
    Convert a datetime to ISO 8601 string.

    Returns None if dt is None (safe for optional fields).
    Ensures the output always includes timezone info (Z suffix).
    """
    if dt is None:
        return None
    if dt.tzinfo is None:
        # Assume naive datetimes from DB are UTC
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def from_iso(value: str) -> datetime:
    """Parse an ISO 8601 string into a timezone-aware datetime."""
    dt = datetime.fromisoformat(value)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def date_to_str(d: Optional[date]) -> Optional[str]:
    """Format a date object as YYYY-MM-DD string."""
    if d is None:
        return None
    return d.isoformat()


def timestamp_ms() -> int:
    """Return current UTC time as Unix timestamp in milliseconds."""
    return int(utcnow().timestamp() * 1000)
