"""
app/services/preference_service.py

Business logic for account preferences (theme + notification toggles).

Rows are created lazily on first access rather than at registration time, so
``AuthService.register`` never needs to know this table exists — a new module
should never require touching another module's write path.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_preference import UserPreference
from app.repositories.user_preference_repository import UserPreferenceRepository
from app.schemas.user import PreferencesUpdateRequest


class PreferenceService:
    """Read/update the current user's preferences, creating defaults lazily."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.preferences = UserPreferenceRepository(session)

    async def get_or_create(self, user_id: str) -> UserPreference:
        preference = await self.preferences.get_by_user_id(user_id)
        if preference is None:
            preference = await self.preferences.add(UserPreference(user_id=user_id))
        return preference

    async def update(
        self, user_id: str, payload: PreferencesUpdateRequest
    ) -> UserPreference:
        preference = await self.get_or_create(user_id)
        for field, value in payload.model_dump().items():
            setattr(preference, field, value)
        return await self.preferences.save(preference)
