"""
app/modules/dashboard/dependencies.py
"""

from fastapi import Depends
from app.dependencies.pets import get_pet_service
from app.modules.pet.services.pet_service import PetService
from app.modules.health.dependencies import get_timeline_service, get_health_score_service, get_vaccination_service
from app.modules.health.services.timeline_service import TimelineService
from app.modules.health.services.health_score_service import HealthScoreService
from app.modules.health.services.vaccination_service import VaccinationService
from app.modules.dashboard.services.dashboard_aggregator_service import DashboardAggregatorService


def get_dashboard_aggregator_service(
    pet_service: PetService = Depends(get_pet_service),
    timeline_service: TimelineService = Depends(get_timeline_service),
    health_score_service: HealthScoreService = Depends(get_health_score_service),
    vaccination_service: VaccinationService = Depends(get_vaccination_service),
) -> DashboardAggregatorService:
    return DashboardAggregatorService(
        pet_service=pet_service,
        timeline_service=timeline_service,
        health_score_service=health_score_service,
        vaccination_service=vaccination_service,
    )
