"""
tests/test_health.py

Phase B1 foundation tests.

Tests:
  1. Application creates without import errors
  2. Root endpoint returns 200
  3. /api/v1/health/live returns 200 (liveness — no DB required)
  4. Response format is consistent JSON
  5. Security headers are present
  6. Request ID header is returned

These tests use TestClient with a mock database so they work
even without a real MySQL server running.
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch


# ─── Fixtures ─────────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def client():
    """
    Create a TestClient with database initialisation mocked out.

    This allows the test suite to run without a MySQL server.
    For integration tests, use a real test database (see conftest.py).
    """
    # Mock init_db and close_db so lifespan doesn't require MySQL
    # Patch check_db_health at the call site (health router) not the definition
    with patch("main.init_db", new_callable=AsyncMock) as mock_init, \
         patch("main.close_db", new_callable=AsyncMock) as mock_close, \
         patch(
             "app.api.v1.routers.health.check_db_health",
             new_callable=AsyncMock,
             return_value={"status": "healthy"},
         ):
        from main import app
        with TestClient(app, raise_server_exceptions=True) as c:
            yield c


# ─── Import Tests ─────────────────────────────────────────────────────────────

def test_application_imports_without_error():
    """Verify the app module can be imported without raising exceptions."""
    import main
    assert main.app is not None


def test_settings_load():
    """Verify Pydantic settings load correctly."""
    from app.core.config import get_settings
    settings = get_settings()
    assert settings.APP_NAME == "PetVerse"
    assert settings.API_PREFIX == "/api/v1"
    assert settings.ENVIRONMENT in ("development", "testing", "production")


# ─── Root Endpoint ─────────────────────────────────────────────────────────────

def test_root_endpoint(client):
    """Root endpoint returns application info."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["application"] == "PetVerse"
    assert "version" in data
    assert "health" in data


# ─── Health Endpoints ─────────────────────────────────────────────────────────

def test_health_live(client):
    """Liveness probe always returns 200."""
    response = client.get("/api/v1/health/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"
    assert "timestamp" in data


def test_health_ready(client):
    """Readiness probe returns 200 when DB is healthy (mocked)."""
    response = client.get("/api/v1/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert "checks" in data
    assert "database" in data["checks"]


def test_health_full(client):
    """Full health check returns application and database info."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "application" in data
    assert data["application"]["name"] == "PetVerse"
    assert "database" in data
    assert "timestamp" in data


# ─── Security Headers ─────────────────────────────────────────────────────────

def test_security_headers_present(client):
    """Verify security headers are injected on every response."""
    response = client.get("/api/v1/health/live")
    headers = response.headers

    assert headers.get("x-content-type-options") == "nosniff"
    assert headers.get("x-frame-options") == "DENY"
    assert "referrer-policy" in headers
    assert "x-request-id" in headers


def test_request_id_header_returned(client):
    """X-Request-ID is returned on every response."""
    response = client.get("/api/v1/health/live")
    assert "x-request-id" in response.headers


def test_process_time_header_returned(client):
    """X-Process-Time performance header is returned."""
    response = client.get("/api/v1/health/live")
    assert "x-process-time" in response.headers


# ─── API Versioning ───────────────────────────────────────────────────────────

def test_v1_prefix_routes_correctly(client):
    """All v1 routes are accessible under /api/v1."""
    response = client.get("/api/v1/health/live")
    assert response.status_code == 200


def test_nonexistent_route_returns_404(client):
    """Unknown routes return standardised 404 error envelope."""
    response = client.get("/api/v1/nonexistent-endpoint")
    assert response.status_code == 404
    data = response.json()
    # Our exception handler returns this structure
    assert "success" in data
    assert data["success"] is False


# ─── Swagger ──────────────────────────────────────────────────────────────────

def test_swagger_accessible_in_development(client):
    """Swagger docs are served in development mode."""
    from app.core.config import get_settings
    settings = get_settings()

    response = client.get("/docs")
    if settings.swagger_enabled:
        assert response.status_code == 200
    else:
        assert response.status_code == 404
