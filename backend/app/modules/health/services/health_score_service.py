"""
app/modules/health/services/health_score_service.py
"""

from app.modules.health.schemas.health_score import HealthScoreResponse
from app.modules.health.repositories import (
    MedicalRecordRepository,
    VaccinationRepository,
    MedicationRepository,
    WeightRepository,
)


class HealthScoreService:
    def __init__(
        self,
        medical_repo: MedicalRecordRepository,
        vaccination_repo: VaccinationRepository,
        medication_repo: MedicationRepository,
        weight_repo: WeightRepository,
    ):
        self.medical_repo = medical_repo
        self.vaccination_repo = vaccination_repo
        self.medication_repo = medication_repo
        self.weight_repo = weight_repo

    async def calculate_score(self, pet_id: str) -> HealthScoreResponse:
        # Mock calculation logic for now as requested
        # In a real app, this would use the repositories to compute scores.
        return HealthScoreResponse(
            pet_id=pet_id,
            overall_score=85,
            nutrition_score=80,
            vaccination_score=100,
            weight_score=90,
            activity_score=70,
            recommendations_placeholder=[
                "Schedule annual checkup.",
                "Increase daily activity.",
            ],
        )
