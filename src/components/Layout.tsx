import React, { useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';

// Pages lazy load maps (we will build these pages next)
import { Dashboard } from '../pages/Dashboard';
import { SortingVisualizer } from '../pages/SortingVisualizer';
import { SearchingVisualizer } from '../pages/SearchingVisualizer';
import { TreeVisualizer } from '../pages/TreeVisualizer';
import { GraphVisualizer } from '../pages/GraphVisualizer';
import { RecursionVisualizer } from '../pages/RecursionVisualizer';
import { DataStructuresVisualizer } from '../pages/DataStructuresVisualizer';
import { ComplexityAnalyzerPage } from '../pages/ComplexityAnalyzerPage';
import { AlgorithmComparisonPage } from '../pages/AlgorithmComparisonPage';
import { SettingsPage } from '../pages/SettingsPage';

export const Layout: React.FC = () => {
  const { activePage } = useAppStore();
  const vantaRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const initVanta = () => {
      if (vantaEffectRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).VANTA && vantaRef.current) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          vantaEffectRef.current = (window as any).VANTA.CLOUDS2({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            skyColor: 0x030712,      // slate-950 background sky
            cloudColor: 0x312e81,    // subtle deep indigo clouds
            cloudShadowColor: 0x020617, // very dark slate shadows
            sunColor: 0x4f46e5,      // glowing indigo sun accent
            sunGlareColor: 0x6d28d9, // purple neon glare
            sunlightColor: 0x4f46e5,
            speed: 1.0
          });
        } catch (err) {
          console.error('Vanta initialization failed:', err);
        }
      } else {
        // Retry in 100ms if Vanta script is loading
        timer = setTimeout(initVanta, 100);
      }
    };

    initVanta();

    return () => {
      if (timer) clearTimeout(timer);
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard key="dashboard" />;
      case 'sorting':
        return <SortingVisualizer key="sorting" />;
      case 'searching':
        return <SearchingVisualizer key="searching" />;
      case 'trees':
        return <TreeVisualizer key="trees" />;
      case 'graphs':
        return <GraphVisualizer key="graphs" />;
      case 'recursion':
        return <RecursionVisualizer key="recursion" />;
      case 'structures':
        return <DataStructuresVisualizer key="structures" />;
      case 'analyzer':
        return <ComplexityAnalyzerPage key="analyzer" />;
      case 'comparisons':
        return <AlgorithmComparisonPage key="comparisons" />;
      case 'settings':
        return <SettingsPage key="settings" />;
      default:
        return <Dashboard key="dashboard" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background-deep relative overflow-hidden select-none">
      {/* Vanta Canvas Container */}
      <div ref={vantaRef} className="absolute inset-0 pointer-events-none z-0 opacity-40" />

      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px] animate-pulse-slow pointer-events-none" />
      
      {/* Background grid */}
      <div className="absolute inset-0 animate-grid pointer-events-none z-0 opacity-20" />

      {/* Main Sidebar */}
      <Sidebar />

      {/* Primary Content Window */}
      <main className="flex-1 overflow-x-hidden min-h-screen p-4 md:p-6 lg:p-8 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Force language server file resolution refresh
