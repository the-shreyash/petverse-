"""
app/services/pet_search_service.py

Search/filter/pagination over a user's own pets (Phase B4 — Pet Management).

Kept as its own service — distinct from ``PetService`` — because search has
a different shape (query params in, page of results out) and will likely
grow independent concerns later (relevance ranking, caching) without
crowding the CRUD service.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import PetGender, PetSpecies, PetStatus
from app.models.user import User
from app.repositories.pet_repository import PetRepository

_SORTABLE_FIELDS = {"created_at", "name", "birth_date", "updated_at"}


class PetSearchService:
    """Search the current user's pets with filters, pagination, and sorting."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.pets = PetRepository(session)

    async def search(
        self,
        user: User,
        *,
        name: str | None = None,
        species: PetSpecies | None = None,
        breed: str | None = None,
        gender: PetGender | None = None,
        status: PetStatus | None = None,
        page: int = 1,
        per_page: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ):
        if sort_by not in _SORTABLE_FIELDS:
            sort_by = "created_at"
        if sort_order not in ("asc", "desc"):
            sort_order = "desc"

        return await self.pets.search(
            owner_id=user.id,
            name=name,
            species=species,
            breed=breed,
            gender=gender,
            status=status,
            page=page,
            per_page=per_page,
            sort_by=sort_by,
            sort_order=sort_order,
        )
