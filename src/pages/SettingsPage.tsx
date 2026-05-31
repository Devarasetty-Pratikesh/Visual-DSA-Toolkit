import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sliders, RotateCcw, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { stats, resetProgress, speed, setSpeed } = useAppStore();

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all your visualization counters, quiz metrics, and learning streaks?')) {
      resetProgress();
      alert('Your statistics have been successfully reset to default values.');
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 select-none max-w-2xl">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white">Visualizer Preferences</h2>
        <p className="text-xs text-slate-400">Configure global simulation coefficients and manage telemetry storage.</p>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
        {/* Speed presets card */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Animation Speed presets</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setSpeed(val)}
                className={`flex-1 p-3 rounded-xl border text-xs font-bold font-mono transition-all ${
                  speed === val
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow shadow-indigo-500/20'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                LEVEL {val}
              </button>
            ))}
          </div>
        </div>

        {/* Database Telemetry */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Workspace Database Stats</span>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-900 border border-white/5 p-4 rounded-xl">
              <span className="text-slate-500 block">Total Logs Compiled</span>
              <span className="text-lg font-black text-white">{stats.history.length} operations</span>
            </div>
            <div className="bg-slate-900 border border-white/5 p-4 rounded-xl">
              <span className="text-slate-500 block">Favorited Algorithms</span>
              <span className="text-lg font-black text-white">{stats.favoriteAlgorithms.length} items</span>
            </div>
          </div>
        </div>

        {/* Danger reset zone */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Danger Zone</span>
            <p className="text-[11px] text-slate-400 mt-1">This operation deletes all local database statistics, streaking timelines, and favorites.</p>
          </div>
          <button
            onClick={handleReset}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-400 active:scale-95 text-rose-400 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 self-start"
          >
            <RotateCcw className="h-4 w-4" /> <span>Reset Profile & Statistics</span>
          </button>
        </div>
      </div>

      {/* Profile branding footer */}
      <div className="glass-panel rounded-2xl p-5 border border-white/5 flex gap-4 items-center">
        <ShieldCheck className="h-6 w-6 text-indigo-400 shrink-0" />
        <div className="text-[11px] text-slate-400 leading-normal">
          Designed and compiled by <span className="font-bold text-white">Antigravity AI IDE Coding Assistant</span>. Optimized for internship and software engineering portfolio showcase review. Powered by React, TS, Zustand, and D3/SVG.
        </div>
      </div>
    </div>
  );
};
