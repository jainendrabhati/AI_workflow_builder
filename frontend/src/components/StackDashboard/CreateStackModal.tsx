
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface CreateStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStack: (name: string, description: string) => void;
}

export const CreateStackModal: React.FC<CreateStackModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreateStack 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onCreateStack(name.trim(), description.trim());
      setName('');
      setDescription('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create New Stack</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="stack-name">Name</Label>
            <Input
              id="stack-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter stack name"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="stack-description">Description</Label>
            <Textarea
              id="stack-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter stack description"
              className="mt-1"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={!name.trim() || !description.trim()}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
