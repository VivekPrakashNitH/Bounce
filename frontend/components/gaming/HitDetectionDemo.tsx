'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Target, Square, Circle } from 'lucide-react';
import { BounceAvatar, SidebarNav, PageMadeModal, GearButton } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const HitDetectionDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<'aabb' | 'circle' | 'polygon'>('aabb');
  const [collision, setCollision] = useState(false);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Hit Detection' },
    { id: 'section-2', label: 'Methods' },
    { id: 'section-3', label: 'Collision Demo' },
    { id: 'section-4', label: 'Optimization' },
    { id: 'section-5', label: 'Examples' },
    { id: 'section-6', label: 'Performance' },
  ];

  const sectionDetails = [
    { label: 'Hit Detection', description: 'Collision fundamentals' },
    { label: 'Methods', description: 'AABB, circle, polygon, ray' },
    { label: 'Collision Demo', description: 'Interactive visualization' },
    { label: 'Optimization', description: 'Broad/narrow phase' },
    { label: 'Examples', description: 'FPS, fighting, physics games' },
    { label: 'Performance', description: 'Spatial partitioning' },
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

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">


      {/* Header Component */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
        title="Hit Detection"
        levelCode="G05"
        accentColor="red"
      />

      <SidebarNav
        sections={sections}
        activeIndex={currentSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="red"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      <PageMadeModal
        isOpen={showPageMadeModal}
        onClose={() => setShowPageMadeModal(false)}
        title="Hit Detection"
        levelCode="G05"
        icon="🎯"
        description="This page covers hit detection with 6 sections including an interactive collision demo."
        sections={sectionDetails}
        accentColor="red"
        learningSummary="How collision detection determines if objects intersect in game engines."
      />

      {/* Gear Icon Button */}
      <GearButton
        onClick={() => setShowPageMadeModal(true)}
        accentColor="red"
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
              <div className="w-12 h-12 border-2 border-red-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-red-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-red-500/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-red-300 mb-4">Use Arrow Keys</h3>
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
              <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-6">Hit Detection</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Hit detection determines if two objects collide or intersect. Critical for combat games, bullet physics, damage.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Methods range from simple (AABB) to complex (polygon). Trade-off between accuracy and performance.
              </p>
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-red-200">
                  <strong>Key Insight:</strong> Broad phase checks many pairs quickly. Narrow phase is precise but slow.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-red-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Target className="w-24 h-24 text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-8 text-center">Detection Methods</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">AABB (Axis-Aligned Bounding Box)</p>
                <p className="text-sm text-slate-300">Two rectangles. Aligned to axes. Fast: O(1). Loose fitting. Most common for 2D.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Circle Collision</p>
                <p className="text-sm text-slate-300">Distance between centers. Precise for circles. Rotation invariant. O(1).</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Polygon (SAT)</p>
                <p className="text-sm text-slate-300">Separating Axis Theorem. Precise. Complex. O(n). Handles rotations.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Raycasting</p>
                <p className="text-sm text-slate-300">Shoot ray. Find first intersection. Fast line-of-sight checks.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-8 text-center">Interactive: Collision Demo</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-red-500/30 rounded-xl p-8">
              <div className="flex gap-3 mb-6">
                {(['aabb', 'circle', 'polygon'] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => { setSelectedMethod(method); setCollision(false); }}
                    className={`px-4 py-2 rounded-lg transition-colors ${selectedMethod === method
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                  >
                    {method.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="bg-slate-900 rounded-lg p-4 mb-6 h-64 flex items-center justify-center relative overflow-hidden border border-slate-700">
                {selectedMethod === 'aabb' && (
                  <>
                    <div className="absolute left-12 top-12 w-16 h-16 bg-blue-500/30 border-2 border-blue-400" />
                    <div
                      className={`absolute transition-all w-16 h-16 border-2 ${collision ? 'bg-red-500/30 border-red-400' : 'bg-green-500/30 border-green-400'
                        }`}
                      style={{ right: '48px', top: '48px' }}
                      onMouseEnter={() => setCollision(true)}
                      onMouseLeave={() => setCollision(false)}
                    />
                  </>
                )}
                {selectedMethod === 'circle' && (
                  <>
                    <Circle className="absolute left-12 top-12 w-16 h-16 text-blue-400" />
                    <Circle
                      className={`absolute transition-all w-16 h-16 ${collision ? 'text-red-400' : 'text-green-400'
                        }`}
                      style={{ right: '48px', top: '48px' }}
                      onMouseEnter={() => setCollision(true)}
                      onMouseLeave={() => setCollision(false)}
                    />
                  </>
                )}
                {selectedMethod === 'polygon' && (
                  <>
                    <div className="absolute left-12 top-12 w-16 h-16 bg-blue-500/30 border-2 border-blue-400 rotate-45" />
                    <div
                      className={`absolute transition-all w-16 h-16 border-2 rotate-12 ${collision ? 'bg-red-500/30 border-red-400' : 'bg-green-500/30 border-green-400'
                        }`}
                      style={{ right: '48px', top: '48px' }}
                      onMouseEnter={() => setCollision(true)}
                      onMouseLeave={() => setCollision(false)}
                    />
                  </>
                )}
              </div>

              <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <p className="text-sm text-slate-300">
                  <strong>Status:</strong> {collision ? 'Collision Detected!' : 'No Collision'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-8 text-center">Optimization Techniques</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Broad Phase</h4>
                <p className="text-sm text-slate-300">Spatial hashing, quadtrees. Quick reject most pairs. Then narrow phase.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Narrow Phase</h4>
                <p className="text-sm text-slate-300">Precise checks on candidates. SAT, GJK algorithms. More CPU intensive.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Continuous Collision</h4>
                <p className="text-sm text-slate-300">Sweep test. Catch fast bullets. Slower but prevents tunneling.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2">Physics Engines</h4>
                <p className="text-sm text-slate-300">Bullet, Havok, PhysX. Use libraries. Don't reinvent collision.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-8 text-center">Real-World Examples</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">FPS Games</p>
                <p className="text-sm text-slate-300">Raycasting for bullets. AABB for environment. Circle for grenades.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Fighting Games</p>
                <p className="text-sm text-slate-300">Complex polygon collision. Hit boxes and hurt boxes. Frame data.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Physics Simulations</p>
                <p className="text-sm text-slate-300">Continuous collision detection. Constraint solving. Stability critical.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-red-300 mb-8 text-center">Performance Considerations</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Spatial Partitioning</p>
                <p className="text-sm text-slate-300">Quadtrees, octrees, grid. Reduce collision checks. Scale to thousands of objects.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Early Exit</p>
                <p className="text-sm text-slate-300">Check distance first. Simple checks before complex. Biggest wins.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-red-300 mb-2">Level Design</p>
                <p className="text-sm text-slate-300">Fewer moving objects. More static. Complexity depends on game type.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
