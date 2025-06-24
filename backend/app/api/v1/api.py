
from fastapi import APIRouter
from app.api.v1.endpoints import workflows, documents, chat, workflow_builder

api_router = APIRouter()

api_router.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(workflow_builder.router, prefix="/workflow-builder", tags=["workflow-builder"])