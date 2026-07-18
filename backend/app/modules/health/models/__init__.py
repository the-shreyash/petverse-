"""
app/modules/health/models/__init__.py
"""

from app.modules.health.models.medical_record import MedicalRecord
from app.modules.health.models.vaccination import Vaccination
from app.modules.health.models.medication import Medication
from app.modules.health.models.weight import WeightHistory
from app.modules.health.models.document import HealthDocument
from app.modules.health.models.appointment import Appointment
from app.modules.health.models.clinic import Clinic

__all__ = [
    "MedicalRecord",
    "Vaccination",
    "Medication",
    "WeightHistory",
    "HealthDocument",
    "Appointment",
    "Clinic",
]
