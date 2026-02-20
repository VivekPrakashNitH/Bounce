'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Target, Square, Circle } from 'lucide-react';
import { BounceAvatar, SidebarNav, PageMadeModal, GearButton, GateKeeper } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const HitDetectionDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<'aabb' | 'circle' | 'polygon'>('aabb');
  const [collision, setCollision] = useState(false);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

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
        <GateKeeper
          title="Level G05"
          subtitle="Hit Detection"
          description="Learn how games detect collisions between objects using AABB, circle, and polygon methods."
          difficulty="Intermediate"
          theme="nature"
          onUnlock={() => setGateUnlocked(true)}
        />
      )}

      {ballVisible && gateUnlocked && (
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
