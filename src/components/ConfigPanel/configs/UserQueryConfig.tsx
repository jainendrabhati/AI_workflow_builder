
import React from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserQueryConfigProps {
  node: Node;
  onUpdate: (nodeId: string, config: any) => void;
}

export const UserQueryConfig: React.FC<UserQueryConfigProps> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="query">Query</Label>
        <Input
          id="query"
          placeholder="Write your query here"
          className="mt-1"
          onChange={(e) => onUpdate(node.id, { query: e.target.value })}
        />
      </div>
    </div>
  );
};
