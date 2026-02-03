'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon } from 'lucide-react';
import { BounceAvatar, SidebarNav } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const InstagramDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [feedData] = useState([
    { id: 1, author: '@user1', caption: 'Beach sunset vibes', likes: 2450, comments: 128 },
    { id: 2, author: '@user2', caption: 'Coffee time', likes: 890, comments: 45 },
    { id: 3, author: '@user3', caption: 'Mountain hiking', likes: 5670, comments: 312 },
  ]);

  const sections = [
    { id: 'section-1', label: 'Instagram' },
    { id: 'section-2', label: 'Architecture' },
    { id: 'section-3', label: 'Feed Demo' },
    { id: 'section-4', label: 'Scalability' },
    { id: 'section-5', label: 'Tech Stack' },
    { id: 'section-6', label: 'Metrics' },
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

  const toggleLike = (postId: number) => {
    setLikedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
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
        accentColor="rose"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-pink-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(236,72,153,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-pink-400 text-xs font-mono mt-1">CS01 — Instagram Case Study</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-pink-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">📷</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This case study covers Instagram's architecture with 6 sections including an interactive feed demo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-pink-900/30 rounded-lg p-3"><p className="text-pink-300 font-mono text-xs font-bold mb-1">Section 1: Instagram</p><p className="text-slate-400 text-xs">Platform overview</p></div>
                  <div className="bg-slate-800/40 border border-pink-900/30 rounded-lg p-3"><p className="text-pink-300 font-mono text-xs font-bold mb-1">Section 2: Architecture</p><p className="text-slate-400 text-xs">Feed, storage, notifications</p></div>
                  <div className="bg-slate-800/40 border border-pink-900/30 rounded-lg p-3"><p className="text-pink-300 font-mono text-xs font-bold mb-1">Section 3: Feed Demo</p><p className="text-slate-400 text-xs">Interactive mock feed</p></div>
                  <div className="bg-slate-800/40 border border-pink-900/30 rounded-lg p-3"><p className="text-pink-300 font-mono text-xs font-bold mb-1">Section 4: Scalability</p><p className="text-slate-400 text-xs">Sharding, load balancing</p></div>
                  <div className="bg-slate-800/40 border border-pink-900/30 rounded-lg p-3"><p className="text-pink-300 font-mono text-xs font-bold mb-1">Section 5: Tech Stack</p><p className="text-slate-400 text-xs">Storage, caching, CDN</p></div>
                  <div className="bg-slate-800/40 border border-pink-900/30 rounded-lg p-3"><p className="text-pink-300 font-mono text-xs font-bold mb-1">Section 6: Metrics</p><p className="text-slate-400 text-xs">2B users, 99.99% uptime</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-950/30 to-rose-950/30 border border-pink-900/50 rounded-lg p-4">
                <p className="text-pink-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-pink-400 font-semibold">Instagram</span> handles 2 billion users with feeds, CDN, and caching.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gear Icon Button */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] transition-all animate-bounce"
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
              <div className="w-12 h-12 border-2 border-rose-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-rose-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-pink-500/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-pink-300 mb-4">Use Arrow Keys</h3>
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
              <h3 className="text-3xl sm:text-4xl font-bold text-pink-300 mb-6">Instagram</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                2 billion monthly active users sharing photos, videos, and stories globally.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Handles billions of image uploads, real-time feed delivery, and social interactions at massive scale.
              </p>
              <div className="mt-6 p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-pink-200">
                  <strong>Challenge:</strong> Deliver personalized feeds to billions with millisecond latency.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-pink-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <div className="text-6xl">📷</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-pink-300 mb-8 text-center">Core Architecture</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl">
                <p className="font-bold text-pink-300 mb-2">Feed Generation</p>
                <p className="text-sm text-slate-300">Ranks posts from followed users. ML algorithm. Real-time freshness.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl">
                <p className="font-bold text-pink-300 mb-2">Image Storage</p>
                <p className="text-sm text-slate-300">CDN distribution. Multiple resolutions. Geo-optimized serving.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl">
                <p className="font-bold text-pink-300 mb-2">Real-time Notifications</p>
                <p className="text-sm text-slate-300">WebSocket connections. Push notifications. Event streaming.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl">
                <p className="font-bold text-pink-300 mb-2">Caching Layers</p>
                <p className="text-sm text-slate-300">Redis for active feeds. Memcached for metadata. Multi-level caching.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-pink-300 mb-8 text-center">Interactive: Mock Feed</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-pink-500/30 rounded-xl p-6">
              <div className="space-y-4 max-w-2xl mx-auto">
                {feedData.map(post => (
                  <div key={post.id} className="bg-slate-700/50 rounded-lg border border-slate-600 overflow-hidden">
                    <div className="bg-slate-800 p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-400/20 rounded-full" />
                      <div>
                        <p className="font-bold text-sm text-slate-300">{post.author}</p>
                        <p className="text-xs text-slate-400">2 hours ago</p>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 aspect-square flex items-center justify-center border-y border-slate-600">
                      <ImageIcon className="w-12 h-12 text-slate-600" />
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`transition-colors ${likedPosts.includes(post.id) ? 'text-pink-400' : 'text-slate-400 hover:text-slate-300'}`}
                        >
                          <Heart className="w-6 h-6" fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300 transition-colors">
                          <MessageCircle className="w-6 h-6" />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300 transition-colors">
                          <Share2 className="w-6 h-6" />
                        </button>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-300">
                          {(likedPosts.includes(post.id) ? post.likes + 1 : post.likes).toLocaleString()} likes
                        </p>
                        <p className="text-sm text-slate-300 mt-1">
                          <span className="font-bold">{post.author}</span> {post.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-pink-300 mb-8 text-center">Scalability Solutions</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl">
                <p className="font-bold text-pink-300 mb-2">Sharding</p>
                <p className="text-sm text-slate-300">Data partitioned by user ID. Each shard independent. Horizontal scale.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl">
                <p className="font-bold text-pink-300 mb-2">Load Balancing</p>
                <p className="text-sm text-slate-300">Distribute traffic across regions. Geographic routing. Failover.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl">
                <p className="font-bold text-pink-300 mb-2">Message Queues</p>
                <p className="text-sm text-slate-300">Async processing. Like counts, comments delayed. Decouples services.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl">
                <p className="font-bold text-pink-300 mb-2">Timeline Fanout</p>
                <p className="text-sm text-slate-300">Pre-compute feeds for each user. Push model. Faster delivery.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-pink-300 mb-8 text-center">Technical Stack</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-pink-500/30 rounded-xl">
                <h4 className="font-bold text-pink-300 mb-2">Storage</h4>
                <p className="text-sm text-slate-300">MySQL, Cassandra, S3. Billions of records. Distributed.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-pink-500/30 rounded-xl">
                <h4 className="font-bold text-pink-300 mb-2">Caching</h4>
                <p className="text-sm text-slate-300">Redis, Memcached. Hot data in memory. Sub-millisecond.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-pink-500/30 rounded-xl">
                <h4 className="font-bold text-pink-300 mb-2">CDN</h4>
                <p className="text-sm text-slate-300">Akamai, CloudFlare. Image delivery. Global edge servers.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-pink-500/30 rounded-xl">
                <h4 className="font-bold text-pink-300 mb-2">Analytics</h4>
                <p className="text-sm text-slate-300">Hadoop, Spark. Engagement metrics. Recommendation ML.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-pink-300 mb-8 text-center">Key Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-pink-300">2B</p>
                <p className="text-sm text-slate-300">Monthly Active Users</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-pink-300">&lt;200ms</p>
                <p className="text-sm text-slate-300">Feed Load Time</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-pink-300">500B+</p>
                <p className="text-sm text-slate-300">Photos Hosted</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-pink-300">99.99%</p>
                <p className="text-sm text-slate-300">Availability SLA</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* {completionProgress > 0 && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center pointer-events-none" style={{ opacity: completionProgress }}>
          <div className="text-center">
            <BounceAvatar className="w-20 h-20 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl sm:text-4xl font-bold text-pink-300 mb-4">Level Complete</h2>
            <button className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-bold pointer-events-auto">
              Next Demo
            </button>
          </div>
        </div>
      )} */}

      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
