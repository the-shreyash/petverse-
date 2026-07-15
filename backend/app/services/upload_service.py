"""
app/services/upload_service.py

Reusable local file-upload service.

This is intentionally generic — it knows nothing about "avatars" or "users".
Any future module that needs to accept a file (pet photos, health documents,
community post images) should reuse ``UploadService.save`` with its own
subdirectory/validation rules, rather than re-implementing disk I/O.

Storage model: files are written under ``UPLOAD_DIRECTORY/<subdir>/`` with a
UUID filename (never the client-supplied name, which avoids path traversal and
collisions). Only the resulting URL is ever persisted in the database — the
caller decides what to do with the returned path.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

from fastapi import UploadFile

from app.core.config import get_settings


class UploadService:
    """Validates and persists uploaded files to local disk."""

    def __init__(self) -> None:
        self.settings = get_settings()

    async def save_image(
        self,
        file: UploadFile,
        *,
        subdir: str,
        allowed_content_types: set[str],
        max_size_bytes: int,
    ) -> str:
        """
        Validate and persist an image upload. Returns the public URL path
        (e.g. ``/uploads/avatars/<uuid>.png``) to store on the owning record.

        Raises ``ValueError`` on validation failure — callers translate this
        into their own domain exception (e.g. ``InvalidAvatarException``) so
        this service stays free of any module-specific error taxonomy.
        """
        if file.content_type not in allowed_content_types:
            raise ValueError(
                f"Unsupported file type '{file.content_type}'. "
                f"Allowed: {', '.join(sorted(allowed_content_types))}."
            )

        contents = await file.read()
        if len(contents) == 0:
            raise ValueError("The uploaded file is empty.")
        if len(contents) > max_size_bytes:
            raise ValueError(
                f"File too large. Maximum size is {max_size_bytes // (1024 * 1024)}MB."
            )

        extension = _EXTENSIONS_BY_CONTENT_TYPE.get(file.content_type, "")
        from app.utils.uuid_helper import generate_uuid_hex

        filename = f"{generate_uuid_hex()}{extension}"

        target_dir = Path(self.settings.UPLOAD_DIRECTORY) / subdir
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / filename
        target_path.write_bytes(contents)

        return f"/uploads/{subdir}/{filename}"

    def delete(self, url: Optional[str]) -> None:
        """
        Remove a previously-saved file given its public URL. Silent no-op if
        the URL is empty, external, or the file is already gone.
        """
        if not url or not url.startswith("/uploads/"):
            return

        relative_path = url.removeprefix("/uploads/")
        # Guard against path traversal — resolve and confirm containment.
        base_dir = Path(self.settings.UPLOAD_DIRECTORY).resolve()
        target_path = (base_dir / relative_path).resolve()
        if base_dir not in target_path.parents:
            return

        if target_path.is_file():
            os.remove(target_path)


_EXTENSIONS_BY_CONTENT_TYPE = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
