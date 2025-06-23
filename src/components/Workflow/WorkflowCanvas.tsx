
import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { UserQueryNode } from './nodes/UserQueryNode';
import { KnowledgeBaseNode } from './nodes/KnowledgeBaseNode';
import { LLMEngineNode } from './nodes/LLMEngineNode';
import { OutputNode } from './nodes/OutputNode';
import { WebSearchNode } from './nodes/WebSearchNode';

const nodeTypes = {
  userQuery: UserQueryNode,
  knowledgeBase: KnowledgeBaseNode,
  llmEngine: LLMEngineNode,
  output: OutputNode,
  webSearch: WebSearchNode,
};

interface WorkflowCanvasProps {
  onNodeSelect: (node: Node | null) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ onNodeSelect }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      console.log('Connecting nodes:', params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) {
        console.log('No type found in dataTransfer');
        return;
      }

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      console.log('Dropping node:', { type, position });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: `${type} node`,
          config: {},
        },
      };

      console.log('Creating new node:', newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log('Node clicked:', node);
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onInit = useCallback((reactFlowInstance: any) => {
    console.log('ReactFlow initialized:', reactFlowInstance);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-64px)] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls className="bg-white border rounded-lg" />
        <MiniMap
          className="bg-white border rounded-lg"
          nodeColor="#e2e8f0"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background color="#e2e8f0" gap={20} />

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drag & drop to get started
              </h3>
              <p className="text-gray-500">
                Add components from the sidebar to build your workflow
              </p>
            </div>
          </div>
        )}
      </ReactFlow>
    </div>
  );
};
