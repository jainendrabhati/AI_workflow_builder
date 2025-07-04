
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const LLMEngineNode = ({ data, selected }: any) => {
  const [apiKey, setApiKey] = useState(data.config?.apiKey || '');
  const [prompt, setPrompt] = useState(
    data.config?.prompt || 'You are a helpful PDF assistant. Use the provided context to answer questions accurately.'
  );

  useEffect(() => {
    setApiKey(data.config?.apiKey || '');
    setPrompt(data.config?.prompt || 'You are a helpful PDF assistant. Use the provided context to answer questions accurately.');
  }, [data.config]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    
    const nodeId = data?.id || data?.nodeId;
    const updatedConfig = {
      ...data.config,
      apiKey: newApiKey
    };
    
    console.log('🔑 Updating LLM API key:', updatedConfig);
    data.onUpdate?.(nodeId, updatedConfig);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    
    const nodeId = data?.id || data?.nodeId;
    const updatedConfig = {
      ...data.config,
      prompt: newPrompt
    };
    
    console.log('📝 Updating LLM prompt:', updatedConfig);
    data.onUpdate?.(nodeId, updatedConfig);
  };

  return (
    <div
      className={`bg-white border-2 rounded-lg p-4 min-w-[300px] ${
        selected ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-5 h-5 text-purple-600" />
        <span className="font-medium">LLM (OpenAI)</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Model:</label>
          <div className="text-sm text-gray-600">GPT-4o Mini</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">API Key:</label>
          <Input
            type="password"
            placeholder="Enter OpenAI API key..."
            value={apiKey}
            onChange={handleApiKeyChange}
            className="w-full text-xs"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Prompt:</label>
          <Textarea
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={handlePromptChange}
            className="w-full text-xs"
            rows={3}
          />
        </div>

        <div className="text-xs text-gray-500">
          <div>Temperature: 0.75</div>
          <div>WebSearch Tool: ✓</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </div>
  );
};
