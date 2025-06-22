
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings } from 'lucide-react';

export const LLMEngineNode = ({ data, selected }: any) => {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-purple-600" />
        <span className="font-medium">LLM (OpenAI)</span>
      </div>
      <div className="text-sm text-gray-600 mb-3">Run a query with OpenAI LLM</div>
      <div className="text-xs text-gray-500 space-y-1">
        <div>Model: GPT 4o - Mini</div>
        <div>API Key: ••••••••••••••••</div>
        <div>Prompt: You are a helpful PDF assistant...</div>
        <div>Temperature: 0.75</div>
        <div>WebSearch Tool: ✓</div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </div>
  );
};
