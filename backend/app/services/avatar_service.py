"""
app/services/avatar_service.py

Avatar-specific orchestration on top of the generic ``UploadService``.

Only the resulting URL is ever stored on ``User.profile_image`` — the file
itself lives on disk (or, later, object storage) and this service is the only
place that knows the avatar-specific rules (subdir, size limit, allowed types).
"""

from __future__ import annotations

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.exceptions.user import InvalidAvatarException
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.services.upload_service import UploadService

_AVATAR_SUBDIR = "avatars"


class AvatarService:
    """Upload and delete the current user's profile avatar."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.users = UserRepository(session)
        self.settings = get_settings()
        self.uploads = UploadService()

    async def upload_avatar(self, user: User, file: UploadFile) -> User:
        """Validate, store, and attach a new avatar; delete the old one."""
        try:
            url = await self.uploads.save_image(
                file,
                subdir=_AVATAR_SUBDIR,
                allowed_content_types=self.settings.allowed_avatar_content_types_set,
                max_size_bytes=self.settings.max_avatar_size_bytes,
            )
        except ValueError as exc:
            raise InvalidAvatarException(str(exc)) from exc

        old_url = user.profile_image
        user.profile_image = url
        user = await self.users.save(user)

        if old_url:
            self.uploads.delete(old_url)

        return user

    async def delete_avatar(self, user: User) -> User:
        """Remove the current avatar, if any. Idempotent."""
        old_url = user.profile_image
        if old_url:
            user.profile_image = None
            user = await self.users.save(user)
            self.uploads.delete(old_url)
        return user
