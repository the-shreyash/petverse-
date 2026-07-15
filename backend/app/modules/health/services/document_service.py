"""
app/modules/health/services/document_service.py
"""

from typing import Sequence
from app.modules.health.models import HealthDocument
from app.modules.health.schemas import HealthDocumentCreate
from app.modules.health.repositories import DocumentRepository


class DocumentService:
    def __init__(self, repository: DocumentRepository):
        self.repository = repository

    async def add_document(self, pet_id: str, data: HealthDocumentCreate) -> HealthDocument:
        doc = HealthDocument(pet_id=pet_id, **data.model_dump())
        return await self.repository.add(doc)

    async def get_document(self, document_id: str) -> HealthDocument:
        doc = await self.repository.get_by_id(document_id)
        if not doc:
            raise ValueError("Document not found")
        return doc

    async def list_documents(self, pet_id: str) -> Sequence[HealthDocument]:
        return await self.repository.list_by_pet(pet_id)

    async def delete_document(self, document_id: str) -> None:
        doc = await self.get_document(document_id)
        await self.repository.delete(doc)
