
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

interface KnowledgeBaseConfigProps {
  config: any;
  onUpdate: (config: any) => void;
}

export const KnowledgeBaseConfig: React.FC<KnowledgeBaseConfigProps> = ({ config, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      onUpdate({ ...config, fileName: file.name, file: file });
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('API Key changed');
    onUpdate({ ...config, apiKey: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>File for Knowledge Base</Label>
        <div className="mt-1">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {config.fileName || 'Upload File'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
      
      <div>
        <Label>Embedding Model</Label>
        <Select onValueChange={(value) => onUpdate({ ...config, embeddingModel: value })}>
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
          value={config.apiKey || ''}
          onChange={handleApiKeyChange}
        />
      </div>
    </div>
  );
};
