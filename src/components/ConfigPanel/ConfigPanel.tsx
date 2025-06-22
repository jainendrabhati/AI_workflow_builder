
import React from 'react';
import { Node } from '@xyflow/react';
import { UserQueryConfig } from './configs/UserQueryConfig';
import { KnowledgeBaseConfig } from './configs/KnowledgeBaseConfig';
import { LLMEngineConfig } from './configs/LLMEngineConfig';
import { OutputConfig } from './configs/OutputConfig';

interface ConfigPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, config: any) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ selectedNode, onNodeUpdate }) => {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l p-4">
        <div className="text-center text-gray-500 mt-8">
          Select a node to configure
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
        return <div>Unknown node type</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-l p-4">
      <h3 className="font-semibold mb-4">{selectedNode.data.label} Configuration</h3>
      {renderConfig()}
    </div>
  );
};
