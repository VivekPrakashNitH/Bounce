'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link as LinkIcon, Copy, Check } from 'lucide-react';
import { BounceAvatar, SidebarNav } from '../ui';
import { Header } from '../ui/Header';

interface ShortenedUrl {
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: string;
}

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const UrlShortenerDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [inputUrl, setInputUrl] = useState('https://example.com/very/long/url/path');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const sections = [
    { id: 'section-1', label: 'URL Shortener' },
    { id: 'section-2', label: 'Requirements' },
    { id: 'section-3', label: 'Shorten Demo' },
    { id: 'section-4', label: 'System Design' },
    { id: 'section-5', label: 'Algorithms' },
    { id: 'section-6', label: 'Metrics' },
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

  const generateShortCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleShortenUrl = () => {
    if (inputUrl.trim()) {
      const shortCode = generateShortCode();
      setShortenedUrls(prev => [
        {
          shortCode,
          longUrl: inputUrl,
          clicks: Math.floor(Math.random() * 500),
          createdAt: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      setInputUrl('');
    }
  };

  const handleCopyCode = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
        accentColor="purple"
        isVisible={true}
      />

      {/* Page Architecture Modal */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-indigo-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(99,102,241,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-indigo-400 text-xs font-mono mt-1">CS03 — URL Shortener</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-indigo-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🔗</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This case study covers URL shortener design with 6 sections including an interactive shorten demo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-indigo-900/30 rounded-lg p-3"><p className="text-indigo-300 font-mono text-xs font-bold mb-1">Section 1: URL Shortener</p><p className="text-slate-400 text-xs">Service overview</p></div>
                  <div className="bg-slate-800/40 border border-indigo-900/30 rounded-lg p-3"><p className="text-indigo-300 font-mono text-xs font-bold mb-1">Section 2: Requirements</p><p className="text-slate-400 text-xs">Short codes, fast redirects</p></div>
                  <div className="bg-slate-800/40 border border-indigo-900/30 rounded-lg p-3"><p className="text-indigo-300 font-mono text-xs font-bold mb-1">Section 3: Shorten Demo</p><p className="text-slate-400 text-xs">Interactive URL shortener</p></div>
                  <div className="bg-slate-800/40 border border-indigo-900/30 rounded-lg p-3"><p className="text-indigo-300 font-mono text-xs font-bold mb-1">Section 4: System Design</p><p className="text-slate-400 text-xs">Database, cache, Zookeeper</p></div>
                  <div className="bg-slate-800/40 border border-indigo-900/30 rounded-lg p-3"><p className="text-indigo-300 font-mono text-xs font-bold mb-1">Section 5: Algorithms</p><p className="text-slate-400 text-xs">Base62, hashing, TTL</p></div>
                  <div className="bg-slate-800/40 border border-indigo-900/30 rounded-lg p-3"><p className="text-indigo-300 font-mono text-xs font-bold mb-1">Section 6: Metrics</p><p className="text-slate-400 text-xs">100B URLs, {"<"}10ms latency</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-900/50 rounded-lg p-4">
                <p className="text-indigo-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-indigo-400 font-semibold">URL shorteners</span> handle billions of URLs with fast redirects.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gear Icon Button */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>





      {ballVisible && (
        <div className="fixed z-30 pointer-events-none">
          <BounceAvatar className="w-4 h-4 opacity-70" />
        </div>
      )}

      <div ref={scrollContainerRef} className="pt-32 pb-20 h-screen overflow-y-auto custom-scrollbar">
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-6">URL Shortener</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Service that converts long URLs into short, shareable links. Like bit.ly or TinyURL.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Handles URL mapping, redirects, click tracking, and collision resolution for billions of URLs.
              </p>
              <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-indigo-200">
                  <strong>Challenge:</strong> Store 100 billion URLs, serve redirects in &lt;10ms, handle collisions.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-indigo-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <LinkIcon className="w-24 h-24 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">Core Requirements</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Short Code Generation</p>
                <p className="text-sm text-slate-300">Generate unique 6-character codes. Collision avoidance. Base62 encoding.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Fast Redirects</p>
                <p className="text-sm text-slate-300">Lookup short code, return long URL. &lt;10ms response. Cached.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Analytics</p>
                <p className="text-sm text-slate-300">Track clicks, referrers, locations. Real-time stats. User dashboards.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Customization</p>
                <p className="text-sm text-slate-300">User-defined short codes. Expiration. QR codes. Analytics.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">Interactive: Shorten URL</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-indigo-500/30 rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-indigo-300 font-bold mb-2 block">Long URL</label>
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleShortenUrl()}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300"
                    placeholder="https://example.com/..."
                  />
                </div>

                <button
                  onClick={handleShortenUrl}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  Shorten URL
                </button>

                {shortenedUrls.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm font-bold text-indigo-300">Recent URLs ({shortenedUrls.length})</p>
                    {shortenedUrls.map(url => (
                      <div key={url.shortCode} className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 truncate">{url.longUrl}</p>
                            <p className="text-sm font-mono text-indigo-300">short.url/{url.shortCode}</p>
                          </div>
                          <button
                            onClick={() => handleCopyCode(url.shortCode)}
                            className="flex-shrink-0 p-2 hover:bg-slate-600 rounded transition-colors"
                            title="Copy short code"
                          >
                            {copiedCode === url.shortCode ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{url.clicks} clicks</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">System Design</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Database: Primary</p>
                <p className="text-sm text-slate-300">MySQL mapping short code to long URL. Indexed lookups. Sharded by hash.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Cache Layer</p>
                <p className="text-sm text-slate-300">Redis hot URLs. LRU eviction. 90% hit rate typical.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Zookeeper</p>
                <p className="text-sm text-slate-300">Distributed lock for ID generation. Prevent collisions. Unique ranges per server.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Analytics DB</p>
                <p className="text-sm text-slate-300">MongoDB for click events. Hadoop for batch analysis. Real-time dashboards.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">Algorithms</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Base62 Encoding</p>
                <p className="text-sm text-slate-300">Convert integer ID to base62 string. 6 chars = 62^6 = 56 trillion URLs.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Hashing Collision</p>
                <p className="text-sm text-slate-300">If custom code exists, retry with hash. Bloom filters for quick checks.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">TTL Management</p>
                <p className="text-sm text-slate-300">Soft delete with expiration. Archive old URLs. Periodic cleanup jobs.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">Scaling Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-indigo-300">100B+</p>
                <p className="text-sm text-slate-300">Total URLs Shortened</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-indigo-300">&lt;10ms</p>
                <p className="text-sm text-slate-300">Redirect Latency</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-indigo-300">1M+</p>
                <p className="text-sm text-slate-300">Shortens Per Day</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-indigo-300">99.9%</p>
                <p className="text-sm text-slate-300">Availability</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
