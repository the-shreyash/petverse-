from fastapi import APIRouter

from .notifications import router as notif_router
from .preferences import router as pref_router
from .reminders import router as rem_router

# We don't nest them under a single prefix here because the paths are distinct:
# /notifications
# /notifications/preferences
# /reminders

__all__ = ["notif_router", "pref_router", "rem_router"]
