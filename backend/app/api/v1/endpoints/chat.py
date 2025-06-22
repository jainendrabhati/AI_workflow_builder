
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.workflow import ChatSession, Workflow
from app.schemas.workflow import ChatSessionCreate, ChatSessionResponse, ChatMessage
from app.services.llm_service import LLMService
from app.services.document_service import DocumentService
from datetime import datetime
import json

router = APIRouter()
llm_service = LLMService()
document_service = DocumentService()

@router.post("/", response_model=dict)
async def chat_with_workflow(
    chat_request: ChatSessionCreate,
    db: Session = Depends(get_db)
):
    try:
        # Get workflow
        workflow = db.query(Workflow).filter(Workflow.id == chat_request.workflow_id).first()
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Execute workflow
        response = await execute_workflow(
            workflow_definition=workflow.definition,
            user_query=chat_request.message,
            workflow_id=chat_request.workflow_id
        )
        
        # Save chat session
        messages = [
            ChatMessage(role="user", content=chat_request.message, timestamp=datetime.utcnow()),
            ChatMessage(role="assistant", content=response, timestamp=datetime.utcnow())
        ]
        
        chat_session = ChatSession(
            workflow_id=chat_request.workflow_id,
            messages=[msg.dict() for msg in messages]
        )
        db.add(chat_session)
        db.commit()
        
        return {
            "response": response,
            "session_id": chat_session.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def execute_workflow(workflow_definition: dict, user_query: str, workflow_id: int) -> str:
    """Execute workflow based on definition"""
    try:
        if not workflow_definition or 'nodes' not in workflow_definition:
            return "Workflow definition is invalid"
        
        nodes = {node['id']: node for node in workflow_definition['nodes']}
        edges = workflow_definition.get('edges', [])
        
        # Find start node (User Query)
        start_node = None
        for node in nodes.values():
            if node['type'] == 'userQuery':
                start_node = node
                break
        
        if not start_node:
            return "No User Query component found in workflow"
        
        # Execute workflow
        current_data = {"query": user_query}
        
        # Follow edges to execute components in order
        current_node_id = start_node['id']
        processed_nodes = set()
        
        while current_node_id and current_node_id not in processed_nodes:
            processed_nodes.add(current_node_id)
            current_node = nodes[current_node_id]
            
            # Process current node
            if current_node['type'] == 'knowledgeBase':
                # Search for relevant context
                search_results = await document_service.search_documents(
                    query=current_data['query'],
                    workflow_id=workflow_id
                )
                context = " ".join([result['text'] for result in search_results[:3]])
                current_data['context'] = context
            
            elif current_node['type'] == 'llmEngine':
                # Generate response using LLM
                node_config = current_node.get('data', {}).get('config', {})
                model = node_config.get('model', 'gpt-3.5-turbo')
                custom_prompt = node_config.get('customPrompt')
                
                response = await llm_service.generate_response(
                    query=current_data['query'],
                    context=current_data.get('context'),
                    model=model,
                    custom_prompt=custom_prompt
                )
                current_data['response'] = response
            
            elif current_node['type'] == 'output':
                # Return final response
                return current_data.get('response', 'No response generated')
            
            # Find next node
            next_node_id = None
            for edge in edges:
                if edge['source'] == current_node_id:
                    next_node_id = edge['target']
                    break
            
            current_node_id = next_node_id
        
        return current_data.get('response', 'Workflow execution completed')
    
    except Exception as e:
        return f"Error executing workflow: {str(e)}"
