"""
app/modules/health/schemas/__init__.py
"""

from app.modules.health.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordUpdate,
    MedicalRecordResponse,
)
from app.modules.health.schemas.vaccination import (
    VaccinationCreate,
    VaccinationUpdate,
    VaccinationResponse,
)
from app.modules.health.schemas.medication import (
    MedicationCreate,
    MedicationUpdate,
    MedicationResponse,
)
from app.modules.health.schemas.weight import (
    WeightHistoryCreate,
    WeightHistoryResponse,
)
from app.modules.health.schemas.document import (
    HealthDocumentCreate,
    HealthDocumentResponse,
)
from app.modules.health.schemas.health_score import HealthScoreResponse
from app.modules.health.schemas.timeline import TimelineResponse, TimelineEvent

__all__ = [
    "MedicalRecordCreate",
    "MedicalRecordUpdate",
    "MedicalRecordResponse",
    "VaccinationCreate",
    "VaccinationUpdate",
    "VaccinationResponse",
    "MedicationCreate",
    "MedicationUpdate",
    "MedicationResponse",
    "WeightHistoryCreate",
    "WeightHistoryResponse",
    "HealthDocumentCreate",
    "HealthDocumentResponse",
    "HealthScoreResponse",
    "TimelineResponse",
    "TimelineEvent",
]
