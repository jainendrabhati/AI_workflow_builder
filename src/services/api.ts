
const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Workflow {
  id: number;
  name: string;
  description?: string;
  definition?: any;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ChatRequest {
  workflow_id: number;
  message: string;
}

export interface ChatResponse {
  response: string;
  session_id: number;
}

export const workflowApi = {
  // Get all workflows
  getWorkflows: async (): Promise<Workflow[]> => {
    const response = await fetch(`${API_BASE_URL}/workflows/`);
    if (!response.ok) throw new Error('Failed to fetch workflows');
    return response.json();
  },

  // Create new workflow
  createWorkflow: async (name: string, description?: string): Promise<Workflow> => {
    const response = await fetch(`${API_BASE_URL}/workflows/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) throw new Error('Failed to create workflow');
    return response.json();
  },

  // Update workflow
  updateWorkflow: async (id: number, definition: any): Promise<Workflow> => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ definition }),
    });
    if (!response.ok) throw new Error('Failed to update workflow');
    return response.json();
  },

  // Get workflow by ID
  getWorkflow: async (id: number): Promise<Workflow> => {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`);
    if (!response.ok) throw new Error('Failed to fetch workflow');
    return response.json();
  },

  // Save workflow with nodes
  saveWorkflow: async (workflowData: any): Promise<Workflow> => {
    const response = await fetch(`${API_BASE_URL}/workflow-builder/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflowData),
    });
    if (!response.ok) throw new Error('Failed to save workflow');
    return response.json();
  },

  // Build workflow
  buildWorkflow: async (workflowId: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/workflow-builder/build/${workflowId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to build workflow');
    return response.json();
  },

  // Validate workflow
  validateWorkflow: async (workflowId: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/workflow-builder/validate/${workflowId}`);
    if (!response.ok) throw new Error('Failed to validate workflow');
    return response.json();
  },
};

export const documentApi = {
  // Upload document
  uploadDocument: async (file: File, workflowId?: number): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    if (workflowId) formData.append('workflow_id', workflowId.toString());

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
  },

  // Search documents
  searchDocuments: async (query: string, workflowId?: number): Promise<any> => {
    const params = new URLSearchParams({ query });
    if (workflowId) params.append('workflow_id', workflowId.toString());

    const response = await fetch(`${API_BASE_URL}/documents/search?${params}`);
    if (!response.ok) throw new Error('Failed to search documents');
    return response.json();
  },
};

export const chatApi = {
  // Send chat message
  sendMessage: async (workflowId: number, message: string): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_id: workflowId, message }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },
};
