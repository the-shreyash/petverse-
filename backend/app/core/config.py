"""
app/core/config.py

Centralized settings for PetVerse backend.

Uses Pydantic BaseSettings to:
  - Load values from .env file automatically
  - Validate all required fields at startup
  - Support development / testing / production environments
  - Construct DATABASE_URL from parts if not provided directly

Usage:
    from app.core.config import get_settings
    settings = get_settings()
"""

from __future__ import annotations

import secrets
from functools import lru_cache
from typing import Literal, Optional

from pydantic import AnyUrl, Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application-wide settings.  All values are loaded from environment
    variables (or a .env file).  Missing required values raise a
    ValidationError at startup — fail fast, fail loud.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",          # silently ignore unknown env vars
    )

    # ─── Application ──────────────────────────────────────────────────────────
    APP_NAME: str = Field(default="PetVerse", description="Application name")
    APP_VERSION: str = Field(default="1.0.0", description="Semantic version")
    API_PREFIX: str = Field(default="/api/v1", description="Global API prefix")
    ENVIRONMENT: Literal["development", "testing", "production"] = Field(
        default="development"
    )

    # ─── Security ─────────────────────────────────────────────────────────────
    SECRET_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(64),
        description="App secret key. Set explicitly in production.",
    )

    # ─── JWT (used in Phase B2) ───────────────────────────────────────────────
    JWT_SECRET: str = Field(
        default_factory=lambda: secrets.token_urlsafe(64),
        description="JWT signing secret. Set explicitly in production.",
    )
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, gt=0)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7, gt=0)

    # Single-use email verification / password reset token lifetimes (Phase B2)
    EMAIL_VERIFICATION_EXPIRE_HOURS: int = Field(default=24, gt=0)
    PASSWORD_RESET_EXPIRE_MINUTES: int = Field(default=30, gt=0)

    # Bcrypt work factor. 12 is the production default; tests may lower it.
    BCRYPT_ROUNDS: int = Field(default=12, ge=4, le=16)

    # Base URL of the frontend — used to build links inside placeholder emails.
    FRONTEND_URL: str = Field(default="http://localhost:5173")

    # ─── MySQL ────────────────────────────────────────────────────────────────
    MYSQL_HOST: str = Field(default="localhost")
    MYSQL_PORT: int = Field(default=3306, gt=0, le=65535)
    MYSQL_DATABASE: str = Field(default="petverse")
    MYSQL_USER: str = Field(default="root")
    MYSQL_PASSWORD: str = Field(default="")

    # Can be provided directly; constructed from parts if absent
    DATABASE_URL: Optional[str] = Field(default=None)

    # ─── File Uploads ─────────────────────────────────────────────────────────
    UPLOAD_DIRECTORY: str = Field(default="uploads")
    MAX_AVATAR_SIZE_MB: int = Field(default=5, gt=0)
    ALLOWED_AVATAR_CONTENT_TYPES: str = Field(
        default="image/jpeg,image/png,image/webp",
        description="Comma-separated list of accepted avatar MIME types",
    )
    MAX_PET_IMAGE_SIZE_MB: int = Field(default=5, gt=0)
    ALLOWED_PET_IMAGE_CONTENT_TYPES: str = Field(
        default="image/jpeg,image/png,image/webp",
        description="Comma-separated list of accepted pet image MIME types",
    )
    PET_GALLERY_MAX_IMAGES: int = Field(
        default=20, gt=0, description="Max gallery images per pet"
    )

    # ─── CORS ─────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: str = Field(
        default="http://localhost:5173,http://localhost:5174",
        description="Comma-separated list of allowed origins",
    )

    # ─── Logging ──────────────────────────────────────────────────────────────
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
        default="INFO"
    )

    # ─── AI Services ──────────────────────────────────────────────────────────
    OPENAI_API_KEY: Optional[str] = Field(default=None)
    GEMINI_API_KEY: Optional[str] = Field(default=None)

    # ─── Computed Properties ──────────────────────────────────────────────────

    @model_validator(mode="after")
    def build_database_url(self) -> "Settings":
        """
        Construct DATABASE_URL from MySQL parts if not explicitly provided.
        Uses aiomysql driver for SQLAlchemy async support.

        Special characters in the password (@ # $ etc.) are URL-encoded so
        they don't confuse the connection URL parser.
        """
        if not self.DATABASE_URL:
            from urllib.parse import quote_plus
            encoded_password = quote_plus(self.MYSQL_PASSWORD)
            encoded_user = quote_plus(self.MYSQL_USER)
            self.DATABASE_URL = (
                f"mysql+aiomysql://{encoded_user}:{encoded_password}"
                f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
            )
        return self

    @property
    def allowed_origins_list(self) -> list[str]:
        """Parse comma-separated ALLOWED_ORIGINS into a list."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def allowed_avatar_content_types_set(self) -> set[str]:
        """Parse comma-separated ALLOWED_AVATAR_CONTENT_TYPES into a set."""
        return {
            t.strip() for t in self.ALLOWED_AVATAR_CONTENT_TYPES.split(",") if t.strip()
        }

    @property
    def max_avatar_size_bytes(self) -> int:
        return self.MAX_AVATAR_SIZE_MB * 1024 * 1024

    @property
    def allowed_pet_image_content_types_set(self) -> set[str]:
        """Parse comma-separated ALLOWED_PET_IMAGE_CONTENT_TYPES into a set."""
        return {
            t.strip()
            for t in self.ALLOWED_PET_IMAGE_CONTENT_TYPES.split(",")
            if t.strip()
        }

    @property
    def max_pet_image_size_bytes(self) -> int:
        return self.MAX_PET_IMAGE_SIZE_MB * 1024 * 1024

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

    @property
    def is_testing(self) -> bool:
        return self.ENVIRONMENT == "testing"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def swagger_enabled(self) -> bool:
        """Swagger/ReDoc are only served in development and testing."""
        return self.ENVIRONMENT in ("development", "testing")

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if v in ("change-me-generate-a-secure-random-key-at-least-32-chars", ""):
            import logging
            logging.getLogger(__name__).warning(
                "SECRET_KEY is using the default placeholder value. "
                "Set a proper SECRET_KEY in production."
            )
        return v

    @field_validator("JWT_SECRET")
    @classmethod
    def validate_jwt_secret(cls, v: str) -> str:
        if v in ("change-me-generate-a-separate-jwt-secret-key", ""):
            import logging
            logging.getLogger(__name__).warning(
                "JWT_SECRET is using the default placeholder value. "
                "Set a proper JWT_SECRET in production."
            )
        return v


@lru_cache
def get_settings() -> Settings:
    """
    Return the cached Settings singleton.

    Using @lru_cache ensures the .env file is only read once per process,
    and all callers share the same instance.

    In tests, call get_settings.cache_clear() to reset between test cases.
    """
    return Settings()
