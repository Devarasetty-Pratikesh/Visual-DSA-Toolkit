import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PageType } from '../types';
import {
  LayoutDashboard,
  ArrowUpDown,
  Search,
  GitBranch,
  Network,
  RefreshCw,
  Clock,
  Columns,
  Settings,
  Menu,
  X,
  Code,
  Trophy,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sorting' as PageType, label: 'Sorting Visualizer', icon: ArrowUpDown, badge: '8 Algos' },
    { id: 'searching' as PageType, label: 'Searching Visualizer', icon: Search, badge: '5 Algos' },
    { id: 'trees' as PageType, label: 'Tree Visualizer', icon: GitBranch, badge: 'AVL, BST' },
    { id: 'graphs' as PageType, label: 'Graph Visualizer', icon: Network, badge: 'A*, Dijkstra' },
    { id: 'recursion' as PageType, label: 'Recursion Visualizer', icon: RefreshCw },
    { id: 'structures' as PageType, label: 'Data Structures', icon: Database, badge: 'Stack, List' },
    { id: 'analyzer' as PageType, label: 'Complexity Analyzer', icon: Clock },
    { id: 'comparisons' as PageType, label: 'Algorithm Battle', icon: Columns, badge: 'Dual Run' },
    { id: 'settings' as PageType, label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: PageType) => {
    setActivePage(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-background-card border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-neon-indigo">
            Ω
          </div>
          <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 tracking-wider">
            ALGO-CRAFT
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <AnimatePresence>
        {(isOpen || true) && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`fixed inset-y-0 left-0 z-30 w-64 bg-background-card/90 backdrop-blur-md border-r border-white/5 flex flex-col justify-between py-6 px-4 lg:sticky lg:flex ${
              isOpen ? 'flex' : 'hidden lg:flex'
            } h-screen overflow-y-auto`}
          >
            <div>
              {/* Logo / Header */}
              <div className="flex items-center gap-3 px-2 mb-8">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center font-extrabold text-white text-lg shadow-neon-indigo">
                  V
                </div>
                <div>
                  <h1 className="font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-violet-200 leading-none">
                    Visual DSA
                  </h1>
                  <span className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
                    Toolkit v1.0
                  </span>
                </div>
              </div>

              {/* Navigation items */}
              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-white border-l-2 border-indigo-500 shadow-glass'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${
                            isActive ? 'text-indigo-400' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                          isActive 
                            ? 'bg-indigo-500/20 text-indigo-300' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="mt-8 pt-4 border-t border-white/5 px-2">
              <div className="p-3 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 rounded-2xl border border-indigo-500/10 flex items-center gap-3">
                <Trophy className="h-5 w-5 text-indigo-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-indigo-200 font-bold truncate">PRO DSA Rank</p>
                  <p className="text-[10px] text-slate-400">Master Level Accomplished</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
        />
      )}
    </>
  );
};
