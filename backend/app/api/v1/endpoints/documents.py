
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.workflow import Document
from app.schemas.workflow import DocumentResponse
from app.services.document_service import DocumentService

router = APIRouter()
document_service = DocumentService()

@router.post("/upload", response_model=dict)
async def upload_document(
    file: UploadFile = File(...),
    workflow_id: int = None,
    db: Session = Depends(get_db)
):
    try:
        file_content = await file.read()
        
        # Process document
        result = await document_service.process_document(
            filename=file.filename,
            file_content=file_content,
            workflow_id=workflow_id
        )
        print(f"Processed document: {result}")
        # Save to database
        db_document = Document(
            filename=file.filename,
            content=result.get("text_length", 0),
            workflow_id=workflow_id
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        
        return {
            "message": "Document uploaded successfully",
            "document_id": db_document.id,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[DocumentResponse])
def get_documents(workflow_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Document)
    if workflow_id:
        query = query.filter(Document.workflow_id == workflow_id)
    documents = query.all()
    return documents

@router.get("/search")
async def search_documents(
    query: str,
    workflow_id: int = None,
    n_results: int = 5
):
    try:
        results = await document_service.search_documents(
            query=query,
            workflow_id=workflow_id,
            n_results=n_results
        )
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
