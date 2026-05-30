import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Trash2, RotateCcw, Database, ArrowRight, LayoutGrid, ChevronsRight } from 'lucide-react';
import { LearningAcademy } from '../components/LearningAcademy';

export const DataStructuresVisualizer: React.FC = () => {
  const { incrementVisualizations } = useAppStore();

  const [activeTab, setActiveTab] = useState<'stack' | 'linkedlist' | 'hash' | 'heap'>('stack');
  const [stackSubTab, setStackSubTab] = useState<'Stack' | 'Queue'>('Stack');

  const getAlgoName = (): string => {
    if (activeTab === 'stack') return stackSubTab;
    if (activeTab === 'linkedlist') return 'Linked List';
    if (activeTab === 'hash') return 'Hash Probing';
    if (activeTab === 'heap') return 'Heap';
    return 'Stack';
  };
  
  // Custom states
  const [inputVal, setInputValue] = useState('34');

  // 1. Stack & Queue states
  const [stack, setStack] = useState<number[]>([42, 19, 8, 73]);
  const [queue, setQueue] = useState<number[]>([5, 88, 12, 47]);
  const [hudMessage, setHudMessage] = useState('Workspace loaded.');

  // 2. Linked List states
  const [list, setList] = useState<number[]>([10, 20, 30, 40]);

  // 3. Hash Table states
  const [hashTable, setHashTable] = useState<(number | null)[]>(Array(8).fill(null));
  const [collisionLog, setCollisionLog] = useState('Insert elements to trigger hashing formulas.');

  // 4. Heap Max Heap states
  const [heap, setHeap] = useState<number[]>([90, 80, 70, 40, 50, 30, 10]);

  const handlePush = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputVal);
    if (isNaN(val)) return;

    if (activeTab === 'stack') {
      setStackSubTab('Stack');
      setStack((prev) => [...prev, val]);
      setHudMessage(`Pushed element ${val} to top of the stack.`);
      incrementVisualizations('Stack Push', 'Structures', 300);
    } else if (activeTab === 'linkedlist') {
      setList((prev) => [...prev, val]);
      setHudMessage(`Inserted node ${val} at the end of the Linked List.`);
    } else if (activeTab === 'hash') {
      const idx = val % 8;
      setHashTable((prev) => {
        const nextTable = [...prev];
        if (nextTable[idx] === null) {
          nextTable[idx] = val;
          setCollisionLog(`Hashed ${val} -> Hash index (${val} % 8) = ${idx}. Slot was empty!`);
        } else {
          // Linear probing
          let probed = false;
          for (let i = 1; i < 8; i++) {
            const probeIdx = (idx + i) % 8;
            if (nextTable[probeIdx] === null) {
              nextTable[probeIdx] = val;
              setCollisionLog(`Collision at index ${idx}! Linear probing skipped to slot ${probeIdx}.`);
              probed = true;
              break;
            }
          }
          if (!probed) setCollisionLog('Hash table completely full! Clear buckets.');
        }
        return nextTable;
      });
      incrementVisualizations('Hash Insertion', 'Structures', 400);
    } else if (activeTab === 'heap') {
      // Basic insert and max heapify sorting mock
      const nextHeap = [...heap, val].sort((a, b) => b - a);
      setHeap(nextHeap);
      setHudMessage(`Inserted ${val} and triggered Heapify Up sequence to balance binary trees.`);
    }
    setInputValue('');
  };

  const handlePop = () => {
    if (activeTab === 'stack') {
      setStackSubTab('Stack');
      if (stack.length === 0) return;
      const popped = stack[stack.length - 1];
      setStack((prev) => prev.slice(0, -1));
      setHudMessage(`Popped element ${popped} from top of the stack.`);
      incrementVisualizations('Stack Pop', 'Structures', 300);
    } else if (activeTab === 'linkedlist') {
      if (list.length === 0) return;
      const popped = list[list.length - 1];
      setList((prev) => prev.slice(0, -1));
      setHudMessage(`Deleted tail node ${popped}.`);
    } else if (activeTab === 'heap') {
      if (heap.length === 0) return;
      const rootVal = heap[0];
      setHeap((prev) => prev.slice(1));
      setHudMessage(`Extracted max element root ${rootVal} and re-balanced Max Heap.`);
    }
  };

  // Queue Operations
  const handleEnqueue = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    setStackSubTab('Queue');
    setQueue((prev) => [...prev, val]);
    setHudMessage(`Enqueued element ${val} at the tail of the Queue.`);
    setInputValue('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) return;
    setStackSubTab('Queue');
    const dequeued = queue[0];
    setQueue((prev) => prev.slice(1));
    setHudMessage(`Dequeued head element ${dequeued} from the Queue.`);
  };

  const handleReverseList = () => {
    setList((prev) => [...prev].reverse());
    setHudMessage('Reversed the Linked List nodes order pointers.');
  };

  const handleClearTable = () => {
    setHashTable(Array(8).fill(null));
    setCollisionLog('Cleared Hash Table buckets.');
  };

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      {/* Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">Interactive Structures Workbench</h2>
          <p className="text-xs text-slate-400">Play with stack cylinders, queue tubes, pointer maps, and hash tables.</p>
        </div>
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'stack' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Stack & Queue
          </button>
          <button
            onClick={() => setActiveTab('linkedlist')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'linkedlist' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Linked List
          </button>
          <button
            onClick={() => setActiveTab('hash')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hash' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hash Table
          </button>
          <button
            onClick={() => setActiveTab('heap')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'heap' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Binary Heap
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6 min-h-[380px] justify-between relative overflow-hidden">
            {/* HUD Status info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Model</span>
                  <p className="text-sm font-black text-indigo-400 font-mono capitalize">{activeTab}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 border border-white/5 rounded-xl text-[10px] text-indigo-300 font-mono">
                <span>{hudMessage}</span>
              </div>
            </div>

            {/* Render selected data structures */}
            <div className="flex-1 min-h-[260px] border border-white/5 bg-slate-950/20 rounded-2xl flex items-center justify-center p-6">
              
              {/* Stack & Queue */}
              {activeTab === 'stack' && (
                <div className="w-full flex flex-col md:flex-row justify-around gap-12 py-4">
                  {/* Vertical Cylinder Stack container */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stack (LIFO)</span>
                    <div className="w-32 h-[180px] border-x-2 border-b-2 border-dashed border-indigo-500/40 rounded-b-2xl p-3 flex flex-col-reverse justify-start gap-1.5 bg-indigo-950/5 relative">
                      {stack.map((v, k) => (
                        <div key={k} className="h-8 bg-indigo-600/90 text-white rounded-lg flex items-center justify-center font-mono font-bold text-xs shadow border border-indigo-400/30 animate-slide-down">
                          {v}
                        </div>
                      ))}
                      {stack.length === 0 && <span className="text-[10px] text-slate-600 font-mono text-center self-center py-12">Empty Stack</span>}
                    </div>
                  </div>

                  {/* Horizontal sliding queue deck */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Queue (FIFO)</span>
                    <div className="h-16 w-[280px] border-y-2 border-dashed border-emerald-500/40 p-2 flex items-center justify-start gap-2 bg-emerald-950/5 relative rounded-lg">
                      {/* Queue entry arrow */}
                      <span className="absolute -left-6 text-emerald-500"><ChevronsRight className="h-5 w-5" /></span>
                      {queue.map((v, k) => (
                        <div key={k} className="h-10 w-10 bg-emerald-600/90 text-white rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow border border-emerald-400/30 shrink-0">
                          {v}
                        </div>
                      ))}
                      {queue.length === 0 && <span className="text-[10px] text-slate-600 font-mono text-center w-full">Empty Queue</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Linked Lists */}
              {activeTab === 'linkedlist' && (
                <div className="flex flex-wrap items-center justify-center gap-4 py-4 w-full">
                  {list.map((v, k) => (
                    <React.Fragment key={k}>
                      <div className="h-12 w-20 p-2 bg-slate-900 border border-indigo-500/20 text-white rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow relative">
                        <div className="flex items-center justify-between w-full h-full">
                          <span className="flex-1 text-center">{v}</span>
                          <div className="h-full w-px bg-white/5 mx-1" />
                          <span className="text-[8px] text-indigo-400 font-bold tracking-tighter">next</span>
                        </div>
                      </div>
                      {k < list.length - 1 && (
                        <span className="text-indigo-400"><ArrowRight className="h-5 w-5 animate-pulse" /></span>
                      )}
                    </React.Fragment>
                  ))}
                  {list.length === 0 && <span className="text-xs text-slate-500 py-10 font-mono">Linked List empty. Insert element.</span>}
                </div>
              )}

              {/* Hash Tables */}
              {activeTab === 'hash' && (
                <div className="w-full max-w-lg flex flex-col gap-4">
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {hashTable.map((v, k) => (
                      <div key={k} className="flex flex-col items-center gap-1.5">
                        <div className={`h-16 w-16 rounded-xl flex flex-col items-center justify-center font-mono text-xs border transition-all ${
                          v !== null ? 'bg-indigo-600/90 border-indigo-400/40 text-white font-bold' : 'bg-slate-900 border-white/5 text-slate-600'
                        }`}>
                          <span className="text-[9px] text-indigo-300 font-bold uppercase leading-none mb-1 select-none">Slot {k}</span>
                          <span>{v !== null ? v : 'nil'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-center text-xs font-mono text-indigo-300 select-text">
                    {collisionLog}
                  </div>
                </div>
              )}

              {/* Heap */}
              {activeTab === 'heap' && (
                <div className="w-full flex flex-col items-center gap-6">
                  {/* Array Index view representation */}
                  <div className="flex gap-1.5 overflow-x-auto max-w-md p-2 bg-slate-900/60 rounded-xl border border-white/5">
                    {heap.map((v, k) => (
                      <div key={k} className="flex flex-col items-center gap-1">
                        <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-indigo-300 shrink-0">
                          {v}
                        </div>
                        <span className="text-[8px] text-slate-600 font-bold font-mono">idx {k}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mock representation nodes */}
                  <div className="text-[10px] text-slate-400 font-mono text-center">
                    Represented as a visual Binary Heap: Root contains max element {heap[0] || 'nil'}. Left child index is 2*i+1, right is 2*i+2.
                  </div>
                </div>
              )}

            </div>

            {/* Quick Actions Deck */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
              {/* Insert element form */}
              <form onSubmit={handlePush} className="flex items-center gap-2">
                <input
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-16 bg-slate-950 border border-white/10 hover:border-white/20 rounded-xl px-2 py-1.5 text-xs text-white font-mono text-center outline-none focus:border-indigo-500 transition"
                  placeholder="Val"
                />
                
                {/* Dynamically adjust labels tailored to tabs */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white text-xs font-bold rounded-xl shadow shadow-indigo-500/10 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> <span>{activeTab === 'stack' ? 'Push Stack' : activeTab === 'linkedlist' ? 'List Insert' : activeTab === 'hash' ? 'Hash Add' : 'Heap Add'}</span>
                </button>

                {activeTab === 'stack' && (
                  <button
                    type="button"
                    onClick={handleEnqueue}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition text-white text-xs font-bold rounded-xl shadow shadow-emerald-500/10"
                  >
                    Enqueue
                  </button>
                )}

                {activeTab === 'linkedlist' && (
                  <button
                    type="button"
                    onClick={handleReverseList}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 rounded-xl border border-white/5"
                  >
                    Reverse List
                  </button>
                )}

                {activeTab === 'hash' && (
                  <button
                    type="button"
                    onClick={handleClearTable}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-rose-400 rounded-xl border border-white/5 flex items-center gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> <span>Clear Table</span>
                  </button>
                )}
              </form>

              {/* Extraction buttons */}
              {(activeTab === 'stack' || activeTab === 'linkedlist' || activeTab === 'heap') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePop}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-rose-400 text-xs font-bold rounded-xl border border-white/5 flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" /> <span>{activeTab === 'stack' ? 'Pop Stack' : activeTab === 'linkedlist' ? 'Delete Tail' : 'Extract Max'}</span>
                  </button>
                  {activeTab === 'stack' && (
                    <button
                      onClick={handleDequeue}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-rose-400 text-xs font-bold rounded-xl border border-white/5"
                    >
                      Dequeue
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Companion panel: Custom syntax pseudocode, Quiz & AI Tutor Chat */}
        <div className="flex flex-col gap-6 h-[440px]">
          <LearningAcademy algoName={getAlgoName()} category="datastructures" />
        </div>
      </div>
    </div>
  );
};
