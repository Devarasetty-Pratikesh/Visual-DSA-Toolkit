import React from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Zap,
  Clock,
  BookOpen,
  Calendar,
  Flame,
  ArrowRight,
  TrendingUp,
  Brain,
  History,
  Heart
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { stats, setActivePage } = useAppStore();

  // 1. Chart Data: Telemetry for recent operations
  const activityData = [
    { name: 'Mon', count: 2 },
    { name: 'Tue', count: 4 },
    { name: 'Wed', count: 3 },
    { name: 'Thu', count: 7 },
    { name: 'Fri', count: 5 },
    { name: 'Sat', count: 9 },
    { name: 'Sun', count: 8 },
  ];

  // 2. Chart Data: Skills Distribution Radar
  const skillData = [
    { subject: 'Sorting', A: 85, fullMark: 100 },
    { subject: 'Searching', A: 90, fullMark: 100 },
    { subject: 'Trees', A: 70, fullMark: 100 },
    { subject: 'Graphs', A: 65, fullMark: 100 },
    { subject: 'Recursion', A: 75, fullMark: 100 },
    { subject: 'Structures', A: 80, fullMark: 100 },
  ];

  // 3. Chart Data: Challenges Donut (Dynamic telemetry!)
  const difficultyData = stats.challengesCompleted === 0
    ? [{ name: 'No Solved Quizzes', value: 1, color: '#1e293b' }]
    : [
        { name: 'Easy', value: stats.solvedEasy || 0, color: '#10b981' },
        { name: 'Medium', value: stats.solvedMedium || 0, color: '#f59e0b' },
        { name: 'Hard', value: stats.solvedHard || 0, color: '#f43f5e' }
      ].filter(item => item.value > 0);

  return (
    <div className="flex-1 flex flex-col gap-6 md:gap-8 pb-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-white/10 shadow-glass flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Flame className="h-3.5 w-3.5 fill-current" /> Continuous Learning Streak Active
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome to the <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Visual DSA Arena</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Elevate your algorithmic understanding with beautiful interactive simulations. Run animations, study pseudocode, adjust execution speeds, and master computer science fundamentals.
          </p>
        </div>
        <button
          onClick={() => setActivePage('sorting')}
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-neon-indigo hover:shadow-indigo-500/40 transform active:scale-95 transition-all relative z-10"
        >
          <span>Launch sorting visualizer</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visualizations Run */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Visualizations Run</p>
            <h3 className="text-2xl font-black text-white mt-1">{stats.visualizationsRun}</h3>
          </div>
        </div>

        {/* Challenges Completed */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Quizzes Solved</p>
            <h3 className="text-2xl font-black text-white mt-1">{stats.challengesCompleted}</h3>
          </div>
        </div>

        {/* Time Spent */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Learning Time</p>
            <h3 className="text-2xl font-black text-white mt-1">{stats.timeSpentMinutes}m</h3>
          </div>
        </div>

        {/* Favorites Count */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Favorite Algos</p>
            <h3 className="text-2xl font-black text-white mt-1">{stats.favoriteAlgorithms.length}</h3>
          </div>
        </div>
      </div>

      {/* Grid: Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Line Area Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between min-h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <h4 className="text-sm md:text-base font-bold text-white">Visualizer Activity Timeline</h4>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> This Week
            </span>
          </div>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: 12, color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between min-h-[350px]">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-indigo-400" />
            <h4 className="text-sm md:text-base font-bold text-white">Algorithm Competency Map</h4>
          </div>
          <div className="flex-1 w-full min-h-[240px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Comprehension" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row: Recent Activity & Performance Analytics Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* History Timelines */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <History className="h-5 w-5 text-indigo-400" />
            <h4 className="text-sm md:text-base font-bold text-white">Recent Visualization Logs</h4>
          </div>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
            {stats.history.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No algorithms visualized yet. Launch sorting above!</p>
            ) : (
              stats.history.map((log) => (
                <div key={log.id} className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs font-semibold text-indigo-400 shrink-0">
                      {log.category.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-white">{log.algorithmName}</p>
                      <p className="text-[10px] text-slate-400">{log.category} • {new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                    {(log.durationMs / 1000).toFixed(1)}s run
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Challenges Completed Donut */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <h4 className="text-sm md:text-base font-bold text-white">Solved Quizzes by Difficulty</h4>
          </div>
          <div className="flex-1 flex flex-col md:flex-row lg:flex-col items-center justify-around gap-4 py-4">
            <div className="w-[140px] h-[140px] relative shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-2xl font-black text-white">{stats.challengesCompleted}</span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Solved</span>
              </div>
            </div>
            {/* Legend layout */}
            <div className="flex flex-col gap-2 shrink-0">
              {stats.challengesCompleted === 0 ? (
                <span className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-wider">0 active records</span>
              ) : (
                difficultyData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-400 w-16">{entry.name}:</span>
                    <span className="font-bold text-white">{entry.value} solved</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
