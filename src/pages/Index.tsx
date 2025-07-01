
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
  file?: File | null;
  prompt?: string;
  fileContent?: string;
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
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeUpdate = (nodeId: string, config: NodeConfig) => {
    console.log('📝 Node update received:', nodeId, config);
    setWorkflowNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              config: {
                ...(node.data.config || {}),
                ...config
              }
            }
          };
          console.log('✅ Updated node:', updatedNode);
          return updatedNode;
        }
        return node;
      });
      console.log('📊 All nodes after update:', updatedNodes);
      return updatedNodes;
    });
  };

  const handleNodesChange = (nodes: WorkflowNode[]) => {
    console.log('🔄 Nodes changed:', nodes);
    setWorkflowNodes(nodes);
  };

  const getDefaultApiKey = () => {
    return 'sk-1234567890abcdef1234567890abcdef';
  };

  const handleSave = async () => {
    if (workflowNodes.length === 0) {
      toast.error('No components to save. Please add some components to your workflow.');
      return;
    }

    try {
      console.log('💾 Saving workflow with nodes:', workflowNodes);
      
      const nodesForSave = await Promise.all(
        workflowNodes.map(async node => {
          const config = { ...node.data.config };
          
          // Handle file conversion to base64 for knowledge base nodes
          if (node.type === 'knowledgeBase' && config?.file instanceof File) {
            const reader = new FileReader();
            const fileContent = await new Promise<string>((resolve, reject) => {
              reader.onload = () => {
                const result = reader.result as string;
                const base64Content = result.split(',')[1];
                resolve(base64Content);
              };
              reader.onerror = reject;
              reader.readAsDataURL(config.file as File);
            });
            
            config.fileContent = fileContent;
            config.fileName = config.file.name;
            delete config.file;
          }

          return {
            id: node.id,
            type: node.type,
            position: node.position,
            data: {
              label: node.data.label,
              config: config
            }
          };
        })
      );

      const workflowData = {
        nodes: nodesForSave,
        edges: [],
        name: `Workflow-${Date.now()}`,
        description: 'Auto-generated workflow'
      };

      console.log('📤 Sending workflow data:', workflowData);
      await saveWorkflow(workflowData);
      toast.success('Workflow saved successfully!');
    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error('Failed to save workflow. Please try again.');
    }
  };

  const handleBuildStack = async () => {
    if (workflowNodes.length === 0) {
      toast.error('Please add some components to your workflow before building');
      return;
    }

    console.log('🚀 Building stack with nodes:', workflowNodes);

    const userQueryNode = workflowNodes.find(node => node.type === 'userQuery');
    const llmNode = workflowNodes.find(node => node.type === 'llmEngine');

    if (!userQueryNode || !llmNode) {
      toast.error('Please add both User Query and LLM Engine components to your workflow');
      return;
    }

    const userConfig = userQueryNode.data.config || {};
    const llmConfig = llmNode.data.config || {};

    console.log('👤 User Query Config:', userConfig);
    console.log('🤖 LLM Config:', llmConfig);

    if (!userConfig.query?.trim()) {
      toast.error('Please enter a query in the User Query component');
      return;
    }

    if (!llmConfig.apiKey?.trim()) {
      toast.error('Please configure the API key for your LLM Engine');
      return;
    }

    try {
      const nodesForBuild = await Promise.all(
        workflowNodes.map(async node => {
          const config = { ...node.data.config };
          
          console.log(`📋 Processing ${node.type} node:`, config);

          // Handle file conversion to base64 for knowledge base nodes
          if (node.type === 'knowledgeBase' && config?.file instanceof File) {
            console.log('📄 Converting file to base64:', config.file.name);
            const reader = new FileReader();
            const fileContent = await new Promise<string>((resolve, reject) => {
              reader.onload = () => {
                const result = reader.result as string;
                const base64Content = result.split(',')[1];
                resolve(base64Content);
              };
              reader.onerror = reject;
              reader.readAsDataURL(config.file as File);
            });
            
            config.fileContent = fileContent;
            config.fileName = config.file.name;
            delete config.file;
            console.log('✅ File converted to base64');
          }

          return {
            id: node.id,
            type: node.type,
            position: node.position,
            data: {
              label: node.data.label,
              config: config
            }
          };
        })
      );

      console.log('📦 Final build data:', nodesForBuild);

      const buildData = {
        nodes: nodesForBuild,
        timestamp: Date.now()
      };

      await buildStack(buildData);
      toast.success('Stack built successfully! 🚀');
    } catch (error) {
      console.error('❌ Build error:', error);
      toast.error('Failed to build stack. Please try again.');
    }
  };

  const handleNewStack = () => setCurrentView('dashboard');
  const handleStackSelect = (_stackId: string) => setCurrentView('editor');

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
