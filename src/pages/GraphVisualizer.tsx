import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LearningAcademy } from '../components/LearningAcademy';
import {
  Play,
  RotateCcw,
  BookOpen,
  Plus,
  Trash2
} from 'lucide-react';
import { GraphNode, GraphEdge } from '../types';

export const GraphVisualizer: React.FC = () => {
  const { incrementVisualizations } = useAppStore();

  const algorithms = [
    'BFS',
    'DFS',
    'Dijkstra',
    'Bellman Ford',
    'Prim MST',
    'Kruskal MST',
    'A* Search'
  ];

  // 1. Graph State
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState('Dijkstra');
  
  // Editor mode configurations
  const [editorMode, setEditorMode] = useState<'node' | 'edge' | 'delete'>('node');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [edgeWeightInput, setEdgeWeightInput] = useState('4');

  // Animation states
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [activeEdgeId, setActiveEdgeId] = useState<string | null>(null);
  const [finalPathNodes, setFinalPathNodes] = useState<string[]>([]);
  const [distanceMap, setDistanceMap] = useState<Record<string, number>>({});
  const [runLog, setRunLog] = useState('Click canvas to add nodes. Select a node to link it to another.');

  // Initialize a pre-loaded graph representing a navigation routing network for high visual appeal on launch!
  useEffect(() => {
    loadDefaultGraph();
  }, []);

  const loadDefaultGraph = () => {
    const defaultNodes: GraphNode[] = [
      { id: 'A', label: 'A', x: 80, y: 150 },
      { id: 'B', label: 'B', x: 220, y: 70 },
      { id: 'C', label: 'C', x: 220, y: 230 },
      { id: 'D', label: 'D', x: 380, y: 70 },
      { id: 'E', label: 'E', x: 380, y: 230 },
      { id: 'F', label: 'F', x: 520, y: 150 }
    ];

    const defaultEdges: GraphEdge[] = [
      { id: 'A-B', from: 'A', to: 'B', weight: 4, isDirected: false },
      { id: 'A-C', from: 'A', to: 'C', weight: 2, isDirected: false },
      { id: 'B-C', from: 'B', to: 'C', weight: 1, isDirected: false },
      { id: 'B-D', from: 'B', to: 'D', weight: 5, isDirected: false },
      { id: 'C-E', from: 'C', to: 'E', weight: 3, isDirected: false },
      { id: 'D-E', from: 'D', to: 'E', weight: 2, isDirected: false },
      { id: 'D-F', from: 'D', to: 'F', weight: 2, isDirected: false },
      { id: 'E-F', from: 'E', to: 'F', weight: 4, isDirected: false }
    ];

    setNodes(defaultNodes);
    setEdges(defaultEdges);
    resetAnimationStates();
    setRunLog('Loaded default routing graph.');
  };

  const resetAnimationStates = () => {
    setVisitedNodes([]);
    setActiveEdgeId(null);
    setFinalPathNodes([]);
    setDistanceMap({});
  };

  // 2. Editor operations
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (editorMode !== 'node') return;

    // Get click bounds inside SVG
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Determine character label based on length
    const label = String.fromCharCode(65 + nodes.length);
    const newNode: GraphNode = {
      id: label,
      label,
      x,
      y
    };

    setNodes((prev) => [...prev, newNode]);
    setRunLog(`Added Node ${label} at position (${Math.floor(x)}, ${Math.floor(y)})`);
  };

  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop background canvas triggers
    resetAnimationStates();

    if (editorMode === 'delete') {
      setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setEdges((prev) => prev.filter((edge) => edge.from !== nodeId && edge.to !== nodeId));
      setRunLog(`Deleted node ${nodeId} and all adjacent edges.`);
      return;
    }

    if (editorMode === 'edge') {
      if (!selectedNodeId) {
        setSelectedNodeId(nodeId);
        setRunLog(`Select target node to connect Node ${nodeId} to.`);
      } else {
        if (selectedNodeId === nodeId) {
          setSelectedNodeId(null);
          return;
        }

        // Add edge
        const fromNode = selectedNodeId;
        const toNode = nodeId;
        const weight = parseInt(edgeWeightInput) || 1;
        const edgeId = `${fromNode}-${toNode}`;

        // Ensure edge doesn't exist
        const exists = edges.some(
          (edge) =>
            (edge.from === fromNode && edge.to === toNode) ||
            (!edge.isDirected && edge.from === toNode && edge.to === fromNode)
        );

        if (!exists) {
          const newEdge: GraphEdge = {
            id: edgeId,
            from: fromNode,
            to: toNode,
            weight,
            isDirected: false
          };
          setEdges((prev) => [...prev, newEdge]);
          setRunLog(`Created edge linking node ${fromNode} to node ${toNode} with weight = ${weight}.`);
        } else {
          setRunLog('Connection already exists between selected nodes.');
        }

        setSelectedNodeId(null);
      }
    }
  };

  // Node Drag listeners
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const handleNodeMouseDown = (nodeId: string) => {
    if (editorMode !== 'node') return;
    setDraggedNodeId(nodeId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId || editorMode !== 'node') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes((prev) =>
      prev.map((node) => (node.id === draggedNodeId ? { ...node, x, y } : node))
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggedNodeId(null);
  };

  // 3. Graph Algorithms execution
  const runAlgorithm = () => {
    resetAnimationStates();
    if (nodes.length === 0) return;

    // Pick start node (usually 'A') and end node (usually the last node)
    const startNode = nodes[0].id;
    const endNode = nodes[nodes.length - 1].id;

    setRunLog(`Initiating ${selectedAlgo} search starting at node ${startNode}...`);

    if (selectedAlgo === 'BFS' || selectedAlgo === 'DFS') {
      // Standard Graph Traversal (Queue / Stack model)
      const isBFS = selectedAlgo === 'BFS';
      const queueStack = [startNode];
      const visited: string[] = [];
      const parentMap: Record<string, string> = {};

      const stepTrace: string[] = [];
      const edgeTrace: string[] = [];

      while (queueStack.length > 0) {
        const curr = isBFS ? queueStack.shift()! : queueStack.pop()!;
        if (visited.includes(curr)) continue;
        visited.push(curr);
        stepTrace.push(curr);

        // Find outgoing neighbors
        const neighbors = edges
          .filter((e) => e.from === curr || e.to === curr)
          .map((e) => (e.from === curr ? e.to : e.from));

        for (const n of neighbors) {
          if (!visited.includes(n) && !queueStack.includes(n)) {
            queueStack.push(n);
            parentMap[n] = curr;
          }
        }
      }

      // Animate steps
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < stepTrace.length) {
          const active = stepTrace[idx];
          setVisitedNodes((prev) => [...prev, active]);
          setRunLog(`Visiting node ${active}. Expanding unvisited neighbors.`);
          idx++;
        } else {
          clearInterval(interval);
          incrementVisualizations(selectedAlgo, 'Graphs', stepTrace.length * 400);
        }
      }, 600);
    } else if (selectedAlgo === 'Dijkstra') {
      // Dijkstra Shortest Path Search
      const distances: Record<string, number> = {};
      const parents: Record<string, string | null> = {};
      const unvisited = new Set(nodes.map((n) => n.id));

      nodes.forEach((n) => {
        distances[n.id] = Infinity;
        parents[n.id] = null;
      });
      distances[startNode] = 0;

      const visitOrder: string[] = [];
      const edgeRelaxes: string[] = [];

      while (unvisited.size > 0) {
        // Greedy select smallest unvisited distance
        let u: string | null = null;
        unvisited.forEach((nodeId) => {
          if (u === null || distances[nodeId] < distances[u]) {
            u = nodeId;
          }
        });

        if (u === null || distances[u] === Infinity) break;
        unvisited.delete(u);
        visitOrder.push(u);

        // Relax neighbors
        const activeNeighbors = edges.filter((e) => e.from === u || e.to === u);
        for (const edge of activeNeighbors) {
          const v = edge.from === u ? edge.to : edge.from;
          if (unvisited.has(v)) {
            const alt = distances[u] + edge.weight;
            if (alt < distances[v]) {
              distances[v] = alt;
              parents[v] = u;
              edgeRelaxes.push(edge.id);
            }
          }
        }
      }

      // Reconstruct final path from endNode back to startNode
      const finalPath: string[] = [];
      let pathTrace: string | null = endNode;
      while (pathTrace !== null && distances[endNode] !== Infinity) {
        finalPath.unshift(pathTrace);
        pathTrace = parents[pathTrace];
      }

      // Animate relaxation steps
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < visitOrder.length) {
          const active = visitOrder[idx];
          setVisitedNodes((prev) => [...prev, active]);
          setDistanceMap({ ...distances });
          setRunLog(`Relaxing edges from Node ${active}. Minimum distance tentative updates.`);
          idx++;
        } else {
          clearInterval(interval);
          setFinalPathNodes(finalPath);
          setRunLog(`Shortest path from ${startNode} to ${endNode} computed successfully! Cost: ${distances[endNode]}`);
          incrementVisualizations('Dijkstra', 'Graphs', visitOrder.length * 500);
        }
      }, 700);
    } else {
      setRunLog(`${selectedAlgo} runner is ready. Click Run to start.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      {/* Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">Graph Algorithms Visualizer</h2>
          <p className="text-xs text-slate-400">Build custom graphs, link weighted nodes, and trace traversal/relaxation streams.</p>
        </div>
        <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5 shrink-0">
          {algorithms.map((algo) => (
            <button
              key={algo}
              onClick={() => setSelectedAlgo(algo)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedAlgo === algo
                  ? 'bg-indigo-600 text-white shadow-glass shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Canvas Arena */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6 min-h-[380px] justify-between relative overflow-hidden">
            {/* HUD Status panel */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Search</span>
                  <p className="text-sm font-black text-indigo-400 font-mono">{selectedAlgo}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Node Count</span>
                  <p className="text-sm font-black text-white font-mono">{nodes.length}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Edge Count</span>
                  <p className="text-sm font-black text-white font-mono">{edges.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 border border-white/5 rounded-xl text-[10px] text-slate-400 font-mono max-w-sm truncate">
                <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                <span className="truncate">{runLog}</span>
              </div>
            </div>

            {/* SVG Interactive Workspace */}
            <div className="flex-1 min-h-[320px] border border-white/5 bg-slate-950/20 rounded-2xl relative overflow-hidden">
              <svg
                width="100%"
                height="340"
                className="cursor-crosshair bg-slate-950/5 relative"
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
              >
                {/* 1. Connections rendering */}
                {edges.map((edge) => {
                  const fromNode = nodes.find((n) => n.id === edge.from);
                  const toNode = nodes.find((n) => n.id === edge.to);

                  if (!fromNode || !toNode) return null;

                  const isPathEdge =
                    finalPathNodes.includes(edge.from) &&
                    finalPathNodes.includes(edge.to) &&
                    Math.abs(finalPathNodes.indexOf(edge.from) - finalPathNodes.indexOf(edge.to)) === 1;

                  let strokeCol = 'stroke-slate-800';
                  if (isPathEdge) strokeCol = 'stroke-emerald-400 shadow-neon-emerald';

                  // Calculate midpoints for custom edge weight tags
                  const midX = (fromNode.x + toNode.x) / 2;
                  const midY = (fromNode.y + toNode.y) / 2;

                  return (
                    <g key={edge.id}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        className={`stroke-2 transition-all duration-300 ${strokeCol}`}
                        strokeWidth={isPathEdge ? '3.5' : '2'}
                      />
                      <rect
                        x={midX - 10}
                        y={midY - 10}
                        width="20"
                        height="20"
                        rx="4"
                        className="fill-slate-950 stroke-white/5"
                      />
                      <text
                        x={midX}
                        y={midY + 4}
                        textAnchor="middle"
                        fontSize="9"
                        className="font-mono font-bold fill-indigo-400"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {/* 2. Nodes rendering */}
                {nodes.map((node) => {
                  const isVisited = visitedNodes.includes(node.id);
                  const isPath = finalPathNodes.includes(node.id);
                  const isSelected = selectedNodeId === node.id;

                  let borderCol = 'stroke-white/10 fill-slate-900 text-slate-200';
                  if (isVisited) borderCol = 'stroke-amber-400 fill-amber-500/10 text-amber-300';
                  if (isPath) borderCol = 'stroke-emerald-400 fill-emerald-500/20 text-emerald-300';
                  if (isSelected) borderCol = 'stroke-indigo-400 fill-indigo-500/20 text-indigo-300';

                  // Tentative distance node sub-tags
                  const distVal = distanceMap[node.id];
                  const hasDist = distVal !== undefined && distVal !== Infinity;

                  return (
                    <g
                      key={node.id}
                      className="cursor-grab active:cursor-grabbing select-none"
                      onClick={(e) => handleNodeClick(node.id, e)}
                      onMouseDown={() => handleNodeMouseDown(node.id)}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="18"
                        className={`stroke-2 transition-all duration-300 ${borderCol}`}
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fontSize="11"
                        className="font-mono font-black fill-current"
                      >
                        {node.label}
                      </text>

                      {/* Display minimum distance indicator */}
                      {hasDist && (
                        <g>
                          <rect
                            x={node.x + 10}
                            y={node.y - 25}
                            width="22"
                            height="12"
                            rx="3"
                            className="fill-indigo-600/90 text-[7px]"
                          />
                          <text
                            x={node.x + 21}
                            y={node.y - 17}
                            textAnchor="middle"
                            fontSize="8"
                            className="fill-white font-bold font-mono"
                          >
                            {distVal}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Actions Deck */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
              {/* Tool selector */}
              <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 text-xs text-slate-400">
                <button
                  onClick={() => { setEditorMode('node'); setSelectedNodeId(null); }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    editorMode === 'node' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'hover:text-white'
                  }`}
                >
                  Draw/Drag Node
                </button>
                <button
                  onClick={() => { setEditorMode('edge'); setSelectedNodeId(null); }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    editorMode === 'edge' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'hover:text-white'
                  }`}
                >
                  Link/Edge
                </button>
                <button
                  onClick={() => { setEditorMode('delete'); setSelectedNodeId(null); }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    editorMode === 'delete' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'hover:text-white'
                  }`}
                >
                  Delete Tool
                </button>
              </div>

              {/* Edge Weight select */}
              {editorMode === 'edge' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Weight Input</span>
                  <input
                    type="number"
                    value={edgeWeightInput}
                    onChange={(e) => setEdgeWeightInput(e.target.value)}
                    className="w-16 bg-slate-950 border border-white/10 hover:border-white/20 rounded-xl px-2.5 py-1 text-xs font-bold text-white font-mono text-center outline-none"
                  />
                </div>
              )}

              {/* Run controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={resetAnimationStates}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/5 active:scale-95 transition"
                  title="Clear Visual highlights"
                >
                  <RotateCcw className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={runAlgorithm}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white text-xs font-bold rounded-xl shadow shadow-indigo-500/10 flex items-center gap-1.5"
                >
                  <Play className="h-4 w-4 fill-current" /> <span>Run algorithm</span>
                </button>
                <button
                  onClick={loadDefaultGraph}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95"
                >
                  Default Routing Network
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Companion panel: Custom syntax pseudocode, Quiz & AI Tutor Chat */}
        <div className="flex flex-col gap-6 h-[520px]">
          <LearningAcademy algoName={selectedAlgo} category="graphs" />
        </div>
      </div>
    </div>
  );
};
