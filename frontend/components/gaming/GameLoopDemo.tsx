'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Zap, RefreshCw, Clock } from 'lucide-react';
import { BounceAvatar, SidebarNav, PageMadeModal, GearButton } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const GameLoopDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [loopRunning, setLoopRunning] = useState(false);
  const [loopStep, setLoopStep] = useState(0);
  const steps = ['Input', 'Update', 'Render', 'Wait'];
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'The Game Loop' },
    { id: 'section-2', label: 'Loop Phases' },
    { id: 'section-3', label: 'Loop Simulation' },
    { id: 'section-4', label: 'Timing Models' },
    { id: 'section-5', label: 'Performance Budget' },
    { id: 'section-6', label: 'Common Issues' },
  ];

  const sectionDetails = [
    { label: 'The Game Loop', description: 'Core concept overview' },
    { label: 'Loop Phases', description: 'Input, Update, Render' },
    { label: 'Loop Simulation', description: 'Interactive visualization' },
    { label: 'Timing Models', description: 'Fixed vs variable timestep' },
    { label: 'Performance Budget', description: '16.67ms frame budget' },
    { label: 'Common Issues', description: 'Frame drops, input lag, tearing' },
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

  useEffect(() => {
    if (!loopRunning) return;
    const interval = setInterval(() => {
      setLoopStep(prev => (prev + 1) % steps.length);
    }, 800);
    return () => clearInterval(interval);
  }, [loopRunning, steps.length]);

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">


      {/* Header Component */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
        title="Game Loop"
        levelCode="G02"
        accentColor="purple"
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

      {/* Page Architecture Modal */}
      <PageMadeModal
        isOpen={showPageMadeModal}
        onClose={() => setShowPageMadeModal(false)}
        title="Game Loop"
        levelCode="G02"
        icon="🔄"
        description="This page covers the Game Loop with 6 sections including an interactive loop simulation."
        sections={sectionDetails}
        accentColor="purple"
        learningSummary="How the game loop drives input, update, and render cycles at 60 FPS."
      />

      {/* Gear Icon Button */}
      <GearButton
        onClick={() => setShowPageMadeModal(true)}
        accentColor="purple"
      />

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
              <div className="w-12 h-12 border-2 border-purple-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-purple-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-purple-300 mb-4">Use Arrow Keys</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-slate-700/50 rounded text-center">
                <p className="text-xs font-bold mb-1">UP</p>
                <p className="text-xs text-slate-400">Scroll</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded text-center">
                <p className="text-xs font-bold mb-1">DOWN</p>
                <p className="text-xs text-slate-400">Scroll</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded text-center">
                <p className="text-xs font-bold mb-1">LEFT</p>
                <p className="text-xs text-slate-400">Move</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded text-center">
                <p className="text-xs font-bold mb-1">RIGHT</p>
                <p className="text-xs text-slate-400">Move</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center">Press any key to continue</p>
          </div>
        </div>
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
              <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-6">The Game Loop</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Every game runs on a loop: Input {'>'} Update {'>'} Render {'>'} Repeat. This repeats 60 times per second (60 FPS).
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                The game loop is the heartbeat of any game. It handles all interactions, physics updates, and graphics rendering.
              </p>
              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-purple-200">
                  <strong>Key Insight:</strong> 60 FPS = 16.67ms per frame. Every millisecond counts for responsiveness.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-purple-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <RefreshCw className="w-24 h-24 text-purple-400 animate-spin" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Loop Phases</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">1. Input Phase</p>
                <p className="text-sm text-slate-300">Capture keyboard, mouse, controller input. Build event queue. Non-blocking.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">2. Update Phase</p>
                <p className="text-sm text-slate-300">Process events. Update entity positions, apply physics, check collisions, run AI, resolve game logic.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">3. Render Phase</p>
                <p className="text-sm text-slate-300">Draw all entities to screen. Submit to GPU. Buffer swap. Compose final image.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">4. Frame Sync</p>
                <p className="text-sm text-slate-300">Wait for vsync or fixed timestep. Maintain 60 FPS. Sleep if ahead. Prevent tearing.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Interactive: Loop Simulation</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-xl p-8">
              <button
                onClick={() => setLoopRunning(!loopRunning)}
                className={`w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors mb-8 ${loopRunning ? 'opacity-75' : ''}`}
              >
                {loopRunning ? 'Stop Loop' : 'Start Loop'}
              </button>

              <div className="grid grid-cols-4 gap-3">
                {steps.map((step, idx) => (
                  <div key={step} className={`p-6 rounded-lg border text-center transition-all ${loopStep === idx ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/30 scale-105' :
                    loopRunning ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-700/50 border-slate-600'
                    }`}>
                    <p className={`text-sm font-bold ${loopStep === idx ? 'text-purple-300' : 'text-slate-400'}`}>{step}</p>
                    <p className="text-xs text-slate-500 mt-2">{loopStep === idx ? 'Running' : 'Waiting'}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <p className="text-xs text-slate-300">
                  <strong>FPS:</strong> 60 | <strong>Frame Time:</strong> 16.67ms | <strong>Current Step:</strong> {steps[loopStep]}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Timing Models</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Fixed Timestep</h4>
                <p className="text-sm text-slate-300">Always update with same dt. Deterministic. Better for multiplayer. Harder to maintain 60 FPS.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Variable Timestep</h4>
                <p className="text-sm text-slate-300">dt varies per frame. Smooth 60 FPS. Easier but less predictable. Physics drift possible.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Accumulator Pattern</h4>
                <p className="text-sm text-slate-300">Hybrid approach. Fixed logic steps. Variable render rate. Best of both worlds.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Frame Skipping</h4>
                <p className="text-sm text-slate-300">Skip render, do logic multiple times. Mobile optimization. Lower visual fidelity.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Performance Budget</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">16.67ms per frame (60 FPS)</p>
                <p className="text-sm text-slate-300">Total time from start to finish. Input + Update + Render + Wait.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Input: 1-2ms</p>
                <p className="text-sm text-slate-300">Poll input devices. Very fast. Usually negligible.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Update: 5-8ms</p>
                <p className="text-sm text-slate-300">Physics, AI, logic. Most CPU work. Can vary widely.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Render: 5-8ms</p>
                <p className="text-sm text-slate-300">GPU work. Draw calls, shaders. GPU bound or CPU bound?</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Common Issues</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Frame Drops</p>
                <p className="text-sm text-slate-300">One frame takes too long. Causes hitches. Usually GC, physics, or rendering.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Input Lag</p>
                <p className="text-sm text-slate-300">User presses button but action delayed. Polling too slowly or buffering input.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Tearing</p>
                <p className="text-sm text-slate-300">Horizontal lines on screen. Render + display mismatch. Use vsync to fix.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
