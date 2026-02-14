'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Zap, Clock, Database, AlertCircle, Layers } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const CachingDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const [completionProgress, setCompletionProgress] = useState(0);
  const [cache, setCache] = useState<{ key: string }[]>([]);
  const [cacheHits, setCacheHits] = useState(0);
  const [cacheMisses, setCacheMisses] = useState(0);
  const [cacheStatus, setCacheStatus] = useState<string>('Ready');
  const CACHE_SIZE = 3;
  const dbData = ['User_A', 'User_B', 'User_C', 'User_D', 'User_E'];
  const [selectedKey, setSelectedKey] = useState('User_A');
  const [processingCache, setProcessingCache] = useState(false);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const sections = [
    { id: 'section-1', label: 'What is Caching' },
    { id: 'section-2', label: 'Cache Layers' },
    { id: 'section-3', label: 'Hit vs Miss' },
    { id: 'section-4', label: 'Invalidation' },
    { id: 'section-5', label: 'Consistency' },
    { id: 'section-6', label: 'Why It Matters' },
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



  const handleCacheRequest = () => {
    if (processingCache) return;
    setProcessingCache(true);
    const foundIdx = cache.findIndex(item => item.key === selectedKey);
    if (foundIdx !== -1) {
      setCacheHits(prev => prev + 1);
      setCacheStatus(`HIT on ${selectedKey}. Moved to MRU.`);
      setCache(prev => {
        const newCache = [...prev];
        const item = newCache.splice(foundIdx, 1)[0];
        newCache.push(item);
        return newCache;
      });
    } else {
      setCacheMisses(prev => prev + 1);
      setCacheStatus(`MISS on ${selectedKey}. Fetching...`);
      setTimeout(() => {
        setCache(prev => {
          let newCache = [...prev];
          if (newCache.length >= CACHE_SIZE) newCache.shift();
          newCache.push({ key: selectedKey });
          return newCache;
        });
        setCacheStatus(`Wrote ${selectedKey} to cache.`);
      }, 400);
    }
    setTimeout(() => setProcessingCache(false), 800);
  };

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">

      {/* HEADER SECTION */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={() => { }}
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
        accentColor="orange"
        isVisible={true}
      />

      {/* PAGE ARCHITECTURE MODAL */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-orange-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(251,146,60,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-orange-400 text-xs font-mono mt-1">L3 — Caching</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-orange-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page uses a <span className="text-orange-400 font-semibold">scroll-driven learning system</span> with 6 sections covering caching fundamentals.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-orange-900/30 rounded-lg p-3"><p className="text-orange-300 font-mono text-xs font-bold mb-1">Section 1: Introduction</p><p className="text-slate-400 text-xs">What is caching and the speed vs staleness trade-off</p></div>
                  <div className="bg-slate-800/40 border border-orange-900/30 rounded-lg p-3"><p className="text-orange-300 font-mono text-xs font-bold mb-1">Section 2: Cache Layers</p><p className="text-slate-400 text-xs">Browser, CDN, App, and DB cache hierarchy</p></div>
                  <div className="bg-slate-800/40 border border-orange-900/30 rounded-lg p-3"><p className="text-orange-300 font-mono text-xs font-bold mb-1">Section 3: Interactive Demo</p><p className="text-slate-400 text-xs">LRU cache simulator with hit/miss tracking</p></div>
                  <div className="bg-slate-800/40 border border-orange-900/30 rounded-lg p-3"><p className="text-orange-300 font-mono text-xs font-bold mb-1">Section 4: Invalidation</p><p className="text-slate-400 text-xs">TTL, LRU, Event-Driven, Versioning strategies</p></div>
                  <div className="bg-slate-800/40 border border-orange-900/30 rounded-lg p-3"><p className="text-orange-300 font-mono text-xs font-bold mb-1">Section 5: Consistency</p><p className="text-slate-400 text-xs">Write-through vs write-behind patterns</p></div>
                  <div className="bg-slate-800/40 border border-orange-900/30 rounded-lg p-3"><p className="text-orange-300 font-mono text-xs font-bold mb-1">Section 6: Why It Matters</p><p className="text-slate-400 text-xs">Performance, cost, scalability benefits</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-950/30 to-yellow-950/30 border border-orange-900/50 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-orange-400 font-semibold">caching</span> trades memory for speed, the importance of cache invalidation strategies, and consistency patterns for distributed systems.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING GEAR ICON */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full shadow-[0_0_20px_rgba(251,146,60,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(251,146,60,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>



      <div className="pt-32 pb-20">
        {/* Section 1: Intro */}
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-6">What is Caching?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Caching stores frequently accessed data in a faster, intermediate location. Instead of fetching from the original source every time, you retrieve from cache—dramatically reducing latency.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                The trade-off: stale data. You must decide when to refresh the cache and what data to keep.
              </p>
              <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-orange-200">
                  <strong>Mental Model:</strong> Caching is like keeping frequently used books on your desk. You trade memory space for speed.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-yellow-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-orange-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Zap className="w-24 h-24 text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Cache Layers */}
        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center sm:order-last">
              <div className="w-full max-w-sm space-y-2">
                <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                  <p className="font-bold text-orange-300 text-sm mb-1">L1: Browser Cache</p>
                  <p className="text-xs text-slate-300">Images, CSS, JS - days/months</p>
                </div>
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="font-bold text-yellow-300 text-sm mb-1">L2: CDN Cache</p>
                  <p className="text-xs text-slate-300">Static assets at edge - minutes/hours</p>
                </div>
                <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                  <p className="font-bold text-orange-300 text-sm mb-1">L3: App Cache (Redis)</p>
                  <p className="text-xs text-slate-300">Query results, sessions - seconds</p>
                </div>
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="font-bold text-yellow-300 text-sm mb-1">L4: DB Cache</p>
                  <p className="text-xs text-slate-300">Buffer pools - immediate</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-6">Cache Layers</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Modern systems use multiple cache layers. Each layer is faster but smaller and more expensive per byte.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Speed hierarchy: DB cache to App cache to CDN to Browser.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Popular tools: Redis, Memcached, Nginx, Cloudflare/CloudFront.
              </p>
              <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-orange-200">
                  <strong>Key Insight:</strong> More layers = better performance but higher complexity and staleness risk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive */}
        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-8 text-center">Interactive: Cache Hit vs Miss</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-orange-500/30 rounded-xl p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-bold text-orange-300 mb-3">Select Key:</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {dbData.map(key => (
                      <button
                        key={key}
                        onClick={() => setSelectedKey(key)}
                        disabled={processingCache}
                        className={`px-3 py-2 text-xs rounded border transition-colors ${selectedKey === key ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-700 border-slate-600 hover:border-slate-400 text-slate-300'}`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleCacheRequest}
                    disabled={processingCache}
                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-colors mb-4"
                  >
                    {processingCache ? 'Processing...' : 'Fetch Data'}
                  </button>
                  <div className="text-xs text-slate-300 bg-slate-900 rounded p-3 min-h-12 flex items-center">{cacheStatus}</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-300 mb-3">Cache Memory (Max {CACHE_SIZE}):</p>
                  <div className="space-y-2 mb-6">
                    {Array.from({ length: Math.max(0, CACHE_SIZE - cache.length) }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8 border-2 border-dashed border-slate-600 rounded flex items-center px-3 text-xs text-slate-500">
                        [Empty]
                      </div>
                    ))}
                    {cache.map((item, idx) => (
                      <div key={item.key} className="h-8 bg-orange-600/30 border border-orange-500 rounded flex items-center justify-between px-3 text-xs">
                        <span className="font-mono text-orange-200">{item.key}</span>
                        {idx === cache.length - 1 && <span className="text-[10px] bg-orange-500 text-black px-1.5 rounded font-bold">MRU</span>}
                        {idx === 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 rounded font-bold">LRU</span>}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                      <p className="text-xs text-slate-400 mb-1">Hits</p>
                      <p className="text-xl font-bold text-green-400">{cacheHits}</p>
                    </div>
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                      <p className="text-xs text-slate-400 mb-1">Misses</p>
                      <p className="text-xl font-bold text-red-400">{cacheMisses}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Invalidation */}
        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-8 text-center">Invalidation Strategies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <Clock className="text-orange-400 mb-3" size={24} />
                <h4 className="font-bold text-orange-300 mb-2">TTL</h4>
                <p className="text-sm text-slate-300">Expire after fixed duration. Simple but may serve stale data.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <Database className="text-orange-400 mb-3" size={24} />
                <h4 className="font-bold text-orange-300 mb-2">LRU</h4>
                <p className="text-sm text-slate-300">Evict least recently accessed. Good for memory constraints.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <AlertCircle className="text-orange-400 mb-3" size={24} />
                <h4 className="font-bold text-orange-300 mb-2">Event-Driven</h4>
                <p className="text-sm text-slate-300">Invalidate when source changes. Most accurate, requires coordination.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <Layers className="text-orange-400 mb-3" size={24} />
                <h4 className="font-bold text-orange-300 mb-2">Versioning</h4>
                <p className="text-sm text-slate-300">Version keys when source changes. Never evicts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Consistency */}
        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-8 text-center">The Consistency Challenge</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl">
                <p className="text-sm text-slate-300">
                  <strong className="text-orange-300">The Problem:</strong> Database changes but cache is stale. You serve wrong data to users.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl">
                <p className="text-sm text-slate-300">
                  <strong className="text-orange-300">Write-Through:</strong> Update cache and database together. Guarantees consistency. <strong className="text-orange-300">Write-Behind:</strong> Cache first, database later. Fast but risky.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl">
                <p className="text-sm text-slate-300">
                  <strong className="text-orange-300">Real-World:</strong> Most systems tolerate eventual consistency. For critical data like payments, prioritize consistency over speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Why It Matters */}
        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-8 text-center">Why Caching Matters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">Performance</h4>
                <p className="text-sm text-slate-300">1000x faster. Microseconds vs multi-second queries.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">Cost Efficiency</h4>
                <p className="text-sm text-slate-300">Fewer database queries. Lower compute costs.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">Scalability</h4>
                <p className="text-sm text-slate-300">Cache shields database from thundering herd.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">UX</h4>
                <p className="text-sm text-slate-300">Faster load times. Critical on mobile/slow connections.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">Resilience</h4>
                <p className="text-sm text-slate-300">Cache serves stale data if database goes down.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-orange-500/30 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-2">Hit Ratio</h4>
                <p className="text-sm text-slate-300">80%+ is healthy. Below 50% means reconsider strategy.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
