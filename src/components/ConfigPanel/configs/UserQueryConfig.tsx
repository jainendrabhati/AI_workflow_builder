
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserQueryConfigProps {
  config: any;
  onUpdate: (config: any) => void;
}

export const UserQueryConfig: React.FC<UserQueryConfigProps> = ({ config, onUpdate }) => {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Query input changed:', e.target.value);
    // Only update the query field, preserve others
    onUpdate({ query: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="query">Query</Label>
        <Input
          id="query"
          placeholder="Write your query here"
          className="mt-1"
          value={config.query || ''}
          onChange={handleQueryChange}
        />
      </div>
    </div>
  );
};
