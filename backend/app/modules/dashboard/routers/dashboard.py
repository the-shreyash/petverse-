"""
app/modules/dashboard/routers/dashboard.py
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User
from app.utils.response import success_response
from app.modules.dashboard.schemas.dashboard import DashboardResponse
from app.modules.dashboard.services.dashboard_aggregator_service import DashboardAggregatorService
from app.modules.dashboard.dependencies import get_dashboard_aggregator_service

router = APIRouter()

@router.get("", summary="Get user dashboard data")
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    service: DashboardAggregatorService = Depends(get_dashboard_aggregator_service),
) -> JSONResponse:
    dashboard = await service.get_dashboard(current_user)
    return success_response(data=dashboard.model_dump(mode="json"), message="Dashboard retrieved.")
