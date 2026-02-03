'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Layers, Package, Zap, Server, CheckCircle } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const DockerDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [building, setBuilding] = useState(false);
  const [containers, setContainers] = useState<string[]>([]);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'What is Docker' },
    { id: 'section-2', label: 'Why Docker' },
    { id: 'section-3', label: 'Build Container' },
    { id: 'section-4', label: 'Key Concepts' },
    { id: 'section-5', label: 'Docker vs VMs' },
    { id: 'section-6', label: 'Best Practices' },
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
      const container = scrollContainerRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const totalScroll = scrollHeight - clientHeight;
      const progress = Math.min(100, (scrollTop / totalScroll) * 100);
      setScrollProgress(progress);
      const sectionCount = sections.length;
      setCurrentSection(Math.min(sectionCount - 1, Math.floor((scrollTop / (totalScroll / sectionCount)) * sectionCount) % sectionCount));
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
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gateUnlocked, showInstructions]);

  useEffect(() => {
    setBallVisible(currentSection !== 3);
  }, [currentSection]);

  const handleBuild = () => {
    setBuilding(true);
    setTimeout(() => {
      setBuilding(false);
      setContainers(prev => [...prev, `app-${Date.now()}`]);
    }, 2000);
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

      {/* SIDEBAR NAVIGATION */}
      <SidebarNav
        sections={sections}
        activeIndex={currentSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="blue"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-sky-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(56,189,248,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-sky-400 text-xs font-mono mt-1">L16 — Docker Containers</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-sky-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page covers Docker with 6 sections including an interactive container building demo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-sky-900/30 rounded-lg p-3"><p className="text-sky-300 font-mono text-xs font-bold mb-1">Section 1: What is Docker</p><p className="text-slate-400 text-xs">Container fundamentals</p></div>
                  <div className="bg-slate-800/40 border border-sky-900/30 rounded-lg p-3"><p className="text-sky-300 font-mono text-xs font-bold mb-1">Section 2: Why Docker</p><p className="text-slate-400 text-xs">Consistency, isolation, speed</p></div>
                  <div className="bg-slate-800/40 border border-sky-900/30 rounded-lg p-3"><p className="text-sky-300 font-mono text-xs font-bold mb-1">Section 3: Build Container</p><p className="text-slate-400 text-xs">Interactive docker build</p></div>
                  <div className="bg-slate-800/40 border border-sky-900/30 rounded-lg p-3"><p className="text-sky-300 font-mono text-xs font-bold mb-1">Section 4: Key Concepts</p><p className="text-slate-400 text-xs">Images, containers, volumes</p></div>
                  <div className="bg-slate-800/40 border border-sky-900/30 rounded-lg p-3"><p className="text-sky-300 font-mono text-xs font-bold mb-1">Section 5: Docker vs VMs</p><p className="text-slate-400 text-xs">Comparison of technologies</p></div>
                  <div className="bg-slate-800/40 border border-sky-900/30 rounded-lg p-3"><p className="text-sky-300 font-mono text-xs font-bold mb-1">Section 6: Best Practices</p><p className="text-slate-400 text-xs">Small images, caching, security</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-sky-950/30 to-blue-950/30 border border-sky-900/50 rounded-lg p-4">
                <p className="text-sky-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-sky-400 font-semibold">Docker containers</span> package and run applications consistently.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gear Icon Button */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] transition-all animate-bounce"
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
              <div className="w-12 h-12 border-2 border-sky-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-sky-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && (
        <GameInstructions
          visible={showInstructions}
          onDismiss={() => setShowInstructions(false)}
          onShow={() => setShowInstructions(true)}
          theme="cyan"
          title="How to Play"
          subtitle="Use arrow keys to move. Bounce to enter the zone."
        />
      )}

      {ballVisible && gateUnlocked && !showInstructions && (
        <div className="fixed z-30 pointer-events-none">
          <BounceAvatar className="w-4 h-4 opacity-70" />
        </div>
      )}

      <div ref={scrollContainerRef} className="pt-32 pb-20 h-screen overflow-y-auto custom-scrollbar">
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-sky-300 mb-6">What is Docker?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Docker packages applications with dependencies into containers. Containers run consistently across dev, staging, and production.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                No more "works on my machine". Build once, run anywhere.
              </p>
              <div className="mt-6 p-4 bg-sky-500/10 border border-sky-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-sky-200">
                  <strong>Mental Model:</strong> Containers are like shipping containers—standardized boxes that work on any ship, truck, or train.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-blue-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-sky-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Box className="w-24 h-24 text-sky-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-sky-300 mb-8 text-center">Why Docker?</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-sky-600/20 to-blue-600/20 border border-sky-500/30 rounded-xl">
                <p className="font-bold text-sky-300 mb-2">Consistency</p>
                <p className="text-sm text-slate-300">Same environment everywhere. Dev matches production. No configuration drift.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-sky-600/20 to-blue-600/20 border border-sky-500/30 rounded-xl">
                <p className="font-bold text-sky-300 mb-2">Isolation</p>
                <p className="text-sm text-slate-300">Each app in own container. No dependency conflicts. Multiple versions coexist.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-sky-600/20 to-blue-600/20 border border-sky-500/30 rounded-xl">
                <p className="font-bold text-sky-300 mb-2">Speed</p>
                <p className="text-sm text-slate-300">Start in seconds. Deploy faster. Scale horizontally. Lightweight vs VMs.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-sky-300 mb-8 text-center">Interactive: Build Container</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-sky-500/30 rounded-xl p-8">
              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={handleBuild}
                  disabled={building}
                  className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                  {building ? 'Building...' : 'Build Image'}
                  <Box size={16} />
                </button>

                {building && (
                  <div className="w-full max-w-md space-y-2">
                    <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-slate-300">Step 1/5: FROM node:18</span>
                    </div>
                    <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-slate-300">Step 2/5: WORKDIR /app</span>
                    </div>
                  </div>
                )}

                <div className="w-full max-w-md">
                  <p className="text-sm text-sky-300 mb-3 font-bold">Running Containers:</p>
                  <div className="space-y-2">
                    {containers.length === 0 && (
                      <div className="p-4 border-2 border-dashed border-slate-600 rounded text-center text-slate-500 text-sm">
                        No containers running
                      </div>
                    )}
                    {containers.map((c, idx) => (
                      <div key={c} className="p-3 bg-sky-500/20 border border-sky-500/30 rounded flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-green-400" size={16} />
                          <span className="text-xs text-slate-300 font-mono">{c}</span>
                        </div>
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">running</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-sky-300 mb-8 text-center">Key Concepts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-sky-500/30 rounded-xl">
                <Package className="text-sky-400 mb-2" size={20} />
                <h4 className="font-bold text-sky-300 mb-2">Image</h4>
                <p className="text-sm text-slate-300">Blueprint for container. Immutable. Layered filesystem. Shared across containers.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-sky-500/30 rounded-xl">
                <Box className="text-sky-400 mb-2" size={20} />
                <h4 className="font-bold text-sky-300 mb-2">Container</h4>
                <p className="text-sm text-slate-300">Running instance of image. Isolated process. Ephemeral. State lost on stop.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-sky-500/30 rounded-xl">
                <Layers className="text-sky-400 mb-2" size={20} />
                <h4 className="font-bold text-sky-300 mb-2">Dockerfile</h4>
                <p className="text-sm text-slate-300">Build script. FROM, COPY, RUN, CMD. Reproducible builds.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-sky-500/30 rounded-xl">
                <Server className="text-sky-400 mb-2" size={20} />
                <h4 className="font-bold text-sky-300 mb-2">Volume</h4>
                <p className="text-sm text-slate-300">Persistent storage. Survives container restarts. Shared data. Database files.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-sky-500/30 rounded-xl">
                <Zap className="text-sky-400 mb-2" size={20} />
                <h4 className="font-bold text-sky-300 mb-2">Network</h4>
                <p className="text-sm text-slate-300">Container communication. Bridge, host, overlay modes. Service discovery.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-sky-500/30 rounded-xl">
                <Layers className="text-sky-400 mb-2" size={20} />
                <h4 className="font-bold text-sky-300 mb-2">Compose</h4>
                <p className="text-sm text-slate-300">Multi-container apps. YAML config. One command deploy. Dev environments.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-sky-300 mb-8 text-center">Docker vs VMs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-sky-500/10 border border-sky-500/30 rounded-xl">
                <h4 className="font-bold text-sky-300 mb-4 text-center">Docker Containers</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    Lightweight (MB)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    Start in seconds
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    Share host kernel
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    High density
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-slate-700/50 border border-slate-600 rounded-xl">
                <h4 className="font-bold text-slate-300 mb-4 text-center">Virtual Machines</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>Heavy (GB)</li>
                  <li>Start in minutes</li>
                  <li>Full OS per VM</li>
                  <li>Lower density</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-sky-300 mb-8 text-center">Best Practices</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-sky-600/20 to-blue-600/20 border border-sky-500/30 rounded-xl">
                <p className="font-bold text-sky-300 mb-2">Small Images</p>
                <p className="text-sm text-slate-300">Use Alpine Linux. Multi-stage builds. Remove build tools. .dockerignore file.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-sky-600/20 to-blue-600/20 border border-sky-500/30 rounded-xl">
                <p className="font-bold text-sky-300 mb-2">Layer Caching</p>
                <p className="text-sm text-slate-300">Order matters. Copy package.json before code. Rebuild only changed layers.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-sky-600/20 to-blue-600/20 border border-sky-500/30 rounded-xl">
                <p className="font-bold text-sky-300 mb-2">Security</p>
                <p className="text-sm text-slate-300">Non-root user. Scan images. No secrets in images. Use secrets management.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
