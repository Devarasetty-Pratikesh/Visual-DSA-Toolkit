import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LearningAcademy } from '../components/LearningAcademy';
import {
  RotateCcw,
  Plus,
  Trash2,
  Search,
  TrendingDown
} from 'lucide-react';

interface TreeNode {
  value: number;
  height: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

export const TreeVisualizer: React.FC = () => {
  const { incrementVisualizations } = useAppStore();

  const [treeType, setTreeType] = useState<'BST' | 'AVL'>('BST');
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState<string>('15');
  const [activeTraversingNodes, setActiveTraversingNodes] = useState<number[]>([]);
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const [searchingNode, setSearchingNode] = useState<number | null>(null);
  const [searchFound, setSearchFound] = useState<boolean | null>(null);
  const [rotationLog, setRotationLog] = useState<string>('Ready for tree operations.');

  // Height helper
  const getHeight = (node: TreeNode | null): number => {
    return node ? node.height : 0;
  };

  const getBalance = (node: TreeNode | null): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  const rightRotate = (y: TreeNode): TreeNode => {
    const x = y.left!;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

    setRotationLog(`Applying Right Rotation around node ${y.value} to restore balance.`);
    return x;
  };

  const leftRotate = (x: TreeNode): TreeNode => {
    const y = x.right!;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;

    setRotationLog(`Applying Left Rotation around node ${x.value} to restore balance.`);
    return y;
  };

  // BST & AVL insertion
  const insertNode = (node: TreeNode | null, val: number): TreeNode => {
    if (!node) {
      return { value: val, height: 1, left: null, right: null };
    }

    if (val < node.value) {
      node.left = insertNode(node.left, val);
    } else if (val > node.value) {
      node.right = insertNode(node.right, val);
    } else {
      return node; // Duplicate keys not allowed
    }

    // Update height
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));

    if (treeType === 'AVL') {
      const balance = getBalance(node);

      // LL Case
      if (balance > 1 && val < node.left!.value) {
        return rightRotate(node);
      }
      // RR Case
      if (balance < -1 && val > node.right!.value) {
        return leftRotate(node);
      }
      // LR Case
      if (balance > 1 && val > node.left!.value) {
        node.left = leftRotate(node.left!);
        return rightRotate(node);
      }
      // RL Case
      if (balance < -1 && val < node.right!.value) {
        node.right = rightRotate(node.right!);
        return leftRotate(node);
      }
    }

