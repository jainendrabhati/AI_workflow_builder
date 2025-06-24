
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
        logger.info(f"Received workflow data: {workflow_data}")
        
        # Extract workflow info
        name = workflow_data.get('name', 'Untitled Workflow')
        description = workflow_data.get('description', '')
        nodes = workflow_data.get('nodes', [])
        
        # Validate nodes
        if not nodes:
            raise HTTPException(status_code=400, detail="Workflow must contain at least one node")
        
        logger.info(f"Processing {len(nodes)} nodes")
        for i, node in enumerate(nodes):
            logger.info(f"Node {i}: type={node.get('type')}, data={node.get('data', {})}")
        
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

@router.post("/build")
def build_workflow(
    build_data: Dict[str, Any],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Build workflow from provided data"""
    try:
        logger.info(f"Building workflow with data: {build_data}")
        
        nodes = build_data.get('nodes', [])
        
        # Validate that we have nodes
        if not nodes:
            raise HTTPException(status_code=400, detail="No components to build. Please add some components to your workflow.")
        
        logger.info(f"Processing {len(nodes)} nodes for build")
        
        # Find required components
        user_query_node = None
        llm_node = None
        
        for node in nodes:
            node_type = node.get('type')
            logger.info(f"Checking node: type={node_type}, data={node.get('data', {})}")
            
            if node_type == 'userQuery':
                user_query_node = node
            elif node_type == 'llmEngine':
                llm_node = node
        
        if not user_query_node:
            raise HTTPException(status_code=400, detail="Please add a User Query component to your workflow")
            
        if not llm_node:
            raise HTTPException(status_code=400, detail="Please add an LLM Engine component to your workflow")
        
        # Validate configurations
        user_data = user_query_node.get('data', {})
        user_config = user_data.get('config', {})
        user_query = user_config.get('query', '').strip()
        
        logger.info(f"User query config: {user_config}")
        logger.info(f"User query value: '{user_query}'")
        
        if not user_query:
            raise HTTPException(status_code=400, detail="Please enter a query in the User Query component")
            
        llm_data = llm_node.get('data', {})
        llm_config = llm_data.get('config', {})
        llm_api_key = llm_config.get('apiKey', '').strip()
        
        logger.info(f"LLM config: {llm_config}")
        
        if not llm_api_key:
            raise HTTPException(status_code=400, detail="Please configure the API key for your LLM Engine")
        
        # Add background task to build the workflow
        background_tasks.add_task(build_workflow_task, nodes)
        
        return {
            "message": "Workflow build started successfully",
            "status": "building",
            "nodes_processed": len(nodes)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error building workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to build workflow: {str(e)}")

def build_workflow_task(nodes: List[Dict[str, Any]]):
    """Background task to build the workflow"""
    try:
        logger.info(f"Building workflow with {len(nodes)} nodes")
        
        # Process each node type
        for node in nodes:
            node_type = node.get('type')
            node_config = node.get('data', {}).get('config', {})
            
            if node_type == 'userQuery':
                query = node_config.get('query', '')
                logger.info(f"Processing user query: {query}")
                
            elif node_type == 'knowledgeBase':
                file_name = node_config.get('fileName', 'No file')
                logger.info(f"Processing knowledge base with file: {file_name}")
                
            elif node_type == 'llmEngine':
                prompt = node_config.get('prompt', 'Default prompt')
                logger.info(f"Processing LLM with prompt: {prompt[:50]}...")
                
            elif node_type == 'output':
                logger.info("Processing output node")
        
        logger.info("Workflow built successfully")
        
    except Exception as e:
        logger.error(f"Error in build task: {str(e)}")
