'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Inbox, ArrowRight, CheckCircle, Clock, Layers } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

interface Message {
  id: number;
  content: string;
  status: 'queue' | 'processing' | 'done';
}

export const MessageQueueDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextId, setNextId] = useState(1);
  const [msgInput, setMsgInput] = useState('');
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const sections = [
    { id: 'section-1', label: 'What are Queues' },
    { id: 'section-2', label: 'Why Use Them' },
    { id: 'section-3', label: 'Send Messages' },
    { id: 'section-4', label: 'Patterns' },
    { id: 'section-5', label: 'Popular Tools' },
    { id: 'section-6', label: 'Trade-offs' },
  ];

  // --- Touch Unlock Logic ---


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
    setBallVisible(currentSection !== 3);
  }, [currentSection]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        const queueMsg = updated.find(m => m.status === 'queue');
        if (queueMsg) {
          queueMsg.status = 'processing';
          setTimeout(() => {
            setMessages(curr => curr.map(m => m.id === queueMsg.id ? { ...m, status: 'done' } : m));
          }, 1500);
        }
        return updated.filter(m => m.status !== 'done' || Date.now() % 10000 < 5000);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!msgInput.trim()) return;
    setMessages(prev => [...prev, { id: nextId, content: msgInput, status: 'queue' }]);
    setNextId(nextId + 1);
    setMsgInput('');
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
        accentColor="green"
        isVisible={true}
      />

      {/* PAGE ARCHITECTURE MODAL */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-teal-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(45,212,191,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-teal-400 text-xs font-mono mt-1">L5 — Message Queues</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-teal-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page covers Message Queue fundamentals with 6 sections.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 1: Introduction</p><p className="text-slate-400 text-xs">What are message queues and async communication</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 2: Why Use Them</p><p className="text-slate-400 text-xs">Decoupling, async processing, load smoothing</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 3: Interactive Demo</p><p className="text-slate-400 text-xs">Send messages through queue simulation</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 4: Patterns</p><p className="text-slate-400 text-xs">Point-to-point, pub/sub, priority, DLQ</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 5: Popular Tools</p><p className="text-slate-400 text-xs">RabbitMQ, Kafka, SQS, Redis Streams</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 6: Trade-offs</p><p className="text-slate-400 text-xs">Pros, cons, and when to use</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-teal-950/30 to-cyan-950/30 border border-teal-900/50 rounded-lg p-4">
                <p className="text-teal-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-teal-400 font-semibold">message queues</span> decouple services, enable async processing, and smooth traffic spikes in distributed systems.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING GEAR ICON */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full shadow-[0_0_20px_rgba(45,212,191,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(45,212,191,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>





      {ballVisible && (
        <div className="fixed z-30 pointer-events-none">
          <BounceAvatar className="w-4 h-4 opacity-70" />
        </div>
      )}

      <div className="pt-32 pb-20">
        {/* Section 1: Intro */}
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-6">What are Message Queues?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Message queues decouple services by buffering asynchronous communication. Producers send messages, consumers process them independently.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                This enables services to operate at different speeds without blocking each other.
              </p>
              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-teal-200">
                  <strong>Mental Model:</strong> Like a restaurant ticket system—orders queue up, chefs process them one at a time.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-cyan-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-teal-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Layers className="w-24 h-24 text-teal-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Why Use Them */}
        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center sm:order-last">
              <div className="w-full max-w-sm space-y-3">
                <div className="p-4 bg-teal-500/20 border border-teal-500/30 rounded-lg">
                  <Send className="text-teal-400 mb-2" size={20} />
                  <p className="font-bold text-teal-300 text-sm mb-1">Decoupling</p>
                  <p className="text-xs text-slate-300">Services don't need to know about each other</p>
                </div>
                <div className="p-4 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                  <Clock className="text-cyan-400 mb-2" size={20} />
                  <p className="font-bold text-cyan-300 text-sm mb-1">Async Processing</p>
                  <p className="text-xs text-slate-300">Respond fast, process slow tasks later</p>
                </div>
                <div className="p-4 bg-teal-500/20 border border-teal-500/30 rounded-lg">
                  <Inbox className="text-teal-400 mb-2" size={20} />
                  <p className="font-bold text-teal-300 text-sm mb-1">Load Smoothing</p>
                  <p className="text-xs text-slate-300">Buffer traffic spikes gracefully</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-6">Why Message Queues?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Direct service-to-service calls create tight coupling. If the downstream service is slow or down, the caller blocks or fails.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Queues absorb load spikes. During Black Friday, millions of orders queue up instead of overwhelming the payment service.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Retry logic built-in. Failed messages automatically requeue after backoff.
              </p>
              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-teal-200">
                  <strong>Key Insight:</strong> Queues turn synchronous failures into asynchronous retries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive */}
        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-8 text-center">Interactive: Send Messages</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-teal-500/30 rounded-xl p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-2 w-full max-w-md">
                  <input
                    type="text"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type message (e.g. Order #123)"
                    className="flex-1 bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white focus:border-teal-500 outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!msgInput.trim()}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send size={16} /> Send
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Inbox className="text-teal-400" size={16} />
                      <p className="font-bold text-teal-300 text-sm">Queue</p>
                    </div>
                    <div className="space-y-2 min-h-32">
                      {messages.filter(m => m.status === 'queue').map(msg => (
                        <div key={msg.id} className="bg-slate-800 rounded px-3 py-2 text-xs text-slate-300 flex items-center gap-2">
                          <Clock size={12} className="text-teal-400" />
                          {msg.content}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowRight className="text-cyan-400" size={16} />
                      <p className="font-bold text-cyan-300 text-sm">Processing</p>
                    </div>
                    <div className="space-y-2 min-h-32">
                      {messages.filter(m => m.status === 'processing').map(msg => (
                        <div key={msg.id} className="bg-slate-800 rounded px-3 py-2 text-xs text-slate-300 flex items-center gap-2 animate-pulse">
                          <ArrowRight size={12} className="text-cyan-400" />
                          {msg.content}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="text-green-400" size={16} />
                      <p className="font-bold text-green-300 text-sm">Done</p>
                    </div>
                    <div className="space-y-2 min-h-32">
                      {messages.filter(m => m.status === 'done').map(msg => (
                        <div key={msg.id} className="bg-slate-800 rounded px-3 py-2 text-xs text-slate-300 flex items-center gap-2">
                          <CheckCircle size={12} className="text-green-400" />
                          {msg.content}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Patterns */}
        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-8 text-center">Queue Patterns</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Point-to-Point</p>
                <p className="text-sm text-slate-300">One producer, one consumer. Each message processed once. Classic work queue (RabbitMQ, SQS).</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Pub/Sub</p>
                <p className="text-sm text-slate-300">One producer, multiple consumers. Each consumer gets copy of message. Event broadcasting (Kafka, SNS).</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Priority Queue</p>
                <p className="text-sm text-slate-300">Messages tagged with priority. High priority processed first. Critical orders jump the line.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Dead Letter Queue</p>
                <p className="text-sm text-slate-300">Failed messages after max retries go to DLQ. Manual inspection and reprocessing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Popular Tools */}
        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-8 text-center">Popular Message Queues</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">RabbitMQ</h4>
                <p className="text-sm text-slate-300">Classic broker. AMQP protocol. Flexible routing. Good for microservices.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">Apache Kafka</h4>
                <p className="text-sm text-slate-300">Distributed log. High throughput. Event streaming. Replays possible.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">AWS SQS</h4>
                <p className="text-sm text-slate-300">Managed queue. Pay-per-use. Easy setup. Integrates with Lambda.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">Redis Streams</h4>
                <p className="text-sm text-slate-300">In-memory. Fast. Good for real-time. Consumer groups built-in.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">Google Pub/Sub</h4>
                <p className="text-sm text-slate-300">Managed pub/sub. Global scale. At-least-once delivery. Low latency.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">NATS</h4>
                <p className="text-sm text-slate-300">Lightweight. Cloud-native. Simple API. Great for microservices mesh.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Trade-offs */}
        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-8 text-center">Trade-offs</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Pros</p>
                <p className="text-sm text-slate-300">Decoupling. Async processing. Load smoothing. Retry logic. Service resilience.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Cons</p>
                <p className="text-sm text-slate-300">Eventual consistency. No immediate response. Ordering challenges. Duplicate messages. Operational overhead.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">When to Use</p>
                <p className="text-sm text-slate-300">Background jobs, event-driven architectures, microservices communication, traffic spike absorption, retry-heavy workflows.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
