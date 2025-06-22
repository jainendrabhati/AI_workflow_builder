
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, User } from 'lucide-react';

interface HeaderProps {
  onNewStack: () => void;
  onSave: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewStack, onSave }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">G</span>
        </div>
        <h1 className="text-xl font-semibold">GenAI Stack</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button onClick={onNewStack} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4" />
          New Stack
        </Button>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
