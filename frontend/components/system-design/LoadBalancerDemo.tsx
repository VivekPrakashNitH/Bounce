
import React, { useState, useEffect } from 'react';
import { Activity, Globe, Server, Code2, MousePointerClick, Zap } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';
import { COURSE_CONTENT } from '../../data/courseContent';
import { GameState } from '../../types';
import { ArchitectureInfo } from '../ui/ArchitectureInfo';

interface Props {
  onShowCode: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const LoadBalancerDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const [activeServer, setActiveServer] = useState<number | null>(null);
  const [requests, setRequests] = useState<{ id: number, target: number, x: number }[]>([]);
  const [reqCount, setReqCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const [showCodePanel, setShowCodePanel] = useState(false);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const servers = [1, 2, 3];
  const levelData = COURSE_CONTENT.find(l => l.id === GameState.LEVEL_LOAD_BALANCER);

  const sections = [
    { id: 'section-1', label: 'Concept' },
    { id: 'section-2', label: 'Problem' },
    { id: 'section-3', label: 'Round-Robin' },
    { id: 'section-4', label: 'Strategies' },
    { id: 'section-5', label: 'Health Checks' },
    { id: 'section-6', label: 'Impact' },
  ];

  // --- Touch Unlock Logic ---
  const [hoveredAnimation, setHoveredAnimation] = useState<string | null>(null);

  const sendRequest = () => {
    if (!hasInteracted) setHasInteracted(true);
    const target = (reqCount % 3) + 1;
    const newReq = { id: Date.now(), target, x: 0 };
    setRequests(prev => [...prev, newReq]);
    setReqCount(prev => prev + 1);
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





  useEffect(() => {
    if (scrollProgress >= 90) {
      setCompletionProgress(Math.min((scrollProgress - 90) / 10, 1));
    }
  }, [scrollProgress]);

  useEffect(() => {
    if (requests.length === 0) return;
    const interval = setInterval(() => {
      setRequests(prev => prev.map(r => {
        if (r.x < 100) return { ...r, x: r.x + 2 };
        return r;
      }).filter(r => {
        if (r.x >= 100) {
          setActiveServer(r.target);
          setTimeout(() => setActiveServer(null), 200);
          return false;
        }
        return true;
      }));
    }, 16);
    return () => clearInterval(interval);
  }, [requests]);

  return (
    <div className="w-full">



      {/* GAME GATE */}


      {/* INSTRUCTION OVERLAY */}


      {/* FLOATING BALL */}


      {/* CODE PANEL */}
      {showCodePanel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-[0_0_40px_rgba(34,211,238,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-white">How Round-Robin Works</h3>
              <button onClick={() => setShowCodePanel(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">The Concept</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Round-robin is the simplest load balancing algorithm: distribute requests evenly across servers in sequence. Request 1→Server1, Request 2→Server2, Request 3→Server3, Request 4→Server1 again.</p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Code Example</h4>
                <pre className="bg-black/50 border border-slate-700 rounded-lg p-4 text-[11px] sm:text-xs overflow-x-auto font-mono text-slate-300 leading-relaxed">{`// Track current server index
let currentIndex = 0;
const servers = ['Server1', 'Server2', 'Server3'];

function distributeRequest(request) {
  const server = servers[currentIndex % servers.length];
  currentIndex++;
  return forwardToServer(server, request);
}`}</pre>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Advantages</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2"><span className="text-blue-400 font-bold">•</span><span>Simple: Minimal logic, easy to implement</span></li>
                  <li className="flex gap-2"><span className="text-blue-400 font-bold">•</span><span>Fair: Equal distribution if requests take equal time</span></li>
                  <li className="flex gap-2"><span className="text-blue-400 font-bold">•</span><span>Stateless: No need to track server state</span></li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-blue-950/30 to-cyan-950/30 border border-cyan-900/50 rounded-lg p-4">
                <p className="text-cyan-400 font-semibold mb-2">Try This</p>
                <p className="text-slate-300 text-sm mb-3">Modify the algorithm to use weighted round-robin: Server1 gets 50%, Server2 and Server3 get 25% each.</p>
                <button onClick={() => setShowCodePanel(false)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors">Got It</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE MADE MODAL */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(147,51,234,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-purple-400 text-xs font-mono mt-1">Level 2: Load Balancer</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-6 text-slate-300 text-sm">
              <div>
                <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2"><span className="text-xl">🏗️</span> Architecture</h4>
                <p className="leading-relaxed mb-3">6 sections covering: concept, single-server problem, round-robin algorithm, alternative strategies, health checks, and real-world implications.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded p-2 text-xs"><span className="text-purple-300 font-bold">Concept:</span> What is load balancing?</div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded p-2 text-xs"><span className="text-purple-300 font-bold">Problem:</span> Why single servers fail</div>
                </div>
              </div>
              <div>
                <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2"><span className="text-xl">⚙️</span> State System</h4>
                <ul className="space-y-1 text-xs">
                  <li><span className="text-cyan-400">scrollProgress:</span> 0–100% scroll position</li>
                  <li><span className="text-cyan-400">currentSection:</span> Which section is viewport-centered</li>
                  <li><span className="text-cyan-400">ballPosition & ballRotation:</span> Real-time movement</li>
                  <li><span className="text-cyan-400">activeServer & requests:</span> Demo animation state</li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-900/50 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">Pattern Recognition</p>
                <p>This identical 10-step structure applies to all 13 System Design levels. Once perfected, it becomes a reusable template.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-lg transition-colors">Ready</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING HOW-WAS-MADE BUTTON */}
      <button onClick={() => setShowPageMadeModal(true)} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] transition-all animate-bounce" title="How this page was made">
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
        accentColor="green"
        isVisible={true}
      />

      {/* MAIN CONTENT */}
      <section id="section-1" className="min-h-screen w-full bg-slate-950 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">What is a Load Balancer?</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">A load balancer is a system that <span className="text-green-400 font-semibold">distributes incoming requests</span> across multiple servers. Instead of all traffic hitting one server, the load balancer acts as a <span className="text-green-400 font-semibold">traffic cop</span>, routing each request to a less-busy server.</p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">This is the key to horizontal scaling: add more servers, not more powerful servers. The load balancer ensures no single server becomes a bottleneck.</p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">Without load balancers, systems are fragile. One overloaded server means cascade failure. With them, systems become resilient and can handle growth.</p>
          </div>
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="w-full max-w-xs h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-3">⚖️</div>
                <p className="text-slate-400 text-sm font-mono">Distribute Traffic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-2" className="min-h-screen w-full bg-slate-900 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="w-full max-w-xs bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex flex-col items-center gap-4">
              <div className="p-4 sm:p-6 rounded-2xl border-2 bg-red-500/20 border-red-500 shadow-red-500/30">
                <Server size={48} className="text-slate-200" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-mono text-xs sm:text-sm font-semibold">Single Server</p>
                <p className="text-slate-500 text-xs mt-1">= Bottleneck + Failure Point</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center order-1 lg:order-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">The Single Server Problem</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">Imagine all traffic directed to one server. When requests spike (flash sales, viral moments), that server becomes overwhelmed. Response times skyrocket. Requests time out. Users leave.</p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">Worse, if that server crashes, <span className="text-red-400 font-semibold">the entire service goes down</span>. No redundancy. No safety net.</p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">You could buy a more powerful server, but that only delays the problem. At some point, one machine can't handle the load, no matter how powerful.</p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">The solution: <span className="text-green-400 font-semibold">horizontal scaling</span>—add more servers and distribute the load.</p>
          </div>
        </div>
      </section>

      <section id="section-3" className="min-h-screen w-full bg-slate-950 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Round-Robin Strategy</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">Round-robin is the simplest load balancing algorithm: distribute requests evenly in a cycle.</p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">Request 1 → Server A | Request 2 → Server B | Request 3 → Server C | Request 4 → Server A | ...</p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">This assumes all requests take roughly equal time. If they do, you get perfect load distribution. If they don't (some requests are complex, others simple), servers still become unbalanced.</p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">Try the interactive demo below to see round-robin in action.</p>
            <button onClick={sendRequest} className="px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm sm:text-base font-bold rounded-lg shadow-lg shadow-green-500/30 transition-all active:scale-95 w-fit">
              {hasInteracted ? 'Send Another Request' : 'Send Request'}
            </button>
          </div>
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="w-full max-w-xs h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 relative overflow-hidden flex flex-col items-center justify-center gap-4" onMouseEnter={() => setHoveredAnimation('roundrobin')} onMouseLeave={() => setHoveredAnimation(null)}>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-green-500/20 border-2 border-green-400 rounded-lg flex items-center justify-center">
                  <Globe size={24} className="text-green-400" />
                </div>
                <p className="text-xs text-slate-400 font-mono">Request #{reqCount}</p>
              </div>
              <div className="w-1 h-12 bg-slate-700" />
              <div className="flex flex-col gap-2 w-full">
                {servers.map(id => (
                  <div key={id} className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all text-xs ${activeServer === id ? 'bg-green-500/20 border-green-400 shadow-green-400/30' : 'bg-slate-700 border-slate-600'}`}>
                    <Server size={16} />
                    <span className="font-mono">Server {id}</span>
                  </div>
                ))}
              </div>
              {hoveredAnimation === 'roundrobin' && !showCodePanel && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="bg-slate-950 border-2 border-cyan-400 rounded-lg p-4 text-center max-w-xs">
                    <p className="text-cyan-400 text-sm font-semibold mb-3">Want to see the code?</p>
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => setShowCodePanel(true)} className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded transition-colors">Yes</button>
                      <button onClick={() => setHoveredAnimation(null)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold rounded transition-colors">No</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="section-4" className="min-h-screen w-full bg-slate-900 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Other Distribution Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-green-400 mb-3">Least Connections</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">Route to the server with the fewest active connections. Works well when requests have different durations.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">Best for: Long-lived connections (WebSockets, database connections)</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-green-400 mb-3">Weighted Round-Robin</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">Assign each server a weight (60%, 30%, 10%). Powerful servers get more traffic.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">Best for: Heterogeneous server hardware</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-green-400 mb-3">IP Hash</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">Hash client IP to consistently route them to the same server. Ensures session persistence.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">Best for: Sticky sessions, caching benefits</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-green-400 mb-3">Least Response Time</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">Route to the server with the best average response time. Adaptive and performance-aware.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">Best for: Heterogeneous workloads</p>
            </div>
          </div>
        </div>
      </section>

      <section id="section-5" className="min-h-screen w-full bg-slate-950 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto w-full">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Health Checks & Resilience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Active Health Checks</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">Load balancer periodically pings each server (HTTP GET, TCP connect, etc.). If a server doesn't respond, it's marked unhealthy and removed from the pool.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">Example: Ping /health every 5 seconds</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Passive Health Checks</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">Monitor actual request responses. If a server returns errors or timeouts consistently, reduce its traffic or mark it unhealthy.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">Example: Circuit breaker pattern</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Graceful Degradation</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">If a server becomes unhealthy, its existing connections are drained (wait for them to finish). New requests are routed elsewhere. Then the server is taken offline.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">Prevents abrupt connection drops</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Automatic Recovery</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">Periodically recheck unhealthy servers. If they recover and pass health checks, gradually bring them back into the pool.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">No manual intervention needed</p>
            </div>
          </div>
        </div>
      </section>

      <section id="section-6" className="min-h-screen w-full bg-slate-900 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto w-full">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Why This Matters: The Scaling Game</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">📈 Horizontal Scalability</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">Add servers, not more CPU. Load balancers make this possible. Your system scales linearly with hardware investment.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                10 servers = 10x throughput (mostly)
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">🛡️ High Availability</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">No single point of failure. Lose one server, traffic redirects. Lose two, system still works. This is how Netflix, Uber, and AWS stay up 99.99% of the time.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                Redundancy is the antidote to failure
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">⚡ Rolling Deployments</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">Upgrade servers without downtime. Remove one from the load balancer, deploy new code, add it back. Repeat. Zero downtime deployment.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                The load balancer is your deployment enabler
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">💰 Cost Efficiency</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">Use commodity hardware instead of supercomputers. Buy 100 cheap servers instead of one ultra-expensive one. Cheaper and more reliable.</p>
              <p className="text-slate-200 text-xs text-slate-400 font-mono bg-slate-950/50 rounded p-2">
                Abundance is cheaper than excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE INFO */}
      {levelData && <ArchitectureInfo level={levelData} />}

      {/* INSTRUCTION OVERLAY */}


      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1); }
        }
        @keyframes moveDown {
          0% { transform: translateY(-64px); opacity: 1; }
          100% { transform: translateY(64px); opacity: 1; }
        }
        @keyframes moveUp {
          0% { transform: translateY(64px); opacity: 1; }
          100% { transform: translateY(-64px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
