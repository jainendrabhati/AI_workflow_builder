
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

export const UserQueryNode = ({ data, selected }: any) => {
  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[200px] ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <span className="font-medium">User Query</span>
      </div>
      <div className="text-sm text-gray-600 mb-3">Enter point for queries</div>
      <div className="text-xs text-gray-500">User Query</div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
};
