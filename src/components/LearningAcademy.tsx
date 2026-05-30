import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { THEORY_DATA } from '../data/theoryData';
import { ALGO_QUIZZES } from '../data/quizData';
import {
  Terminal,
  HelpCircle,
  Sparkles,
  Send,
  Check,
  Copy,
  AlertCircle,
  CheckCircle,
  HelpCircle as HintIcon,
  ChevronRight,
  Trophy
} from 'lucide-react';

interface LearningAcademyProps {
  algoName: string;
  category: string;
}

export const LearningAcademy: React.FC<LearningAcademyProps> = ({ algoName, category }) => {
  const { completeChallenge } = useAppStore();

  const [activeTab, setActiveTab] = useState<'pseudocode' | 'quiz' | 'tutor'>('pseudocode');
  const [copied, setCopied] = useState(false);

  // Quiz States
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState(0);

  // AI Tutor States
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'tutor'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const theory = THEORY_DATA[algoName];
  const quiz = ALGO_QUIZZES[algoName];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Reset quiz states when algorithm changes
  useEffect(() => {
    setSelectedOpt(null);
    setIsQuizSubmitted(false);
    setShowHint(false);
    setQuizAttempts(0);

    // Initialize chat messages with a tailored greeting
    setChatMessages([
      {
        sender: 'tutor',
        text: `Hi! I am your AI DSA Tutor. Ask me anything about how ${algoName} works, its time and space complexities, edge cases, stability, or how to implement it in your technical interviews!`
      }
    ]);
  }, [algoName]);

  const copyToClipboard = () => {
    if (!theory?.pseudocode) return;
    navigator.clipboard.writeText(theory.pseudocode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine difficulty based on algorithm properties
  const getAlgoDifficulty = (): 'Easy' | 'Medium' | 'Hard' => {
    const easyAlgos = ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Linear Search', 'Stack', 'Queue'];
    const hardAlgos = ['Dijkstra', 'AVL Tree', 'Bellman Ford', 'Prim MST', 'Kruskal MST'];
    
    if (easyAlgos.includes(algoName)) return 'Easy';
    if (hardAlgos.includes(algoName)) return 'Hard';
    return 'Medium';
  };

  const handleQuizSubmit = () => {
    if (selectedOpt === null || !quiz) return;
    
    setIsQuizSubmitted(true);
    setQuizAttempts((a) => a + 1);

    if (selectedOpt === quiz.correctIdx) {
      // Correct! Track challenge completion in Zustand store
      const difficulty = getAlgoDifficulty();
      completeChallenge(algoName, difficulty);
    }
  };

  const handleTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // Generate responsive simulated AI tutor reply tailored to active algorithm characteristics
    setTimeout(() => {
      let reply = '';
      const query = userText.toLowerCase();
      const diff = getAlgoDifficulty();

      if (query.includes('complexity') || query.includes('big o') || query.includes('runtime') || query.includes('slow') || query.includes('fast')) {
        const c = theory?.complexity || { best: 'N/A', average: 'N/A', worst: 'N/A', space: 'N/A' };
        reply = `For ${algoName}, here is the complete Big O complexity breakdown:
• Best-Case Time Complexity: ${c.best}
• Average-Case Time Complexity: ${c.average}
• Worst-Case Time Complexity: ${c.worst}
• Auxiliary Space Complexity: ${c.space}

${algoName} is rated as a ${diff}-level algorithm. Let me know if you would like me to explain why it takes ${c.worst} in the worst case!`;
      } 
      else if (query.includes('stable') || query.includes('stability')) {
        const stableAlgos = ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Counting Sort', 'Radix Sort', 'Linear Search'];
        const isStable = stableAlgos.includes(algoName);
        reply = `Stability determines whether duplicate elements maintain their relative original order after executing the algorithm.
For ${algoName}, it is mathematically ${isStable ? 'STABLE' : 'UNSTABLE'}.
${
  isStable 
    ? 'This is because it only performs operations (swaps/moves) when values strictly break ordering conditions (e.g. strict inequality), keeping duplicates in their original order.' 
    : 'This is because long-range swaps or parent extractions scramble the relative original indices of duplicate values.'
}`;
      } 
      else if (query.includes('code') || query.includes('pseudocode') || query.includes('write') || query.includes('implement')) {
        reply = `To write ${algoName}, check out the "Pseudocode" tab on this very companion panel! It shows a highly clear, clean standard syntax. In real code:
• Make sure to handle boundary guards (e.g. empty inputs or single-element inputs).
• Pay close attention to index increments to avoid array index out of bounds or infinite loops.
Would you like me to walk through the pseudocode logic line-by-line?`;
      } 
      else if (query.includes('interview') || query.includes('question') || query.includes('ask')) {
        reply = `Here are common coding interview questions related to ${algoName}:
1. "Explain the core mechanism and space-time trade-off of ${algoName}."
2. "${algoName === 'Quick Sort' ? 'How does the pivot choice affect performance?' : algoName === 'Merge Sort' ? 'How can you optimize space allocation in Merge Sort?' : 'What are the main edge cases to watch out for?'}"
3. "${algoName === 'Dijkstra' ? 'Why does it fail on negative edge weights?' : 'Can you implement it iteratively and recursively?'}"

Let's discuss one of these! Ask me your thoughts.`;
      } 
      else if (query.includes('pivot') || query.includes('partition')) {
        reply = `Partitioning around a pivot is the core engine of Quick Sort. By choosing a pivot element, the list is divided into elements smaller than the pivot (placed left) and larger elements (placed right).
If pivot selection is poor (e.g., picking the first element in a pre-sorted array), Quick Sort degrades to O(N²). Using a Randomized or Median-of-Three pivot strategy keeps it at a highly optimal O(N log N).`;
      } 
      else if (query.includes('heap') || query.includes('heapify')) {
        reply = `A Binary Heap is a complete binary tree represented as an array in-memory. In Heap Sort or priority queues:
• For any node at index i, its left child is at 2*i + 1, and its right child is at 2*i + 2.
• "Heapify" is the process of comparing a node with its children and swapping down to maintain the heap property (Max Heap or Min Heap). This runs in O(log N) depth.`;
      } 
      else if (query.includes('dijkstra') || query.includes('relax') || query.includes('negative')) {
        reply = `Dijkstra's shortest path algorithm operates greedily. It locks in the shortest path to a node once it is visited.
If there are negative edge weights, a shorter path to a previously visited node could be discovered later. Because Dijkstra never revisits "finalized" nodes, it fails to relax these paths, leading to incorrect path calculations.`;
      } 
      else if (query.includes('tree') || query.includes('balance') || query.includes('rotation') || query.includes('avl')) {
        reply = `In AVL self-balancing trees, balance factors (BF = Height(Left) - Height(Right)) are checked upon insertion or deletion.
• If BF becomes +2 or -2, it indicates a subtree imbalance.
• Rotations (Single Left, Single Right, Left-Right, or Right-Left) are applied to restructure nodes locally, restoring a maximum height deviation of 1 in O(1) time.`;
      } 
      else if (query.includes('recursion') || query.includes('factorial') || query.includes('fibonacci') || query.includes('hanoi')) {
        reply = `Recursion splits problems into smaller subproblems. Key requirements:
1. **Base Case:** Stops the execution stack from building indefinitely.
2. **Recursive Step:** Moves the state closer to the base case.
Without a base case, you will exhaust your system RAM, resulting in a Stack Overflow!`;
      } 
      else if (query.includes('stack') || query.includes('queue') || query.includes('lifo') || query.includes('fifo')) {
        reply = `Stack and Queue are linear data structures with opposing retrieval modes:
• Stack: LIFO (Last In First Out). Nodes are pushed and popped from the same end (the top). Excellent for undo histories and recursive calls.
• Queue: FIFO (First In First Out). Nodes are enqueued at the tail and dequeued from the head. Ideal for task scheduling and breadth-first search.`;
      } 
      else if (query.includes('hash') || query.includes('probing') || query.includes('collision')) {
        reply = `Hash collision occurs when different keys hash to the same table index.
• Linear Probing resolves this by checking sequential slots (i + 1, i + 2...) until an empty slot is located. This can lead to primary clustering.
• Quadratic Probing checks slots in quadratic steps (i + 1², i + 2²...), which spreads keys more uniformly.`;
      } 
      else {
        reply = `Great query! Let's examine ${algoName} more deeply.
The core concept of ${algoName} is ${
          theory?.principle || 'to process data systematically based on structured conditions.'
        }
It is incredibly efficient for ${
          theory?.applications?.[0] || 'solving fundamental operations.'
        }
What specific part of its logic or animation steps would you like to drill into next?`;
      }

      setChatMessages((prev) => [...prev, { sender: 'tutor', text: reply }]);
    }, 800);
  };

  return (
    <div className="glass-panel rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden bg-slate-900/40 backdrop-blur-md">
      {/* Dynamic Tabs Navigation Header */}
      <div className="flex border-b border-white/5 bg-slate-950/60 p-1.5 shrink-0 select-none">
        <button
          onClick={() => setActiveTab('pseudocode')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition duration-200 ${
            activeTab === 'pseudocode'
              ? 'bg-indigo-600/90 text-white shadow shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>Pseudocode</span>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition duration-200 relative ${
            activeTab === 'quiz'
              ? 'bg-indigo-600/90 text-white shadow shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Quiz Arena</span>
          {quiz && !isQuizSubmitted && (
            <span className="absolute top-1 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition duration-200 ${
            activeTab === 'tutor'
              ? 'bg-indigo-600/90 text-white shadow shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Tutor</span>
        </button>
      </div>

      {/* Dynamic Tab Body content panels */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        
        {/* Tab 1: Pseudocode */}
        {activeTab === 'pseudocode' && (
          <div className="flex flex-col h-full gap-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-mono bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/10">
                  {algoName}
                </span>
                <span className="text-slate-500 text-[10px]">•</span>
                <span className={`text-[10px] font-extrabold uppercase ${
                  getAlgoDifficulty() === 'Easy' ? 'text-emerald-400' :
                  getAlgoDifficulty() === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {getAlgoDifficulty()} Difficulty
                </span>
              </div>
              {theory?.pseudocode && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition"
                  title="Copy algorithm pseudocode"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-auto rounded-xl bg-slate-950/70 border border-white/5 p-4 relative min-h-[180px]">
              <pre className="font-mono text-xs leading-relaxed text-indigo-200 select-text whitespace-pre-wrap">
                {theory?.pseudocode || `// No standard pseudocode is defined for ${algoName}.\n// Consult the AI Tutor tab for structural examples!`}
              </pre>
            </div>
            
            <div className="text-[10px] text-slate-500 leading-relaxed font-mono italic shrink-0">
              * Note: Pseudocode outlines logical structures. Syntaxes might differ across C++, Java, and Python compilations.
            </div>
          </div>
        )}

        {/* Tab 2: Quiz Arena */}
        {activeTab === 'quiz' && (
          <div className="flex flex-col h-full justify-between animate-fade-in gap-4">
            {!quiz ? (
              <div className="flex flex-col items-center justify-center text-center py-10 gap-3 h-full">
                <HelpCircle className="h-12 w-12 text-slate-600 animate-pulse" />
                <div>
                  <h5 className="text-sm font-bold text-white">Quiz is under construction</h5>
                  <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
                    No question is mapped for {algoName} yet. Try testing your knowledge on sorting or searching visualizers!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-4">
                  {/* Top header stats */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                      <Trophy className="h-3.5 w-3.5 text-amber-400" /> Quick Quiz
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">
                      Level: {getAlgoDifficulty()}
                    </span>
                  </div>

                  {/* Question */}
                  <h4 className="text-sm font-bold text-white leading-relaxed">
                    {quiz.question}
                  </h4>

                  {/* Options List */}
                  <div className="flex flex-col gap-2.5">
                    {quiz.options.map((option, idx) => {
                      let btnCol = 'border-white/5 bg-slate-950/40 hover:bg-slate-900/50 hover:border-white/10 text-slate-300';
                      
                      if (selectedOpt === idx) {
                        btnCol = 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200 ring-2 ring-indigo-500/20';
                      }

                      if (isQuizSubmitted) {
                        if (idx === quiz.correctIdx) {
                          btnCol = 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-bold';
                        } else if (selectedOpt === idx) {
                          btnCol = 'border-rose-500/40 bg-rose-500/15 text-rose-300 font-semibold';
                        } else {
                          btnCol = 'border-white/5 bg-slate-950/20 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isQuizSubmitted}
                          onClick={() => { setSelectedOpt(idx); setShowHint(false); }}
                          className={`w-full p-3 text-xs text-left rounded-xl border flex items-center justify-between transition duration-200 outline-none ${btnCol}`}
                        >
                          <span className="flex-1 pr-3 leading-relaxed">{option}</span>
                          <span className="shrink-0 flex items-center justify-center h-4.5 w-4.5 rounded-full border border-white/10 text-[9px] font-bold font-mono bg-slate-900 text-slate-500">
                            {String.fromCharCode(65 + idx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Area */}
                  {isQuizSubmitted && (
                    <div className={`p-3.5 rounded-xl border leading-relaxed text-xs animate-slide-up flex flex-col gap-1.5 ${
                      selectedOpt === quiz.correctIdx
                        ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-300'
                        : 'border-rose-500/20 bg-rose-950/20 text-rose-300'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        {selectedOpt === quiz.correctIdx ? (
                          <>
                            <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
                            <span>Correct Answer! Challenges counter +1!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4.5 w-4.5 text-rose-400" />
                            <span>Incorrect. Try studying the explanation!</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-0.5">
                        {quiz.explanation}
                      </p>
                    </div>
                  )}

                  {/* Hint Reveal */}
                  {showHint && !isQuizSubmitted && (
                    <div className="p-3 bg-slate-950/60 border border-white/5 text-amber-300 text-xs rounded-xl flex gap-2 items-start font-mono leading-relaxed animate-fade-in">
                      <HintIcon className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold uppercase text-[10px]">Hint: </span>
                        <span>{quiz.hint}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submitting Buttons */}
                <div className="flex gap-2 shrink-0 select-none">
                  {!isQuizSubmitted ? (
                    <>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="px-3.5 py-2.5 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition duration-200 outline-none"
                      >
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                      </button>
                      <button
                        onClick={handleQuizSubmit}
                        disabled={selectedOpt === null}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-black text-xs text-white uppercase tracking-wider transition active:scale-95 outline-none shadow shadow-indigo-500/10"
                      >
                        Submit Answer
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedOpt(null);
                        setIsQuizSubmitted(false);
                        setShowHint(false);
                      }}
                      className="w-full py-2.5 rounded-xl border border-white/5 text-indigo-300 hover:text-white hover:bg-white/5 text-xs font-black uppercase tracking-wider transition active:scale-95 outline-none"
                    >
                      Try Quiz Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: AI Tutor Chat */}
        {activeTab === 'tutor' && (
          <div className="flex flex-col h-full justify-between animate-fade-in gap-3 min-h-0">
            {/* Scrollable conversation pane */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[140px] max-h-[360px]">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'tutor'
                      ? 'bg-slate-900 text-slate-300 border border-white/5 mr-auto'
                      : 'bg-indigo-600/90 text-white ml-auto shadow shadow-indigo-500/5'
                  }`}
                >
                  <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mb-1 leading-none font-mono">
                    {msg.sender === 'tutor' ? 'AI Tutor' : 'You'}
                  </span>
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Submission */}
            <form onSubmit={handleTutorSubmit} className="p-1 border-t border-white/5 flex gap-1.5 shrink-0 select-none">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about complexity, stability, or interviews..."
                className="flex-1 bg-slate-950 border border-white/5 hover:border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none transition font-sans"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-40 transition text-white rounded-xl shadow shrink-0 outline-none flex items-center justify-center"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
