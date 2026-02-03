'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Server, Hash, Circle, TrendingUp, Database } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const ConsistentHashingDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [servers, setServers] = useState([0, 1, 2]);
  const [keyInput, setKeyInput] = useState('');
  const [highlightKey, setHighlightKey] = useState<string | null>(null);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'What is Consistent Hashing' },
    { id: 'section-2', label: 'Rehashing Problem' },
    { id: 'section-3', label: 'Hash Ring' },
    { id: 'section-4', label: 'Virtual Nodes' },
    { id: 'section-5', label: 'Use Cases' },
    { id: 'section-6', label: 'Trade-offs' },
  ];

  // --- Touch Unlock Logic ---
  const handleTouchUnlock = () => {
    if (!gateUnlocked) {
      setGateUnlocked(true);
      setTimeout(() => setShowInstructions(false), 1500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.overflow-y-auto.custom-scrollbar');
      if (!container) return;

      const { scrollTop, clientHeight, scrollHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      // Detect current section
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
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (!gateUnlocked) {
          setGateUnlocked(true);
          setShowInstructions(true);
        } else if (showInstructions) {
          setShowInstructions(false);
        }
        setKeysPressed(prev => new Set([...prev, e.key]));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };
    const container = document.querySelector('.overflow-y-auto.custom-scrollbar');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [sections.length, sections, gateUnlocked, showInstructions]);

  useEffect(() => {
    setBallVisible(currentSection !== 3);
  }, [currentSection]);

  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % 360;
  };

  const findServer = (key: string) => {
    const keyHash = simpleHash(key);
    let closest = servers[0];
    let minDist = Math.abs(simpleHash(`server${servers[0]}`) - keyHash);
    for (const srv of servers) {
      const srvHash = simpleHash(`server${srv}`);
      const dist = Math.abs(srvHash - keyHash);
      if (dist < minDist) {
        minDist = dist;
        closest = srv;
      }
    }
    return closest;
  };

  const handleLookup = () => {
    if (!keyInput.trim()) return;
    setHighlightKey(keyInput);
    setTimeout(() => setHighlightKey(null), 2000);
  };

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">


      {/* SIDEBAR NAVIGATION */}
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
        accentColor="purple"
        isVisible={gateUnlocked}
      />

      {/* PAGE ARCHITECTURE MODAL */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-violet-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            {/* Header */}
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-violet-400 text-xs font-mono mt-1">L4 — Consistent Hashing</p>
              </div>
              <button
                onClick={() => setShowPageMadeModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Page Architecture */}
              <div>
                <h4 className="text-violet-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">🏗️</span> Page Architecture
                </h4>
                <div className="space-y-3">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    This page uses a <span className="text-violet-400 font-semibold">scroll-driven learning system</span> with 6 major sections:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-800/40 border border-violet-900/30 rounded-lg p-3">
                      <p className="text-violet-300 font-mono text-xs font-bold mb-1">Section 1: Introduction</p>
                      <p className="text-slate-400 text-xs">What is consistent hashing and why it matters</p>
                    </div>
                    <div className="bg-slate-800/40 border border-violet-900/30 rounded-lg p-3">
                      <p className="text-violet-300 font-mono text-xs font-bold mb-1">Section 2: The Problem</p>
                      <p className="text-slate-400 text-xs">Rehashing problem with traditional modulo hashing</p>
                    </div>
                    <div className="bg-slate-800/40 border border-violet-900/30 rounded-lg p-3">
                      <p className="text-violet-300 font-mono text-xs font-bold mb-1">Section 3: Interactive Demo</p>
                      <p className="text-slate-400 text-xs">Hash ring visualization with key lookup</p>
                    </div>
                    <div className="bg-slate-800/40 border border-violet-900/30 rounded-lg p-3">
                      <p className="text-violet-300 font-mono text-xs font-bold mb-1">Section 4: Virtual Nodes</p>
                      <p className="text-slate-400 text-xs">Load balancing with vnodes</p>
                    </div>
                    <div className="bg-slate-800/40 border border-violet-900/30 rounded-lg p-3">
                      <p className="text-violet-300 font-mono text-xs font-bold mb-1">Section 5: Use Cases</p>
                      <p className="text-slate-400 text-xs">Real-world applications: DynamoDB, Cassandra, etc.</p>
                    </div>
                    <div className="bg-slate-800/40 border border-violet-900/30 rounded-lg p-3">
                      <p className="text-violet-300 font-mono text-xs font-bold mb-1">Section 6: Trade-offs</p>
                      <p className="text-slate-400 text-xs">Pros, cons, and when to use</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Concepts */}
              <div>
                <h4 className="text-violet-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">💡</span> Key Concepts
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-violet-400 font-bold">→</span>
                    <span><span className="text-violet-400">Hash Ring</span>: Circular space where servers and keys are mapped</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-violet-400 font-bold">→</span>
                    <span><span className="text-violet-400">Virtual Nodes</span>: Multiple ring positions per physical server for even distribution</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-violet-400 font-bold">→</span>
                    <span><span className="text-violet-400">Minimal Disruption</span>: Only K/N keys remapped when adding/removing servers</span>
                  </li>
                </ul>
              </div>

              {/* Closing */}
              <div className="bg-gradient-to-r from-violet-950/30 to-purple-950/30 border border-violet-900/50 rounded-lg p-4">
                <p className="text-violet-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">
                  How <span className="text-violet-400 font-semibold">consistent hashing</span> solves the rehashing problem in distributed systems, enabling seamless scaling without massive data migration.
                </p>
                <button
                  onClick={() => setShowPageMadeModal(false)}
                  className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Ready to Learn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING "HOW THIS WAS MADE" BUTTON */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>

      {!gateUnlocked && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center cursor-pointer"
          onClick={handleTouchUnlock}
          onTouchStart={handleTouchUnlock}
        >
          <div className="text-center">
            <BounceAvatar className="w-32 h-32 mx-auto mb-6 opacity-80" />

            {/* Desktop hint */}
            <p className="text-slate-300 text-lg mb-4 hidden md:block">Press any arrow key to unlock</p>

            {/* Mobile hint */}
            <p className="text-slate-300 text-lg mb-4 md:hidden">Tap anywhere to unlock</p>

            <div className="flex gap-3 justify-center opacity-60 text-sm hidden md:flex">
              <span>UP</span>
              <span>DOWN</span>
              <span>LEFT</span>
              <span>RIGHT</span>
            </div>

            {/* Mobile tap indicator */}
            <div className="md:hidden flex flex-col items-center text-slate-500 mt-4">
              <div className="w-12 h-12 border-2 border-violet-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-violet-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && (
        <GameInstructions
          visible={showInstructions}
          onDismiss={() => setShowInstructions(false)}
          onShow={() => setShowInstructions(true)}
          theme="violet"
          title="How to Play"
          subtitle="Use arrow keys to move. Bounce to enter the zone."
        />
      )}

      {ballVisible && gateUnlocked && !showInstructions && (
        <div className="fixed z-30 pointer-events-none">
          <BounceAvatar className="w-4 h-4 opacity-70" />
        </div>
      )}

      <div className="pt-32 pb-20">
        {/* Section 1: Intro */}
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-violet-300 mb-6">What is Consistent Hashing?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Consistent hashing is a distributed hashing technique that minimizes remapping when servers are added or removed.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Traditional modulo hashing (key % N) requires remapping most keys when N changes. Consistent hashing only remaps keys from affected servers.
              </p>
              <div className="mt-6 p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-violet-200">
                  <strong>Mental Model:</strong> Servers and keys placed on a circular ring. Each key finds the nearest clockwise server.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-violet-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <RefreshCw className="w-24 h-24 text-violet-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: The Problem */}
        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-violet-300 mb-8 text-center">The Rehashing Problem</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                <p className="font-bold text-violet-300 mb-2">Traditional Hashing (Modulo)</p>
                <p className="text-sm text-slate-300 mb-3">server = hash(key) % N</p>
                <p className="text-sm text-slate-300">With 3 servers, key "user123" → server 1. Add a 4th server, now "user123" → server 3. Most keys remapped.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                <p className="font-bold text-violet-300 mb-2">The Impact</p>
                <p className="text-sm text-slate-300">Cache invalidation. Database queries spike. User sessions lost. System thrashes during scaling events.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                <p className="font-bold text-violet-300 mb-2">Consistent Hashing Solution</p>
                <p className="text-sm text-slate-300">Only K/N keys remapped (K = total keys, N = servers). Adding server 4 only affects ~25% of keys.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive */}
        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-violet-300 mb-8 text-center">Interactive: Hash Ring</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-violet-500/30 rounded-xl p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Enter key (e.g. user123)"
                    className="bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white focus:border-violet-500 outline-none"
                  />
                  <button
                    onClick={handleLookup}
                    disabled={!keyInput.trim()}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded font-bold transition-colors disabled:opacity-50"
                  >
                    Lookup
                  </button>
                </div>

                <div className="relative w-80 h-80">
                  <Circle className="absolute inset-0 w-full h-full text-slate-600" strokeWidth={1} />

                  {servers.map((srv) => {
                    const angle = (simpleHash(`server${srv}`) / 360) * 2 * Math.PI;
                    const x = 160 + 140 * Math.cos(angle - Math.PI / 2);
                    const y = 160 + 140 * Math.sin(angle - Math.PI / 2);
                    return (
                      <div key={srv} className="absolute" style={{ left: x - 16, top: y - 16 }}>
                        <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-violet-400">
                          S{srv}
                        </div>
                      </div>
                    );
                  })}

                  {highlightKey && (() => {
                    const angle = (simpleHash(highlightKey) / 360) * 2 * Math.PI;
                    const x = 160 + 140 * Math.cos(angle - Math.PI / 2);
                    const y = 160 + 140 * Math.sin(angle - Math.PI / 2);
                    const targetServer = findServer(highlightKey);
                    return (
                      <div className="absolute" style={{ left: x - 12, top: y - 12 }}>
                        <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
                        <div className="absolute inset-0 w-6 h-6 bg-yellow-400 rounded-full" />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-yellow-400 whitespace-nowrap font-bold">
                          → S{targetServer}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-3 gap-3 w-full">
                  {servers.map((srv) => (
                    <div key={srv} className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg text-center">
                      <Server className="text-violet-400 mx-auto mb-1" size={16} />
                      <p className="text-xs font-bold text-violet-300">Server {srv}</p>
                      <p className="text-[10px] text-slate-400">hash: {simpleHash(`server${srv}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Virtual Nodes */}
        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-violet-300 mb-8 text-center">Virtual Nodes</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                <p className="font-bold text-violet-300 mb-2">The Load Imbalance Problem</p>
                <p className="text-sm text-slate-300">With few servers, hash ring distribution is uneven. One server might handle 50% of keys, another only 10%.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                <p className="font-bold text-violet-300 mb-2">Virtual Nodes Solution</p>
                <p className="text-sm text-slate-300">Each physical server maps to multiple virtual nodes on the ring. Server A: vnodes A1, A2, A3. Distributes load evenly.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                <p className="font-bold text-violet-300 mb-2">Typical Configuration</p>
                <p className="text-sm text-slate-300">100-200 virtual nodes per physical server. Higher values = better distribution but more metadata overhead.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Use Cases */}
        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-violet-300 mb-8 text-center">Where It's Used</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-violet-500/30 rounded-xl">
                <Database className="text-violet-400 mb-2" size={20} />
                <h4 className="font-bold text-violet-300 mb-2">DynamoDB</h4>
                <p className="text-sm text-slate-300">Partitions data across nodes. Automatic rebalancing on scale events.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-violet-500/30 rounded-xl">
                <Server className="text-violet-400 mb-2" size={20} />
                <h4 className="font-bold text-violet-300 mb-2">Cassandra</h4>
                <p className="text-sm text-slate-300">Token ring architecture. Each node owns a range of hash values.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-violet-500/30 rounded-xl">
                <Hash className="text-violet-400 mb-2" size={20} />
                <h4 className="font-bold text-violet-300 mb-2">Memcached</h4>
                <p className="text-sm text-slate-300">Client-side consistent hashing. Minimizes cache misses on server changes.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-violet-500/30 rounded-xl">
                <TrendingUp className="text-violet-400 mb-2" size={20} />
                <h4 className="font-bold text-violet-300 mb-2">CDNs</h4>
                <p className="text-sm text-slate-300">Route requests to edge servers. Graceful degradation when nodes fail.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-violet-500/30 rounded-xl">
                <RefreshCw className="text-violet-400 mb-2" size={20} />
                <h4 className="font-bold text-violet-300 mb-2">Riak</h4>
                <p className="text-sm text-slate-300">Distributed key-value store. Ring partitioning with replication.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-violet-500/30 rounded-xl">
                <Database className="text-violet-400 mb-2" size={20} />
                <h4 className="font-bold text-violet-300 mb-2">Redis Cluster</h4>
                <p className="text-sm text-slate-300">16384 hash slots distributed across nodes. Resharding without downtime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Trade-offs */}
        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-violet-300 mb-8 text-center">Trade-offs</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                <p className="font-bold text-violet-300 mb-2">Pros</p>
                <p className="text-sm text-slate-300">Minimal remapping on scale events. Predictable load distribution. Fault tolerant. Works with heterogeneous hardware.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                <p className="font-bold text-violet-300 mb-2">Cons</p>
                <p className="text-sm text-slate-300">More complex than modulo. Metadata overhead for virtual nodes. Range queries not supported. Hotspots still possible.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl">
                <p className="font-bold text-violet-300 mb-2">When to Use</p>
                <p className="text-sm text-slate-300">Distributed caching, sharded databases, load balancing. Any system where servers frequently join/leave and you want to minimize disruption.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