    return node;
  };

  const resetToDefaultTree = () => {
    setRoot(null);
    setActiveTraversingNodes([]);
    setTraversalPath([]);
    setSearchingNode(null);
    setSearchFound(null);
    
    // Add default values to build a nice initial BST/AVL
    const defaults = treeType === 'BST' ? [15, 8, 24, 4, 11, 20, 30] : [20, 10, 30, 5, 15, 25, 35];
    let tempRoot: TreeNode | null = null;
    defaults.forEach((val) => {
      tempRoot = insertNode(tempRoot, val);
    });
    setRoot(tempRoot);
    setRotationLog(`Initialized default ${treeType} Tree.`);
  };

  // Pre-load default balanced elements for stellar first-look impression
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetToDefaultTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeType]);


  // BST deletion helper
  const minValueNode = (node: TreeNode): TreeNode => {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  };

  const deleteNode = (node: TreeNode | null, val: number): TreeNode | null => {
    if (!node) return null;

    if (val < node.value) {
      node.left = deleteNode(node.left, val);
    } else if (val > node.value) {
      node.right = deleteNode(node.right, val);
    } else {
      // Node with only one child or no child
      if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      }

      // Node with two children: Get inorder successor
      const temp = minValueNode(node.right);
      node.value = temp.value;
      node.right = deleteNode(node.right, temp.value);
    }

    // Update height
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));

    if (treeType === 'AVL') {
      const balance = getBalance(node);

      // LL Case
      if (balance > 1 && getBalance(node.left) >= 0) {
        return rightRotate(node);
      }
      // LR Case
      if (balance > 1 && getBalance(node.left) < 0) {
        node.left = leftRotate(node.left!);
        return rightRotate(node);
      }
      // RR Case
      if (balance < -1 && getBalance(node.right) <= 0) {
        return leftRotate(node);
      }
      // RL Case
      if (balance < -1 && getBalance(node.right) > 0) {
        node.right = rightRotate(node.right!);
        return leftRotate(node);
      }
    }

    return node;
  };

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputValue.trim());
    if (isNaN(val)) return;

    setRoot((prev) => insertNode(prev, val));
    setRotationLog(`Inserted element ${val} successfully.`);
    setInputValue('');
  };

  const handleDelete = () => {
    const val = parseInt(inputValue.trim());
    if (isNaN(val)) return;

    setRoot((prev) => deleteNode(prev, val));
    setRotationLog(`Deleted element ${val} (if existed) and balanced trees.`);
    setInputValue('');
  };

  const handleSearch = () => {
    const val = parseInt(inputValue.trim());
    if (isNaN(val)) return;

    setSearchingNode(val);
    setSearchFound(null);

    const searchPath: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) {
        setSearchFound(false);
        return;
      }
      searchPath.push(node.value);
      if (node.value === val) {
        setSearchFound(true);
        return;
      }
      if (val < node.value) {
        traverse(node.left);
      } else {
        traverse(node.right);
      }
    };
    traverse(root);

    // Animate glowing lookup path
    let step = 0;
    const interval = setInterval(() => {
      if (step < searchPath.length) {
        setActiveTraversingNodes((prev) => [...prev, searchPath[step]]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 400);
  };

  // Traversals recursive generators
  const triggerTraversal = (type: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => {
    const path: number[] = [];
    setActiveTraversingNodes([]);
    setTraversalPath([]);

    if (type === 'inorder') {
      const traverse = (node: TreeNode | null) => {
        if (!node) return;
        traverse(node.left);
        path.push(node.value);
        traverse(node.right);
      };
      traverse(root);
    } else if (type === 'preorder') {
      const traverse = (node: TreeNode | null) => {
        if (!node) return;
        path.push(node.value);
        traverse(node.left);
        traverse(node.right);
      };
      traverse(root);
    } else if (type === 'postorder') {
      const traverse = (node: TreeNode | null) => {
        if (!node) return;
        traverse(node.left);
        traverse(node.right);
        path.push(node.value);
      };
      traverse(root);
    } else if (type === 'levelorder') {
      const queue: TreeNode[] = [];
      if (root) queue.push(root);
      while (queue.length > 0) {
        const node = queue.shift()!;
        path.push(node.value);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
    }

    // Animate the path visitation list
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < path.length) {
        setActiveTraversingNodes([path[idx]]);
        setTraversalPath((prev) => [...prev, path[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setActiveTraversingNodes([]);
        incrementVisualizations(`${treeType} Traversal`, 'Trees', path.length * 300);
      }
    }, 500);
  };

  // 3. Layout calculations for SVG rendering
  // Computes precise geometry coordinates recursively for clean tree shapes
  const buildLayout = (node: TreeNode | null, x: number, y: number, hSpacing: number): TreeNode | null => {
    if (!node) return null;
    return {
      ...node,
      x,
      y,
      left: buildLayout(node.left, x - hSpacing, y + 60, hSpacing * 0.5),
      right: buildLayout(node.right, x + hSpacing, y + 60, hSpacing * 0.5)
    };
  };

  const layoutRoot = buildLayout(root, 300, 40, 140);

  // SVG connector lines recursive renderer
  const renderLinks = (node: TreeNode | null): React.ReactNode => {
    if (!node) return null;
    const links: React.ReactNode[] = [];

    if (node.left && node.x !== undefined && node.left.x !== undefined) {
      links.push(
        <line
          key={`link-l-${node.value}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2.5"
          className="transition-all duration-300"
        />
      );
      links.push(renderLinks(node.left));
    }

    if (node.right && node.x !== undefined && node.right.x !== undefined) {
      links.push(
        <line
          key={`link-r-${node.value}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2.5"
          className="transition-all duration-300"
        />
      );
      links.push(renderLinks(node.right));
    }

    return <g>{links}</g>;
  };

  // SVG node circles recursive renderer
  const renderNodes = (node: TreeNode | null): React.ReactNode => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    const isTraversing = activeTraversingNodes.includes(node.value);
    const isSearchTarget = searchingNode === node.value;

    let borderCol = 'stroke-indigo-500/50 fill-[#0f172a] text-slate-100';
    if (isTraversing) borderCol = 'stroke-amber-400 fill-amber-500/20 text-amber-300 shadow-neon-amber';
    if (isSearchTarget) borderCol = searchFound ? 'stroke-emerald-400 fill-emerald-500/20 text-emerald-300' : 'stroke-rose-400 fill-rose-500/20 text-rose-300';

    return (
      <g key={`node-${node.value}`} className="transition-all duration-300 cursor-pointer">
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
          fontSize="10"
          className="font-mono font-black fill-current"
        >
          {node.value}
        </text>
        {renderNodes(node.left)}
        {renderNodes(node.right)}
      </g>
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      {/* Top selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">Tree Visualizer Module</h2>
          <p className="text-xs text-slate-400">Insert, search, and delete nodes. Animate BST traversals and automated AVL rotations.</p>
        </div>
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 shrink-0">
          <button
            onClick={() => setTreeType('BST')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              treeType === 'BST' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Binary Search Tree (BST)
          </button>
          <button
            onClick={() => setTreeType('AVL')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              treeType === 'AVL' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Self-Balancing AVL Tree
          </button>
        </div>
      </div>

      {/* Main Grid panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Render Canvas */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6 min-h-[380px] justify-between relative overflow-hidden">
            {/* Tree details HUD */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Model</span>
                  <p className="text-sm font-black text-indigo-400 font-mono">
                    {treeType === 'BST' ? 'Standard BST Tree' : 'Balanced AVL Tree'}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Balancing Mode</span>
                  <p className="text-xs font-mono font-semibold text-slate-400">
                    {treeType === 'BST' ? 'Manual adjustments' : 'Auto height-rotation splits'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-950/80 border border-white/5 rounded-xl font-mono text-[10px] text-slate-400">
                <TrendingDown className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="truncate max-w-xs">{rotationLog}</span>
              </div>
            </div>

            {/* SVG Render Workspace */}
            <div className="flex-1 min-h-[300px] border border-white/5 bg-slate-950/20 rounded-2xl flex items-center justify-center overflow-auto px-4">
              <svg width="600" height="340" className="max-w-full">
                {/* 1. Connections */}
                {renderLinks(layoutRoot)}
                {/* 2. Nodes circles */}
                {renderNodes(layoutRoot)}
              </svg>
            </div>

            {/* Quick Actions Deck */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
              {/* Insert / Search form block */}
              <form onSubmit={handleInsert} className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-16 bg-slate-950 border border-white/10 hover:border-white/20 rounded-xl px-2 py-1.5 text-xs text-white font-mono text-center outline-none focus:border-indigo-500 transition"
                  placeholder="Val"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white text-xs font-semibold rounded-xl shadow shadow-indigo-500/10 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> <span>Insert</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-rose-400 text-xs font-semibold rounded-xl border border-white/5 flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-white text-xs font-semibold rounded-xl border border-white/5 flex items-center gap-1"
                >
                  <Search className="h-3.5 w-3.5" /> <span>Search</span>
                </button>
              </form>

              {/* Traversal flows */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 font-bold shrink-0">Traversals</span>
                <button
                  onClick={() => triggerTraversal('inorder')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 active:scale-95 rounded-xl text-xs text-slate-300 font-bold transition"
                >
                  Inorder
                </button>
                <button
                  onClick={() => triggerTraversal('preorder')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 active:scale-95 rounded-xl text-xs text-slate-300 font-bold transition"
                >
                  Preorder
                </button>
                <button
                  onClick={() => triggerTraversal('postorder')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 active:scale-95 rounded-xl text-xs text-slate-300 font-bold transition"
                >
                  Postorder
                </button>
                <button
                  onClick={() => triggerTraversal('levelorder')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 active:scale-95 rounded-xl text-xs text-slate-300 font-bold transition"
                >
                  Level Order
                </button>
                <button
                  onClick={resetToDefaultTree}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-400 hover:text-white border border-white/5"
                  title="Reset to default tree"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Traversal printed values bar */}
          {traversalPath.length > 0 && (
            <div className="glass-panel rounded-2xl p-4 border border-white/5 flex gap-4 items-center">
              <span className="text-xs text-indigo-300 font-bold tracking-wider shrink-0 uppercase">Traversal Output</span>
              <div className="flex-1 flex gap-2 overflow-x-auto py-1">
                {traversalPath.map((v, k) => (
                  <div key={k} className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs font-mono font-bold rounded-lg flex items-center justify-center shrink-0">
                    {v}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Companion panel: Custom syntax pseudocode, Quiz & AI Tutor Chat */}
        <div className="flex flex-col gap-6 h-[520px]">
          <LearningAcademy algoName={treeType === 'AVL' ? 'AVL Tree' : 'BST'} category="trees" />
        </div>
      </div>
    </div>
  );
};
