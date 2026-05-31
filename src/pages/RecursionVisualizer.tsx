import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LearningAcademy } from '../components/LearningAcademy';
import { RotateCcw } from 'lucide-react';

interface HanoiMove {
  fromPeg: number;
  toPeg: number;
  disk: number;
}

export const RecursionVisualizer: React.FC = () => {
  const { incrementVisualizations } = useAppStore();

  const [selectedAlgo, setSelectedAlgo] = useState<'Factorial' | 'Fibonacci' | 'Hanoi'>('Hanoi');

  // Hanoi states
  const [numDisks, setNumDisks] = useState(4);
  const [pegs, setPegs] = useState<number[][]>([[], [], []]);
  const [hanoiMoves, setHanoiMoves] = useState<HanoiMove[]>([]);
  const [activeMoveIdx, setActiveMoveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recLog, setRecLog] = useState('Select an algorithm and click play to begin.');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetRecursion = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (selectedAlgo === 'Hanoi') {
      // Build start peg filled with disks
      const startPeg = Array.from({ length: numDisks }, (_, i) => numDisks - i);
      setPegs([startPeg, [], []]);
      
      // Pre-compile Hanoi moves recursively
      const moves: HanoiMove[] = [];
      const solveHanoi = (n: number, from: number, to: number, aux: number) => {
        if (n === 1) {
          moves.push({ fromPeg: from, toPeg: to, disk: 1 });
          return;
        }
        solveHanoi(n - 1, from, aux, to);
        moves.push({ fromPeg: from, toPeg: to, disk: n });
        solveHanoi(n - 1, aux, to, from);
      };
      solveHanoi(numDisks, 0, 2, 1);
      setHanoiMoves(moves);
      setActiveMoveIdx(0);
      setRecLog(`Compiled ${moves.length} recursive moves for Tower of Hanoi.`);
    } else if (selectedAlgo === 'Factorial') {
      setActiveMoveIdx(0);
      setRecLog('Recursive factorial (n = 5) stack frames compiler ready.');
    } else if (selectedAlgo === 'Fibonacci') {
      setActiveMoveIdx(0);
      setRecLog('Recursive fibonacci (n = 4) call tree compiler ready.');
    }
  };

  // Initialize selected recursion states
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetRecursion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlgo, numDisks]);

  // Play hanoi moves step-by-step
  useEffect(() => {
    if (isPlaying && selectedAlgo === 'Hanoi') {
      timerRef.current = setInterval(() => {
        setActiveMoveIdx((prev) => {
          if (prev >= hanoiMoves.length) {
            setIsPlaying(false);
            clearInterval(timerRef.current!);
            incrementVisualizations('Tower of Hanoi', 'Recursion', hanoiMoves.length * 600);
            return prev;
          }

          const move = hanoiMoves[prev];
          setPegs((prevPegs) => {
            const nextPegs = prevPegs.map((p) => [...p]);
            const disk = nextPegs[move.fromPeg].pop();
            if (disk !== undefined) {
              nextPegs[move.toPeg].push(disk);
            }
            return nextPegs;
          });

          setRecLog(`Recursive Frame: Move Disk ${move.disk} from Peg ${move.fromPeg + 1} to Peg ${move.toPeg + 1}`);
          return prev + 1;
        });
      }, 900);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, hanoiMoves, selectedAlgo, incrementVisualizations]);

  // Factorial stack frames trace helper
  const factorialFrames = [
    { call: 'fact(5)', action: 'Holding: 5 * fact(4)', active: true, value: '?' },
    { call: 'fact(4)', action: 'Holding: 4 * fact(3)', active: true, value: '?' },
    { call: 'fact(3)', action: 'Holding: 3 * fact(2)', active: true, value: '?' },
    { call: 'fact(2)', action: 'Holding: 2 * fact(1)', active: true, value: '?' },
    { call: 'fact(1)', action: 'Base Case reached! Return 1', active: true, value: '1' }
  ];

  const handleNextFactStep = () => {
    setActiveMoveIdx((prev) => Math.min(factorialFrames.length, prev + 1));
    if (activeMoveIdx < factorialFrames.length) {
      setRecLog(`Stack Frame pushed: ${factorialFrames[activeMoveIdx].call}`);
    } else {
      setRecLog('Recursion completed. Bubble up: return values 1 -> 2 -> 6 -> 24 -> 120!');
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      {/* Top selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">Recursion Visualizer Module</h2>
          <p className="text-xs text-slate-400">Animate stack allocations, recursive frame call trees, and classical puzzles.</p>
        </div>
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 shrink-0">
          {['Hanoi', 'Factorial', 'Fibonacci'].map((algo) => (
            <button
              key={algo}
              onClick={() => setSelectedAlgo(algo as 'Hanoi' | 'Factorial' | 'Fibonacci')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedAlgo === algo ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              {algo === 'Hanoi' ? 'Tower of Hanoi' : algo}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Playback Canvas Area */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6 min-h-[380px] justify-between relative overflow-hidden">
            {/* Header HUD info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active puzzle</span>
                  <p className="text-sm font-black text-indigo-400 font-mono">
                    {selectedAlgo === 'Hanoi' && 'Tower of Hanoi Disk Sweep'}
                    {selectedAlgo === 'Factorial' && 'Factorial Call Stack Frames'}
                    {selectedAlgo === 'Fibonacci' && 'Fibonacci Recursion Tree'}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Call Stack status</span>
                  <p className="text-xs font-mono font-semibold text-slate-400">
                    {selectedAlgo === 'Hanoi' ? `Remaining Moves: ${hanoiMoves.length - activeMoveIdx}` : 'Pushed to Call Stack'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 border border-white/5 rounded-xl text-[10px] text-slate-400 font-mono">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                <span>{recLog}</span>
              </div>
            </div>

            {/* Towers of Hanoi Visualization container */}
            {selectedAlgo === 'Hanoi' && (
              <div className="flex-1 min-h-[220px] flex justify-around items-end p-6 border border-white/5 bg-slate-950/20 rounded-2xl relative">
                {/* 3 Pegs layout */}
                {pegs.map((peg, pegIdx) => (
                  <div key={pegIdx} className="relative flex flex-col items-center w-1/4 h-[180px]">
                    {/* The peg pillar shaft */}
                    <div className="absolute bottom-0 w-3.5 h-[160px] bg-slate-800 rounded-t-lg border-x border-slate-700/30" />
                    
                    {/* Peg base */}
                    <div className="absolute bottom-0 w-32 h-3.5 bg-slate-900 border border-white/5 rounded-lg" />
                    
                    {/* Disks stacked on the peg */}
                    <div className="absolute bottom-3.5 flex flex-col-reverse items-center w-full gap-0.5 z-10">
                      {peg.map((diskValue) => {
                        // Calculate width based on disk size value
                        const diskWidth = 30 + diskValue * 22;
                        const colors = [
                          'from-rose-500 to-rose-600 shadow-rose-500/10 border-rose-400/30',
                          'from-indigo-500 to-indigo-600 shadow-indigo-500/10 border-indigo-400/30',
                          'from-emerald-500 to-emerald-600 shadow-emerald-500/10 border-emerald-400/30',
                          'from-amber-500 to-amber-600 shadow-amber-500/10 border-amber-400/30',
                          'from-sky-500 to-sky-600 shadow-sky-500/10 border-sky-400/30'
                        ];
                        const colTheme = colors[diskValue % colors.length];

                        return (
                          <div
                            key={diskValue}
                            className={`h-5 rounded-lg bg-gradient-to-r ${colTheme} border flex items-center justify-center text-[10px] font-black text-white font-mono shadow-md transition-all duration-300`}
                            style={{ width: `${diskWidth}px` }}
                          >
                            {diskValue}
                          </div>
                        );
                      })}
                    </div>
                    {/* Peg label tag */}
                    <span className="absolute -bottom-6 font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">Peg {pegIdx + 1}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Factorial Call Stack frame boxes visualizer */}
            {selectedAlgo === 'Factorial' && (
              <div className="flex-1 min-h-[220px] flex flex-col-reverse items-center justify-center gap-2 p-6 border border-white/5 bg-slate-950/20 rounded-2xl relative">
                {/* Visual Cylinder stack frames block */}
                {factorialFrames.slice(0, activeMoveIdx).map((frame, idx) => (
                  <div
                    key={idx}
                    className="w-64 p-3 bg-gradient-to-r from-indigo-950/80 to-slate-900 rounded-xl border border-indigo-500/20 text-xs font-mono flex items-center justify-between shadow shadow-indigo-500/5 animate-slide-up"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">FRAME {idx + 1}</span>
                      <span className="text-white font-bold">{frame.call}</span>
                    </div>
                    <span className="text-slate-400 font-semibold">{frame.action}</span>
                  </div>
                ))}
                {activeMoveIdx === 0 && (
                  <p className="text-xs text-slate-500 py-10 font-mono">Click Step Forward to push recursive factorial(5) calls.</p>
                )}
              </div>
            )}

            {/* Fibonacci Call tree diagram visualizer */}
            {selectedAlgo === 'Fibonacci' && (
              <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center p-6 border border-white/5 bg-slate-950/20 rounded-2xl relative">
                {/* SVG mock Fibonacci recursion tree diagram */}
                <svg width="400" height="200" className="max-w-full">
                  <line x1="200" y1="30" x2="120" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <line x1="200" y1="30" x2="280" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <line x1="120" y1="90" x2="70" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <line x1="120" y1="90" x2="170" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

                  {/* Root */}
                  <circle cx="200" cy="30" r="16" className="stroke-2 stroke-indigo-500 fill-indigo-500/10" />
                  <text x="200" y="34" textAnchor="middle" fontSize="10" className="font-mono font-black fill-indigo-200">f(4)</text>

                  {/* Left subtree */}
                  <circle cx="120" cy="90" r="16" className="stroke-2 stroke-indigo-500 fill-indigo-500/10" />
                  <text x="120" y="94" textAnchor="middle" fontSize="10" className="font-mono font-black fill-indigo-200">f(3)</text>

                  {/* Right subtree */}
                  <circle cx="280" cy="90" r="16" className="stroke-2 stroke-slate-800 fill-slate-900" />
                  <text x="280" y="94" textAnchor="middle" fontSize="10" className="font-mono font-bold fill-slate-500">f(2)</text>

                  <circle cx="70" cy="150" r="16" className="stroke-2 stroke-slate-800 fill-slate-900" />
                  <text x="70" y="154" textAnchor="middle" fontSize="10" className="font-mono font-bold fill-slate-500">f(2)</text>

                  <circle cx="170" cy="150" r="16" className="stroke-2 stroke-slate-800 fill-slate-900" />
                  <text x="170" y="154" textAnchor="middle" fontSize="10" className="font-mono font-bold fill-slate-500">f(1)</text>
                </svg>
              </div>
            )}

            {/* Controls Deck */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={resetRecursion}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/5 active:scale-95 transition"
                >
                  <RotateCcw className="h-4.5 w-4.5" />
                </button>
                {selectedAlgo === 'Hanoi' ? (
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow active:scale-95 transition flex items-center gap-1.5 ${
                      isPlaying ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/15' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/15 shadow-neon-indigo'
                    }`}
                  >
                    {isPlaying ? 'Pause recursion' : 'Animate Hanoi'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextFactStep}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white font-bold text-xs rounded-xl shadow shadow-indigo-500/10"
                  >
                    Step stack frame
                  </button>
                )}
              </div>

              {/* Hanoi disk count config */}
              {selectedAlgo === 'Hanoi' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Hanoi Disks Count</span>
                  <input
                    type="range"
                    min={3}
                    max={5}
                    value={numDisks}
                    onChange={(e) => setNumDisks(parseInt(e.target.value))}
                    className="accent-indigo-500 cursor-pointer h-1"
                  />
                  <span className="text-xs font-mono font-bold text-slate-300">{numDisks}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Companion panel: Custom syntax pseudocode, Quiz & AI Tutor Chat */}
        <div className="flex flex-col gap-6 h-[440px]">
          <LearningAcademy algoName={selectedAlgo === 'Hanoi' ? 'Tower of Hanoi' : selectedAlgo} category="recursion" />
        </div>
      </div>
    </div>
  );
};
