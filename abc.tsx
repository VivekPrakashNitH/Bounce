
import React, { useState, useEffect } from 'react';
import { Activity, Globe, Server, Code2, MousePointerClick, Zap } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';
import { COURSE_CONTENT } from '../../data/courseContent';
import { GameState } from '../../types';
import { ArchitectureInfo } from '../ui/ArchitectureInfo';

interface Props {
    onShowCode: () => void;
}

export const LoadBalancerDemo: React.FC<Props> = ({ onShowCode }) => {
    const [activeServer, setActiveServer] = useState<number | null>(null);
    const [requests, setRequests] = useState<{ id: number, target: number, x: number }[]>([]);
    const [reqCount, setReqCount] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState(0);
    const [gateUnlocked, setGateUnlocked] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
    const [ballVelocity, setBallVelocity] = useState({ dx: 0, dy: 0 });
    const [ballRotation, setBallRotation] = useState(0);
    const [ballVisible, setBallVisible] = useState(true);
    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
    const [hoveredAnimation, setHoveredAnimation] = useState<string | null>(null);
    const [showCodePanel, setShowCodePanel] = useState(false);
    const [showPageMadeModal, setShowPageMadeModal] = useState(false);
    const [completionProgress, setCompletionProgress] = useState(0);

    const servers = [1, 2, 3];
    const levelData = COURSE_CONTENT.find(l => l.id === GameState.LEVEL_LOAD_BALANCER);

    const sections = [
        { name: 'Concept', id: 'section-1' },
        { name: 'Problem', id: 'section-2' },
        { name: 'Round-Robin', id: 'section-3' },
        { name: 'Strategies', id: 'section-4' },
        { name: 'Health Checks', id: 'section-5' },
        { name: 'Impact', id: 'section-6' },
    ];

    const sendRequest = () => {
        if (!hasInteracted) setHasInteracted(true);
        const target = (reqCount % 3) + 1;
        const newReq = { id: Date.now(), target, x: 0 };
        setRequests(prev => [...prev, newReq]);
        setReqCount(prev => prev + 1);
    };

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
            setScrollProgress(Math.min(progress, 100));
            const sectionHeight = windowHeight;
            const section = Math.floor(scrolled / sectionHeight);
            setCurrentSection(Math.min(section, sections.length - 1));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections.length]);

    useEffect(() => {
        if (gateUnlocked) return;
        const handleKeyPress = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                setGateUnlocked(true);
            }
        };
        const handleMouseMove = (e: MouseEvent) => {
            setBallPosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [gateUnlocked]);

    useEffect(() => {
        if (!gateUnlocked || !showInstructions) return;
        const handleInstructionClose = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                setShowInstructions(false);
            }
        };
        window.addEventListener('keydown', handleInstructionClose);
        return () => window.removeEventListener('keydown', handleInstructionClose);
    }, [gateUnlocked, showInstructions]);

    useEffect(() => {
        if (!gateUnlocked) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                setKeysPressed((prev) => new Set([...prev, e.key]));
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                setKeysPressed((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(e.key);
                    return newSet;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gateUnlocked]);

    useEffect(() => {
        if (!gateUnlocked || showInstructions) return;
        const animationFrame = setInterval(() => {
            setBallPosition((prev) => {
                let newDx = 0;
                let newDy = 0;
                if (keysPressed.has('ArrowUp')) newDy -= 1.5;
                if (keysPressed.has('ArrowDown')) newDy += 1.5;
                if (keysPressed.has('ArrowLeft')) newDx -= 1.5;
                if (keysPressed.has('ArrowRight')) newDx += 1.5;
                setBallVelocity({ dx: newDx, dy: newDy });
                let newX = prev.x + newDx;
                let newY = prev.y + newDy;
                newX = Math.max(5, Math.min(95, newX));
                newY = Math.max(10, Math.min(90, newY));
                if (newDx !== 0 || newDy !== 0) {
                    setBallRotation((prev) => (prev + 4) % 360);
                }
                return { x: newX, y: newY };
            });
        }, 30);
        return () => clearInterval(animationFrame);
    }, [keysPressed, gateUnlocked, showInstructions]);

    useEffect(() => {
        setBallVisible(currentSection !== 3);
    }, [currentSection]);

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
            {/* HEADER SECTION */}
            <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 sm:px-8 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <BounceAvatar className="w-6 h-6 sm:w-8 sm:h-8" />
                        <div>
                            <h1 className="text-xs sm:text-sm font-mono text-cyan-400">L2</h1>
                            <h2 className="text-sm sm:text-lg font-semibold text-white">Load Balancer</h2>
                        </div>
                    </div>
                    <button onClick={onShowCode} className="flex items-center gap-1 text-[10px] sm:text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 sm:px-3 py-1.5 rounded text-cyan-400 transition-colors">
                        <Code2 size={14} /> Code
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-6xl mx-auto">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs text-slate-400 font-mono">{Math.round(scrollProgress)}%</span>
                        <span className="text-[10px] sm:text-xs text-slate-400 font-mono">{sections[currentSection]?.name}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
                    </div>
                    <div className="flex gap-1 w-full">
                        {sections.map((section, idx) => (
                            <div key={section.id} className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${idx < currentSection ? 'bg-green-400' : idx === currentSection ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'bg-slate-700'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* GAME GATE */}
            {!gateUnlocked && (
                <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full shadow-[0_0_30px_rgba(74,222,128,0.8)] transition-all duration-100" style={{ left: `${ballPosition.x}%`, top: `${ballPosition.y}%`, transform: 'translate(-50%, -50%)' }}>
                        <div className="w-full h-full rounded-full animate-pulse" />
                    </div>
                    <div className="relative z-10 text-center flex flex-col items-center gap-6 sm:gap-8">
                        <div>
                            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 tracking-tight">Level 2</h1>
                            <p className="text-base sm:text-lg text-slate-400 font-mono">Load Balancer</p>
                        </div>
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-green-400 flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                        </div>
                        <div className="max-w-xs">
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">Learn how systems distribute load and scale horizontally.</p>
                            <p className="text-slate-500 text-xs sm:text-sm font-mono">Press any arrow key or spacebar to begin</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-slate-400 text-xs sm:text-sm font-mono">Beginner+</span>
                        </div>
                    </div>
                </div>
            )}

            {/* INSTRUCTION OVERLAY */}
            {gateUnlocked && showInstructions && (
                <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500`}>
                    <div className="bg-slate-900 border-2 border-cyan-400/50 rounded-2xl p-6 sm:p-10 max-w-md w-full mx-4 text-center shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">How to Play</h3>
                        <p className="text-slate-300 text-sm sm:text-base mb-8">Use <span className="text-cyan-400 font-semibold">arrow keys</span> to move the ball</p>
                        <div className="grid grid-cols-3 gap-3 mb-8 max-w-xs mx-auto">
                            <div className="flex justify-center"><div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-lg">⬅️</div></div>
                            <div className="flex justify-center"><div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-lg">⬆️</div></div>
                            <div className="flex justify-center"><div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-lg">➡️</div></div>
                            <div className="flex justify-center col-start-2"><div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-lg">⬇️</div></div>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm font-mono">Press any arrow key to continue</p>
                        <div className="mt-6 flex justify-center">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING BALL */}
            {gateUnlocked && (
                <div className={`fixed w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.6)] z-30 transition-opacity duration-500 ${ballVisible ? 'opacity-100' : 'opacity-20 pointer-events-none'} ${keysPressed.size === 0 ? 'animate-bounce' : ''}`} style={{ left: `${ballPosition.x}%`, top: `${ballPosition.y}%`, transform: `translate(-50%, -50%) rotate(${ballRotation}deg)`, pointerEvents: 'none' }}>
                    <div className="w-full h-full rounded-full border-2 border-cyan-300/50 animate-pulse" />
                </div>
            )}

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

            {/* MAIN CONTENT */}
            <section className="min-h-screen w-full bg-slate-950 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
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

            <section className="min-h-screen w-full bg-slate-900 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
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

            <section className="min-h-screen w-full bg-slate-950 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
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

            <section className="min-h-screen w-full bg-slate-900 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
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

            <section className="min-h-screen w-full bg-slate-950 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
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

            <section className="min-h-screen w-full bg-slate-900 flex items-center px-4 sm:px-8 py-16 border-b border-slate-800">
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

            {/* COMPLETION OVERLAY */}
            {completionProgress > 0 && (
                <div className={`fixed inset-0 z-45 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500 ${completionProgress >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{ pointerEvents: completionProgress >= 1 ? 'auto' : 'none' }}>
                    <div className="max-w-md mx-4 text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full shadow-[0_0_40px_rgba(74,222,128,0.8)] flex items-center justify-center" style={{ animation: `spin 2s linear infinite`, transform: `scale(${completionProgress})`, opacity: completionProgress }}>
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-cyan-300/50" />
                            </div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ opacity: Math.max(0, completionProgress) }}>Level Complete</h2>
                        <p className="text-lg sm:text-xl text-green-400 font-semibold mb-6" style={{ opacity: Math.max(0, completionProgress - 0.2) }}>Load Balancer Mastered</p>
                        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 sm:p-6 mb-8" style={{ opacity: Math.max(0, completionProgress - 0.3) }}>
                            <p className="text-slate-300 text-sm leading-relaxed">You now understand the second pillar of scalability: distributing load horizontally. Single servers are fragile. Multiple servers with a load balancer are robust and can scale indefinitely.</p>
                        </div>
                        <div className="space-y-2 mb-8" style={{ opacity: Math.max(0, completionProgress - 0.4) }}>
                            <p className="text-slate-400 text-sm font-mono mb-3">What You Learned:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="text-xs text-left bg-green-950/20 border border-green-900/30 rounded p-2">✓ Horizontal Scaling</div>
                                <div className="text-xs text-left bg-blue-950/20 border border-blue-900/30 rounded p-2">✓ Distribution Algorithms</div>
                                <div className="text-xs text-left bg-cyan-950/20 border border-cyan-900/30 rounded p-2">✓ Health Checks</div>
                                <div className="text-xs text-left bg-purple-950/20 border border-purple-900/30 rounded p-2">✓ Resilience Patterns</div>
                            </div>
                        </div>
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} disabled={completionProgress < 0.8} className={`px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-green-500/30 transition-all active:scale-95 ${completionProgress >= 0.8 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} style={{ opacity: Math.max(0, completionProgress - 0.5) }}>
                            Next Level: API Gateway →
                        </button>
                        <p className="text-slate-500 text-xs font-mono mt-4" style={{ opacity: Math.max(0, completionProgress - 0.6) }}>Scroll down to continue or click above</p>
                    </div>
                </div>
            )}

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
