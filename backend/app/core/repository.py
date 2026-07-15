"""
app/core/repository.py

Provides the generic BaseRepository for all domain repositories to inherit from.
This reduces boilerplate for standard CRUD operations.
"""

from typing import Generic, Optional, Sequence, Type, TypeVar
from sqlalchemy import Select, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import Base

T = TypeVar("T", bound=Base)


class BaseRepository(Generic[T]):
    """Generic repository providing standard CRUD operations."""

    def __init__(self, model: Type[T], session: AsyncSession):
        self.model = model
        self.session = session

    def _not_deleted(self) -> Select:
        """Returns a query filtering out soft-deleted records if the model supports it."""
        if hasattr(self.model, "is_deleted"):
            return select(self.model).where(self.model.is_deleted.is_(False))
        return select(self.model)

    async def get_by_id(self, id: str) -> Optional[T]:
        """Fetch a single record by its ID, excluding soft-deleted ones."""
        result = await self.session.execute(
            self._not_deleted().where(self.model.id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[T]:
        """Fetch multiple records with pagination."""
        result = await self.session.execute(
            self._not_deleted().offset(skip).limit(limit)
        )
        return result.scalars().all()

    async def add(self, entity: T) -> T:
        """Stage for insertion and flush."""
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def save(self, entity: T) -> T:
        """Persist changes to an already tracked entity."""
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def delete(self, entity: T, hard: bool = False) -> None:
        """Delete an entity. Soft delete if supported unless hard=True."""
        if not hard and hasattr(entity, "is_deleted"):
            entity.is_deleted = True
            await self.save(entity)
        else:
            await self.session.delete(entity)
            await self.session.flush()
