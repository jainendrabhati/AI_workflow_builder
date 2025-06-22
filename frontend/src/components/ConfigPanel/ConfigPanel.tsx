
import React from 'react';
import { Node } from '@xyflow/react';
import { UserQueryConfig } from './configs/UserQueryConfig';
import { KnowledgeBaseConfig } from './configs/KnowledgeBaseConfig';
import { LLMEngineConfig } from './configs/LLMEngineConfig';
import { OutputConfig } from './configs/OutputConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfigPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, config: any) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ selectedNode, onNodeUpdate }) => {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l p-4">
        <div className="text-center text-gray-500 mt-8">
          Select a component to configure
        </div>
      </div>
    );
  }

  const renderConfig = () => {
    switch (selectedNode.type) {
      case 'userQuery':
        return <UserQueryConfig node={selectedNode} onUpdate={onNodeUpdate} />;
      case 'knowledgeBase':
        return <KnowledgeBaseConfig node={selectedNode} onUpdate={onNodeUpdate} />;
      case 'llmEngine':
        return <LLMEngineConfig node={selectedNode} onUpdate={onNodeUpdate} />;
      case 'output':
        return <OutputConfig node={selectedNode} onUpdate={onNodeUpdate} />;
      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-l">
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-lg">Configure Component</CardTitle>
          <p className="text-sm text-gray-600">{selectedNode.data?.label || selectedNode.type}</p>
        </CardHeader>
        <CardContent>
          {renderConfig()}
        </CardContent>
      </Card>
    </div>
  );
};
