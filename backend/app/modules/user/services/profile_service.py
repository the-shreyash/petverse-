"""
app/services/profile_service.py

Business logic for reading and editing the authenticated user's profile.

Scope note: email is deliberately NOT editable through this service. Changing
a login identifier is an authentication concern (it would need re-verification,
session invalidation, etc. — the same machinery ``AuthService`` already owns
for passwords), so it is out of scope for Phase B3 and left as a clearly
separate future extension of the Identity module rather than duplicated here.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.auth import UsernameAlreadyExistsException
from app.modules.user.models.user import User
from app.modules.user.repositories.user_repository import UserRepository
from app.modules.user.schemas.user import ProfileReplaceRequest, ProfileUpdateRequest


class ProfileService:
    """Read/update the profile fields on the ``users`` row."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.users = UserRepository(session)

    async def get_profile(self, user: User) -> User:
        """Return the profile of an already-resolved user (no extra query)."""
        return user

    async def replace_profile(
        self, user: User, payload: ProfileReplaceRequest
    ) -> User:
        """Full replace (PUT) of every editable profile field."""
        if payload.username != user.username:
            if await self.users.username_exists(
                payload.username, exclude_user_id=user.id
            ):
                raise UsernameAlreadyExistsException()

        user.first_name = payload.first_name
        user.last_name = payload.last_name
        user.username = payload.username
        user.phone_number = payload.phone_number
        user.bio = payload.bio
        user.date_of_birth = payload.date_of_birth
        user.gender = payload.gender
        user.country = payload.country
        user.city = payload.city
        user.timezone = payload.timezone
        user.language = payload.language

        return await self.users.save(user)

    async def update_profile(self, user: User, payload: ProfileUpdateRequest) -> User:
        """Partial update (PATCH) — only fields explicitly set are applied."""
        updates = payload.model_dump(exclude_unset=True)

        if "username" in updates and updates["username"] != user.username:
            if await self.users.username_exists(
                updates["username"], exclude_user_id=user.id
            ):
                raise UsernameAlreadyExistsException()

        for field, value in updates.items():
            setattr(user, field, value)

        return await self.users.save(user)
