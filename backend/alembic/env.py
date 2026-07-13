"""
alembic/env.py

Alembic migration environment — configured for SQLAlchemy 2.0 async.

Key design decisions:
  1. DATABASE_URL is loaded from .env via our Settings class — no hardcoded creds
  2. We import Base.metadata so Alembic can auto-detect model changes
  3. run_migrations_online uses asyncio.run() to work with async engine
  4. All future models that inherit from Base are automatically detected

Adding a new model to migrations:
  1. Create your model in app/models/ inheriting from Base
  2. Import it in app/models/__init__.py
  3. Import app.models in this file (already done below)
  4. Run: alembic revision --autogenerate -m "add your_table"
  5. Review the generated migration, then: alembic upgrade head
"""

from __future__ import annotations

import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

# ── Import Base metadata ───────────────────────────────────────────────────────
# This import must come BEFORE any model imports so Base is registered first.
from app.database.base import Base  # noqa: F401

# ── Import all models so Alembic can detect them ──────────────────────────────
# Add new model modules here as you create them in Phase B2, B3, etc.
# Example:
#   from app.models import user, pet, appointment  # noqa: F401
import app.models  # noqa: F401 — triggers __init__.py which imports all models

# ── Load DATABASE_URL from settings ───────────────────────────────────────────
from app.core.config import get_settings

_settings = get_settings()

# ── Alembic Config ────────────────────────────────────────────────────────────
config = context.config

# Override the sqlalchemy.url from alembic.ini with the real URL from .env
config.set_main_option("sqlalchemy.url", _settings.DATABASE_URL)

# Set up loggers from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# The metadata object containing all table definitions
target_metadata = Base.metadata


# ─── Offline Migrations ───────────────────────────────────────────────────────

def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    Generates SQL scripts without connecting to the database.
    Useful for reviewing migrations before applying them.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,           # detect column type changes
        compare_server_default=True, # detect default value changes
    )
    with context.begin_transaction():
        context.run_migrations()


# ─── Online Migrations ────────────────────────────────────────────────────────

def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """
    Run migrations against a live database using an async engine.

    We use NullPool here because Alembic holds one connection for the
    duration of the migration — we do not need connection pooling.
    """
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Entry point for online migrations."""
    asyncio.run(run_async_migrations())


# ─── Dispatch ─────────────────────────────────────────────────────────────────
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
