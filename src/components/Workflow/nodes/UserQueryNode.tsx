
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';


interface UserQueryNodeProps {
  id: string;
  data: {
    config?: {
      query?: string;
    };
    onUpdate?: (id: string, config: { query: string }) => void;
  };
  selected: boolean;
}

export const UserQueryNode = ({ id, data, selected }: UserQueryNodeProps) => {
  const [query, setQuery] = useState(data.config?.query || '');

  useEffect(() => {
    if (data.config?.query !== undefined) {
      setQuery(data.config.query);
    }
  }, [data.config?.query]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (data.onUpdate) {
      data.onUpdate(id, { query: newQuery });
    }
  };

  return (
    <div
      className={`bg-white border-2 rounded-lg p-4 min-w-[250px] ${
        selected ? 'border-blue-500' : 'border-gray-200'
      }`}
    >

      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <span className="font-medium">User Query</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Enter your query:</label>
        <Input
          placeholder="Write your query here..."
          value={query}
          onChange={handleQueryChange}
          className="w-full text-sm"
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
};
