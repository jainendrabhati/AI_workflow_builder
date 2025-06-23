
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

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('editor');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    console.log('Drag started for:', nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeUpdate = (nodeId: string, config: any) => {
    console.log('Updating node config:', nodeId, config);
    // Update the selected node's config
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          config: config
        }
      });
    }
  };

  const handleSave = () => {
    console.log('Saving workflow...');
    // Add save functionality here
  };

  const handleBuildStack = () => {
    console.log('Building stack...');
    // Add build stack functionality here
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
          <WorkflowCanvas onNodeSelect={setSelectedNode} />
          
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
