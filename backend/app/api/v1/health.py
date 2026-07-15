"""
app/api/v1/routers/health.py

Health check endpoints for PetVerse backend.

Follows the standard Kubernetes / cloud health check pattern:
  - /health        → Full system status (for dashboards / monitoring)
  - /health/live   → Liveness probe  (is the process alive?)
  - /health/ready  → Readiness probe (can it serve traffic?)

Design decisions:
  - Liveness always returns 200 if the process is running
  - Readiness returns 503 if the database is not reachable
  - Full health includes version, environment, and DB status
  - No auth required — these must be reachable by infrastructure
"""

from __future__ import annotations

from datetime import timezone

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.database.engine import check_db_health
from app.utils.datetime_helper import utcnow

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get(
    "",
    summary="Full system health",
    description=(
        "Returns the overall health of the PetVerse backend including "
        "application version, environment, database connectivity, and timestamp."
    ),
    response_description="System health status",
)
async def health_check() -> JSONResponse:
    """
    Full system health check.

    Returns 200 if the application is running normally.
    Returns 503 if a critical dependency (e.g. database) is unhealthy.
    """
    settings = get_settings()
    db_health = await check_db_health()
    is_healthy = db_health.get("status") == "healthy"

    body = {
        "status": "healthy" if is_healthy else "degraded",
        "application": {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        },
        "database": db_health,
        "timestamp": utcnow().isoformat(),
    }

    status_code = status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(status_code=status_code, content=body)


@router.get(
    "/live",
    summary="Liveness probe",
    description=(
        "Kubernetes liveness probe endpoint. Returns 200 as long as the "
        "Python process is running and can handle requests."
    ),
)
async def liveness() -> JSONResponse:
    """
    Liveness probe — always 200 if the process is up.

    Kubernetes uses this to decide whether to restart the pod.
    It should NEVER check external dependencies.
    """
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": "alive",
            "timestamp": utcnow().isoformat(),
        },
    )


@router.get(
    "/ready",
    summary="Readiness probe",
    description=(
        "Kubernetes readiness probe endpoint. Returns 200 only when "
        "the application is ready to serve traffic (database is reachable)."
    ),
)
async def readiness() -> JSONResponse:
    """
    Readiness probe — checks all required dependencies.

    Kubernetes uses this to decide whether to send traffic to this pod.
    Returns 503 until the database is connected and healthy.
    """
    db_health = await check_db_health()
    is_ready = db_health.get("status") == "healthy"

    body = {
        "status": "ready" if is_ready else "not_ready",
        "checks": {
            "database": db_health,
        },
        "timestamp": utcnow().isoformat(),
    }

    status_code = status.HTTP_200_OK if is_ready else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(status_code=status_code, content=body)
