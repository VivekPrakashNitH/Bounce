'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Wifi, Server, Users, BarChart3 } from 'lucide-react';
import { BounceAvatar, SidebarNav, PageMadeModal, GearButton } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const GameNetworkingDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [ping, setPing] = useState(0);
  const [sending, setSending] = useState(false);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Networking' },
    { id: 'section-2', label: 'Architectures' },
    { id: 'section-3', label: 'Ping Test' },
    { id: 'section-4', label: 'Compensation' },
    { id: 'section-5', label: 'Protocols' },
    { id: 'section-6', label: 'Best Practices' },
  ];

  const sectionDetails = [
    { label: 'Networking', description: 'Multiplayer fundamentals' },
    { label: 'Architectures', description: 'Client-server, P2P, hybrid' },
    { label: 'Ping Test', description: 'Interactive latency simulation' },
    { label: 'Compensation', description: 'Prediction, interpolation' },
    { label: 'Protocols', description: 'TCP, UDP, QUIC' },
    { label: 'Best Practices', description: 'Tick rate, server authority' },
  ];

  const handleTouchUnlock = () => {
    if (!gateUnlocked) {
      setGateUnlocked(true);
      setTimeout(() => setShowInstructions(false), 1500);
    }
  };

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
      handleScroll();
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gateUnlocked, showInstructions, onProgress, initialSectionIndex, initialScrollDone]);

  useEffect(() => {
    setBallVisible(currentSection !== 3);
  }, [currentSection]);

  const simulatePing = () => {
    setSending(true);
    setPing(0);
    const duration = 50 + Math.random() * 150;
    const interval = setInterval(() => {
      setPing(p => {
        if (p >= duration) {
          clearInterval(interval);
          setSending(false);
          return duration;
        }
        return p + 5;
      });
    }, 20);
  };

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">


      {/* Header Component */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
        title="Game Networking"
        levelCode="G04"
        accentColor="orange"
      />

      <SidebarNav
        sections={sections}
        activeIndex={currentSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="orange"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      <PageMadeModal
        isOpen={showPageMadeModal}
        onClose={() => setShowPageMadeModal(false)}
        title="Game Networking"
        levelCode="G04"
        icon="📶"
        description="This page covers game networking with 6 sections including an interactive ping test."
        sections={sectionDetails}
        accentColor="orange"
        learningSummary="How multiplayer networking handles latency, synchronization, and game state."
      />

      {/* Gear Icon Button */}
      <GearButton
        onClick={() => setShowPageMadeModal(true)}
        accentColor="orange"
      />

      {!gateUnlocked && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center cursor-pointer"
          onClick={handleTouchUnlock}
          onTouchStart={handleTouchUnlock}
        >
          <div className="text-center">
            <BounceAvatar className="w-32 h-32 mx-auto mb-6 opacity-80" />
            <p className="text-slate-300 text-lg mb-4 hidden md:block">Press any arrow key to unlock</p>
            <p className="text-slate-300 text-lg mb-4 md:hidden">Tap anywhere to unlock</p>
            <div className="flex gap-3 justify-center opacity-60 text-sm hidden md:flex">
              <span>UP</span>
              <span>DOWN</span>
              <span>LEFT</span>
              <span>RIGHT</span>
            </div>
            <div className="md:hidden flex flex-col items-center text-slate-500 mt-4">
              <div className="w-12 h-12 border-2 border-orange-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-orange-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-orange-500/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-orange-300 mb-4">Use Arrow Keys</h3>
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
              <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-6">Game Networking</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Multiplayer games require synchronizing state across players. Latency, bandwidth, packet loss are challenges.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Networking architectures: client-server, peer-to-peer, hybrid. Each has trade-offs.
              </p>
              <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-orange-200">
                  <strong>Key Insight:</strong> Lower ping = better responsiveness. Latency is the main enemy of online gaming.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-orange-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Wifi className="w-24 h-24 text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-8 text-center">Network Architectures</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl">
                <p className="font-bold text-orange-300 mb-2">Client-Server</p>
                <p className="text-sm text-slate-300">Central server is authority. Clients send input, receive game state. Anti-cheat. Single point of failure.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl">
                <p className="font-bold text-orange-300 mb-2">Peer-to-Peer</p>
                <p className="text-sm text-slate-300">No central server. Direct player-to-player. Scales well. Harder to prevent cheating.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl">
                <p className="font-bold text-orange-300 mb-2">Hybrid</p>
                <p className="text-sm text-slate-300">Central server + P2P for gameplay. Best of both. Complex architecture.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-8 text-center">Interactive: Ping Test</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-orange-500/30 rounded-xl p-8">
              <button
                onClick={simulatePing}
                disabled={sending}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-colors mb-8 disabled:opacity-50"
              >
                {sending ? 'Testing...' : 'Test Ping'}
              </button>

              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <p className="text-xs text-slate-400">Ping</p>
                  <p className="text-3xl font-bold text-orange-300">{ping.toFixed(0)}ms</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Network Quality</p>
                  <div className="w-full bg-slate-700 rounded-lg h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${ping < 50 ? 'bg-green-500 w-full' :
                        ping < 100 ? 'bg-yellow-500 w-3/4' :
                          'bg-red-500 w-1/2'
                        }`}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {ping === 0 ? 'Waiting' : ping < 50 ? 'Excellent' : ping < 100 ? 'Good' : 'Poor'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-8 text-center">Latency Compensation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">Prediction</h4>
                <p className="text-sm text-slate-300">Predict opponent movement. Extrapolate from velocity. Smooth gameplay despite latency.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">Interpolation</h4>
                <p className="text-sm text-slate-300">Blend between states. Smooth positions. Delay for smooth rendering.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">Lag Compensation</h4>
                <p className="text-sm text-slate-300">Server rewinds state. Check if bullets hit. Fair for both sides.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">Dead Reckoning</h4>
                <p className="text-sm text-slate-300">Calculate position without updates. Update only when deviation too large.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-8 text-center">Network Protocols</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl">
                <p className="font-bold text-orange-300 mb-2">TCP</p>
                <p className="text-sm text-slate-300">Reliable, ordered delivery. Retransmits lost packets. Slower. Login, chat.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl">
                <p className="font-bold text-orange-300 mb-2">UDP</p>
                <p className="text-sm text-slate-300">Fast, unreliable. No retransmit. Lower latency. Player movement, shooting.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl">
                <p className="font-bold text-orange-300 mb-2">QUIC</p>
                <p className="text-sm text-slate-300">Modern replacement. Combines TCP reliability + UDP speed. Becoming standard.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-8 text-center">Best Practices</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl">
                <p className="font-bold text-orange-300 mb-2">Minimize Data</p>
                <p className="text-sm text-slate-300">Send only changes, not full state. Delta compression. Reduce bandwidth.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl">
                <p className="font-bold text-orange-300 mb-2">Tick Rate</p>
                <p className="text-sm text-slate-300">Server update frequency. 64Hz for esports. 20Hz for casual. Balance fidelity vs bandwidth.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl">
                <p className="font-bold text-orange-300 mb-2">Server Authority</p>
                <p className="text-sm text-slate-300">Server is source of truth. Validate all actions. Prevent cheating.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
