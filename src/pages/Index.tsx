
import React, { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { ComponentLibrary } from '@/components/Sidebar/ComponentLibrary';
import { WorkflowCanvas } from '@/components/Workflow/WorkflowCanvas';
import { ChatModal } from '@/components/Chat/ChatModal';
import { StackDashboard } from '@/components/StackDashboard/StackDashboard';
import { Button } from '@/components/ui/button';
import { Node } from '@xyflow/react';
import { MessageSquare, Play } from 'lucide-react';
import { toast } from 'sonner';
import { saveWorkflow, buildStack } from '@/services/api';

interface NodeConfig {
  query?: string;
  apiKey?: string;
  fileName?: string;
  file?: File;
  prompt?: string;
  [key: string]: any;
}

interface WorkflowNode extends Node {
  data: {
    config?: NodeConfig;
    onUpdate?: (nodeId: string, config: NodeConfig) => void;
    [key: string]: any;
  };
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('editor');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([]);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    console.log('Drag started for:', nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeUpdate = (nodeId: string, config: NodeConfig) => {
    console.log('Updating node config in Index:', nodeId, config);
    
    setWorkflowNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node => 
        node.id === nodeId 
          ? {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...(node.data.config || {}),
                  ...config
                }
              }
            }
          : node
      );
      
      console.log('Updated workflow nodes:', updatedNodes);
      return updatedNodes;
    });
  };

  const handleNodesChange = (nodes: WorkflowNode[]) => {
    console.log('Nodes changed in Index:', nodes);
    setWorkflowNodes(nodes);
  };

  const getDefaultApiKey = () => {
    // Return a default API key for prefilling (in real app, get from secure storage)
    return 'sk-1234567890abcdef1234567890abcdef';
  };

  const handleSave = async () => {
    console.log('Saving workflow...');
    console.log('Current workflow nodes:', workflowNodes);
    
    if (workflowNodes.length === 0) {
      toast.error('No components to save. Please add some components to your workflow.');
      return;
    }

    try {
      // Prepare nodes data with proper structure
      const nodesForSave = workflowNodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label,
          config: node.data.config || {}
        }
      }));

      const workflowData = {
        nodes: nodesForSave,
        edges: [], // Add edges if you have them
        name: `Workflow-${Date.now()}`,
        description: 'Auto-generated workflow'
      };

      console.log('Sending workflow data for save:', workflowData);
      await saveWorkflow(workflowData);
      toast.success('Workflow saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save workflow. Please try again.');
    }
  };

  const handleBuildStack = async () => {
    console.log('Building stack...');
    console.log('Workflow nodes for build:', workflowNodes);
    
    // Validate that we have nodes
    if (workflowNodes.length === 0) {
      toast.error('Please add some components to your workflow before building');
      return;
    }

    // Basic validation for required configurations
    const userQueryNode = workflowNodes.find(node => node.type === 'userQuery');
    const llmNode = workflowNodes.find(node => node.type === 'llmEngine');

    if (!userQueryNode) {
      toast.error('Please add a User Query component to your workflow');
      return;
    }

    if (!llmNode) {
      toast.error('Please add an LLM Engine component to your workflow');
      return;
    }

    // Check if user query has content
    const userConfig = userQueryNode.data.config;
    console.log('User query config during build:', userConfig);
    
    if (!userConfig?.query || userConfig.query.trim() === '') {
      toast.error('Please enter a query in the User Query component');
      return;
    }

    // Check if LLM has API key
    const llmConfig = llmNode.data.config;
    console.log('LLM config during build:', llmConfig);
    
    if (!llmConfig?.apiKey || llmConfig.apiKey.trim() === '') {
      toast.error('Please configure the API key for your LLM Engine');
      return;
    }

    try {
      // Prepare nodes data for build
      const nodesForBuild = workflowNodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label,
          config: node.data.config || {}
        }
      }));

      const buildData = {
        nodes: nodesForBuild,
        timestamp: Date.now()
      };

      console.log('Sending build data:', buildData);
      await buildStack(buildData);
      toast.success('Stack built successfully! 🚀');
    } catch (error) {
      console.error('Build error:', error);
      toast.error('Failed to build stack. Please try again.');
    }
  };

  const handleNewStack = () => {
    setCurrentView('dashboard');
  };

  const handleStackSelect = (stackId: string) => {
    setCurrentView('editor');
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNewStack={handleNewStack} onSave={handleSave} />
        <StackDashboard onStackSelect={handleStackSelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewStack={handleNewStack} onSave={handleSave} />
      
      <div className="flex h-[calc(100vh-64px)]">
        <ComponentLibrary onDragStart={handleDragStart} />
        
        <div className="flex-1 relative">
          <WorkflowCanvas 
            onNodeUpdate={handleNodeUpdate}
            onNodesChange={handleNodesChange}
            defaultApiKey={getDefaultApiKey()}
          />
          
          {/* Floating Action Buttons */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3">
            <Button
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 p-0"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleBuildStack}
              className="bg-green-600 hover:bg-green-700 rounded-full px-4 py-2"
            >
              <Play className="w-4 h-4 mr-2" />
              Build Stack
            </Button>
          </div>
        </div>
      </div>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
