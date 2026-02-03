'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { BounceAvatar, SidebarNav } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const UberDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [rideStatus, setRideStatus] = useState('idle');
  const [eta, setEta] = useState('--');
  const [price, setPrice] = useState('$0.00');
  const [nearbyDrivers, setNearbyDrivers] = useState(3);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Uber' },
    { id: 'section-2', label: 'Core Systems' },
    { id: 'section-3', label: 'Ride Demo' },
    { id: 'section-4', label: 'Architecture' },
    { id: 'section-5', label: 'Challenges' },
    { id: 'section-6', label: 'Tech Stack' },
  ];

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

  const handleRequestRide = () => {
    setRideStatus('finding');
    setPrice('$12.50');
    setTimeout(() => {
      setRideStatus('accepted');
      setEta('4 min away');
    }, 2000);
  };

  const handleCancelRide = () => {
    setRideStatus('idle');
    setEta('--');
    setPrice('$0.00');
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
        accentColor="sky"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-gray-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(107,114,128,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-gray-400 text-xs font-mono mt-1">CS02 — Uber Case Study</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-gray-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🚗</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This case study covers Uber's architecture with 6 sections including an interactive ride request demo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-gray-900/30 rounded-lg p-3"><p className="text-gray-300 font-mono text-xs font-bold mb-1">Section 1: Uber</p><p className="text-slate-400 text-xs">Platform overview</p></div>
                  <div className="bg-slate-800/40 border border-gray-900/30 rounded-lg p-3"><p className="text-gray-300 font-mono text-xs font-bold mb-1">Section 2: Core Systems</p><p className="text-slate-400 text-xs">Matching, location, pricing</p></div>
                  <div className="bg-slate-800/40 border border-gray-900/30 rounded-lg p-3"><p className="text-gray-300 font-mono text-xs font-bold mb-1">Section 3: Ride Demo</p><p className="text-slate-400 text-xs">Interactive ride request</p></div>
                  <div className="bg-slate-800/40 border border-gray-900/30 rounded-lg p-3"><p className="text-gray-300 font-mono text-xs font-bold mb-1">Section 4: Architecture</p><p className="text-slate-400 text-xs">Microservices, queues</p></div>
                  <div className="bg-slate-800/40 border border-gray-900/30 rounded-lg p-3"><p className="text-gray-300 font-mono text-xs font-bold mb-1">Section 5: Challenges</p><p className="text-slate-400 text-xs">Speed, consistency, fault tolerance</p></div>
                  <div className="bg-slate-800/40 border border-gray-900/30 rounded-lg p-3"><p className="text-gray-300 font-mono text-xs font-bold mb-1">Section 6: Tech Stack</p><p className="text-slate-400 text-xs">Node.js, Go, Kafka</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-950/30 to-slate-950/30 border border-gray-900/50 rounded-lg p-4">
                <p className="text-gray-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-gray-400 font-semibold">Uber</span> matches millions of drivers and riders at massive scale.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gear Icon Button */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full shadow-[0_0_20px_rgba(107,114,128,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(107,114,128,0.8)] transition-all animate-bounce"
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
            <p className="text-slate-300 text-lg mb-4 hidden md:block">Press any arrow key to unlock</p>
            <p className="text-slate-300 text-lg mb-4 md:hidden">Tap anywhere to unlock</p>
            <div className="flex gap-3 justify-center opacity-60 text-sm hidden md:flex">
              <span>UP</span>
              <span>DOWN</span>
              <span>LEFT</span>
              <span>RIGHT</span>
            </div>
            <div className="md:hidden flex flex-col items-center text-slate-500 mt-4">
              <div className="w-12 h-12 border-2 border-sky-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-sky-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-gray-600/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-gray-300 mb-4">Use Arrow Keys</h3>
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
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-6">Uber</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Ridesharing platform matching millions of drivers and riders worldwide, processing matching requests milliseconds.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Handles real-time location tracking, surge pricing, routing optimization, and payment processing.
              </p>
              <div className="mt-6 p-4 bg-gray-600/10 border border-gray-600/30 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-200">
                  <strong>Challenge:</strong> Match 100k+ drivers and riders in seconds at massive scale.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-gray-600/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Navigation className="w-24 h-24 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-8 text-center">Core Systems</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Matching Engine</p>
                <p className="text-sm text-slate-300">Find optimal driver for rider. Proximity, ETA, ratings. Real-time.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Location Tracking</p>
                <p className="text-sm text-slate-300">GPS updates per second. Quadtree spatial indexing. Live maps.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Surge Pricing</p>
                <p className="text-sm text-slate-300">Dynamic pricing. High demand areas. Real-time adjustment.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Payment Processing</p>
                <p className="text-sm text-slate-300">Stripe integration. Split payments. Instant settlement.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-8 text-center">Interactive: Ride Request</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-gray-600/30 rounded-xl p-6 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Nearby Drivers</p>
                  <p className="text-2xl font-bold text-gray-300">{nearbyDrivers}</p>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <p className="text-lg font-bold text-gray-300 capitalize">{rideStatus}</p>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">ETA</p>
                  <p className="text-lg font-bold text-gray-300">{eta}</p>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Estimated Price</p>
                  <p className="text-lg font-bold text-gray-300">{price}</p>
                </div>

                {rideStatus === 'idle' && (
                  <button
                    onClick={handleRequestRide}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Request Ride
                  </button>
                )}

                {rideStatus !== 'idle' && (
                  <button
                    onClick={handleCancelRide}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-8 text-center">Architecture</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Microservices</p>
                <p className="text-sm text-slate-300">Matching service, location service, payment service. Independent scaling.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Message Queues</p>
                <p className="text-sm text-slate-300">Kafka for ride events. Asynchronous processing. At-least-once delivery.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Geospatial Database</p>
                <p className="text-sm text-slate-300">PostGIS for location queries. Quadtree for proximity search.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Real-time Communication</p>
                <p className="text-sm text-slate-300">WebSocket, push notifications. Live driver updates to riders.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-8 text-center">Scaling Challenges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-gray-600/30 rounded-xl">
                <h4 className="font-bold text-gray-300 mb-2">Matching Speed</h4>
                <p className="text-sm text-slate-300">Find best driver in &lt;1 second. ML ranking models.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-gray-600/30 rounded-xl">
                <h4 className="font-bold text-gray-300 mb-2">Consistency</h4>
                <p className="text-sm text-slate-300">Prevent double-booking. Distributed transactions.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-gray-600/30 rounded-xl">
                <h4 className="font-bold text-gray-300 mb-2">Fault Tolerance</h4>
                <p className="text-sm text-slate-300">99.99% uptime. Multiple regions. Replication.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-gray-600/30 rounded-xl">
                <h4 className="font-bold text-gray-300 mb-2">Real-time Analytics</h4>
                <p className="text-sm text-slate-300">Surge pricing decisions. Heat maps. Predictive dispatch.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-8 text-center">Tech Stack</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Backend: Node.js, Go, Java</p>
                <p className="text-sm text-slate-300">Microservices. High throughput. Language flexibility.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Databases: PostgreSQL, Cassandra, Redis</p>
                <p className="text-sm text-slate-300">Relational + NoSQL. Cache layer. High availability.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Message Broker: Kafka</p>
                <p className="text-sm text-slate-300">Event streaming. Asynchronous processing. Audit trail.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/30 rounded-xl">
                <p className="font-bold text-gray-300 mb-2">Container Orchestration: Kubernetes</p>
                <p className="text-sm text-slate-300">Automated deployment. Self-healing. Multi-region.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
