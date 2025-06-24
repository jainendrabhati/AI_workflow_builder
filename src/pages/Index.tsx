
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

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('editor');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [workflowNodes, setWorkflowNodes] = useState<Node[]>([]);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    console.log('Drag started for:', nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeUpdate = (nodeId: string, config: any) => {
    console.log('Updating node config:', nodeId, config);
    
    setWorkflowNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...node.data.config,
                  ...config
                }
              }
            }
          : node
      )
    );
  };

  const handleNodesChange = (nodes: Node[]) => {
    console.log('Nodes changed:', nodes);
    setWorkflowNodes(nodes);
  };

  const handleSave = () => {
    console.log('Saving workflow...');
    console.log('Current workflow nodes:', workflowNodes);
    
    if (workflowNodes.length === 0) {
      toast.error('No components to save. Please add some components to your workflow.');
      return;
    }

    // Here you would typically save to backend
    toast.success('Workflow saved successfully!');
  };

  const handleBuildStack = () => {
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
    if (!userQueryNode.data.config?.query || userQueryNode.data.config.query.trim() === '') {
      toast.error('Please enter a query in the User Query component');
      return;
    }

    // Check if LLM has API key
    if (!llmNode.data.config?.apiKey || llmNode.data.config.apiKey.trim() === '') {
      toast.error('Please configure the API key for your LLM Engine');
      return;
    }

    toast.success('Stack built successfully! 🚀');
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
