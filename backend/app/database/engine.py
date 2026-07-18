"""
app/database/engine.py

Async SQLAlchemy engine, session factory, and database lifecycle utilities.

Architecture decisions:
  - NullPool in testing to avoid cross-test connection state leaks
  - Pool recycling every 3600s to avoid MySQL "gone away" errors
  - pre_ping=True to validate connections before use
  - AsyncSession with expire_on_commit=False for async safety

Usage:
    # In dependencies
    async for session in get_db():
        result = await session.execute(...)

    # In lifespan
    await init_db()
    ...
    await close_db()

    # In health check
    healthy = await check_db_health()
"""

from __future__ import annotations

from typing import AsyncGenerator, Optional

from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.core.logging import get_logger

logger = get_logger(__name__)

# Module-level singletons — initialised by init_db(), torn down by close_db()
_engine: Optional[AsyncEngine] = None
_session_factory: Optional[async_sessionmaker[AsyncSession]] = None


def _create_engine(database_url: str, environment: str) -> AsyncEngine:
    """
    Create the async SQLAlchemy engine with environment-appropriate settings.

    Pool settings:
      - development / production: persistent pool, 10 base connections
      - testing: NullPool (no persistent connections, safe for pytest)
    """
    if environment == "testing":
        return create_async_engine(
            database_url,
            poolclass=NullPool,
            echo=False,
        )

    return create_async_engine(
        database_url,
        # Connection pool
        pool_size=10,
        max_overflow=20,
        pool_recycle=3600,       # recycle connections after 1 hour
        pool_timeout=30,         # wait max 30s for a connection
        # Logging — emit SQL in development only
        echo=(environment == "development"),
        echo_pool=False,
    )


async def init_db(database_url: str, environment: str = "development") -> None:
    """
    Initialise the database engine and session factory.

    Called once during application startup (lifespan).
    """
    global _engine, _session_factory

    logger.info("Initialising database engine | environment=%s", environment)

    _engine = _create_engine(database_url, environment)
    _session_factory = async_sessionmaker(
        bind=_engine,
        class_=AsyncSession,
        expire_on_commit=False,  # prevent lazy-load errors after commit in async
        autoflush=False,
        autocommit=False,
    )

    # Verify connectivity immediately at startup so we fail fast
    try:
        async with _engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        logger.info("Database connection verified successfully")
    except Exception as exc:
        logger.critical("Database connection FAILED at startup: %s", exc)
        raise

    # In development, create any model tables that don't yet exist so newly
    # added models never 500 with "table doesn't exist" before a migration is
    # written. This is non-destructive (checkfirst=True): existing tables are
    # left untouched. Production relies on Alembic migrations exclusively.
    if environment == "development":
        try:
            await create_missing_tables()
        except Exception as exc:  # never let schema-sync take down startup
            logger.warning(
                "create_missing_tables skipped due to error (app will still "
                "start; run migrations / reset dev schema): %s",
                exc,
            )


async def create_missing_tables() -> None:
    """
    Create any model-defined tables that are absent from the database.

    Imports the model registry so every table is registered on Base.metadata,
    then issues CREATE TABLE IF NOT EXISTS for each. Never drops or alters
    existing tables — for schema changes use an Alembic migration.
    """
    if _engine is None:
        raise RuntimeError("Database not initialised. Call init_db() first.")

    # Import triggers registration of all models on Base.metadata.
    import app.database.models  # noqa: F401
    from app.database.base import Base

    async with _engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Verified all model tables exist (created any missing).")


async def close_db() -> None:
    """
    Dispose of the engine connection pool.

    Called during application shutdown (lifespan).
    """
    global _engine, _session_factory

    if _engine is not None:
        logger.info("Closing database connection pool")
        await _engine.dispose()
        _engine = None
        _session_factory = None
        logger.info("Database connection pool closed")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields an AsyncSession per request.

    Automatically rolls back on exception, always closes the session.
    Usage in router:
        async def my_endpoint(db: AsyncSession = Depends(get_db)):
            ...
    """
    if _session_factory is None:
        raise RuntimeError(
            "Database not initialised. Call init_db() during application startup."
        )

    async with _session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    """Get the session factory for background tasks and events."""
    if _session_factory is None:
        raise RuntimeError("Database not initialised. Call init_db() during application startup.")
    return _session_factory


async def check_db_health() -> dict:
    """
    Execute a lightweight query to verify database is reachable.

    Returns a dict consumed by the /health/ready endpoint.
    Opens a fresh connection (bypasses pool pre_ping issues with aiomysql).
    """
    if _engine is None:
        return {"status": "unavailable", "detail": "Engine not initialised"}

    try:
        async with _engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "healthy"}
    except Exception as exc:
        logger.error("Database health check failed: %s", exc)
        return {"status": "unhealthy", "detail": str(exc)}
