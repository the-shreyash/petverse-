"""
app/modules/health/dependencies.py
"""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.common import get_db
from app.modules.health.repositories import (
    MedicalRecordRepository,
    VaccinationRepository,
    MedicationRepository,
    WeightRepository,
    DocumentRepository,
)
from app.modules.health.services import (
    MedicalRecordService,
    VaccinationService,
    MedicationService,
    WeightService,
    DocumentService,
    HealthScoreService,
    TimelineService,
)

def get_medical_repo(db: AsyncSession = Depends(get_db)) -> MedicalRecordRepository:
    return MedicalRecordRepository(db)

def get_vaccination_repo(db: AsyncSession = Depends(get_db)) -> VaccinationRepository:
    return VaccinationRepository(db)

def get_medication_repo(db: AsyncSession = Depends(get_db)) -> MedicationRepository:
    return MedicationRepository(db)

def get_weight_repo(db: AsyncSession = Depends(get_db)) -> WeightRepository:
    return WeightRepository(db)

def get_document_repo(db: AsyncSession = Depends(get_db)) -> DocumentRepository:
    return DocumentRepository(db)


def get_medical_service(repo: MedicalRecordRepository = Depends(get_medical_repo)) -> MedicalRecordService:
    return MedicalRecordService(repo)

def get_vaccination_service(repo: VaccinationRepository = Depends(get_vaccination_repo)) -> VaccinationService:
    return VaccinationService(repo)

def get_medication_service(repo: MedicationRepository = Depends(get_medication_repo)) -> MedicationService:
    return MedicationService(repo)

def get_weight_service(repo: WeightRepository = Depends(get_weight_repo)) -> WeightService:
    return WeightService(repo)

def get_document_service(repo: DocumentRepository = Depends(get_document_repo)) -> DocumentService:
    return DocumentService(repo)

def get_health_score_service(
    medical_repo: MedicalRecordRepository = Depends(get_medical_repo),
    vaccination_repo: VaccinationRepository = Depends(get_vaccination_repo),
    medication_repo: MedicationRepository = Depends(get_medication_repo),
    weight_repo: WeightRepository = Depends(get_weight_repo),
) -> HealthScoreService:
    return HealthScoreService(medical_repo, vaccination_repo, medication_repo, weight_repo)

def get_timeline_service(
    medical_repo: MedicalRecordRepository = Depends(get_medical_repo),
    vaccination_repo: VaccinationRepository = Depends(get_vaccination_repo),
    medication_repo: MedicationRepository = Depends(get_medication_repo),
    weight_repo: WeightRepository = Depends(get_weight_repo),
) -> TimelineService:
    return TimelineService(medical_repo, vaccination_repo, medication_repo, weight_repo)
