"""
app/dependencies/users.py

Service providers for the User Account Management module (Phase B3).

Follows the same pattern as ``get_auth_service`` in ``app/dependencies/auth.py``:
one small factory per service, bound to the request-scoped DB session.
Authentication itself is never re-implemented here — routers depend on
``get_current_user`` from ``app.dependencies.auth``.
"""

from __future__ import annotations

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.common import get_db
from app.services.avatar_service import AvatarService
from app.services.preference_service import PreferenceService
from app.services.privacy_service import PrivacyService
from app.services.profile_service import ProfileService
from app.services.user_service import UserService


def get_profile_service(db: AsyncSession = Depends(get_db)) -> ProfileService:
    return ProfileService(db)


def get_avatar_service(db: AsyncSession = Depends(get_db)) -> AvatarService:
    return AvatarService(db)


def get_preference_service(db: AsyncSession = Depends(get_db)) -> PreferenceService:
    return PreferenceService(db)


def get_privacy_service(db: AsyncSession = Depends(get_db)) -> PrivacyService:
    return PrivacyService(db)


def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)
