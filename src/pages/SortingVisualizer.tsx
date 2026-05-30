import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Sparkles,
  BookOpen,
  Send,
  Terminal,
  HelpCircle
} from 'lucide-react';
import {
  SortStep,
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
  generateCountingSortSteps,
  generateRadixSortSteps
} from '../utils/sortingAlgorithms';
import { THEORY_DATA } from '../data/theoryData';
import { LearningAcademy } from '../components/LearningAcademy';

export const SortingVisualizer: React.FC = () => {
  const { speed, setSpeed, incrementVisualizations } = useAppStore();

  const algorithms = [
    'Bubble Sort',
    'Selection Sort',
    'Insertion Sort',
    'Merge Sort',
    'Quick Sort',
    'Heap Sort',
    'Counting Sort',
    'Radix Sort'
  ];

  // 1. Interactive States
  const [selectedAlgo, setSelectedAlgo] = useState('Bubble Sort');
  const [arraySize, setArraySize] = useState(20);
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showLearning, setShowLearning] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 2. Initialize Random Array
  const generateRandomArray = (size = arraySize) => {
    setIsPlaying(false);
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 15);
    setArray(newArray);
    setCurrentStepIdx(0);
    setCustomInput('');
  };

  // Compile steps upon array or algorithm change
  useEffect(() => {
    if (array.length === 0) {
      generateRandomArray();
      return;
    }

    let generatedSteps: SortStep[] = [];
    switch (selectedAlgo) {
      case 'Bubble Sort':
        generatedSteps = generateBubbleSortSteps(array);
        break;
      case 'Selection Sort':
        generatedSteps = generateSelectionSortSteps(array);
        break;
      case 'Insertion Sort':
        generatedSteps = generateInsertionSortSteps(array);
        break;
      case 'Merge Sort':
        generatedSteps = generateMergeSortSteps(array);
        break;
      case 'Quick Sort':
        generatedSteps = generateQuickSortSteps(array);
        break;
      case 'Heap Sort':
        generatedSteps = generateHeapSortSteps(array);
        break;
      case 'Counting Sort':
        generatedSteps = generateCountingSortSteps(array);
        break;
      case 'Radix Sort':
        generatedSteps = generateRadixSortSteps(array);
        break;
      default:
        generatedSteps = generateBubbleSortSteps(array);
    }

    setSteps(generatedSteps);
    setCurrentStepIdx(0);
  }, [array, selectedAlgo]);

  // 3. Playback Management
  const getIntervalDuration = () => {
    // Translate UI speed slider (1 to 5) to milliseconds interval
    switch (speed) {
      case 1: return 800; // Slow
      case 2: return 400;
      case 3: return 150; // Normal
      case 4: return 50;  // Fast
      case 5: return 15;  // Nitro
      default: return 150;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(timerRef.current!);
            incrementVisualizations(selectedAlgo, 'Sorting', steps[steps.length - 1].swaps * 15);
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

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = customInput
      .split(',')
      .map((x) => parseInt(x.trim()))
      .filter((x) => !isNaN(x) && x > 0 && x <= 100);

    if (parsed.length > 3 && parsed.length <= 40) {
      setIsPlaying(false);
      setArray(parsed);
      setArraySize(parsed.length);
      setCurrentStepIdx(0);
    } else {
      alert('Please enter between 4 and 40 integers separated by commas (numbers 1-100).');
    }
  };

  // Get active step metrics
  const activeStep = steps[currentStepIdx] || {
    array: array,
    comparing: [],
    swapping: [],
    sorted: [],
    comparisons: 0,
    swaps: 0,
    log: 'Idle'
  };

  const theory = THEORY_DATA[selectedAlgo] || {
    definition: '',
    principle: '',
    pseudocode: '',
    applications: [],
    advantages: [],
    disadvantages: [],
    complexity: { best: '', average: '', worst: '', space: '' },
    questions: []
  };

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      {/* Category selector row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">Sorting Algorithms Visualizer</h2>
          <p className="text-xs text-slate-400">Animate bar height transformations and analyze performance analytics.</p>
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

      {/* Main Visualizer Board */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Playback Canvas Area */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6 relative min-h-[350px]">
            {/* Array HUD panel */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Comparisons</span>
                  <p className="text-lg font-black text-white font-mono">{activeStep.comparisons}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Swaps</span>
                  <p className="text-lg font-black text-white font-mono">{activeStep.swaps}</p>
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

            {/* Simulated Animated Bars container */}
            <div className="flex-1 min-h-[220px] flex items-end justify-center gap-[4px] md:gap-[6px] px-2 py-4 relative border border-white/5 bg-slate-950/20 rounded-2xl">
              {activeStep.array.map((value, idx) => {
                // Determine bar color states
                const isComparing = activeStep.comparing.includes(idx);
                const isSwapping = activeStep.swapping.includes(idx);
                const isSorted = activeStep.sorted.includes(idx);

                let barColor = 'bg-slate-800 text-slate-400 border border-slate-700/30'; // Normal
                if (isComparing) barColor = 'bg-amber-500 shadow-neon-amber border border-amber-400';
                if (isSwapping) barColor = 'bg-rose-500 shadow-neon-rose border border-rose-400 animate-pulse';
                if (isSorted) barColor = 'bg-emerald-500 shadow-neon-emerald border border-emerald-400/30';

                return (
                  <div key={idx} className="flex flex-col items-center flex-1 max-w-[24px]">
                    {/* Animated height pillar */}
                    <div
                      className={`w-full rounded-t-lg transition-all duration-150 ${barColor}`}
                      style={{ height: `${value * 2}px` }}
                    />
                    {/* Element values under bars for smaller arrays */}
                    {arraySize <= 22 && (
                      <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">{value}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive Control Deck */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
              {/* Play / Step Panel */}
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

              {/* Speed and Size Config */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Size select */}
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-400 font-semibold">Array Size</span>
                  <input
                    type="range"
                    min={8}
                    max={40}
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
                    {speed === 2 && 'Med-Slow'}
                    {speed === 3 && 'Normal'}
                    {speed === 4 && 'Fast'}
                    {speed === 5 && 'Nitro'}
                  </span>
                </div>

                <button
                  onClick={() => generateRandomArray()}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-500/10 active:scale-95 transition"
                >
                  New Random Array
                </button>
              </div>
            </div>
          </div>

          {/* Form input for custom values */}
          <form onSubmit={handleCustomInputSubmit} className="glass-panel rounded-2xl p-4 border border-white/5 flex gap-4 items-center">
            <span className="text-xs text-slate-400 font-bold shrink-0">Custom Values</span>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="E.g. 12, 54, 8, 32, 19, 45"
              className="flex-1 bg-slate-950/60 border border-white/5 hover:border-white/10 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-slate-600 outline-none transition"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-white/10 hover:border-white/20 active:scale-95 transition"
            >
              Parse Array
            </button>
          </form>

          {/* Educational / Learn Modules */}
          {showLearning && (
            <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  <h4 className="text-base font-black text-white">Interactive Theory & Interview Guide</h4>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center text-xs font-mono">
                  <div className="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">Best</p>
                    <p className="text-emerald-400 font-black">{theory.complexity.best}</p>
                  </div>
                  <div className="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">Average</p>
                    <p className="text-indigo-400 font-black">{theory.complexity.average}</p>
                  </div>
                  <div className="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">Worst</p>
                    <p className="text-rose-400 font-black">{theory.complexity.worst}</p>
                  </div>
                  <div className="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">Space</p>
                    <p className="text-amber-400 font-black">{theory.complexity.space}</p>
                  </div>
                </div>
              </div>

              {/* Core Principle Description */}
              <div className="space-y-2">
                <h5 className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Concept Definition</h5>
                <p className="text-sm text-slate-300 leading-relaxed">{theory.definition}</p>
              </div>

              {/* Pro / Cons Matrix table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-2xl flex flex-col gap-2">
                  <h6 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Key Advantages</h6>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    {theory.advantages.map((adv, k) => (
                      <li key={k}>{adv}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose-950/20 border border-rose-500/10 p-4 rounded-2xl flex flex-col gap-2">
                  <h6 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Disadvantages & Gotchas</h6>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    {theory.disadvantages.map((dis, k) => (
                      <li key={k}>{dis}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Practice Questions */}
              <div className="space-y-4">
                <h5 className="text-xs text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="h-4 w-4 text-indigo-400" /> Typical Interview Questions
                </h5>
                <div className="flex flex-col gap-3">
                  {theory.questions.map((q, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col gap-1.5">
                      <p className="text-xs md:text-sm font-bold text-white">Q: {q.question}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">A: {q.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Companion panel: Custom syntax pseudocode, Quiz & AI Tutor Chat */}
        <div className="flex flex-col gap-6 h-[800px]">
          <LearningAcademy algoName={selectedAlgo} category="sorting" />
        </div>
      </div>
    </div>
  );
};
