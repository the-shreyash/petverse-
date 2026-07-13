"""
app/database/base.py

SQLAlchemy 2.0 declarative base.

ALL models must inherit from Base defined here so that:
  - Alembic can discover all table definitions via Base.metadata
  - The async engine has a single metadata registry
  - Future models just do: from app.database.base import Base

Do NOT put any model definitions here — keep this file minimal.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Shared declarative base for all PetVerse ORM models.

    Alembic env.py imports Base.metadata to auto-detect migrations.
    """
    pass
