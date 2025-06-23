
import React from 'react';
import { MessageSquare, Database, Settings, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const components = [
  {
    id: 'userQuery',
    label: 'User Query',
    icon: MessageSquare,
    description: 'Enter point for queries'
  },
  {
    id: 'llmEngine',
    label: 'LLM (OpenAI)',
    icon: Settings,
    description: 'Run a query with OpenAI LLM'
  },
  {
    id: 'knowledgeBase',
    label: 'Knowledge Base',
    icon: Database,
    description: 'Let LLM search info in your file'
  },
  {
    id: 'webSearch',
    label: 'Web Search',
    icon: Search,
    description: 'Search the web for information'
  },
  {
    id: 'output',
    label: 'Output',
    icon: ArrowRight,
    description: 'Display results'
  }
];

interface ComponentLibraryProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onDragStart }) => {
  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    console.log('Drag started for:', nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    onDragStart(event, nodeType);
  };

  return (
    <div className="w-64 bg-white border-r p-4">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-semibold">Chat With AI</h2>
        <Button variant="ghost" size="sm">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Components</h3>
        {components.map((component) => (
          <div
            key={component.id}
            draggable
            onDragStart={(event) => handleDragStart(event, component.id)}
            className="flex items-center gap-3 p-3 border rounded-lg cursor-move hover:bg-gray-50 transition-colors select-none"
          >
            <component.icon className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <div className="font-medium text-sm">{component.label}</div>
            </div>
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
