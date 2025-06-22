
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ArrowRight } from 'lucide-react';

export const OutputNode = ({ data, selected }: any) => {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <ArrowRight className="w-5 h-5 text-orange-600" />
        <span className="font-medium">Output</span>
      </div>
      <div className="text-sm text-gray-600 mb-3">Output of the result nodes as text</div>
      <div className="text-xs text-gray-500">Output Text</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
    </div>
  );
};
