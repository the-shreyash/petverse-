"""
main.py

PetVerse Backend — FastAPI Application Entry Point

This file is responsible for:
  1. Creating the FastAPI application instance
  2. Managing the application lifespan (startup / shutdown)
  3. Registering all middleware (order matters — outermost registered last)
  4. Registering global exception handlers
  5. Mounting the versioned API router

Architecture note on middleware order:
  FastAPI processes middleware in reverse registration order.
  The first-registered middleware is the outermost wrapper.
  We register: ResponseTime → RequestLogging → RequestID (innermost last)
  So execution flows: RequestID → RequestLogging → ResponseTime → route handler

Running locally:
    uvicorn main:app --reload --port 8000

Running in production:
    uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

from app.api.v1 import api_v1_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import get_logger, setup_logging
from app.database.engine import close_db, init_db
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.request_logging import RequestLoggingMiddleware
from app.middleware.response_time import ResponseTimeMiddleware

# ─── Logging must be set up BEFORE the settings are loaded so that
#     any validator warnings are properly captured. ──────────────────────────
_bootstrap_settings = get_settings()
setup_logging(
    log_level=_bootstrap_settings.LOG_LEVEL,
    environment=_bootstrap_settings.ENVIRONMENT,
)
logger = get_logger(__name__)


# ─── Application Lifespan ─────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Manage application startup and shutdown.

    Everything before 'yield' runs on startup.
    Everything after 'yield' runs on shutdown.
    """
    settings = get_settings()

    # ── Startup ───────────────────────────────────────────────────────────────
    logger.info("=" * 60)
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    logger.info("Environment : %s", settings.ENVIRONMENT)
    logger.info("API Prefix  : %s", settings.API_PREFIX)
    logger.info("Log Level   : %s", settings.LOG_LEVEL)
    logger.info("=" * 60)

    # Initialise database — will raise on connection failure (fail fast)
    await init_db(
        database_url=settings.DATABASE_URL,
        environment=settings.ENVIRONMENT,
    )

    # Ensure the upload directory tree exists before any avatar upload request.
    Path(settings.UPLOAD_DIRECTORY, "avatars").mkdir(parents=True, exist_ok=True)

    logger.info("✅ %s is ready to serve requests", settings.APP_NAME)

    yield  # ── Application is running ────────────────────────────────────────

    # ── Shutdown ──────────────────────────────────────────────────────────────
    logger.info("Shutting down %s...", settings.APP_NAME)
    await close_db()
    logger.info("Shutdown complete. Goodbye.")


# ─── FastAPI Application Factory ──────────────────────────────────────────────

def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.

    Extracting this into a factory function makes the app testable:
        app = create_application()
        client = TestClient(app)
    """
    settings = get_settings()

    # Swagger / ReDoc are only enabled in development and testing
    docs_url = "/docs" if settings.swagger_enabled else None
    redoc_url = "/redoc" if settings.swagger_enabled else None
    openapi_url = "/openapi.json" if settings.swagger_enabled else None

    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "🐾 **PetVerse** — One Platform. Complete Pet Care. Powered by AI.\n\n"
            "This is the PetVerse REST API powering the PetVerse mobile and web applications.\n\n"
            "**Phase B1**: Backend Foundation (infrastructure only)\n"
            "**Phase B2**: Authentication & User Management _(coming soon)_\n"
            "**Phase B3**: Pets & Appointments _(coming soon)_"
        ),
        openapi_url=openapi_url,
        docs_url=docs_url,
        redoc_url=redoc_url,
        lifespan=lifespan,
        contact={
            "name": "PetVerse Engineering",
            "email": "engineering@petverse.app",
        },
        license_info={
            "name": "Proprietary",
        },
        openapi_tags=[
            {
                "name": "Health",
                "description": "Application health and readiness probes.",
            },
            {
                "name": "Auth",
                "description": "Authentication — login, register, token refresh. _(Phase B2)_",
            },
            {
                "name": "Users",
                "description": "User profile management. _(Phase B3)_",
            },
            {
                "name": "Pets",
                "description": "Pet profiles and records. _(Phase B3)_",
            },
        ],
    )

    # ─── Exception Handlers ───────────────────────────────────────────────────
    register_exception_handlers(application)

    # ─── Middleware Stack ──────────────────────────────────────────────────────
    # NOTE: Starlette applies middleware in LIFO order (last added = outermost).
    # We want execution order: RequestID → RequestLogging → ResponseTime → handler
    # So we add them in reverse: ResponseTime first, RequestID last.

    # GZip — compress responses larger than 1 KB
    application.add_middleware(GZipMiddleware, minimum_size=1024)

    # Response time header — X-Process-Time
    application.add_middleware(ResponseTimeMiddleware)

    # Structured request/response logging
    application.add_middleware(RequestLoggingMiddleware)

    # CORS — must be added before RequestID so preflight works correctly
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Process-Time"],
    )

    # Trusted host — only in production to prevent Host header injection
    if settings.is_production:
        application.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["petverse.app", "*.petverse.app"],
        )

    # Request ID — must be outermost so all logs have an ID
    application.add_middleware(RequestIDMiddleware)

    # ─── Security Headers ─────────────────────────────────────────────────────
    # Applied via a middleware-style startup hook to inject on every response.
    # We use a simple response wrapper to add headers without a full middleware.
    _register_security_headers(application)

    # ─── API Router ───────────────────────────────────────────────────────────
    application.include_router(
        api_v1_router,
        prefix=settings.API_PREFIX,
    )

    # ─── Uploaded files (avatars, etc.) ───────────────────────────────────────
    # Served directly by this process for now; swap for a CDN/object-storage
    # URL in production without changing any code that stores the URL.
    Path(settings.UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)
    application.mount(
        "/uploads",
        StaticFiles(directory=settings.UPLOAD_DIRECTORY),
        name="uploads",
    )

    # ─── Root endpoint ────────────────────────────────────────────────────────
    @application.get("/", include_in_schema=False)
    async def root():
        return {
            "application": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "docs": f"{settings.API_PREFIX}/docs" if settings.swagger_enabled else None,
            "health": f"{settings.API_PREFIX}/health",
        }

    return application


def _register_security_headers(app: FastAPI) -> None:
    """
    Inject security headers into every response via a middleware.

    Headers applied:
      - X-Content-Type-Options: nosniff
      - X-Frame-Options: DENY
      - Referrer-Policy: strict-origin-when-cross-origin
      - Permissions-Policy: restrictive policy
      - Content-Security-Policy: basic API-safe policy
    """
    from starlette.middleware.base import BaseHTTPMiddleware
    from starlette.requests import Request
    from starlette.responses import Response

    class SecurityHeadersMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request: Request, call_next) -> Response:
            response: Response = await call_next(request)
            response.headers["X-Content-Type-Options"] = "nosniff"
            response.headers["X-Frame-Options"] = "DENY"
            response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
            response.headers["Permissions-Policy"] = (
                "camera=(), microphone=(), geolocation=(), payment=()"
            )
            response.headers["Content-Security-Policy"] = (
                "default-src 'none'; frame-ancestors 'none'"
            )
            response.headers["X-XSS-Protection"] = "1; mode=block"
            return response

    app.add_middleware(SecurityHeadersMiddleware)


# ─── Application Instance ─────────────────────────────────────────────────────
app = create_application()
