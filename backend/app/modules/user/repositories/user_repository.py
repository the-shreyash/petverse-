"""
app/repositories/user_repository.py

Data-access layer for the ``users`` table.

The repository is the ONLY place that talks to SQLAlchemy for users. Services
and routers never build queries themselves — this keeps persistence concerns in
one testable, swappable place (the "repository pattern"). Repositories never
commit; the request-scoped session (see ``get_db``) owns the transaction
boundary so a single request can span several repository calls atomically.
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.user.models.user import User


from app.core.repository import BaseRepository

class UserRepository(BaseRepository[User]):
    """CRUD operations for :class:`User`."""

    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    # ─── Reads ────────────────────────────────────────────────────────────────

    async def get_by_id(self, user_id: str) -> Optional[User]:
        return await self.session.get(User, user_id)

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(
            select(User).where(User.email == email.strip().lower())
        )
        return result.scalar_one_or_none()

    async def get_by_username(self, username: str) -> Optional[User]:
        result = await self.session.execute(
            select(User).where(User.username == username.strip().lower())
        )
        return result.scalar_one_or_none()

    async def email_exists(
        self, email: str, *, exclude_user_id: Optional[str] = None
    ) -> bool:
        stmt = select(User.id).where(User.email == email.strip().lower())
        if exclude_user_id is not None:
            stmt = stmt.where(User.id != exclude_user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def username_exists(
        self, username: str, *, exclude_user_id: Optional[str] = None
    ) -> bool:
        stmt = select(User.id).where(User.username == username.strip().lower())
        if exclude_user_id is not None:
            stmt = stmt.where(User.id != exclude_user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none() is not None

