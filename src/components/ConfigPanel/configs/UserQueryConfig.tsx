
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserQueryConfigProps {
  config: any;
  onUpdate: (config: any) => void;
}

export const UserQueryConfig: React.FC<UserQueryConfigProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="query">Query</Label>
        <Input
          id="query"
          placeholder="Write your query here"
          className="mt-1"
          value={config.query || ''}
          onChange={(e) => onUpdate({ ...config, query: e.target.value })}
        />
      </div>
    </div>
  );
};
