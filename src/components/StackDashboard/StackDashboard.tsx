import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink } from 'lucide-react';
import { CreateStackModal } from './CreateStackModal';
import { workflowApi, Workflow } from '@/services/api';

interface StackDashboardProps {
  onStackSelect: (stackId: string) => void;
}

export const StackDashboard: React.FC<StackDashboardProps> = ({ onStackSelect }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [stacks, setStacks] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStacks();
  }, []);

  const loadStacks = async () => {
    try {
      const workflows = await workflowApi.getAll();
      setStacks(workflows);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStack = async (name: string, description: string) => {
    try {
      const newStack = await workflowApi.create({ name, description, nodes: [], edges: [] });
      setStacks(prev => [...prev, newStack]);
      setIsCreateModalOpen(false);
      onStackSelect(newStack.id.toString());
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading stacks...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Stacks</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          New Stack
        </Button>
      </div>

      {stacks.length === 0 ? (
        <div className="text-center mt-20">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Create New Stack</h3>
          <p className="text-gray-500 mb-4">Start building your generative AI apps with our essential tools and frameworks</p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            New Stack
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stacks.map((stack) => (
            <div key={stack.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">{stack.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{stack.description || 'No description'}</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onStackSelect(stack.id.toString())}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Edit Stack
              </Button>
            </div>
          ))}
        </div>
      )}

      <CreateStackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateStack={handleCreateStack}
      />
    </div>
  );
};
