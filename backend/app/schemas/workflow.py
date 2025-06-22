
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkflowCreate(WorkflowBase):
    definition: Optional[Dict[str, Any]] = None

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    definition: Optional[Dict[str, Any]] = None

class WorkflowResponse(WorkflowBase):
    id: int
    definition: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

class DocumentCreate(BaseModel):
    filename: str
    content: str
    workflow_id: Optional[int] = None

class DocumentResponse(BaseModel):
    id: int
    filename: str
    workflow_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime

class ChatSessionCreate(BaseModel):
    workflow_id: int
    message: str

class ChatSessionResponse(BaseModel):
    id: int
    workflow_id: int
    messages: List[ChatMessage]
    created_at: datetime

    class Config:
        from_attributes = True
