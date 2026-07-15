"""
app/modules/health/routers/documents.py
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.dependencies.pets import get_owned_pet
from app.modules.pet.models.pet import Pet
from app.utils.response import success_response, created_response
from app.modules.health.schemas.document import HealthDocumentCreate, HealthDocumentResponse
from app.modules.health.services.document_service import DocumentService
from app.modules.health.dependencies import get_document_service

router = APIRouter()

@router.post("", summary="Add a health document", status_code=201)
async def add_document(
    payload: HealthDocumentCreate,
    pet: Pet = Depends(get_owned_pet),
    service: DocumentService = Depends(get_document_service),
) -> JSONResponse:
    doc = await service.add_document(pet.id, payload)
    return created_response(data=HealthDocumentResponse.model_validate(doc).model_dump(mode="json"), message="Health document added.")

@router.get("", summary="List health documents for a pet")
async def list_documents(
    pet: Pet = Depends(get_owned_pet),
    service: DocumentService = Depends(get_document_service),
) -> JSONResponse:
    docs = await service.list_documents(pet.id)
    data = [HealthDocumentResponse.model_validate(r).model_dump(mode="json") for r in docs]
    return success_response(data=data, message="Health documents retrieved.")

@router.delete("/{document_id}", summary="Delete a health document")
async def delete_document(
    document_id: str,
    pet: Pet = Depends(get_owned_pet),
    service: DocumentService = Depends(get_document_service),
) -> JSONResponse:
    await service.delete_document(document_id)
    return success_response(data=None, message="Health document deleted.")
