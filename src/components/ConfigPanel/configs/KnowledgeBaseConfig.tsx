
import React from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

interface KnowledgeBaseConfigProps {
  node: Node;
  onUpdate: (nodeId: string, config: any) => void;
}

export const KnowledgeBaseConfig: React.FC<KnowledgeBaseConfigProps> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>File for Knowledge Base</Label>
        <Button variant="outline" className="w-full mt-1 justify-start">
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>
      
      <div>
        <Label>Embedding Model</Label>
        <Select>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="text-embedding-3-large" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
            <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="kb-api-key">API Key</Label>
        <Input
          id="kb-api-key"
          type="password"
          placeholder="••••••••••••••••"
          className="mt-1"
          onChange={(e) => onUpdate(node.id, { apiKey: e.target.value })}
        />
      </div>
    </div>
  );
};
