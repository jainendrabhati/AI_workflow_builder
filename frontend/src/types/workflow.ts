
export interface WorkflowNode {
  id: string;
  type: 'userQuery' | 'knowledgeBase' | 'llmEngine' | 'output';
  position: { x: number; y: number };
  data: {
    label: string;
    config?: any;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface ComponentConfig {
  userQuery: {
    placeholder?: string;
  };
  knowledgeBase: {
    files?: File[];
    embeddingModel?: string;
    apiKey?: string;
  };
  llmEngine: {
    model?: string;
    apiKey?: string;
    prompt?: string;
    temperature?: number;
    webSearchEnabled?: boolean;
    serpApiKey?: string;
  };
  output: {
    displayFormat?: string;
  };
}
