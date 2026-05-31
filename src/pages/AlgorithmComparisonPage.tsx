import React, { useState, useEffect, useRef } from 'react';
import { Play, Columns, Swords } from 'lucide-react';
import {
  SortStep,
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps
} from '../utils/sortingAlgorithms';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const AlgorithmComparisonPage: React.FC = () => {
  const sortingAlgos = [
    'Bubble Sort',
    'Selection Sort',
    'Insertion Sort',
    'Merge Sort',
    'Quick Sort',
    'Heap Sort'
  ];

  // Battle configurations
  const [algo1, setAlgo1] = useState('Bubble Sort');
  const [algo2, setAlgo2] = useState('Merge Sort');
  const [arraySize, setArraySize] = useState(15);
  const [sharedArray, setSharedArray] = useState<number[]>([]);

  // Simulation steps states
  const [steps1, setSteps1] = useState<SortStep[]>([]);
  const [steps2, setSteps2] = useState<SortStep[]>([]);
  const [idx1, setIdx1] = useState(0);
  const [idx2, setIdx2] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getStepsForAlgo = (name: string, arr: number[]): SortStep[] => {
    switch (name) {
      case 'Bubble Sort': return generateBubbleSortSteps(arr);
      case 'Selection Sort': return generateSelectionSortSteps(arr);
      case 'Insertion Sort': return generateInsertionSortSteps(arr);
      case 'Merge Sort': return generateMergeSortSteps(arr);
      case 'Quick Sort': return generateQuickSortSteps(arr);
      case 'Heap Sort': return generateHeapSortSteps(arr);
      default: return generateBubbleSortSteps(arr);
    }
  };

  const generateSharedArray = () => {
    setIsPlaying(false);
    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 75) + 15);
    setSharedArray(newArr);

    // Pre-calculate steps
    setSteps1(getStepsForAlgo(algo1, newArr));
    setSteps2(getStepsForAlgo(algo2, newArr));
    setIdx1(0);
    setIdx2(0);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateSharedArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algo1, algo2, arraySize]);

  // Play both simulations side-by-side
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        let active = false;

        setIdx1((prev) => {
          if (prev < steps1.length - 1) {
            active = true;
            return prev + 1;
          }
          return prev;
        });

        setIdx2((prev) => {
          if (prev < steps2.length - 1) {
            active = true;
            return prev + 1;
          }
          return prev;
        });

        if (!active) {
          setIsPlaying(false);
          clearInterval(timerRef.current!);
        }
      }, 180);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps1, steps2]);

  const handleRunBattle = () => {
    setIdx1(0);
    setIdx2(0);
    setIsPlaying(true);
  };

  // Fetch active steps info
  const step1 = steps1[idx1] || { array: sharedArray, comparisons: 0, swaps: 0 };
  const step2 = steps2[idx2] || { array: sharedArray, comparisons: 0, swaps: 0 };

  const finalMetricsData = [
    { name: 'Comparisons', [algo1]: step1.comparisons, [algo2]: step2.comparisons },
    { name: 'Swaps', [algo1]: step1.swaps, [algo2]: step2.swaps }
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      {/* Top selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Swords className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white">Algorithm Battle Arena</h2>
            <p className="text-xs text-slate-400">Run two sorting algorithms side-by-side using identical arrays, and compare telemetry statistics.</p>
          </div>
        </div>

        {/* Dynamic dual selections selector */}
        <div className="flex items-center gap-3 bg-slate-900/60 p-2 rounded-2xl border border-white/5">
          <select
            value={algo1}
            onChange={(e) => setAlgo1(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-indigo-500"
          >
            {sortingAlgos.map((item) => (
              <option key={item} value={item} disabled={item === algo2}>{item}</option>
            ))}
          </select>
          <span className="text-xs text-rose-400 font-bold">VS</span>
          <select
            value={algo2}
            onChange={(e) => setAlgo2(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-indigo-500"
          >
            {sortingAlgos.map((item) => (
              <option key={item} value={item} disabled={item === algo1}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Battle Workspace panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Algorithm Visualizer Panel */}
        <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col gap-4 relative">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h4 className="text-sm md:text-base font-extrabold text-white">{algo1}</h4>
            <div className="flex gap-4 text-[10px] font-mono text-slate-400">
              <p>Comps: <span className="font-bold text-white">{step1.comparisons}</span></p>
              <p>Swaps: <span className="font-bold text-white">{step1.swaps}</span></p>
            </div>
          </div>
          <div className="h-28 flex items-end justify-center gap-1.5 p-3 bg-slate-950/20 border border-white/5 rounded-2xl">
            {step1.array.map((value, idx) => (
              <div
                key={idx}
                className="bg-indigo-500 rounded-t-sm flex-1 transition-all duration-100"
                style={{ height: `${value * 0.8}px` }}
              />
            ))}
          </div>
        </div>

        {/* Right Algorithm Visualizer Panel */}
        <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col gap-4 relative">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h4 className="text-sm md:text-base font-extrabold text-white">{algo2}</h4>
            <div className="flex gap-4 text-[10px] font-mono text-slate-400">
              <p>Comps: <span className="font-bold text-white">{step2.comparisons}</span></p>
              <p>Swaps: <span className="font-bold text-white">{step2.swaps}</span></p>
            </div>
          </div>
          <div className="h-28 flex items-end justify-center gap-1.5 p-3 bg-slate-950/20 border border-white/5 rounded-2xl">
            {step2.array.map((value, idx) => (
              <div
                key={idx}
                className="bg-rose-500 rounded-t-sm flex-1 transition-all duration-100"
                style={{ height: `${value * 0.8}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Control panel & Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Simulation commands */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6 justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Columns className="h-4.5 w-4.5 text-indigo-400" />
              <span className="text-xs font-bold text-white">Battle Parameters</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Generate identical numerical arrays, click run simulation to observe step-by-step executions, and analyze performance counters.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold">
              <span className="text-slate-400">Array Size</span>
              <input
                type="range"
                min={8}
                max={25}
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="w-24 accent-indigo-500 bg-slate-800 cursor-pointer h-1"
              />
              <span className="font-mono text-slate-300">{arraySize}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={generateSharedArray}
                className="flex-1 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/5 active:scale-95 transition text-xs font-bold"
              >
                Reset Setup
              </button>
              <button
                onClick={handleRunBattle}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white font-bold text-xs rounded-xl shadow shadow-indigo-500/10 flex items-center justify-center gap-1"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> <span>Start Battle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic side-by-side performance bar chart! */}
        <div className="xl:col-span-3 glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between min-h-[260px]">
          <span className="text-xs font-bold text-white border-b border-white/5 pb-2">Simulation Side-by-Side Charts Comparison</span>
          <div className="flex-1 w-full min-h-[190px] mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={finalMetricsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: 11 }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey={algo1} fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey={algo2} fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
