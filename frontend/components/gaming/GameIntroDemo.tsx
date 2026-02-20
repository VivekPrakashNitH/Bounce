'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Zap, Users, TrendingUp } from 'lucide-react';
import { BounceAvatar, SidebarNav, PageMadeModal, GearButton, GateKeeper } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const GameIntroDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Introduction' },
    { id: 'section-2', label: 'Categories' },
    { id: 'section-3', label: 'Fundamentals' },
    { id: 'section-4', label: 'Technologies' },
    { id: 'section-5', label: 'Statistics' },
  ];

  const sectionDetails = [
    { label: 'Introduction', description: 'What is gaming development' },
    { label: 'Categories', description: 'Action, strategy, puzzle, RPG' },
    { label: 'Fundamentals', description: 'Game loop, feedback, progression' },
    { label: 'Technologies', description: 'Rendering, physics, audio' },
    { label: 'Statistics', description: 'Industry numbers and trends' },
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
        title="Gaming Introduction"
        levelCode="G00"
        accentColor="green"
      />

      <SidebarNav
        sections={sections}
        activeIndex={currentSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="green"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      <PageMadeModal
        isOpen={showPageMadeModal}
        onClose={() => setShowPageMadeModal(false)}
        title="Gaming Introduction"
        levelCode="G00"
        icon="🎮"
        description="This page introduces game development with 5 sections covering fundamentals and industry overview."
        sections={sectionDetails}
        accentColor="green"
        learningSummary="The fundamentals of game development including categories, core mechanics, and technologies."
      />

      {/* Gear Icon Button */}
      <GearButton
        onClick={() => setShowPageMadeModal(true)}
        accentColor="green"
      />

      {!gateUnlocked && (
        <GateKeeper
          title="Level G00"
          subtitle="Gaming Introduction"
          description="Explore the fundamentals of game development and the gaming industry."
          difficulty="Beginner"
          theme="nature"
          onUnlock={() => setGateUnlocked(true)}
        />
      )}

      {ballVisible && gateUnlocked && (
        <div className="fixed z-30 pointer-events-none">
          <BounceAvatar className="w-4 h-4 opacity-70" />
        </div>
      )}

      <div ref={scrollContainerRef} className="pt-32 pb-20 h-screen overflow-y-auto custom-scrollbar">
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-green-300 mb-6">Gaming Development</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Games are interactive software that engage players through real-time interaction, feedback loops, and engaging mechanics.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Building games requires understanding architecture, physics, rendering, networking, and optimization.
              </p>
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-green-200">
                  <strong>Why Games Matter:</strong> 3 billion gamers globally. Multi-billion dollar industry. Cutting-edge tech.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-green-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Gamepad2 className="w-24 h-24 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-green-300 mb-8 text-center">Game Categories</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">Action Games</p>
                <p className="text-sm text-slate-300">Real-time gameplay. Reflexes matter. Fast-paced combat or challenges. FPS, platformers.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">Strategy Games</p>
                <p className="text-sm text-slate-300">Tactical thinking. Planning matters. Turn-based or real-time strategy. Chess-like depth.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">Puzzle Games</p>
                <p className="text-sm text-slate-300">Problem-solving. Logic puzzles. Satisfying mechanics. Tetris, Portal-style games.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">RPG Games</p>
                <p className="text-sm text-slate-300">Character progression. Story-driven. Immersive worlds. Dungeons, dragons, adventure.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-green-300 mb-8 text-center">Game Fundamentals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-green-500/30 rounded-xl">
                <h4 className="font-bold text-green-300 mb-2">Gameplay Loop</h4>
                <p className="text-sm text-slate-300">Input -&gt; Update -&gt; Render. Repeat 60 times/second. Smooth and responsive.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-green-500/30 rounded-xl">
                <h4 className="font-bold text-green-300 mb-2">Feedback Systems</h4>
                <p className="text-sm text-slate-300">Visual, audio, haptic feedback. Player feels in control. Satisfying feedback loops.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-green-500/30 rounded-xl">
                <h4 className="font-bold text-green-300 mb-2">Progression</h4>
                <p className="text-sm text-slate-300">Difficulty curves. Unlock mechanics. Leveling systems. Keep players engaged.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-green-500/30 rounded-xl">
                <h4 className="font-bold text-green-300 mb-2">Monetization</h4>
                <p className="text-sm text-slate-300">Premium games, F2P, battle pass, cosmetics, ads. Different models for different games.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-green-300 mb-8 text-center">Key Technologies</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">Rendering</p>
                <p className="text-sm text-slate-300">Graphics pipeline. 2D/3D rendering. Shaders, textures, lighting. GPU optimization.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">Physics Engine</p>
                <p className="text-sm text-slate-300">Collision detection. Gravity, forces, momentum. Realistic or arcade physics.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">Audio Engine</p>
                <p className="text-sm text-slate-300">Spatial audio, music systems, sound effects. FMOD, Wwise. Immersive audio.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-green-300 mb-8 text-center">Industry Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-green-500/30 rounded-xl text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-300">180B+</p>
                <p className="text-sm text-slate-300">Global gaming market size</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-green-500/30 rounded-xl text-center">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-300">3B+</p>
                <p className="text-sm text-slate-300">Active gamers worldwide</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-green-500/30 rounded-xl text-center">
                <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-300">60 FPS</p>
                <p className="text-sm text-slate-300">Target frame rate standard</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-green-500/30 rounded-xl text-center">
                <Gamepad2 className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-300">All Platforms</p>
                <p className="text-sm text-slate-300">PC, console, mobile, browser</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
