
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LLMEngineConfigProps {
  config: any;
  onUpdate: (config: any) => void;
}

export const LLMEngineConfig: React.FC<LLMEngineConfigProps> = ({ config, onUpdate }) => {
  const [temperature, setTemperature] = React.useState([config.temperature || 0.75]);
  const [webSearchEnabled, setWebSearchEnabled] = React.useState(config.webSearch || true);

  const handleModelChange = (value: string) => {
    console.log('Model changed:', value);
    onUpdate({ ...config, model: value });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('LLM API Key changed');
    onUpdate({ ...config, apiKey: e.target.value });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Prompt changed');
    onUpdate({ ...config, prompt: e.target.value });
  };

  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value);
    onUpdate({ ...config, temperature: value[0] });
  };

  const handleWebSearchToggle = (checked: boolean) => {
    setWebSearchEnabled(checked);
    onUpdate({ ...config, webSearch: checked });
  };

  const handleSerpApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SERP API Key changed');
    onUpdate({ ...config, serpApiKey: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Model</Label>
        <Select onValueChange={handleModelChange} value={config.model}>
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
          value={config.apiKey || ''}
          onChange={handleApiKeyChange}
        />
      </div>
      
      <div>
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="You are a helpful PDF assistant. Use web search if the PDF lacks context."
          className="mt-1"
          rows={3}
          value={config.prompt || ''}
          onChange={handlePromptChange}
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
            onValueChange={handleTemperatureChange}
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
          onCheckedChange={handleWebSearchToggle}
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
            value={config.serpApiKey || ''}
            onChange={handleSerpApiKeyChange}
          />
        </div>
      )}
    </div>
  );
};
