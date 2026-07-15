"""
app/repositories/pet_repository.py

Data-access layer for the ``pets`` table.

The repository is the ONLY place that talks to SQLAlchemy for pets. Services
and routers never build queries themselves. Every read here excludes
soft-deleted rows by default (``Pet.is_deleted == False``) so callers never
have to remember to filter them out.
"""

from __future__ import annotations

from typing import Optional, Sequence

from sqlalchemy import Select, and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.enums import PetGender, PetSpecies, PetStatus
from app.modules.pet.models.pet import Pet


from app.core.repository import BaseRepository

class PetRepository(BaseRepository[Pet]):
    """CRUD + query operations for :class:`Pet`."""

    def __init__(self, session: AsyncSession):
        super().__init__(Pet, session)

    # ─── Reads ────────────────────────────────────────────────────────────────

    async def microchip_exists(
        self, microchip_number: str, *, exclude_pet_id: Optional[str] = None
    ) -> bool:
        stmt = select(Pet.id).where(
            Pet.microchip_number == microchip_number, Pet.is_deleted.is_(False)
        )
        if exclude_pet_id is not None:
            stmt = stmt.where(Pet.id != exclude_pet_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def list_by_owner(
        self, owner_id: str, *, page: int, per_page: int
    ) -> tuple[Sequence[Pet], int]:
        """Return (page of pets, total count) for one owner, newest first."""
        base = self._not_deleted().where(Pet.owner_id == owner_id)

        total = await self.session.scalar(
            select(func.count()).select_from(base.subquery())
        )
        result = await self.session.execute(
            base.order_by(Pet.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        return result.scalars().all(), total or 0

    async def search(
        self,
        *,
        owner_id: Optional[str] = None,
        name: Optional[str] = None,
        species: Optional[PetSpecies] = None,
        breed: Optional[str] = None,
        gender: Optional[PetGender] = None,
        status: Optional[PetStatus] = None,
        page: int,
        per_page: int,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> tuple[Sequence[Pet], int]:
        """
        Filtered, paginated, sorted search over non-deleted pets.

        ``owner_id`` scopes results to one owner's pets — every current caller
        passes it (users only ever search their own pets), but it's kept
        optional so a future admin/shelter search can reuse this method
        unscoped.
        """
        conditions = []
        if owner_id is not None:
            conditions.append(Pet.owner_id == owner_id)
        if name:
            conditions.append(Pet.name.ilike(f"%{name}%"))
        if species is not None:
            conditions.append(Pet.species == species)
        if breed:
            conditions.append(Pet.breed.ilike(f"%{breed}%"))
        if gender is not None:
            conditions.append(Pet.gender == gender)
        if status is not None:
            conditions.append(Pet.status == status)

        base = self._not_deleted()
        if conditions:
            base = base.where(and_(*conditions))

        total = await self.session.scalar(
            select(func.count()).select_from(base.subquery())
        )

        sort_column = getattr(Pet, sort_by, Pet.created_at)
        order_clause = sort_column.desc() if sort_order == "desc" else sort_column.asc()

        result = await self.session.execute(
            base.order_by(order_clause)
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        return result.scalars().all(), total or 0

