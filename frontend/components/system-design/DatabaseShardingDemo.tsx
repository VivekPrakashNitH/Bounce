'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Database, Hash, Server, Zap, TrendingUp, Network } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const DatabaseShardingDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const [completionProgress, setCompletionProgress] = useState(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [animating, setAnimating] = useState<{ val: number, target: number } | null>(null);
  const [shardA, setShardA] = useState<number[]>([]);
  const [shardB, setShardB] = useState<number[]>([]);
  const [shardC, setShardC] = useState<number[]>([]);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const sections = [
    { id: 'section-1', label: 'What is Sharding' },
    { id: 'section-2', label: 'Why Shard' },
    { id: 'section-3', label: 'Interactive' },
    { id: 'section-4', label: 'Shard Keys' },
    { id: 'section-5', label: 'Challenges' },
    { id: 'section-6', label: 'Real World' },
  ];

  // --- Touch Unlock Logic ---


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
      const container = document.querySelector('.overflow-y-auto.custom-scrollbar');
      if (!container) return;

      const { scrollTop, clientHeight, scrollHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

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
      setCurrentSection(Math.min(activeSection, sections.length - 1));
      setCompletionProgress(Math.max(0, Math.min(1, (progress - 90) / 10)));

      if (onProgress) {
        onProgress({ sectionIndex: activeSection, totalSections: sections.length });
      }
    };
    const container = document.querySelector('.overflow-y-auto.custom-scrollbar');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [sections.length, sections, onProgress, initialSectionIndex, initialScrollDone]);



  const handleInsert = () => {
    const num = parseInt(inputVal);
    if (isNaN(num)) return;
    const targetShard = num % 3;
    setAnimating({ val: num, target: targetShard });
    setInputVal('');
    setTimeout(() => {
      if (targetShard === 0) setShardA(prev => [...prev, num]);
      else if (targetShard === 1) setShardB(prev => [...prev, num]);
      else setShardC(prev => [...prev, num]);
      setAnimating(null);
    }, 800);
  };

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">

      {/* HEADER SECTION */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
      />

      {/* SIDEBAR NAVIGATION */}
      <SidebarNav
        sections={sections}
        activeIndex={currentSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="red"
        isVisible={true}
      />

      {/* PAGE ARCHITECTURE MODAL */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(248,113,113,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-red-400 text-xs font-mono mt-1">L7 — Database Sharding</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page covers Database Sharding with 6 sections including an interactive shard router.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-red-900/30 rounded-lg p-3"><p className="text-red-300 font-mono text-xs font-bold mb-1">Section 1: Introduction</p><p className="text-slate-400 text-xs">What is sharding and horizontal partitioning</p></div>
                  <div className="bg-slate-800/40 border border-red-900/30 rounded-lg p-3"><p className="text-red-300 font-mono text-xs font-bold mb-1">Section 2: Why Shard</p><p className="text-slate-400 text-xs">Vertical limits, horizontal scaling, query performance</p></div>
                  <div className="bg-slate-800/40 border border-red-900/30 rounded-lg p-3"><p className="text-red-300 font-mono text-xs font-bold mb-1">Section 3: Interactive Demo</p><p className="text-slate-400 text-xs">Sharding by User ID with modulo routing</p></div>
                  <div className="bg-slate-800/40 border border-red-900/30 rounded-lg p-3"><p className="text-red-300 font-mono text-xs font-bold mb-1">Section 4: Shard Keys</p><p className="text-slate-400 text-xs">User ID, geography, time range patterns</p></div>
                  <div className="bg-slate-800/40 border border-red-900/30 rounded-lg p-3"><p className="text-red-300 font-mono text-xs font-bold mb-1">Section 5: Challenges</p><p className="text-slate-400 text-xs">Resharding, cross-shard queries, hotspots</p></div>
                  <div className="bg-slate-800/40 border border-red-900/30 rounded-lg p-3"><p className="text-red-300 font-mono text-xs font-bold mb-1">Section 6: Real World</p><p className="text-slate-400 text-xs">Instagram, MongoDB, Vitess examples</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-950/30 to-pink-950/30 border border-red-900/50 rounded-lg p-4">
                <p className="text-red-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-red-400 font-semibold">database sharding</span> enables horizontal scaling by distributing data across multiple servers using shard keys.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING GEAR ICON */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-[0_0_20px_rgba(248,113,113,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(248,113,113,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>



      <div className="pt-32 pb-20">
        {/* Section 1: Intro */}
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-6">What is Database Sharding?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Sharding splits a single database into multiple smaller databases (shards) distributed across servers. Each shard contains a subset of the total data.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                This horizontal partitioning enables databases to scale beyond the limits of a single machine.
              </p>
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-red-200">
                  <strong>Mental Model:</strong> Like filing cabinets in different rooms—each cabinet holds a specific range of files.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-red-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Database className="w-24 h-24 text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Why Shard */}
        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center sm:order-last">
              <div className="w-full max-w-sm space-y-3">
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <TrendingUp className="text-red-400 mb-2" size={20} />
                  <p className="font-bold text-red-300 text-sm mb-1">Vertical Scaling Limits</p>
                  <p className="text-xs text-slate-300">Single server maxes out CPU/RAM/Storage</p>
                </div>
                <div className="p-4 bg-pink-500/20 border border-pink-500/30 rounded-lg">
                  <Network className="text-pink-400 mb-2" size={20} />
                  <p className="font-bold text-pink-300 text-sm mb-1">Horizontal Scaling</p>
                  <p className="text-xs text-slate-300">Add more servers to distribute load</p>
                </div>
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <Zap className="text-red-400 mb-2" size={20} />
                  <p className="font-bold text-red-300 text-sm mb-1">Query Performance</p>
                  <p className="text-xs text-slate-300">Smaller tables = faster queries per shard</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-6">Why Shard?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Single databases face hard limits. A PostgreSQL instance might handle 10TB comfortably, but beyond that, performance degrades exponentially.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Sharding distributes writes and reads across multiple machines, each handling a fraction of the total load.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Cost-effective: Add commodity servers instead of expensive high-end hardware.
              </p>
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-red-200">
                  <strong>Key Insight:</strong> Sharding enables linear scaling. 2x servers ≈ 2x capacity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive */}
        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-8 text-center">Interactive: Sharding by User ID</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-red-500/30 rounded-xl p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Enter User ID (e.g. 101)"
                    className="bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white focus:border-red-500 outline-none"
                  />
                  {/* <button 
  onClick={handleInsert}
  disabled={!inputVal || !!animating}
  className={`bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-bold transition-colors disabled:opacity-50
    ${!inputVal ? 'animate-pulse' : ''}`}
>
  Write Data
</button> */}
                  <button
                    onClick={handleInsert}
                    disabled={!inputVal || !!animating}
                    className={`bg-red-600 text-white px-6 py-2 rounded font-bold transition-colors ${!inputVal ? 'firefly-glow opacity-100' : 'hover:bg-red-500 disabled:opacity-50'}`}
                  >
                    Write Data
                  </button>


                </div>

                <div className="relative p-4 border-2 border-slate-600 border-dashed rounded-lg bg-slate-800/50 flex flex-col items-center w-48">
                  <Hash size={20} className="text-slate-400 mb-1" />
                  <span className="text-xs font-mono text-slate-300">Shard = ID % 3</span>
                  {animating && (
                    <div className="absolute top-full mt-2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg animate-bounce z-50">
                      {animating.val}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 w-full mt-8">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Server className="text-red-400" size={16} />
                      <p className="font-bold text-red-300 text-sm">Shard 0</p>
                    </div>
                    <div className="space-y-1 min-h-24">
                      {shardA.map((val, idx) => (
                        <div key={idx} className="bg-slate-800 rounded px-2 py-1 text-xs text-slate-300 font-mono">
                          User_{val}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Server className="text-pink-400" size={16} />
                      <p className="font-bold text-pink-300 text-sm">Shard 1</p>
                    </div>
                    <div className="space-y-1 min-h-24">
                      {shardB.map((val, idx) => (
                        <div key={idx} className="bg-slate-800 rounded px-2 py-1 text-xs text-slate-300 font-mono">
                          User_{val}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Server className="text-red-400" size={16} />
                      <p className="font-bold text-red-300 text-sm">Shard 2</p>
                    </div>
                    <div className="space-y-1 min-h-24">
                      {shardC.map((val, idx) => (
                        <div key={idx} className="bg-slate-800 rounded px-2 py-1 text-xs text-slate-300 font-mono">
                          User_{val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Shard Keys */}
        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-8 text-center">Choosing Shard Keys</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="text-sm text-slate-300">
                  <strong className="text-red-300">User ID:</strong> Most common. Each user's data lives on one shard. Queries by user are fast. Cross-user aggregations require scatter-gather.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="text-sm text-slate-300">
                  <strong className="text-red-300">Geography:</strong> Shard by region (US, EU, Asia). Reduces latency for regional queries. Compliance-friendly (data residency).
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="text-sm text-slate-300">
                  <strong className="text-red-300">Time Range:</strong> Recent data on hot shards, old data archived. Good for time-series (logs, metrics). Unbalanced writes (hot shard problem).
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="text-sm text-slate-300">
                  <strong className="text-red-300">Bad Choice:</strong> Sequential IDs create hotspots. All new writes hit the same shard. Use hashed keys or UUIDs for even distribution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Challenges */}
        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-8 text-center">Sharding Challenges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Resharding</h4>
                <p className="text-sm text-slate-300">Adding/removing shards requires moving data. Downtime or complex migration logic.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Cross-Shard Queries</h4>
                <p className="text-sm text-slate-300">Joins across shards are slow. Requires scatter-gather pattern or denormalization.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Transactions</h4>
                <p className="text-sm text-slate-300">Distributed transactions (2PC) are complex and slow. Prefer single-shard transactions.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Hotspots</h4>
                <p className="text-sm text-slate-300">Popular users/keys create uneven load. Some shards overloaded while others idle.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Operational Complexity</h4>
                <p className="text-sm text-slate-300">More moving parts. Backups, monitoring, failover multiply by number of shards.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Schema Changes</h4>
                <p className="text-sm text-slate-300">Must apply migrations to all shards. Rolling deploys more complex.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Real World */}
        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-8 text-center">Real-World Sharding</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Instagram</p>
                <p className="text-sm text-slate-300">Shards by user ID. Thousands of PostgreSQL shards. Cross-shard queries avoided via denormalization.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">MongoDB</p>
                <p className="text-sm text-slate-300">Built-in sharding via config servers. Auto-balancing chunks across shards. Range or hashed shard keys.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Vitess (YouTube)</p>
                <p className="text-sm text-slate-300">Transparent sharding layer for MySQL. Resharding without downtime. Powers YouTube's massive scale.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">When NOT to Shard</p>
                <p className="text-sm text-slate-300">Premature optimization. Try vertical scaling, read replicas, caching first. Shard only when single-machine limits reached.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; } @keyframes fireflyGlow { 0%, 100% { background-color: #b91c1c; box-shadow: 0 0 6px #f87171; } 50% { background-color: #f87171; box-shadow: 0 0 20px #f87171; } } .firefly-glow { animation: fireflyGlow 1.5s ease-in-out infinite; }`}</style>
    </div>
  );
};

