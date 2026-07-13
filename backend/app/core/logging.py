"""
app/core/logging.py

Centralized structured logging for PetVerse backend.

Features:
  - JSON-like structured log format in production
  - Human-readable format in development
  - Per-logger level control
  - Request ID injection (reads from contextvars)
  - Configures uvicorn loggers to match app format

Usage:
    from app.core.logging import setup_logging, get_logger

    setup_logging()                     # call once at startup
    logger = get_logger(__name__)       # in any module
    logger.info("Something happened")
"""

from __future__ import annotations

import logging
import sys
from contextvars import ContextVar
from typing import Optional

# Context variable populated by RequestIDMiddleware
request_id_ctx: ContextVar[Optional[str]] = ContextVar("request_id", default=None)


class RequestIDFilter(logging.Filter):
    """Inject the current request ID into every log record."""

    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_ctx.get("-")
        return True


class DevelopmentFormatter(logging.Formatter):
    """
    Human-readable formatter for local development.

    Format: [LEVEL]  timestamp  request_id  name - message
    """

    LEVEL_COLORS = {
        "DEBUG":    "\033[36m",   # cyan
        "INFO":     "\033[32m",   # green
        "WARNING":  "\033[33m",   # yellow
        "ERROR":    "\033[31m",   # red
        "CRITICAL": "\033[35m",   # magenta
    }
    RESET = "\033[0m"

    def format(self, record: logging.LogRecord) -> str:
        color = self.LEVEL_COLORS.get(record.levelname, "")
        record.levelname = f"{color}{record.levelname:<8}{self.RESET}"
        return super().format(record)


class ProductionFormatter(logging.Formatter):
    """
    Structured log formatter for production / log aggregators.

    Outputs a single-line format that is easy to parse with tools
    like Datadog, CloudWatch, or Loki.
    """

    def format(self, record: logging.LogRecord) -> str:
        # Ensure request_id exists (filter may not have run in all cases)
        if not hasattr(record, "request_id"):
            record.request_id = "-"
        return super().format(record)


def setup_logging(log_level: str = "INFO", environment: str = "development") -> None:
    """
    Configure the root logger and all relevant sub-loggers.

    Call this exactly once during application startup (inside lifespan).
    """
    level = getattr(logging, log_level.upper(), logging.INFO)

    # ── Choose formatter ────────────────────────────────────────────────────
    if environment == "production":
        fmt = (
            "%(asctime)s | %(levelname)-8s | %(request_id)s | "
            "%(name)s | %(message)s"
        )
        formatter = ProductionFormatter(fmt, datefmt="%Y-%m-%dT%H:%M:%S")
    else:
        fmt = (
            "%(asctime)s  %(levelname)s  [%(request_id)s]  "
            "%(name)s — %(message)s"
        )
        formatter = DevelopmentFormatter(fmt, datefmt="%H:%M:%S")

    # ── Build handler ───────────────────────────────────────────────────────
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)
    handler.setFormatter(formatter)
    handler.addFilter(RequestIDFilter())

    # ── Configure root logger ───────────────────────────────────────────────
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    # Remove any handlers added before our setup (e.g. by uvicorn)
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # ── Silence noisy third-party loggers ──────────────────────────────────
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").propagate = True
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if environment == "development" else logging.WARNING
    )
    logging.getLogger("alembic").setLevel(logging.INFO)

    logger = get_logger(__name__)
    logger.info(
        "Logging configured | level=%s | environment=%s",
        log_level,
        environment,
    )


def get_logger(name: str) -> logging.Logger:
    """
    Return a named logger.  Always use this instead of logging.getLogger
    so filters are consistently applied.
    """
    return logging.getLogger(name)
