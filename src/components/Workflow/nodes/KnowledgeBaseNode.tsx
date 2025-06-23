
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';

export const KnowledgeBaseNode = ({ data, selected }: any) => {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-5 h-5 text-green-600" />
        <span className="font-medium">Knowledge Base</span>
      </div>
      <div className="text-sm text-gray-600 mb-3">Let LLM search info in your file</div>
      <div className="text-xs text-gray-500">File for Knowledge Base</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
};
