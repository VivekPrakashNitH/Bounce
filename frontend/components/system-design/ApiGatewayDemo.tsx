'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Route, Code2, Box, User, ShoppingCart, ArrowRight, MousePointerClick } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const ApiGatewayDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'What is API Gateway' },
    { id: 'section-2', label: 'Route Requests' },
    { id: 'section-3', label: 'Responsibilities' },
    { id: 'section-4', label: 'Popular Gateways' },
    { id: 'section-5', label: 'Gateway vs LB' },
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

  const handleRequest = (route: '/users' | '/orders') => {
    if (processing) return;
    if (!hasInteracted) setHasInteracted(true);
    setProcessing(true);
    setActiveRoute(route);
    setTimeout(() => {
      setProcessing(false);
      setActiveRoute(null);
    }, 1500);
  };

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">


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
          <div className="bg-slate-900 border-2 border-purple-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            {/* Header */}
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-purple-400 text-xs font-mono mt-1">L6 — API Gateway</p>
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
                    This page uses a <span className="text-purple-400 font-semibold">scroll-driven learning system</span> with 6 major sections:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 1: Introduction</p>
                      <p className="text-slate-400 text-xs">What is an API Gateway and its role</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 2: Interactive Demo</p>
                      <p className="text-slate-400 text-xs">Route requests to different services</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 3: Key Responsibilities</p>
                      <p className="text-slate-400 text-xs">Routing, auth, rate limiting, and more</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 4: Popular Gateways</p>
                      <p className="text-slate-400 text-xs">Kong, AWS API Gateway, Envoy, Traefik</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 5: Gateway vs LB</p>
                      <p className="text-slate-400 text-xs">Differences and when to use each</p>
                    </div>
                    <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3">
                      <p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 6: Best Practices</p>
                      <p className="text-slate-400 text-xs">Single responsibility, fail fast, monitoring</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Concepts */}
              <div>
                <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">💡</span> Key Concepts
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">→</span>
                    <span><span className="text-purple-400">Single Entry Point</span>: All requests flow through one gateway</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">→</span>
                    <span><span className="text-purple-400">Cross-Cutting Concerns</span>: Auth, logging, rate limiting handled centrally</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">→</span>
                    <span><span className="text-purple-400">Smart Routing</span>: Routes to different microservices based on path/method</span>
                  </li>
                </ul>
              </div>

              {/* Closing */}
              <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border border-purple-900/50 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">
                  How <span className="text-purple-400 font-semibold">API Gateways</span> serve as the single entry point for microservices, handling routing, security, and cross-cutting concerns.
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
        </div>
      )}

      {/* FLOATING "HOW THIS WAS MADE" BUTTON */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all animate-bounce"
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
              <div className="w-12 h-12 border-2 border-purple-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-purple-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && (
        <GameInstructions
          visible={showInstructions}
          onDismiss={() => setShowInstructions(false)}
          onShow={() => setShowInstructions(true)}
          theme="purple"
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
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-6">What is API Gateway?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                An API Gateway is a server that sits between clients and backend services. It routes incoming requests to the appropriate microservice, handles cross-cutting concerns like authentication, rate limiting, and request transformation.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Think of it as a traffic director—one entry point, smart routing, security layer.
              </p>
              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-purple-200">
                  <strong>Mental Model:</strong> A restaurant host stands at the entrance, takes your order (request), and routes you to the right table/kitchen (service).
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-purple-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Route className="w-24 h-24 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Interactive: Route Requests</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-xl p-8">
              <p className="text-sm text-slate-400 mb-6 text-center">Click buttons to route requests through the API Gateway</p>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 items-center">

                <div className="col-span-1 flex flex-col gap-4">
                  {!hasInteracted && (
                    <div className="absolute -top-12 left-0 w-full flex flex-col items-center animate-bounce z-50 pointer-events-none">
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full mb-1 whitespace-nowrap font-bold shadow-lg">Click Me</span>
                      <MousePointerClick className="text-blue-500 fill-blue-500" size={16} />
                    </div>
                  )}

                  <button
                    onClick={() => handleRequest('/users')}
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-3 rounded-lg text-xs font-mono flex items-center justify-between shadow-lg transition-all"
                  >
                    <span>GET /users</span>
                    <User size={14} />
                  </button>
                  <button
                    onClick={() => handleRequest('/orders')}
                    disabled={processing}
                    className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white p-3 rounded-lg text-xs font-mono flex items-center justify-between shadow-lg transition-all"
                  >
                    <span>GET /orders</span>
                    <ShoppingCart size={14} />
                  </button>
                </div>

                <div className="col-span-1 relative h-32 flex items-center justify-center">
                  {processing && (
                    <div className="absolute animate-[slideRight_0.7s_linear_forwards] z-20">
                      <div className={`w-3 h-3 rounded-full ${activeRoute === '/users' ? 'bg-blue-400' : 'bg-orange-400'}`} />
                    </div>
                  )}
                  <div className="w-full h-0.5 bg-slate-700" />
                </div>

                <div className={`col-span-1 h-24 border-2 border-purple-500 rounded-xl bg-slate-800 flex flex-col items-center justify-center transition-all ${processing ? 'shadow-[0_0_20px_rgba(168,85,247,0.4)]' : ''}`}>
                  <Route className="text-purple-400 mb-2" size={20} />
                  <span className="text-xs font-bold text-slate-300">Gateway</span>
                  <span className="text-[10px] text-slate-500">Router</span>
                </div>

                <div className="col-span-1 relative h-32">
                  <div className="absolute top-[30%] left-0 w-full h-[50%] border-t-2 border-r-2 border-slate-700 rounded-tr-3xl" />
                  <div className="absolute bottom-[30%] left-0 w-full h-[50%] border-b-2 border-r-2 border-slate-700 rounded-br-3xl" />

                  {processing && activeRoute === '/users' && (
                    <div className="absolute top-[30%] left-0 w-full h-full animate-[routeUp_0.7s_0.7s_linear_forwards]">
                      <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_blue]" />
                    </div>
                  )}

                  {processing && activeRoute === '/orders' && (
                    <div className="absolute bottom-[30%] left-0 w-full h-full animate-[routeDown_0.7s_0.7s_linear_forwards]">
                      <div className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_10px_orange]" />
                    </div>
                  )}
                </div>

                <div className="col-span-1 flex flex-col justify-between h-32 py-2">
                  <div className={`p-3 border border-blue-500/30 rounded-lg bg-slate-800 flex items-center gap-2 transition-transform ${activeRoute === '/users' && processing ? 'scale-110 bg-blue-500/20 border-blue-500' : ''}`}>
                    <User className="text-blue-400" size={16} />
                    <div className="text-[10px]">User Service</div>
                  </div>

                  <div className={`p-3 border border-orange-500/30 rounded-lg bg-slate-800 flex items-center gap-2 transition-transform ${activeRoute === '/orders' && processing ? 'scale-110 bg-orange-500/20 border-orange-500' : ''}`}>
                    <ShoppingCart className="text-orange-400" size={16} />
                    <div className="text-[10px]">Order Service</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Key Responsibilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Request Routing</h4>
                <p className="text-sm text-slate-300">Route requests to correct microservice based on path, method, headers.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Authentication</h4>
                <p className="text-sm text-slate-300">Validate JWT, OAuth, API keys before routing to services.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Rate Limiting</h4>
                <p className="text-sm text-slate-300">Throttle requests per user/IP. Prevent abuse.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Load Balancing</h4>
                <p className="text-sm text-slate-300">Distribute traffic across multiple service instances.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Request Transform</h4>
                <p className="text-sm text-slate-300">Modify headers, body, protocols. Unify service APIs.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Logging & Monitoring</h4>
                <p className="text-sm text-slate-300">Centralized logging. Metrics. Distributed tracing.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Popular API Gateways</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Kong</p>
                <p className="text-sm text-slate-300">Open-source. Built on Nginx. Plugin ecosystem. Used by Shopify, Netflix.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">AWS API Gateway</p>
                <p className="text-sm text-slate-300">Serverless. Auto-scaling. Integrates with Lambda, DynamoDB. REST/WebSocket.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Envoy</p>
                <p className="text-sm text-slate-300">Service mesh. Advanced routing. gRPC support. Used by Lyft, Uber.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Traefik</p>
                <p className="text-sm text-slate-300">Cloud-native. Docker/K8s integration. Dynamic routing. Easy config.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">API Gateway vs Load Balancer</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Load Balancer</p>
                <p className="text-sm text-slate-300">Distributes traffic across identical servers. Network layer (L4/L7). Health checks.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">API Gateway</p>
                <p className="text-sm text-slate-300">Routes to DIFFERENT services. Application logic. Auth/Rate-limit/Transform. Single entry point.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Often Combined</p>
                <p className="text-sm text-slate-300">API Gateway receives request, routes to backend, which has a Load Balancer for its instances.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Best Practices</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Single Responsibility</p>
                <p className="text-sm text-slate-300">Gateway handles routing/security. Services handle business logic. Clear separation.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Fail Fast</p>
                <p className="text-sm text-slate-300">Rate limit and auth at gateway. Don't pass bad requests to services.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Monitoring</p>
                <p className="text-sm text-slate-300">Gateway is critical. Monitor latency, error rates, saturation. Alerts.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`
        @keyframes slideRight { 0% { left: 0; } 100% { left: 100%; } }
        @keyframes routeUp { 
          0% { left: 0; top: 30%; } 
          50% { left: 100%; top: 30%; } 
          100% { left: 100%; top: -20%; opacity: 0; } 
        }
        @keyframes routeDown { 
          0% { left: 0; bottom: 30%; } 
          50% { left: 100%; bottom: 30%; } 
          100% { left: 100%; bottom: -20%; opacity: 0; } 
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } 
        .animate-fade-in { animation: fade-in 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};
