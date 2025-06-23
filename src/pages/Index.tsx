
import React, { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { ComponentLibrary } from '@/components/Sidebar/ComponentLibrary';
import { WorkflowCanvas } from '@/components/Workflow/WorkflowCanvas';
import { ConfigPanel } from '@/components/ConfigPanel/ConfigPanel';
import { ChatModal } from '@/components/Chat/ChatModal';
import { StackDashboard } from '@/components/StackDashboard/StackDashboard';
import { Button } from '@/components/ui/button';
import { Node } from '@xyflow/react';
import { MessageSquare, Play } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('editor');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [workflowNodes, setWorkflowNodes] = useState<Node[]>([]);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    console.log('Drag started for:', nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeUpdate = (nodeId: string, config: any) => {
    console.log('Updating node config:', nodeId, config);
    
    // Update the selected node's config if it matches
    if (selectedNode && selectedNode.id === nodeId) {
      const updatedSelectedNode = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          config: {
            ...selectedNode.data.config,
            ...config
          }
        }
      };
      setSelectedNode(updatedSelectedNode);
    }

    // Update the workflow nodes state
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

  const handleNodeSelect = (node: Node | null) => {
    console.log('Node selected:', node);
    setSelectedNode(node);
  };

  const handleSave = () => {
    console.log('Saving workflow...');
    console.log('Current workflow nodes:', workflowNodes);
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

    if (!llmNode.data.config?.apiKey) {
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
            onNodeSelect={handleNodeSelect}
            onNodeUpdate={handleNodeUpdate}
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
        
        <ConfigPanel selectedNode={selectedNode} onNodeUpdate={handleNodeUpdate} />
      </div>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
