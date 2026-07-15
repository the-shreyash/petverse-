"""
app/modules/health/services/medical_record_service.py
"""

from typing import Sequence
from app.modules.health.models import MedicalRecord
from app.modules.health.schemas import MedicalRecordCreate, MedicalRecordUpdate
from app.modules.health.repositories import MedicalRecordRepository


class MedicalRecordService:
    def __init__(self, repository: MedicalRecordRepository):
        self.repository = repository

    async def create_record(self, pet_id: str, data: MedicalRecordCreate) -> MedicalRecord:
        record = MedicalRecord(pet_id=pet_id, **data.model_dump())
        return await self.repository.add(record)

    async def get_record(self, record_id: str) -> MedicalRecord:
        record = await self.repository.get_by_id(record_id)
        if not record:
            raise ValueError("Medical Record not found")
        return record

    async def list_records(self, pet_id: str) -> Sequence[MedicalRecord]:
        return await self.repository.list_by_pet(pet_id)

    async def update_record(self, record_id: str, data: MedicalRecordUpdate) -> MedicalRecord:
        record = await self.get_record(record_id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(record, key, value)
        return await self.repository.save(record)

    async def delete_record(self, record_id: str) -> None:
        record = await self.get_record(record_id)
        await self.repository.delete(record)
