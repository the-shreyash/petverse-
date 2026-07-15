"""
app/modules/dashboard/services/dashboard_aggregator_service.py
"""

from datetime import datetime, timedelta
from app.modules.user.models.user import User
from app.modules.pet.services.pet_service import PetService
from app.modules.health.services.timeline_service import TimelineService
from app.modules.health.services.health_score_service import HealthScoreService
from app.modules.health.services.vaccination_service import VaccinationService
from app.modules.dashboard.schemas.dashboard import DashboardResponse, DashboardStats, DashboardCharts, ChartData
from app.modules.pet.schemas.pet import PetResponse


class DashboardAggregatorService:
    def __init__(
        self,
        pet_service: PetService,
        timeline_service: TimelineService,
        health_score_service: HealthScoreService,
        vaccination_service: VaccinationService,
    ):
        self.pet_service = pet_service
        self.timeline_service = timeline_service
        self.health_score_service = health_score_service
        self.vaccination_service = vaccination_service

    async def get_dashboard(self, user: User) -> DashboardResponse:
        # 1. Get all pets for user
        pets, total_pets = await self.pet_service.list_my_pets(user, page=1, per_page=100)
        
        # 2. Aggregate Data
        healthy_pets = 0
        vaccinations_due = 0
        total_health_score = 0
        
        all_activities = []
        all_vaccinations = []
        all_pets_data = []
        
        for pet in pets:
            # Pet Data
            all_pets_data.append(PetResponse.model_validate(pet).model_dump(mode="json"))
            
            # Health Score
            score = await self.health_score_service.calculate_score(pet.id)
            if score.overall_score > 70:
                healthy_pets += 1
            total_health_score += score.overall_score
            
            # Timeline Activities
            timeline = await self.timeline_service.generate_timeline(pet.id)
            all_activities.extend([e.model_dump(mode="json") for e in timeline.events])
            
            # Vaccinations
            vaccs = await self.vaccination_service.list_vaccinations(pet.id)
            all_vaccinations.extend([v for v in vaccs])
            for v in vaccs:
                if v.next_due_date and v.next_due_date <= datetime.now().date() + timedelta(days=30):
                    vaccinations_due += 1

        avg_health_score = (total_health_score // total_pets) if total_pets > 0 else 0

        # Sort activities chronologically for the feed
        all_activities.sort(key=lambda x: x["date"], reverse=True)

        stats = DashboardStats(
            total_pets=total_pets,
            healthy_pets=healthy_pets,
            appointments_this_week=0,  # Placeholder for future Appointments module
            vaccinations_due=vaccinations_due,
            average_health_score=avg_health_score,
        )

        charts = DashboardCharts(
            weight_trend=[ChartData(label="Jan", value=12.5), ChartData(label="Feb", value=12.8)], # Placeholder
            vaccination_status=[ChartData(label="Completed", value=10), ChartData(label="Pending", value=vaccinations_due)],
            health_score_trend=[ChartData(label="Score", value=avg_health_score)],
            monthly_visits=[]
        )

        return DashboardResponse(
            stats=stats,
            pets=all_pets_data,
            health_summary={"status": "Good", "issues": 0},
            vaccinations=[{"vaccine_name": v.vaccine_name, "date": v.administration_date.isoformat()} for v in all_vaccinations],
            appointments=[],
            feeding_placeholder=[],
            activities=all_activities[:10], # Top 10 recent activities
            health_score={"average": avg_health_score},
            charts=charts,
            notifications_placeholder=[{"title": "Welcome to PetVerse"}],
            ai_placeholder={"tip": "Hydration is important."}
        )
