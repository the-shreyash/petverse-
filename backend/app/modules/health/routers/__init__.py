"""
app/modules/health/routers/__init__.py
"""

from fastapi import APIRouter

from .medical_records import router as medical_records_router
from .vaccinations import router as vaccinations_router
from .medications import router as medications_router
from .weight import router as weight_router
from .documents import router as documents_router
from .score import router as score_router
from .timeline import router as timeline_router

health_module_router = APIRouter()

health_module_router.include_router(medical_records_router, prefix="/medical-records", tags=["Health: Medical Records"])
health_module_router.include_router(vaccinations_router, prefix="/vaccinations", tags=["Health: Vaccinations"])
health_module_router.include_router(medications_router, prefix="/medications", tags=["Health: Medications"])
health_module_router.include_router(weight_router, prefix="/weight", tags=["Health: Weight"])
health_module_router.include_router(documents_router, prefix="/documents", tags=["Health: Documents"])
health_module_router.include_router(score_router, prefix="/score", tags=["Health: Score"])
health_module_router.include_router(timeline_router, prefix="/timeline", tags=["Health: Timeline"])
