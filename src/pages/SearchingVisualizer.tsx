import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LearningAcademy } from '../components/LearningAcademy';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  BookOpen,
  Send,
  HelpCircle
} from 'lucide-react';
import {
  SearchStep,
  generateLinearSearchSteps,
  generateBinarySearchSteps,
  generateJumpSearchSteps,
  generateInterpolationSearchSteps,
  generateExponentialSearchSteps,
  getSortedSearchArray
} from '../utils/searchingAlgorithms';

export const SearchingVisualizer: React.FC = () => {
  const { speed, setSpeed, incrementVisualizations } = useAppStore();

  const algorithms = [
    'Linear Search',
    'Binary Search',
    'Jump Search',
    'Interpolation Search',
    'Exponential Search'
  ];

  const [selectedAlgo, setSelectedAlgo] = useState('Binary Search');
  const [arraySize, setArraySize] = useState(15);
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState(42);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize random values
  const generateRandomArray = (size = arraySize) => {
    setIsPlaying(false);
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
    // Sort array if binary/jump/interpolation/exponential searches require sorting
    const finalArray = selectedAlgo !== 'Linear Search' ? [...newArray].sort((a, b) => a - b) : newArray;
    setArray(finalArray);

    // Pick random target from array with 80% chance, or random out of bound with 20%
    if (Math.random() > 0.2) {
      setTarget(finalArray[Math.floor(Math.random() * finalArray.length)]);
    } else {
      setTarget(99);
    }
    setCurrentStepIdx(0);
  };

  // Compile search steps
  useEffect(() => {
    if (array.length === 0) {
      generateRandomArray();
      return;
    }

    const searchArr = selectedAlgo !== 'Linear Search' ? getSortedSearchArray(array) : array;
    if (JSON.stringify(searchArr) !== JSON.stringify(array)) {
      setArray(searchArr);
      return;
    }

    let generatedSteps: SearchStep[] = [];
    switch (selectedAlgo) {
      case 'Linear Search':
        generatedSteps = generateLinearSearchSteps(array, target);
        break;
      case 'Binary Search':
        generatedSteps = generateBinarySearchSteps(array, target);
        break;
      case 'Jump Search':
        generatedSteps = generateJumpSearchSteps(array, target);
        break;
      case 'Interpolation Search':
        generatedSteps = generateInterpolationSearchSteps(array, target);
        break;
      case 'Exponential Search':
        generatedSteps = generateExponentialSearchSteps(array, target);
        break;
      default:
        generatedSteps = generateBinarySearchSteps(array, target);
    }

    setSteps(generatedSteps);
    setCurrentStepIdx(0);
  }, [array, selectedAlgo, target]);

  // Interval playback
  const getIntervalDuration = () => {
    switch (speed) {
      case 1: return 1200;
      case 2: return 700;
      case 3: return 400; // Normal
      case 4: return 150;
      case 5: return 50;  // Nitro
      default: return 400;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(timerRef.current!);
            incrementVisualizations(selectedAlgo, 'Searching', steps.length * 200);
            return prev;
          }
          return prev + 1;
        });
      }, getIntervalDuration());
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, speed]);

  const activeStep = steps[currentStepIdx] || {
    index: -1,
    low: 0,
    high: array.length - 1,
    visited: [],
    found: false,
    foundIndex: -1,
    log: 'Idle'
  };

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      {/* Top selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">Searching Algorithms Visualizer</h2>
          <p className="text-xs text-slate-400">Animate binary splits, jumps, and linear scans step-by-step.</p>
        </div>
        <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5">
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

      {/* Grid: Layout Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Playback Canvas Area */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6 min-h-[350px]">
            {/* Array HUD panel */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Search Target</span>
                  <p className="text-lg font-black text-indigo-400 font-mono">{target}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inspection Index</span>
                  <p className="text-lg font-black text-white font-mono">
                    {activeStep.index === -1 ? 'None' : activeStep.index}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Step Logs</span>
                  <p className="text-xs font-semibold text-indigo-300 font-mono max-w-sm truncate">{activeStep.log}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-white/5 font-mono text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">Step {currentStepIdx}</span>
                <span className="px-1">/</span>
                <span className="px-1">{steps.length - 1}</span>
              </div>
            </div>

            {/* Simulated Animated Cells container */}
            <div className="flex-1 min-h-[160px] flex flex-wrap items-center justify-center gap-3 p-4 border border-white/5 bg-slate-950/20 rounded-2xl">
              {array.map((value, idx) => {
                const isChecking = activeStep.index === idx;
                const isVisited = activeStep.visited.includes(idx) && !isChecking;
                const isTarget = activeStep.found && activeStep.foundIndex === idx;

                // Bounds detection (for binary boundaries)
                const inBounds =
                  selectedAlgo === 'Linear Search' || (idx >= activeStep.low && idx <= activeStep.high);

                let cellColor = 'bg-slate-900 border-white/5 text-slate-300';
                if (!inBounds) cellColor = 'bg-slate-950 border-white/5 opacity-25 scale-95';
                if (isVisited) cellColor = 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300 scale-95';
                if (isChecking) cellColor = 'bg-amber-500 border-amber-400 text-slate-950 shadow-neon-amber scale-110 font-black';
                if (isTarget) cellColor = 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-neon-emerald scale-110 font-black';

                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center text-xs md:text-sm font-semibold border font-mono transition-all duration-200 relative ${cellColor}`}
                    >
                      {value}
                      
                      {/* Bounding markers tags for high/low/mid pointers in Binary search */}
                      {selectedAlgo === 'Binary Search' && idx === activeStep.low && inBounds && (
                        <span className="absolute -top-6 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5 text-[8px] font-bold uppercase tracking-widest scale-75 select-none">Low</span>
                      )}
                      {selectedAlgo === 'Binary Search' && idx === activeStep.high && inBounds && (
                        <span className="absolute -bottom-6 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5 text-[8px] font-bold uppercase tracking-widest scale-75 select-none">High</span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-600 font-bold">idx {idx}</span>
                  </div>
                );
              })}
            </div>

            {/* Interactive Control Deck */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStepIdx(0); }}
                  disabled={currentStepIdx === 0}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/5 hover:border-white/10 active:scale-95 transition disabled:opacity-40"
                  title="Reset to Start"
                >
                  <RotateCcw className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStepIdx((p) => Math.max(0, p - 1)); }}
                  disabled={currentStepIdx === 0}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/5 hover:border-white/10 active:scale-95 transition disabled:opacity-40"
                >
                  <SkipBack className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-3 rounded-2xl text-white shadow-lg active:scale-95 transition flex items-center gap-1.5 ${
                    isPlaying
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 shadow-neon-indigo'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5 fill-current" />
                      <span className="text-xs font-semibold uppercase tracking-wider px-1">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 fill-current" />
                      <span className="text-xs font-semibold uppercase tracking-wider px-1">Play</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStepIdx((p) => Math.min(steps.length - 1, p + 1)); }}
                  disabled={currentStepIdx === steps.length - 1}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/5 hover:border-white/10 active:scale-95 transition disabled:opacity-40"
                >
                  <SkipForward className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Speed / Size Deck */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Custom target insert */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Search Target</span>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => {
                      const tg = parseInt(e.target.value);
                      if (!isNaN(tg)) setTarget(tg);
                    }}
                    className="w-16 bg-slate-950 border border-white/10 hover:border-white/20 rounded-xl px-2.5 py-1 text-xs font-bold text-white font-mono text-center outline-none"
                  />
                </div>

                {/* Size slider */}
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-400 font-semibold">Size</span>
                  <input
                    type="range"
                    min={8}
                    max={25}
                    value={arraySize}
                    onChange={(e) => {
                      const sz = parseInt(e.target.value);
                      setArraySize(sz);
                      generateRandomArray(sz);
                    }}
                    className="w-24 accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1"
                  />
                  <span className="text-xs font-mono font-bold text-slate-300">{arraySize}</span>
                </div>

                {/* Speed select */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Speed</span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-24 accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1"
                  />
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    {speed === 1 && 'Slow'}
                    {speed === 3 && 'Normal'}
                    {speed === 5 && 'Nitro'}
                  </span>
                </div>

                <button
                  onClick={() => generateRandomArray()}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-500/10 active:scale-95 transition"
                >
                  Generate Array
                </button>
              </div>
            </div>
          </div>

          {/* Theory Panel for Search */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              <h4 className="text-base font-black text-white">Educational Guidelines</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
              <div className="space-y-2">
                <h5 className="font-extrabold text-white">How it works</h5>
                <p className="leading-relaxed">
                  {selectedAlgo === 'Linear Search' && 'Linear search checks every slot sequentially from beginning to end. It does not require sorted data but has slow worst-case scaling O(N).'}
                  {selectedAlgo === 'Binary Search' && 'Binary search checks the middle slot. Since the data is sorted, it halves the search interval at each step, ensuring lightning-fast search scaling in O(log N).'}
                  {selectedAlgo === 'Jump Search' && 'Jump search partitions the list into block grids of size √N. It skips block-by-block and scans linearly within the block, delivering O(√N) speeds.'}
                  {selectedAlgo !== 'Linear Search' && selectedAlgo !== 'Binary Search' && selectedAlgo !== 'Jump Search' && 'Splits nodes based on numerical distributions. Fits perfect for massive uniform datasets.'}
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-extrabold text-white">Prerequisites</h5>
                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl font-mono leading-relaxed text-[11px]">
                  <p>Sorted Data: <span className={selectedAlgo === 'Linear Search' ? 'text-rose-400' : 'text-emerald-400 font-bold'}>{selectedAlgo === 'Linear Search' ? 'No' : 'Required'}</span></p>
                  <p className="mt-1">Worst Complexity: <span className="text-indigo-300">{selectedAlgo === 'Linear Search' ? 'O(N)' : selectedAlgo === 'Jump Search' ? 'O(√N)' : 'O(log N)'}</span></p>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="font-extrabold text-white">Real-world Application</h5>
                <p className="leading-relaxed">
                  {selectedAlgo === 'Linear Search' && 'Database lookups on unsorted key entries, transaction verification streams.'}
                  {selectedAlgo === 'Binary Search' && 'SQL indexing engines, version control commit trace branches (git bisect).'}
                  {selectedAlgo === 'Jump Search' && 'Scanning records on hard drives/SSDs where jumping blocks is highly optimized.'}
                  {selectedAlgo !== 'Linear Search' && selectedAlgo !== 'Binary Search' && selectedAlgo !== 'Jump Search' && 'Uniform keys mapping index tables.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Companion panel: Custom syntax pseudocode, Quiz & AI Tutor Chat */}
        <div className="flex flex-col gap-6 h-[525px]">
          <LearningAcademy algoName={selectedAlgo} category="searching" />
        </div>
      </div>
    </div>
  );
};
