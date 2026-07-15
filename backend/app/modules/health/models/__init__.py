"""
app/modules/health/models/__init__.py
"""

from app.modules.health.models.medical_record import MedicalRecord
from app.modules.health.models.vaccination import Vaccination
from app.modules.health.models.medication import Medication
from app.modules.health.models.weight import WeightHistory
from app.modules.health.models.document import HealthDocument

__all__ = [
    "MedicalRecord",
    "Vaccination",
    "Medication",
    "WeightHistory",
    "HealthDocument",
]
