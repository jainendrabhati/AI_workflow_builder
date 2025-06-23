
import React from 'react';
import { Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserQueryConfig } from './configs/UserQueryConfig';
import { KnowledgeBaseConfig } from './configs/KnowledgeBaseConfig';
import { LLMEngineConfig } from './configs/LLMEngineConfig';
import { OutputConfig } from './configs/OutputConfig';

interface ConfigPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, config: any) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  selectedNode,
  onNodeUpdate,
}) => {
  const renderConfig = () => {
    if (!selectedNode) {
      return (
        <div className="text-center text-gray-500 mt-8">
          Select a component to configure its settings
        </div>
      );
    }

    const handleConfigUpdate = (config: any) => {
      onNodeUpdate(selectedNode.id, config);
    };

    switch (selectedNode.type) {
      case 'userQuery':
        return (
          <UserQueryConfig
            config={selectedNode.data.config || {}}
            onUpdate={handleConfigUpdate}
          />
        );
      case 'knowledgeBase':
        return (
          <KnowledgeBaseConfig
            config={selectedNode.data.config || {}}
            onUpdate={handleConfigUpdate}
          />
        );
      case 'llmEngine':
        return (
          <LLMEngineConfig
            config={selectedNode.data.config || {}}
            onUpdate={handleConfigUpdate}
          />
        );
      case 'output':
        return (
          <OutputConfig
            config={selectedNode.data.config || {}}
            onUpdate={handleConfigUpdate}
          />
        );
      default:
        return (
          <div className="text-center text-gray-500 mt-8">
            Unknown component type
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedNode ? `Configure ${selectedNode.data.label}` : 'Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderConfig()}
        </CardContent>
      </Card>
    </div>
  );
};
