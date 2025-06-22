
import React from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';

interface OutputConfigProps {
  node: Node;
  onUpdate: (nodeId: string, config: any) => void;
}

export const OutputConfig: React.FC<OutputConfigProps> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Output Text</Label>
        <div className="mt-1 p-3 bg-gray-50 rounded border text-sm text-gray-600">
          Output will be generated based on query
        </div>
      </div>
    </div>
  );
};
