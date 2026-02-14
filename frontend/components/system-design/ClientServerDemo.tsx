
import React, { useState, useEffect } from 'react';
import { Laptop, Database, ArrowRight, ArrowLeft, Code2, MousePointerClick } from 'lucide-react';
import { BounceAvatar, SidebarNav, AnimatedBackground } from '../ui';
import { Header } from '../ui/Header';
import { ArchitectureInfo } from '../ui/ArchitectureInfo';
import { COURSE_CONTENT } from '../../data/courseContent';
import { GameState } from '../../types';

interface Props {
  onShowCode: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const ClientServerDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'processing' | 'receiving' | 'done'>('idle');
  const [data, setData] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [hoveredAnimation, setHoveredAnimation] = useState<string | null>(null);
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Model' },
    { id: 'section-2', label: 'Client' },
    { id: 'section-3', label: 'Network' },
    { id: 'section-4', label: 'Server' },
    { id: 'section-5', label: 'Response' },
    { id: 'section-6', label: 'Implications' },
  ];

  // --- Touch Unlock Logic ---


  // --- Scroll & Navigation Logic ---
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
      // Find the scrollable container - in CourseExperience it's the parent div
      const container = document.querySelector('.overflow-y-auto.custom-scrollbar');
      if (!container) return;

      const { scrollTop, clientHeight, scrollHeight } = container;

      // Calculate scroll progress
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      // Detect current section based on scroll position relative to container
      let activeSection = 0;
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          // Get element position relative to viewport, but we need to check if it's visible in the container
          const rect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // Check if the element's top is visible within the top half of the container
          // relative top position = rect.top - containerRect.top
          if (rect.top < containerRect.top + containerRect.height / 2) {
            activeSection = i;
          } else {
            break;
          }
        }
      }
      setCurrentSection(Math.min(activeSection, sections.length - 1));

      if (onProgress) {
        onProgress({ sectionIndex: activeSection, totalSections: sections.length });
      }
    };

    // We need to attach to the scrollable container found in CourseExperience
    const container = document.querySelector('.overflow-y-auto.custom-scrollbar');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // specific check on mount
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [sections.length, sections, onProgress, initialSectionIndex, initialScrollDone]);





  useEffect(() => {
    if (scrollProgress >= 90) {
      setCompletionProgress(Math.min((scrollProgress - 90) / 10, 1));
    }
  }, [scrollProgress]);

  const levelData = COURSE_CONTENT.find(l => l.id === GameState.LEVEL_CLIENT_SERVER);

  const handleRequest = () => {
    if (requestStatus !== 'idle' && requestStatus !== 'done') return;

    setHasInteracted(true);
    setRequestStatus('sending');
    setData(null);

    setTimeout(() => {
      setRequestStatus('processing');
      setTimeout(() => {
        setRequestStatus('receiving');
        setTimeout(() => {
          setRequestStatus('done');
          setData("JSON Data: { user: 'Alice', id: 1 }");
        }, 1000);
      }, 800);
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* Animated Doodle Background */}
      <AnimatedBackground variant="code" opacity={6} />

      {/* GAME GATE OVERLAY */}


      {/* CODE EXPLANATION PANEL */}
      {showCodePanel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-[0_0_40px_rgba(34,211,238,0.3)]">
            {/* Header */}
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-white">How Network Animation Works</h3>
              <button
                onClick={() => setShowCodePanel(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Explanation */}
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">The Concept</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The network animation simulates packet movement between client and server. When the request status changes, we update the position of a small circular element (the "packet") across a horizontal line, using CSS animations to create smooth motion.
                </p>
              </div>

              {/* Code Snippet */}
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Code Example</h4>
                <pre className="bg-black/50 border border-slate-700 rounded-lg p-4 text-[11px] sm:text-xs overflow-x-auto font-mono text-slate-300 leading-relaxed">
                  {`// State to track request lifecycle
const [requestStatus, setRequestStatus] = 
  useState('idle' | 'sending' | 'processing' | 'receiving' | 'done');

// Trigger animation on status change
{requestStatus === 'sending' && (
  <div className="animate-[moveDown_1s_linear_forwards]">
    <div className="w-3 h-3 bg-yellow-400 rounded-full 
                    shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
  </div>
)}

// CSS animation
@keyframes moveDown {
  0% { transform: translateY(-64px); }
  100% { transform: translateY(64px); }
}`}
                </pre>
              </div>

              {/* Key Takeaways */}
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Key Points</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>State drives rendering: Each request status has its own visual representation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>CSS animations handle motion: Keeps animation smooth and performant</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Color coding helps clarity: Yellow = request, Green = response</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-950/30 to-cyan-950/30 border border-cyan-900/50 rounded-lg p-4">
                <p className="text-cyan-400 font-semibold mb-2">Try This Yourself</p>
                <p className="text-slate-300 text-sm mb-3">
                  Modify the animation duration in the CSS @keyframes. Try changing 1s to 2s, or swap the axis from Y to X. See how it changes the behavior!
                </p>
                <button
                  onClick={() => setShowCodePanel(false)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Got It, Let's Go
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE ARCHITECTURE MODAL */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(147,51,234,0.3)]">
            {/* Header */}
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-purple-400 text-xs font-mono mt-1">Level 1: Client-Server Model</p>
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
                <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">🏗️</span> Page Architecture
                </h4>
                <div className="space-y-3">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    This page uses a <span className="text-cyan-400 font-semibold">scroll-driven learning system</span> with 6 major sections:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 1: Model</p>
                      <p className="text-slate-400 text-xs">Introduction to client-server fundamentals</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 2: Client</p>
                      <p className="text-slate-400 text-xs">Deep dive into client responsibilities</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 3: Network</p>
                      <p className="text-slate-400 text-xs">Interactive latency & packet animation</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 4: Server</p>
                      <p className="text-slate-400 text-xs">Server processing & concurrency</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 5: Response</p>
                      <p className="text-slate-400 text-xs">Round-trip completion & tradeoffs</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 6: Why It Matters</p>
                      <p className="text-slate-400 text-xs">6-point framework of real-world constraints</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Pattern */}
              <div>
                <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">📐</span> Layout Pattern
                </h4>
                <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                  Each section alternates left-right layout:
                </p>
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-blue-950/30 to-transparent border border-blue-900/30 rounded-lg p-3">
                    <p className="text-blue-400 text-xs font-mono font-bold">Odd Sections (1, 3, 5)</p>
                    <p className="text-slate-400 text-xs">Content LEFT · Visual RIGHT</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-950/30 to-transparent border border-purple-900/30 rounded-lg p-3">
                    <p className="text-purple-400 text-xs font-mono font-bold">Even Sections (2, 4, 6)</p>
                    <p className="text-slate-400 text-xs">Visual LEFT · Content RIGHT</p>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mt-3">
                  Mobile: Stacked vertically. Desktop: Side-by-side 50/50 grid.
                </p>
              </div>

              {/* Interaction System */}
              <div>
                <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">🎮</span> Interaction System
                </h4>
                <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                  <p className="text-cyan-400 font-mono text-xs font-bold mb-2">Interactive Buttons</p>
                  <p className="text-slate-400 text-xs">Hover animations reveal "Want to see how this works?" with code panel</p>
                </div>
              </div>
            </div>

            {/* State Management */}
            <div>
              <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span> State & Effects
              </h4>
              <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                This page uses multiple coordinated state machines:
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">→</span>
                  <span><span className="text-cyan-400">requestStatus</span>: State machine tracking request lifecycle (idle → sending → processing → receiving → done)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">→</span>
                  <span><span className="text-cyan-400">scrollProgress</span>: 0–100% based on document scroll position</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">→</span>
                  <span><span className="text-cyan-400">currentSection</span>: Which section is viewport-centered</span>
                </li>
              </ul>
            </div>

            {/* Key Design Decisions */}
            <div>
              <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> Design Decisions
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span><span className="text-cyan-400">Scroll-driven progress</span> — Teaches pacing, not rushing. Progress bar = learning map.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span><span className="text-cyan-400">Ball as metaphor</span> — Physical object you control = "you're driving the learning"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span><span className="text-cyan-400">Hover → Explain</span> — Inline learning: curious users can peek at code without breaking flow</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span><span className="text-cyan-400">Apple aesthetic</span> — Generous spacing, subtle shadows, dark mode, focus on clarity</span>
                </li>
              </ul>
            </div>

            {/* Closing */}
            <div className="bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-900/50 rounded-lg p-4">
              <p className="text-purple-400 font-semibold mb-2">You Now Know</p>
              <p className="text-slate-300 text-sm">
                How to build a <span className="text-cyan-400 font-semibold">scroll-driven educational experience</span> that teaches system design concepts while maintaining engagement. This pattern scales to all 13 System Design levels.
              </p>
              <button
                onClick={() => setShowPageMadeModal(false)}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Ready to Learn
              </button>
            </div>
          </div>
        </div>
      )
      }


      {/* FLOATING "HOW THIS WAS MADE" BUTTON */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>
      {/* HEADER SECTION */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode}
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
        isVisible={true}
      />

      {/* SECTION 1: INTRO (Content Left, Visual Right) */}
      <section id="section-1" className="min-h-screen w-full bg-slate-950 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Content Left */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">What is the Client-Server Model?</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              The client-server model is the foundational architecture of distributed computing. A <span className="text-blue-400 font-semibold">client</span> sends a request for a resource or service. A <span className="text-purple-400 font-semibold">server</span> receives it, performs work, and returns a response.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              This pattern is ubiquitous: your browser is a client querying web servers for pages, your phone is a client calling APIs, your database client talks to a database server. It separates concerns: clients handle presentation, servers handle logic and state.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              The elegance of this model is also its fundamental challenge: <span className="text-yellow-400 font-semibold">distance creates latency</span>. Every request-response cycle takes time. Networks can fail. Servers can be overloaded. This tension drives everything in system design.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Understanding this model—its mechanics, failure modes, and limitations—is the first step to building scalable systems.
            </p>
          </div>

          {/* Visual Right */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="w-full max-w-xs h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-3">🔗</div>
                <p className="text-slate-400 text-sm font-mono">Request ↔ Response</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE CLIENT (Content Right, Visual Left) */}
      <section id="section-2" className="min-h-screen w-full bg-slate-900 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Visual Left */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="w-full max-w-xs bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex flex-col items-center gap-4">
              <div className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${requestStatus === 'done' ? 'bg-green-500/20 border-green-500 shadow-green-500/50' : 'bg-slate-800 border-slate-600'}`}>
                <Laptop size={48} className="text-slate-200" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-mono text-xs sm:text-sm font-semibold">Client</p>
                <p className="text-slate-500 text-xs mt-1">Your browser, phone, or app</p>
              </div>
            </div>
          </div>

          {/* Content Right */}
          <div className="flex flex-col justify-center order-1 lg:order-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">The Client Initiates</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              The client is <span className="text-blue-400 font-semibold">your local machine</span>—where computation happens in real-time under user control. A browser, mobile app, or IoT device. The client has limited resources (battery, bandwidth, computation) and prioritizes responsiveness.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              It needs something it doesn't have: data, a calculation, authentication, persistence. So it crafts a request—a structured message with parameters, headers, and a body—and sends it into the network.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              The request includes metadata: "Who are you?" (authentication), "What do you want?" (action), "Any special instructions?" (headers). The more specific the request, the better the response.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              <span className="text-cyan-400 font-semibold">Mental model:</span> The client is impatient and has limited memory. It delegates heavy lifting to the server and waits for an answer.
            </p>

            {!hasInteracted && (
              <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold bg-blue-950/30 border border-blue-900/50 rounded-lg p-3 mt-2">
                <MousePointerClick size={16} />
                <span>Try the interactive demo below →</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: THE REQUEST (Content Left, Visual Right) */}
      <section id="section-3" className="min-h-screen w-full bg-slate-950 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Content Left */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">The Network in Motion</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              The request doesn't teleport. It travels through cables, routers, switches, and data centers, crossing continents in <span className="text-yellow-400 font-semibold">milliseconds</span>. But milliseconds add up.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              In real networks, a round-trip time (RTT) from your device to a nearby server is ~10–50ms. To a server on the opposite coast: ~100–200ms. Across the world: ~200–500ms. Add processing time, and a "simple" request becomes expensive.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              This is why system designers obsess over reducing hops, increasing cache hits, and minimizing database queries. <span className="text-yellow-400 font-semibold">Every millisecond matters</span> when multiplied across millions of users and billions of requests.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              <span className="text-cyan-400 font-semibold">The problem:</span> You can't speed up the speed of light, but you can reduce the distance traveled. This leads to architectures like Content Delivery Networks (CDNs), edge computing, and geographic replication.
            </p>

            <button
              onClick={handleRequest}
              disabled={requestStatus !== 'idle' && requestStatus !== 'done'}
              className={`px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 w-fit ${!hasInteracted ? 'ring-4 ring-blue-500/30' : ''}`}
            >
              {requestStatus === 'idle' || requestStatus === 'done' ? 'Send Request' : 'Waiting...'}
            </button>
          </div>

          {/* Visual Right - Network Diagram */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div
              className="w-full max-w-xs h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 relative overflow-hidden flex flex-col items-center justify-center gap-8 cursor-help transition-all hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              onMouseEnter={() => setHoveredAnimation('network')}
              onMouseLeave={() => setHoveredAnimation(null)}
            >
              {/* Network Diagram */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-500/20 border-2 border-blue-400 rounded-lg flex items-center justify-center">
                  <Laptop size={24} className="text-blue-400" />
                </div>
                <p className="text-xs text-slate-400 font-mono">Client</p>
              </div>

              <div className="w-1 h-16 bg-slate-700 relative flex items-center justify-center">
                {requestStatus === 'sending' && (
                  <div className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-[moveDown_1s_linear_forwards]" />
                )}
                {requestStatus === 'receiving' && (
                  <div className="absolute w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-[moveUp_1s_linear_forwards]" />
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all ${requestStatus === 'processing' ? 'bg-purple-500/20 border-purple-400' : 'bg-slate-700 border-slate-600'}`}>
                  <Database size={24} className={requestStatus === 'processing' ? 'text-purple-400' : 'text-slate-400'} />
                </div>
                <p className="text-xs text-slate-400 font-mono">Server</p>
              </div>

              {/* Hover Nudge */}
              {hoveredAnimation === 'network' && !showCodePanel && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="bg-slate-950 border-2 border-cyan-400 rounded-lg p-4 text-center max-w-xs">
                    <p className="text-cyan-400 text-sm font-semibold mb-3">Want to see how this works?</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setShowCodePanel(true)}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setHoveredAnimation(null)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold rounded transition-colors"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE SERVER (Content Right, Visual Left) */}
      <section id="section-4" className="min-h-screen w-full bg-slate-900 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Visual Left */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="w-full max-w-xs bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex flex-col items-center gap-4">
              <div className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${requestStatus === 'processing' ? 'bg-purple-500/20 border-purple-500 shadow-purple-500/30' : 'bg-slate-800 border-slate-600'}`}>
                <Database size={48} className="text-slate-200" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-mono text-xs sm:text-sm font-semibold">Server</p>
                <p className="text-slate-500 text-xs mt-1">Remote computer processing requests</p>
              </div>
            </div>
          </div>

          {/* Content Right */}
          <div className="flex flex-col justify-center order-1 lg:order-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">The Server Processes</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              When the request arrives, the server <span className="text-purple-400 font-semibold">wakes up and works</span>. It parses the request, validates authentication, checks authorization, executes business logic, queries databases, and assembles a response.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              A single request might spawn dozens of internal operations: database queries, cache lookups, microservice calls, logging. This processing is <span className="text-purple-400 font-semibold">not free</span>—it consumes CPU, memory, and I/O resources.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              Servers must be <span className="text-purple-400 font-semibold">highly concurrent</span>. They juggle thousands of requests simultaneously. If each request blocks other requests, throughput collapses. This is why servers use threading, async I/O, and event loops.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              <span className="text-cyan-400 font-semibold">The challenge:</span> Scale a server from handling 10 requests/second to 10,000. The code stays the same, but resource contention, connection pools, and cache coherency become critical.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE RESPONSE (Content Left, Visual Right) */}
      <section id="section-5" className="min-h-screen w-full bg-slate-950 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Content Left */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">The Round Trip Complete</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              The server packages the result into a response and sends it back (the green packet). It travels the network again, crossing the same distance, incurring the same latency.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              The client receives the response, parses it, updates local state, and renders the UI. By the time the user sees the result, <span className="text-green-400 font-semibold">multiple seconds may have elapsed</span>.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              This is the core tension of distributed systems: <span className="text-green-400 font-semibold">responsiveness vs. correctness</span>. Optimizing for speed (caching, approximations, speculation) risks correctness (stale data, inconsistency). This tradeoff is everywhere in system design.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              <span className="text-cyan-400 font-semibold">Key insight:</span> A single client-server round trip is the atomic unit of distributed computing. Everything else—load balancing, replication, caching, queuing—is built on top of this foundation.
            </p>

            <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 font-mono text-xs sm:text-sm">
              <div className="text-slate-500 mb-2"># Server Logs</div>
              {requestStatus !== 'idle' && (
                <>
                  <div className="text-yellow-500">&gt; [OUT] Requesting data...</div>
                </>
              )}
              {requestStatus === 'processing' && (
                <div className="text-purple-400">&gt; [SRV] Processing...</div>
              )}
              {(requestStatus === 'receiving' || requestStatus === 'done') && (
                <div className="text-green-400">&gt; [IN] Response received.</div>
              )}
              {data && (
                <div className="text-white mt-2 border-l-2 border-slate-600 pl-2 text-[10px] sm:text-xs">
                  {data}
                </div>
              )}
            </div>
          </div>

          {/* Visual Right */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="w-full max-w-xs bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 font-mono mb-4">Full Cycle</p>
                <div className="grid grid-cols-2 gap-4 text-center text-xs">
                  <div className="bg-yellow-500/10 border border-yellow-900 rounded p-2">
                    <div className="text-yellow-400 font-semibold">↓ Request</div>
                    <div className="text-slate-500 text-[10px] mt-1">~1000ms</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-900 rounded p-2">
                    <div className="text-purple-400 font-semibold">⚙️ Process</div>
                    <div className="text-slate-500 text-[10px] mt-1">~800ms</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-900 rounded p-2">
                    <div className="text-green-400 font-semibold">↑ Response</div>
                    <div className="text-slate-500 text-[10px] mt-1">~1000ms</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-900 rounded p-2">
                    <div className="text-blue-400 font-semibold">✓ Total</div>
                    <div className="text-slate-500 text-[10px] mt-1">~2800ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: IMPLICATIONS (Content Full Width) */}
      <section id="section-6" className="min-h-screen w-full bg-slate-900 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto w-full">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Why This Matters: The Fundamental Limits</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">📡 Latency is a Physical Limit</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                You cannot make a network request faster than the speed of light allows. A request to a server 1000km away takes ~5ms minimum, plus processing, plus response travel. This latency multiplies across thousands of requests.
              </p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                Solution: Replicate servers geographically. Bring the server closer to the client.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">⚙️ Servers Are Finite Resources</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                Each server has CPU cores, RAM, and network bandwidth. If every request takes 100ms to process, one server can handle ~10 requests/second. One million users? You need 100,000 servers, or you need to make requests faster.
              </p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                Solution: Optimize query time, cache results, use async processing, distribute load.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">🔗 Concurrency Creates Contention</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                When thousands of requests hit the same server simultaneously, they compete for resources: CPU, disk I/O, database connections. If not managed, this causes thrashing, dropped requests, and timeouts.
              </p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                Solution: Thread pools, connection pooling, rate limiting, circuit breakers.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">💥 Networks Fail, Servers Crash</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                Packets are lost, servers go down, clients disconnect. The client doesn't know if the request never arrived, the server is processing it, or the response was lost. This ambiguity is dangerous.
              </p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                Solution: Timeouts, retries, idempotency, monitoring, redundancy.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">📊 Data Must Be Consistent</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                If multiple clients update data simultaneously, or if a server crashes mid-request, what happens to data? Transactions, ACID guarantees, and concurrency control exist because data integrity is non-negotiable.
              </p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                Solution: ACID databases, replication, consensus algorithms, versioning.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">🧠 This Model Powers Everything</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                Every system you'll design—microservices, APIs, message queues, caches, load balancers, databases—is built to optimize or mitigate the client-server model. Understanding this foundation unlocks all of system design.
              </p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                Next: Learn how servers handle scale, concurrency, and failure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE INFO */}
      {levelData && <ArchitectureInfo level={levelData} />}



      {/* Completion Styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1); }
        }
      `}</style>

      <style>{`
        @keyframes moveDown {
          0% { transform: translateY(-64px); opacity: 1; }
          100% { transform: translateY(64px); opacity: 1; }
        }
        @keyframes moveUp {
          0% { transform: translateY(64px); opacity: 1; }
          100% { transform: translateY(-64px); opacity: 1; }
        }
      `}</style>
    </div >
  );
};
