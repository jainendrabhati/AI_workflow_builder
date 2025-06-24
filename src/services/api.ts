const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Workflow {
  id: number;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  created_at?: string;
  updated_at?: string;
}

export const documentApi = {
  async getAll(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }
    return response.json();
  },

  async create(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create document: ${response.status}`);
    }
    return response.json();
  },

  async get(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.status}`);
    }
    return response.json();
  },

  async update(id: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update document: ${response.status}`);
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete document: ${response.status}`);
    }
  },
};

export const workflowApi = {
  async getAll(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/workflows`);
    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.status}`);
    }
    return response.json();
  },

  async create(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create workflow: ${response.status}`);
    }
    return response.json();
  },

  async get(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch workflow: ${response.status}`);
    }
    return response.json();
  },

  async update(id: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update workflow: ${response.status}`);
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete workflow: ${response.status}`);
    }
  },

  async saveWorkflow(workflowData: any): Promise<any> {
    console.log('Saving workflow with data:', workflowData);
    const response = await fetch(`${API_BASE_URL}/workflow-builder/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowData),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Save workflow error:', errorData);
      throw new Error(`Failed to save workflow: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Workflow saved successfully:', result);
    return result;
  },

  async getWorkflows(): Promise<Workflow[]> {
    return this.getAll();
  },

  async createWorkflow(name: string, description: string): Promise<Workflow> {
    return this.create({ name, description, nodes: [], edges: [] });
  },
};

// Export individual functions that are used in Index.tsx
export const saveWorkflow = workflowApi.saveWorkflow;

export const buildStack = async (buildData: any): Promise<any> => {
  console.log('📤 Building stack with data:', buildData);

  try {
    const response = await fetch(`${API_BASE_URL}/workflow-builder/build`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildData),
    });

    if (!response.ok) {
      const contentType = response.headers.get('Content-Type') || '';
      const errorData = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      console.error('❌ Build stack error:', errorData);
      throw new Error(
        `Failed to build stack: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log('✅ Stack built successfully:', result);
    return result;
  } catch (error) {
    console.error('❗ Unexpected error during stack build:', error);
    throw error;
  }
};

