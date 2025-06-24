import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const KnowledgeBaseNode = ({ data, selected }: any) => {
  const [fileName, setFileName] = useState(data.config?.fileName || '');
  const [apiKey, setApiKey] = useState(data.config?.apiKey || '');
  const [file, setFile] = useState<File | null>(data.config?.file || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFileName(data.config?.fileName || '');
    setApiKey(data.config?.apiKey || '');
    setFile(data.config?.file || null);
  }, [data.config]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    console.log('Uploaded file:', uploadedFile);
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
      

      const nodeId = data?.id || data?.nodeId;
      data.onUpdate?.(nodeId, {
        file: uploadedFile,
        fileName: uploadedFile.name
      });
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);

    const nodeId = data?.id || data?.nodeId;
    data.onUpdate?.(nodeId, {
      apiKey: newApiKey
    });
  };

  return (
    <div className={`bg-white border-2 rounded-lg p-4 min-w-[280px] ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-5 h-5 text-green-600" />
        <span className="font-medium">Knowledge Base</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Upload File:</label>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {fileName || 'Choose File'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">API Key:</label>
          <Input
            type="password"
            placeholder="Enter API key..."
            value={apiKey}
            onChange={handleApiKeyChange}
            className="w-full text-xs"
          />
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
};
