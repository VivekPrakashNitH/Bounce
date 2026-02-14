'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Database, FileText, BookOpen, Zap, HardDrive, List } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const DbInternalsDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const [completionProgress, setCompletionProgress] = useState(0);
  const [queryType, setQueryType] = useState<'full' | 'index'>('full');
  const [searching, setSearching] = useState(false);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const sections = [
    { id: 'section-1', label: 'DB Internals' },
    { id: 'section-2', label: 'Storage Engines' },
    { id: 'section-3', label: 'Index Demo' },
    { id: 'section-4', label: 'Indexes' },
    { id: 'section-5', label: 'Query Pipeline' },
    { id: 'section-6', label: 'ACID' },
  ];



  useEffect(() => {
    // Handle initial resume scroll
    if (initialSectionIndex !== undefined && !initialScrollDone && sections.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(sections[initialSectionIndex]?.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setInitialScrollDone(true);
        }
      }, 500);
    }

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const totalScroll = scrollHeight - clientHeight;
      const progress = Math.min(100, (scrollTop / totalScroll) * 100);
      setScrollProgress(progress);
      const sectionCount = sections.length;

      let activeSection = 0;
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (rect.top < containerRect.top + containerRect.height / 2) {
            activeSection = i;
          } else {
            break;
          }
        }
      }

      setCurrentSection(activeSection);
      setCompletionProgress(Math.max(0, Math.min(1, (progress - 90) / 10)));

      if (onProgress) {
        onProgress({ sectionIndex: activeSection, totalSections: sections.length });
      }
    };
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [onProgress, initialSectionIndex, initialScrollDone]);



  const handleQuery = () => {
    setSearching(true);
    setTimeout(() => setSearching(false), queryType === 'full' ? 2000 : 500);
  };

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">


      {/* Header Component */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
      />

      <SidebarNav
        sections={sections}
        activeIndex={currentSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="amber"
        isVisible={true}
      />

      {/* Page Architecture Modal */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(251,191,36,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-amber-400 text-xs font-mono mt-1">L13 — Database Internals</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-amber-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page covers Database Internals with 6 sections including an interactive index demo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-amber-900/30 rounded-lg p-3"><p className="text-amber-300 font-mono text-xs font-bold mb-1">Section 1: Introduction</p><p className="text-slate-400 text-xs">How databases work internally</p></div>
                  <div className="bg-slate-800/40 border border-amber-900/30 rounded-lg p-3"><p className="text-amber-300 font-mono text-xs font-bold mb-1">Section 2: Storage Engines</p><p className="text-slate-400 text-xs">B-Tree, LSM Tree, Heap Files</p></div>
                  <div className="bg-slate-800/40 border border-amber-900/30 rounded-lg p-3"><p className="text-amber-300 font-mono text-xs font-bold mb-1">Section 3: Index Demo</p><p className="text-slate-400 text-xs">Interactive index vs full scan comparison</p></div>
                  <div className="bg-slate-800/40 border border-amber-900/30 rounded-lg p-3"><p className="text-amber-300 font-mono text-xs font-bold mb-1">Section 4: Indexes</p><p className="text-slate-400 text-xs">B-Tree, Hash, Full-Text, Composite indexes</p></div>
                  <div className="bg-slate-800/40 border border-amber-900/30 rounded-lg p-3"><p className="text-amber-300 font-mono text-xs font-bold mb-1">Section 5: Query Pipeline</p><p className="text-slate-400 text-xs">Parser, Planner, Executor</p></div>
                  <div className="bg-slate-800/40 border border-amber-900/30 rounded-lg p-3"><p className="text-amber-300 font-mono text-xs font-bold mb-1">Section 6: ACID</p><p className="text-slate-400 text-xs">Atomicity, Consistency, Isolation, Durability</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-950/30 to-yellow-950/30 border border-amber-900/50 rounded-lg p-4">
                <p className="text-amber-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-amber-400 font-semibold">database internals</span> work including storage engines, indexes, and query execution.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gear Icon Button */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(251,191,36,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>



      <div ref={scrollContainerRef} className="pt-32 pb-20 h-screen overflow-y-auto custom-scrollbar">
        {/* Section 1: Intro */}
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-6">How Databases Work</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Databases are complex systems with storage engines, query planners, transaction managers, and caching layers working together.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Understanding internals helps you write better queries, design efficient schemas, and debug performance issues.
              </p>
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-amber-200">
                  <strong>Mental Model:</strong> A database is like a library with catalogs (indexes), shelves (storage), and librarians (query engine).
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-amber-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Database className="w-24 h-24 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Storage Engine */}
        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-8 text-center">Storage Engines</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">B-Tree (Most Common)</p>
                <p className="text-sm text-slate-300">Balanced tree structure. O(log n) reads/writes. Good for range queries. Used by PostgreSQL, MySQL InnoDB.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">LSM Tree (Log-Structured Merge)</p>
                <p className="text-sm text-slate-300">Write-optimized. Append-only logs merged in background. Fast writes, slower reads. Used by Cassandra, RocksDB.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">Heap Files</p>
                <p className="text-sm text-slate-300">Unordered storage. Append new rows. Requires indexes for fast lookups. PostgreSQL default for table data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive */}
        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-8 text-center">Interactive: Index vs Full Scan</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-amber-500/30 rounded-xl p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setQueryType('full')}
                    className={`px-4 py-2 rounded font-bold transition-colors ${queryType === 'full' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                  >
                    Full Table Scan
                  </button>
                  <button
                    onClick={() => setQueryType('index')}
                    className={`px-4 py-2 rounded font-bold transition-colors ${queryType === 'index' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                  >
                    Index Lookup
                  </button>
                </div>

                <button
                  onClick={handleQuery}
                  disabled={searching}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-bold transition-colors"
                >
                  Run Query
                </button>

                {queryType === 'full' && (
                  <div className="w-full max-w-md">
                    <p className="text-sm text-slate-300 mb-4">Scanning all 1M rows...</p>
                    <div className="space-y-2">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`h-8 rounded flex items-center px-3 text-xs transition-all ${searching && i <= 5 ? 'bg-red-600/30 border border-red-500' : 'bg-slate-700 border border-slate-600'}`}>
                          Row {i * 100000 + 1} - {(i + 1) * 100000}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-red-400 mt-4">Time: ~2 seconds (slow)</p>
                  </div>
                )}

                {queryType === 'index' && (
                  <div className="w-full max-w-md">
                    <p className="text-sm text-slate-300 mb-4">Using B-Tree index on user_id...</p>
                    <div className="space-y-2">
                      <div className={`p-4 rounded border ${searching ? 'bg-green-600/30 border-green-500' : 'bg-slate-700 border-slate-600'}`}>
                        <p className="text-xs text-slate-300 mb-2">Index: user_id_idx</p>
                        <div className="text-[10px] text-slate-400 font-mono">Root → Branch → Leaf → Row</div>
                      </div>
                      <div className={`h-8 rounded flex items-center px-3 text-xs ${searching ? 'bg-green-600/30 border border-green-500' : 'bg-slate-700 border border-slate-600'}`}>
                        Found: Row 427,815
                      </div>
                    </div>
                    <p className="text-xs text-green-400 mt-4">Time: ~5ms (fast!)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Indexes */}
        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-8 text-center">Indexes Explained</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-amber-500/30 rounded-xl">
                <h4 className="font-bold text-amber-300 mb-2">B-Tree Index</h4>
                <p className="text-sm text-slate-300">Most common. Sorted tree. Good for equality and range queries. WHERE age BETWEEN 20 AND 30.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-amber-500/30 rounded-xl">
                <h4 className="font-bold text-amber-300 mb-2">Hash Index</h4>
                <p className="text-sm text-slate-300">O(1) lookups. Only equality. No ranges. WHERE user_id = 123. Fast but limited.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-amber-500/30 rounded-xl">
                <h4 className="font-bold text-amber-300 mb-2">Full-Text Index</h4>
                <p className="text-sm text-slate-300">Tokenizes text. WHERE description LIKE '%database%'. Used for search. GIN in PostgreSQL.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-amber-500/30 rounded-xl">
                <h4 className="font-bold text-amber-300 mb-2">Composite Index</h4>
                <p className="text-sm text-slate-300">Multiple columns. (city, age). Order matters. Covers queries filtering both.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-amber-500/30 rounded-xl">
                <h4 className="font-bold text-amber-300 mb-2">Covering Index</h4>
                <p className="text-sm text-slate-300">Includes all queried columns. No table lookup needed. Index-only scan.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-amber-500/30 rounded-xl">
                <h4 className="font-bold text-amber-300 mb-2">Trade-off</h4>
                <p className="text-sm text-slate-300">Faster reads, slower writes. Index maintenance overhead. Storage cost.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Query Execution */}
        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-8 text-center">Query Execution Pipeline</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">1. Parser</p>
                <p className="text-sm text-slate-300">Converts SQL string to AST (Abstract Syntax Tree). Validates syntax. Checks table/column existence.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">2. Query Planner</p>
                <p className="text-sm text-slate-300">Generates execution plan. Decides index usage, join order, scan method. Uses statistics to estimate cost.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">3. Executor</p>
                <p className="text-sm text-slate-300">Runs the plan. Fetches data from storage. Applies filters, joins, aggregations. Returns result set.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">EXPLAIN Command</p>
                <p className="text-sm text-slate-300">Shows execution plan. Reveals index usage, scan types, row estimates. Essential for optimization.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Transactions */}
        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-8 text-center">ACID Properties</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">Atomicity</p>
                <p className="text-sm text-slate-300">All or nothing. Transaction either completes fully or rolls back. No partial state.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">Consistency</p>
                <p className="text-sm text-slate-300">Database constraints maintained. Foreign keys, unique constraints enforced. Valid state to valid state.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">Isolation</p>
                <p className="text-sm text-slate-300">Concurrent transactions don't interfere. Isolation levels control visibility. Read uncommitted → Serializable.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">Durability</p>
                <p className="text-sm text-slate-300">Committed data persists. Survives crashes. Write-ahead log (WAL) ensures recovery.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* {completionProgress > 0 && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center pointer-events-none" style={{ opacity: completionProgress }}>
          <div className="text-center">
            <BounceAvatar className="w-20 h-20 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-4">Level Complete</h2>
            <button className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-bold pointer-events-auto">
              Next Level
            </button>
          </div>
        </div>
      )} */}

      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
