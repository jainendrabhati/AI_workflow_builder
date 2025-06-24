
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.workflow import Workflow
from app.schemas.workflow import WorkflowCreate, WorkflowResponse
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/save", response_model=WorkflowResponse)
def save_workflow(
    workflow_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Save workflow with nodes and configurations"""
    try:
        # Extract workflow info
        name = workflow_data.get('name', 'Untitled Workflow')
        description = workflow_data.get('description', '')
        nodes = workflow_data.get('nodes', [])
        
        # Validate nodes
        if not nodes:
            raise HTTPException(status_code=400, detail="Workflow must contain at least one node")
        
        # Create workflow
        workflow_create = WorkflowCreate(
            name=name,
            description=description,
            definition={
                'nodes': nodes,
                'edges': workflow_data.get('edges', [])
            }
        )
        
        db_workflow = Workflow(**workflow_create.dict())
        db.add(db_workflow)
        db.commit()
        db.refresh(db_workflow)
        
        logger.info(f"Workflow saved with ID: {db_workflow.id}")
        return db_workflow
        
    except Exception as e:
        logger.error(f"Error saving workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save workflow: {str(e)}")

@router.post("/build/{workflow_id}")
def build_workflow(
    workflow_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Build and deploy a workflow"""
    try:
        # Get workflow
        workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Validate workflow definition
        definition = workflow.definition
        if not definition or not definition.get('nodes'):
            raise HTTPException(status_code=400, detail="Workflow has no nodes to build")
        
        nodes = definition['nodes']
        
        # Validate required components
        user_query_node = next((node for node in nodes if node.get('type') == 'userQuery'), None)
        llm_node = next((node for node in nodes if node.get('type') == 'llmEngine'), None)
        
        if not user_query_node:
            raise HTTPException(status_code=400, detail="Workflow must contain a User Query component")
            
        if not llm_node:
            raise HTTPException(status_code=400, detail="Workflow must contain an LLM Engine component")
        
        # Validate configurations
        user_config = user_query_node.get('data', {}).get('config', {})
        llm_config = llm_node.get('data', {}).get('config', {})
        
        if not user_config.get('query', '').strip():
            raise HTTPException(status_code=400, detail="User Query component must have a query")
            
        if not llm_config.get('apiKey', '').strip():
            raise HTTPException(status_code=400, detail="LLM Engine must have an API key configured")
        
        # Add background task to build the workflow
        background_tasks.add_task(build_workflow_task, workflow.id, definition)
        
        return {
            "message": "Workflow build started successfully",
            "workflow_id": workflow_id,
            "status": "building"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error building workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to build workflow: {str(e)}")

def build_workflow_task(workflow_id: int, definition: Dict[str, Any]):
    """Background task to build the workflow"""
    try:
        logger.info(f"Building workflow {workflow_id}")
        
        # Here you would implement the actual workflow building logic
        # For now, we'll just simulate the build process
        
        nodes = definition.get('nodes', [])
        logger.info(f"Processing {len(nodes)} nodes")
        
        # Process each node type
        for node in nodes:
            node_type = node.get('type')
            node_config = node.get('data', {}).get('config', {})
            
            if node_type == 'userQuery':
                logger.info(f"Processing user query: {node_config.get('query', '')}")
                
            elif node_type == 'knowledgeBase':
                logger.info(f"Processing knowledge base with file: {node_config.get('fileName', 'No file')}")
                
            elif node_type == 'llmEngine':
                logger.info(f"Processing LLM with model: GPT-4o-mini")
                
            elif node_type == 'output':
                logger.info("Processing output node")
        
        logger.info(f"Workflow {workflow_id} built successfully")
        
    except Exception as e:
        logger.error(f"Error in build task for workflow {workflow_id}: {str(e)}")

@router.get("/validate/{workflow_id}")
def validate_workflow(workflow_id: int, db: Session = Depends(get_db)):
    """Validate a workflow before building"""
    try:
        workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        definition = workflow.definition
        if not definition or not definition.get('nodes'):
            return {"valid": False, "errors": ["Workflow has no components"]}
        
        nodes = definition['nodes']
        errors = []
        
        # Check for required components
        user_query_node = next((node for node in nodes if node.get('type') == 'userQuery'), None)
        llm_node = next((node for node in nodes if node.get('type') == 'llmEngine'), None)
        
        if not user_query_node:
            errors.append("Missing User Query component")
        else:
            user_config = user_query_node.get('data', {}).get('config', {})
            if not user_config.get('query', '').strip():
                errors.append("User Query component is empty")
        
        if not llm_node:
            errors.append("Missing LLM Engine component")
        else:
            llm_config = llm_node.get('data', {}).get('config', {})
            if not llm_config.get('apiKey', '').strip():
                errors.append("LLM Engine missing API key")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "node_count": len(nodes)
        }
        
    except Exception as e:
        logger.error(f"Error validating workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to validate workflow: {str(e)}")
