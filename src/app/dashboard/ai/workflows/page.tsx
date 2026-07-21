"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Panel,
  Handle,
  Position
} from "reactflow";
import "reactflow/dist/style.css";
import { Play, Activity, Database, BrainCircuit, Box, MessageSquare, Split, Users, Terminal, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom node styling
const nodeStyle = {
  background: "#fff",
  border: "2px solid #e2e8f0",
  borderRadius: "12px",
  padding: "16px",
  minWidth: "250px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
};

const initialNodes: Node[] = [
  {
    id: "trigger",
    position: { x: 50, y: 150 },
    data: { 
      label: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"><Play className="w-5 h-5"/></div>
          <div>
            <div className="font-bold text-slate-800">Trigger</div>
            <div className="text-xs text-slate-500">HTTP Webhook</div>
          </div>
        </div>
      ) 
    },
    style: nodeStyle,
  },
  {
    id: "rag",
    position: { x: 400, y: 150 },
    data: { 
      label: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Database className="w-5 h-5"/></div>
          <div>
            <div className="font-bold text-slate-800">Knowledge Retrieval</div>
            <div className="text-xs text-slate-500">Workspace Search</div>
          </div>
        </div>
      ) 
    },
    style: nodeStyle,
  },
  {
    id: "prompt",
    position: { x: 750, y: 150 },
    data: { 
      label: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 border-b pb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600"><MessageSquare className="w-5 h-5"/></div>
            <div>
              <div className="font-bold text-slate-800">Prompt Template</div>
              <div className="text-xs text-slate-500">Dynamic Chaining</div>
            </div>
          </div>
          <div className="text-xs bg-slate-50 p-2 border rounded font-mono text-slate-600">
            "Summarize this context: &#123;&#123;context&#125;&#125;"
          </div>
          <Handle type="target" position={Position.Left} id="context" className="!bg-indigo-500 !w-3 !h-3" />
          <Handle type="source" position={Position.Right} id="promptOut" className="!bg-indigo-500 !w-3 !h-3" />
        </div>
      ) 
    },
    style: nodeStyle,
  },
  {
    id: "llm",
    position: { x: 1100, y: 150 },
    data: { 
      label: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600"><BrainCircuit className="w-5 h-5"/></div>
          <div>
            <div className="font-bold text-slate-800">LLM Node</div>
            <div className="text-xs text-slate-500">GPT-4o (Reasoning)</div>
          </div>
        </div>
      ) 
    },
    style: nodeStyle,
  },

  {
    id: "planner",
    position: { x: 1100, y: 150 },
    data: { 
      label: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"><ListTodo className="w-5 h-5"/></div>
          <div>
            <div className="font-bold text-slate-800">Planner Agent</div>
            <div className="text-xs text-slate-500">Task Decomposition</div>
          </div>
          <Handle type="target" position={Position.Left} id="default" className="!bg-emerald-500 !w-3 !h-3" />
          <Handle type="source" position={Position.Right} id="default" className="!bg-emerald-500 !w-3 !h-3" />
        </div>
      ) 
    },
    style: nodeStyle,
  },
  {
    id: "executor",
    position: { x: 1400, y: 150 },
    data: { 
      label: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600"><Terminal className="w-5 h-5"/></div>
          <div>
            <div className="font-bold text-slate-800">Executor Agent</div>
            <div className="text-xs text-slate-500">Action/Observation Loop</div>
          </div>
          <Handle type="target" position={Position.Left} id="default" className="!bg-orange-500 !w-3 !h-3" />
          <Handle type="source" position={Position.Right} id="default" className="!bg-orange-500 !w-3 !h-3" />
        </div>
      ) 
    },
    style: nodeStyle,
  },
  {
    id: "router",
    position: { x: 1750, y: 150 },
    data: { 
      label: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 border-b pb-2">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600"><Split className="w-5 h-5"/></div>
            <div>
              <div className="font-bold text-slate-800">Router</div>
              <div className="text-xs text-slate-500">Conditional Branching</div>
            </div>
          </div>
          <div className="text-xs space-y-2 mt-1">
            <div className="flex items-center justify-between bg-slate-50 p-1.5 border rounded">
              <span>If text == "code"</span>
              <Handle type="source" position={Position.Right} id="routeCode" className="!bg-pink-500 !relative !transform-none !right-0 !top-0 !w-3 !h-3" />
            </div>
            <div className="flex items-center justify-between bg-slate-50 p-1.5 border rounded">
              <span>Else</span>
              <Handle type="source" position={Position.Right} id="routeDefault" className="!bg-pink-500 !relative !transform-none !right-0 !top-0 !w-3 !h-3" />
            </div>
          </div>
          <Handle type="target" position={Position.Left} id="default" className="!bg-indigo-500 !w-3 !h-3" />
        </div>
      ) 
    },
    style: nodeStyle,
  },
  {
    id: "supervisor",
    position: { x: 2150, y: 50 },
    data: { 
      label: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600"><Users className="w-5 h-5"/></div>
          <div>
            <div className="font-bold text-slate-800">Supervisor Agent</div>
            <div className="text-xs text-slate-500">Multi-Agent Delegation</div>
          </div>
          <Handle type="target" position={Position.Left} id="default" className="!bg-indigo-500 !w-3 !h-3" />
        </div>
      ) 
    },
    style: nodeStyle,
  },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "trigger", target: "rag", animated: true },
  { id: "e2", source: "rag", target: "prompt", sourceHandle: "default", targetHandle: "context", animated: true },
  { id: "e3", source: "prompt", target: "llm", sourceHandle: "promptOut", targetHandle: "default", animated: true },
  { id: "e4", source: "llm", target: "planner", animated: true },
  { id: "e-planner", source: "planner", target: "executor", animated: true },
  { id: "e-executor", source: "executor", target: "router", animated: true },
  { id: "e5", source: "router", target: "supervisor", sourceHandle: "routeCode", targetHandle: "default", animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
];

export default function WorkflowBuilderPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setIsDebugOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="h-14 border-b bg-white flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-indigo-600" />
          <h1 className="font-semibold text-slate-800">Visual Workflow Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Save Draft</Button>
          <Button size="sm" className="bg-indigo-600">
            <Play className="w-4 h-4 mr-2" /> Execute Pipeline
          </Button>
        </div>
      </header>

      <div className="flex-1 relative flex">
        {/* React Flow Canvas */}
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background color="#ccc" gap={16} />
            <Controls />
            <Panel position="top-left" className="bg-white/90 p-2 rounded shadow-sm border text-xs text-slate-600 font-medium">
              Click any node to open the Visual Debugger
            </Panel>
          </ReactFlow>
        </div>

        {/* Visual Debugger Panel */}
        {isDebugOpen && (
          <div className="w-80 bg-white border-l h-full flex flex-col shadow-xl z-20">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h3 className="font-semibold text-slate-800 text-sm">Execution Trace</h3>
              </div>
              <button onClick={() => setIsDebugOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Node ID</div>
                <div className="text-sm font-mono bg-slate-100 p-2 rounded">llm-node-1</div>
              </div>
              
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Status</div>
                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-full border border-emerald-200">
                  Completed in 1.2s
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Input State</div>
                <pre className="text-xs bg-slate-900 text-emerald-400 p-3 rounded overflow-x-auto">
{`{
  "context": [
    "Doc Chunk 1",
    "Doc Chunk 2"
  ]
}`}
                </pre>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Output State</div>
                <pre className="text-xs bg-slate-900 text-emerald-400 p-3 rounded overflow-x-auto">
{`{
  "text": "Generated response..."
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
