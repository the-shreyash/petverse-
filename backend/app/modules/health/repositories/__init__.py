"""
app/modules/health/repositories/__init__.py
"""

from .medical_record_repo import MedicalRecordRepository
from .vaccination_repo import VaccinationRepository
from .medication_repo import MedicationRepository
from .weight_repo import WeightRepository
from .document_repo import DocumentRepository

__all__ = [
    "MedicalRecordRepository",
    "VaccinationRepository",
    "MedicationRepository",
    "WeightRepository",
    "DocumentRepository",
]
