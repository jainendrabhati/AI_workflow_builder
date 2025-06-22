
import React from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LLMEngineConfigProps {
  node: Node;
  onUpdate: (nodeId: string, config: any) => void;
}

export const LLMEngineConfig: React.FC<LLMEngineConfigProps> = ({ node, onUpdate }) => {
  const [temperature, setTemperature] = React.useState([0.75]);
  const [webSearchEnabled, setWebSearchEnabled] = React.useState(true);

  return (
    <div className="space-y-4">
      <div>
        <Label>Model</Label>
        <Select>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="GPT 4o - Mini" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o-mini">GPT 4o - Mini</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="llm-api-key">API Key</Label>
        <Input
          id="llm-api-key"
          type="password"
          placeholder="••••••••••••••••"
          className="mt-1"
          onChange={(e) => onUpdate(node.id, { apiKey: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="You are a helpful PDF assistant. Use web search if the PDF lacks context."
          className="mt-1"
          rows={3}
          onChange={(e) => onUpdate(node.id, { prompt: e.target.value })}
        />
        <div className="text-xs text-blue-600 mt-1">
          • CONTEXT: {'{context}'}
          • User Query: {'{query}'}
        </div>
      </div>
      
      <div>
        <Label>Temperature</Label>
        <div className="mt-2">
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            max={1}
            min={0}
            step={0.01}
            className="w-full"
          />
          <div className="text-sm text-gray-500 mt-1">{temperature[0]}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="web-search">WebSearch Tool</Label>
        <Switch
          id="web-search"
          checked={webSearchEnabled}
          onCheckedChange={setWebSearchEnabled}
        />
      </div>
      
      {webSearchEnabled && (
        <div>
          <Label htmlFor="serp-api">SERP API</Label>
          <Input
            id="serp-api"
            type="password"
            placeholder="••••••••••••••••"
            className="mt-1"
            onChange={(e) => onUpdate(node.id, { serpApiKey: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};
