"""
tests/conftest.py

Shared test fixtures for the Phase B2 auth suite.

Strategy:
  - Run against an in-memory SQLite database (via aiosqlite) so the suite needs
    no MySQL server. Our models are intentionally DB-agnostic, so the same
    schema created by ``Base.metadata.create_all`` works here and on MySQL.
  - Each test gets a FRESH database (function-scoped engine) for isolation.
  - The app's ``get_db`` dependency is overridden to use the test session, so
    routers, services and repositories run exactly as in production.
  - bcrypt cost is lowered to the minimum via ``BCRYPT_ROUNDS=4`` to keep the
    suite fast — set BEFORE any app module (and thus passlib) is imported.
"""

from __future__ import annotations

import os

# Must be set before importing app modules that read settings at import time.
os.environ.setdefault("ENVIRONMENT", "testing")
os.environ.setdefault("BCRYPT_ROUNDS", "4")
os.environ.setdefault("JWT_SECRET", "test-jwt-secret-key-for-suite-only")

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

# Importing app.database.models registers every table on Base.metadata.
import app.database.models  # noqa: F401
from app.database.base import Base
from app.dependencies.common import get_db as common_get_db
from main import app


@pytest_asyncio.fixture
async def db_session():
    """Provide an isolated in-memory database and a session factory for one test."""
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,  # one shared in-memory connection for the test
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    yield factory

    await engine.dispose()


@pytest_asyncio.fixture
async def client(db_session):
    """
    An ``httpx.AsyncClient`` wired to the app with ``get_db`` overridden to the
    test database. Mirrors the production request lifecycle: commit on success,
    rollback on error.
    """

    async def _override_get_db():
        async with db_session() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[common_get_db] = _override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


# ─── Reusable payloads / helpers ──────────────────────────────────────────────

VALID_PASSWORD = "StrongP@ss1"


def registration_payload(**overrides):
    """A valid registration body; override any field per test."""
    body = {
        "first_name": "Ada",
        "last_name": "Lovelace",
        "username": "adalovelace",
        "email": "ada@example.com",
        "password": VALID_PASSWORD,
        "phone_number": "+15551234567",
    }
    body.update(overrides)
    return body


async def register_user(client, **overrides):
    """Register a user and return the parsed response JSON."""
    resp = await client.post("/api/v1/auth/register", json=registration_payload(**overrides))
    return resp
