import React, { useState } from 'react';
import { Clock, Search } from 'lucide-react';

export const ComplexityAnalyzerPage: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const complexityLibrary = [
    { name: 'Bubble Sort', category: 'Sorting', best: 'O(N)', average: 'O(N²)', worst: 'O(N²)', space: 'O(1)', stable: 'Yes' },
    { name: 'Selection Sort', category: 'Sorting', best: 'O(N²)', average: 'O(N²)', worst: 'O(N²)', space: 'O(1)', stable: 'No' },
    { name: 'Insertion Sort', category: 'Sorting', best: 'O(N)', average: 'O(N²)', worst: 'O(N²)', space: 'O(1)', stable: 'Yes' },
    { name: 'Merge Sort', category: 'Sorting', best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N log N)', space: 'O(N)', stable: 'Yes' },
    { name: 'Quick Sort', category: 'Sorting', best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N²)', space: 'O(log N)', stable: 'No' },
    { name: 'Heap Sort', category: 'Sorting', best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N log N)', space: 'O(1)', stable: 'No' },
    { name: 'Linear Search', category: 'Searching', best: 'O(1)', average: 'O(N)', worst: 'O(N)', space: 'O(1)', stable: 'N/A' },
    { name: 'Binary Search', category: 'Searching', best: 'O(1)', average: 'O(log N)', worst: 'O(log N)', space: 'O(1)', stable: 'N/A' },
    { name: 'Dijkstra', category: 'Graphs', best: 'O(E + V log V)', average: 'O(E + V log V)', worst: 'O(V²)', space: 'O(V)', stable: 'N/A' },
    { name: 'AVL Tree search', category: 'Trees', best: 'O(log N)', average: 'O(log N)', worst: 'O(log N)', space: 'O(N)', stable: 'N/A' }
  ];

  const filtered = complexityLibrary.filter((item) =>
    item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col gap-6 select-none">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white">Complexity Analyzer Library</h2>
        <p className="text-xs text-slate-400">Study mathematical time and space boundaries (Big O Notation) across different algorithms.</p>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
        {/* Search header filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-extrabold text-white">Mathematical Boundaries Cheat Sheet</span>
          </div>
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search algorithm or category..."
              className="bg-slate-950 border border-white/5 hover:border-white/10 focus:border-indigo-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none w-64 transition"
            />
          </div>
        </div>

        {/* Detailed Grid Table */}
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-white/5 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Algorithm Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-emerald-400">Best Case</th>
                <th className="p-4 text-indigo-400">Average Case</th>
                <th className="p-4 text-rose-400">Worst Case</th>
                <th className="p-4 text-amber-400">Space Complexity</th>
                <th className="p-4 text-slate-300">Stable Sort</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-900/40 text-slate-300 transition-colors font-mono"
                >
                  <td className="p-4 font-sans font-bold text-white text-xs">{item.name}</td>
                  <td className="p-4 font-sans text-xs text-slate-400">{item.category}</td>
                  <td className="p-4 font-bold text-emerald-400">{item.best}</td>
                  <td className="p-4 font-bold text-indigo-400">{item.average}</td>
                  <td className="p-4 font-bold text-rose-400">{item.worst}</td>
                  <td className="p-4 font-bold text-amber-400">{item.space}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-widest ${
                      item.stable === 'Yes'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : item.stable === 'No'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.stable}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
