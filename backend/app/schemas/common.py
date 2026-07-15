"""
app/schemas/common.py

Shared schemas used across the application.
"""

from typing import Generic, Sequence, TypeVar
from pydantic import Field
from app.core.schema import PetVerseBaseModel

T = TypeVar("T")

class PaginatedResponse(PetVerseBaseModel, Generic[T]):
    """Generic pagination wrapper for listing operations."""
    items: Sequence[T]
    total: int = Field(ge=0, description="Total number of items available")
    page: int = Field(ge=1, description="Current page number")
    per_page: int = Field(ge=1, le=100, description="Items per page")
    total_pages: int = Field(ge=0, description="Total number of pages")
