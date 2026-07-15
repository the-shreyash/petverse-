"""
app/modules/health/services/timeline_service.py
"""

from typing import Sequence
from app.modules.health.schemas.timeline import TimelineResponse, TimelineEvent
from app.modules.health.repositories import (
    MedicalRecordRepository,
    VaccinationRepository,
    MedicationRepository,
    WeightRepository,
)


class TimelineService:
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

    async def generate_timeline(self, pet_id: str) -> TimelineResponse:
        events = []

        records = await self.medical_repo.list_by_pet(pet_id)
        for r in records:
            events.append(TimelineEvent(
                id=r.id,
                event_type="medical_record",
                title=f"Visit: {r.diagnosis}",
                description=r.treatment,
                date=r.visit_date, # type: ignore
                metadata={"doctor_id": r.doctor_id}
            ))

        vaccinations = await self.vaccination_repo.list_by_pet(pet_id)
        for v in vaccinations:
            events.append(TimelineEvent(
                id=v.id,
                event_type="vaccination",
                title=f"Vaccine: {v.vaccine_name}",
                date=v.administration_date, # type: ignore
                metadata={"status": v.status}
            ))

        medications = await self.medication_repo.list_by_pet(pet_id)
        for m in medications:
            events.append(TimelineEvent(
                id=m.id,
                event_type="medication",
                title=f"Medication: {m.medicine_name}",
                date=m.start_date, # type: ignore
                metadata={"dosage": m.dosage}
            ))

        weights = await self.weight_repo.list_by_pet(pet_id)
        for w in weights:
            events.append(TimelineEvent(
                id=w.id,
                event_type="weight",
                title=f"Weight: {w.weight}kg",
                date=w.recorded_at,
                metadata={}
            ))

        # Sort all events chronologically (newest first)
        events.sort(key=lambda e: e.date, reverse=True)

        return TimelineResponse(pet_id=pet_id, events=events)
