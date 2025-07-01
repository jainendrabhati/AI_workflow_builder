
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.workflow import Workflow
from app.schemas.workflow import WorkflowCreate, WorkflowResponse
import json
import logging
import base64

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/save", response_model=WorkflowResponse)
def save_or_update_workflow(
    workflow_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Create or update workflow based on name"""
    try:
        logger.info(f"💾 Received workflow data: {workflow_data}")

        # Extract workflow info
        name = workflow_data.get('name', 'Untitled Workflow')
        description = workflow_data.get('description', '')
        nodes = workflow_data.get('nodes', [])
        edges = workflow_data.get('edges', [])

        # Log detailed node information
        for i, node in enumerate(nodes):
            logger.info(f"📋 Node {i}: {node.get('type')} - Config: {node.get('data', {}).get('config', {})}")

        # Validate nodes
        if not nodes:
            raise HTTPException(status_code=400, detail="Workflow must contain at least one node")

        # Check if workflow with the same name exists
        existing_workflow = db.query(Workflow).filter(Workflow.name == name).first()

        if existing_workflow:
            # Update existing workflow
            logger.info(f"🔄 Updating existing workflow with name: {name}")
            existing_workflow.description = description
            existing_workflow.definition = {
                'nodes': nodes,
                'edges': edges
            }
            db.commit()
            db.refresh(existing_workflow)
            logger.info(f"✅ Workflow updated successfully: {existing_workflow.id}")
            return existing_workflow
        else:
            # Create new workflow
            logger.info(f"➕ Creating new workflow with name: {name}")
            workflow_create = WorkflowCreate(
                name=name,
                description=description,
                definition={'nodes': nodes, 'edges': edges}
            )
            db_workflow = Workflow(**workflow_create.dict())
            db.add(db_workflow)
            db.commit()
            db.refresh(db_workflow)
            logger.info(f"✅ Workflow created successfully: {db_workflow.id}")
            return db_workflow

    except Exception as e:
        logger.error(f"❌ Error saving workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save workflow: {str(e)}")


@router.post("/build")
def build_workflow(
    build_data: Dict[str, Any],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Build workflow from provided data"""
    try:
        logger.info(f"🚀 Building workflow with data keys: {list(build_data.keys())}")
        
        nodes = build_data.get('nodes', [])
        
        # Validate that we have nodes
        if not nodes:
            raise HTTPException(status_code=400, detail="No components to build. Please add some components to your workflow.")
        
        logger.info(f"📊 Processing {len(nodes)} nodes for build")
        
        # Log all nodes for debugging
        for i, node in enumerate(nodes):
            logger.info(f"📋 Node {i}: {node}")
        
        # Find required components
        user_query_node = None
        llm_node = None
        knowledge_base_node = None
        
        for node in nodes:
            node_type = node.get('type')
            node_config = node.get('data', {}).get('config', {})
            logger.info(f"🔍 Checking node: type={node_type}, config={node_config}")
            
            if node_type == 'userQuery':
                user_query_node = node
            elif node_type == 'llmEngine':
                llm_node = node
            elif node_type == 'knowledgeBase':
                knowledge_base_node = node
        
        if not user_query_node:
            raise HTTPException(status_code=400, detail="Please add a User Query component to your workflow")
            
        if not llm_node:
            raise HTTPException(status_code=400, detail="Please add an LLM Engine component to your workflow")
        
        # Validate configurations
        user_data = user_query_node.get('data', {})
        user_config = user_data.get('config', {})
        user_query = user_config.get('query', '').strip()
        
        logger.info(f"👤 User query config: {user_config}")
        logger.info(f"👤 User query value: '{user_query}'")
        
        if not user_query:
            raise HTTPException(status_code=400, detail="Please enter a query in the User Query component")
            
        llm_data = llm_node.get('data', {})
        llm_config = llm_data.get('config', {})
        llm_api_key = llm_config.get('apiKey', '').strip()
        llm_prompt = llm_config.get('prompt', '').strip()
        
        logger.info(f"🤖 LLM config: {llm_config}")
        logger.info(f"🤖 LLM API key present: {'Yes' if llm_api_key else 'No'}")
        logger.info(f"🤖 LLM prompt: '{llm_prompt[:100]}...' (first 100 chars)")

        if not llm_api_key:
            raise HTTPException(status_code=400, detail="Please configure the API key for your LLM Engine")
        
        # Add background task to build the workflow
        background_tasks.add_task(build_workflow_task, nodes)
        
        return {
            "message": "Workflow build started successfully",
            "status": "building",
            "nodes_processed": len(nodes),
            "components_found": {
                "user_query": bool(user_query_node),
                "llm_engine": bool(llm_node),
                "knowledge_base": bool(knowledge_base_node)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error building workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to build workflow: {str(e)}")

def build_workflow_task(nodes: List[Dict[str, Any]]):
    """Background task to build the workflow"""
    try:
        logger.info(f"🚀 Building workflow with {len(nodes)} nodes")
        
        # Process each node type
        for i, node in enumerate(nodes):
            node_type = node.get('type')
            node_config = node.get('data', {}).get('config', {})
            
            logger.info(f"📝 Processing node {i+1}/{len(nodes)}: {node_type}")
            logger.info(f"📋 Full config: {node_config}")
            
            if node_type == 'userQuery':
                query = node_config.get('query', '')
                logger.info(f"👤 User Query: {query}")
                print(f"👤 User Query: {query}")
                
            elif node_type == 'knowledgeBase':
                file_name = node_config.get('fileName', 'No file')
                file_content = node_config.get('fileContent')
                api_key = node_config.get('apiKey', 'Not provided')
                
                logger.info(f"📚 Knowledge Base Node:")
                logger.info(f"  - File Name: {file_name}")
                logger.info(f"  - API Key: {'Present' if api_key and api_key != 'Not provided' else 'Missing'}")
                logger.info(f"  - File Content: {'Present' if file_content else 'Missing'}")
                
                print(f"📚 Knowledge Base:")
                print(f"  📄 File: {file_name}")
                print(f"  🔑 API Key: {'Present' if api_key and api_key != 'Not provided' else 'Missing'}")
                
                if file_content:
                    try:
                        # Decode base64 to get file bytes
                        file_bytes = base64.b64decode(file_content)
                        logger.info(f"📄 File processed successfully: {len(file_bytes)} bytes")
                        print(f"📄 File processed: {len(file_bytes)} bytes")
                        
                        # Here you can add PDF processing logic
                        # For example, extract text from PDF, create embeddings, etc.
                        
                    except Exception as e:
                        logger.error(f"❌ Error processing file: {str(e)}")
                        print(f"❌ Error processing file: {str(e)}")
                else:
                    logger.warning("⚠️ No file content found in knowledge base node")
                    print("⚠️ No file content found in knowledge base node")
                
            elif node_type == 'llmEngine':
                prompt = node_config.get('prompt', 'Default prompt')
                api_key = node_config.get('apiKey', 'Not provided')
                model = node_config.get('model', 'gpt-4o-mini')
                temperature = node_config.get('temperature', 0.75)
                web_search = node_config.get('webSearch', True)
                serp_api_key = node_config.get('serpApiKey', '')
                
                logger.info(f"🤖 LLM Engine Node:")
                logger.info(f"  - Model: {model}")
                logger.info(f"  - Prompt: {prompt[:100]}{'...' if len(prompt) > 100 else ''}")
                logger.info(f"  - API Key: {'Present' if api_key and api_key != 'Not provided' else 'Missing'}")
                logger.info(f"  - Temperature: {temperature}")
                logger.info(f"  - Web Search: {web_search}")
                logger.info(f"  - SERP API Key: {'Present' if serp_api_key else 'Missing'}")
                
                print(f"🤖 LLM Engine:")
                print(f"  🏷️ Model: {model}")
                print(f"  📝 Prompt: {prompt[:100]}{'...' if len(prompt) > 100 else ''}")
                print(f"  🔑 API Key: {'Present' if api_key and api_key != 'Not provided' else 'Missing'}")
                print(f"  🌡️ Temperature: {temperature}")
                print(f"  🔍 Web Search: {'Enabled' if web_search else 'Disabled'}")
                
            elif node_type == 'webSearch':
                api_key = node_config.get('apiKey', 'Not provided')
                logger.info(f"🔍 Web Search Node:")
                logger.info(f"  - API Key: {'Present' if api_key and api_key != 'Not provided' else 'Missing'}")
                print(f"🔍 Web Search API Key: {'Present' if api_key and api_key != 'Not provided' else 'Missing'}")
                
            elif node_type == 'output':
                display_format = node_config.get('displayFormat', 'default')
                logger.info(f"📤 Output Node:")
                logger.info(f"  - Display Format: {display_format}")
                print(f"📤 Output Node: Ready to display results (Format: {display_format})")
        
        logger.info("✅ Workflow built successfully")
        print("✅ Workflow processing completed!")
        
    except Exception as e:
        logger.error(f"❌ Error in build task: {str(e)}")
        print(f"❌ Error in build task: {str(e)}")
