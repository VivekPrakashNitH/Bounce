'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layers, Code2, MousePointerClick } from 'lucide-react';
import { BounceAvatar, SidebarNav, PageMadeModal, GearButton } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const GameArchDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Architecture' },
    { id: 'section-2', label: 'Core Layers' },
    { id: 'section-3', label: 'Layer Picker' },
    { id: 'section-4', label: 'Design Patterns' },
    { id: 'section-5', label: 'Performance' },
    { id: 'section-6', label: 'Engines' },
  ];

  // Section details for PageMadeModal
  const sectionDetails = [
    { label: 'Architecture', description: 'Game structure overview' },
    { label: 'Core Layers', description: 'Rendering, physics, input, logic' },
    { label: 'Layer Picker', description: 'Interactive layer exploration' },
    { label: 'Design Patterns', description: 'ECS, game loop, state machine' },
    { label: 'Performance', description: 'Frame pacing, culling, memory' },
    { label: 'Engines', description: 'Unity, Unreal, Godot' },
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

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">


      {/* Header Component */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
        title="Game Architecture"
        levelCode="G01"
        accentColor="cyan"
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
        accentColor="cyan"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      <PageMadeModal
        isOpen={showPageMadeModal}
        onClose={() => setShowPageMadeModal(false)}
        title="Game Architecture"
        levelCode="G01"
        icon="🎮"
        description="This page covers Game Architecture with 6 sections including an interactive layer picker."
        sections={sectionDetails}
        accentColor="cyan"
        learningSummary="How game architecture organizes rendering, physics, and game logic layers."
      />

      {/* Gear Icon Button */}
      <GearButton
        onClick={() => setShowPageMadeModal(true)}
        accentColor="cyan"
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
              <div className="w-12 h-12 border-2 border-cyan-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-cyan-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-cyan-300 mb-4">Use Arrow Keys</h3>
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
              <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-6">Game Architecture</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Game architecture defines how a game is structured and organized. It includes the engine, rendering system, physics, input handling, and game logic.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Good architecture = scalable, maintainable, and performant games.
              </p>
              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-cyan-200">
                  <strong>Key Insight:</strong> Layers separate concerns—rendering, physics, input, AI all independent.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-cyan-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Layers className="w-24 h-24 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Core Layers</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Rendering Layer</p>
                <p className="text-sm text-slate-300">Draws sprites, models, effects. Handles 2D/3D graphics, z-ordering, particle systems.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Physics Layer</p>
                <p className="text-sm text-slate-300">Collision detection, movement, forces, gravity. Determines if two objects touch.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Input Layer</p>
                <p className="text-sm text-slate-300">Keyboard, mouse, controller input. Translates user actions into game events.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Game Logic Layer</p>
                <p className="text-sm text-slate-300">Entities, behaviors, AI, scoring, win/lose conditions. Core game rules.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Interactive: Layer Picker</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-xl p-8">
              <p className="text-sm text-slate-400 mb-6">Click a layer to learn more:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Rendering', 'Physics', 'Input', 'Logic'].map(layer => (
                  <button
                    key={layer}
                    onClick={() => setSelectedLayer(selectedLayer === layer ? null : layer)}
                    className={`p-4 rounded-lg border transition-all ${selectedLayer === layer
                      ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-700/50 border-slate-600 hover:border-cyan-500/50'
                      }`}
                  >
                    <p className="font-bold text-cyan-300">{layer}</p>
                  </button>
                ))}
              </div>
              {selectedLayer && (
                <div className="mt-6 p-4 bg-cyan-600/10 border border-cyan-500/30 rounded-lg">
                  <p className="text-sm text-cyan-200">
                    {selectedLayer === 'Rendering' && 'Handles visual output. Canvas, WebGL, sprite rendering. 60 FPS target.'}
                    {selectedLayer === 'Physics' && 'Simulates movement and collisions. Separates objects, applies forces.'}
                    {selectedLayer === 'Input' && 'Event handlers for keyboard, mouse, touch. Maps to game actions.'}
                    {selectedLayer === 'Logic' && 'Game entities, AI decisions, scoring, state management. Core loop.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Design Patterns</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-cyan-500/30 rounded-xl">
                <h4 className="font-bold text-cyan-300 mb-2">Entity-Component-System</h4>
                <p className="text-sm text-slate-300">Entities have components. Systems operate on components. Flexible and scalable.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-cyan-500/30 rounded-xl">
                <h4 className="font-bold text-cyan-300 mb-2">Game Loop</h4>
                <p className="text-sm text-slate-300">Update, render, repeat. Fixed timestep vs variable. Deterministic vs smooth.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-cyan-500/30 rounded-xl">
                <h4 className="font-bold text-cyan-300 mb-2">State Machine</h4>
                <p className="text-sm text-slate-300">Menu, Playing, Paused, GameOver. State transitions. Handles flow control.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-cyan-500/30 rounded-xl">
                <h4 className="font-bold text-cyan-300 mb-2">Object Pooling</h4>
                <p className="text-sm text-slate-300">Reuse objects instead of creating/destroying. Reduces GC pauses. Faster.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Performance Considerations</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Frame Pacing</p>
                <p className="text-sm text-slate-300">Target 60 FPS. Budget: 16ms per frame. Profiling critical. Avoid frame drops.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Culling & LOD</p>
                <p className="text-sm text-slate-300">Only render visible objects. Lower detail distant objects. Huge performance gain.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Memory Management</p>
                <p className="text-sm text-slate-300">Cache-friendly data structures. Avoid allocations in hot loops. Object pooling.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Popular Engines</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Unity</p>
                <p className="text-sm text-slate-300">C#, 2D/3D, physics, networking. Industry standard. Huge ecosystem.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Unreal Engine</p>
                <p className="text-sm text-slate-300">C++, AAA quality. Real-time rendering. Photorealistic graphics.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Godot</p>
                <p className="text-sm text-slate-300">GDScript, open-source. Lightweight. Growing indie community.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
