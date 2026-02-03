'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { BounceAvatar, SidebarNav } from '../ui';
import { Header } from '../ui/Header';

interface Point {
  x: number;
  y: number;
  id: number;
}

interface Props {
  onShowCode?: () => void;
}

export const QuadtreeVisualizer: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [points, setPoints] = useState<Point[]>([]);
  const [showTree, setShowTree] = useState(false);
  const [numPoints, setNumPoints] = useState(50);
  const pointIdRef = useRef(0);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Quadtree' },
    { id: 'section-2', label: 'Structure' },
    { id: 'section-3', label: 'Visualizer' },
    { id: 'section-4', label: 'Operations' },
    { id: 'section-5', label: 'Applications' },
    { id: 'section-6', label: 'Performance' },
  ];

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

  useEffect(() => {
    if (canvasRef.current && points.length > 0) {
      drawQuadtree();
    }
  }, [points, showTree]);

  const generateRandomPoints = (count: number) => {
    const newPoints: Point[] = [];
    for (let i = 0; i < count; i++) {
      newPoints.push({
        x: Math.random() * 300,
        y: Math.random() * 300,
        id: pointIdRef.current++,
      });
    }
    setPoints(newPoints);
  };

  const drawQuadtree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 300, 300);

    if (showTree) {
      const drawNode = (x: number, y: number, size: number, depth: number) => {
        const maxDepth = 3;
        if (depth >= maxDepth) return;

        const mid = size / 2;
        const alpha = 1 - (depth / maxDepth) * 0.7;
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.lineWidth = 0.5;

        ctx.strokeRect(x, y, mid, mid);
        ctx.strokeRect(x + mid, y, mid, mid);
        ctx.strokeRect(x, y + mid, mid, mid);
        ctx.strokeRect(x + mid, y + mid, mid, mid);

        if (depth < maxDepth - 1) {
          drawNode(x, y, mid, depth + 1);
          drawNode(x + mid, y, mid, depth + 1);
          drawNode(x, y + mid, mid, depth + 1);
          drawNode(x + mid, y + mid, mid, depth + 1);
        }
      };

      drawNode(0, 0, 300, 0);
    }

    ctx.fillStyle = '#ec4899';
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
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
        accentColor="teal"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-teal-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(20,184,166,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-teal-400 text-xs font-mono mt-1">CS04 — Quadtree</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-teal-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">⚡</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This case study covers quadtree data structure with 6 sections including an interactive visualizer.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 1: Quadtree</p><p className="text-slate-400 text-xs">Data structure overview</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 2: Structure</p><p className="text-slate-400 text-xs">Nodes, divisions, depth</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 3: Visualizer</p><p className="text-slate-400 text-xs">Interactive quadtree demo</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 4: Operations</p><p className="text-slate-400 text-xs">Insert, range query</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 5: Applications</p><p className="text-slate-400 text-xs">Maps, gaming, graphics</p></div>
                  <div className="bg-slate-800/40 border border-teal-900/30 rounded-lg p-3"><p className="text-teal-300 font-mono text-xs font-bold mb-1">Section 6: Performance</p><p className="text-slate-400 text-xs">O(log n) operations</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-teal-950/30 to-cyan-950/30 border border-teal-900/50 rounded-lg p-4">
                <p className="text-teal-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-teal-400 font-semibold">quadtrees</span> power location searches, collision detection, and spatial databases.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gear Icon Button */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(20,184,166,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>

      {!gateUnlocked && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <BounceAvatar className="w-32 h-32 mx-auto mb-6 opacity-80" />
            <p className="text-slate-300 text-lg mb-4">Press any arrow key to unlock</p>
            <div className="flex gap-3 justify-center opacity-60 text-sm">
              <span>UP</span>
              <span>DOWN</span>
              <span>LEFT</span>
              <span>RIGHT</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-teal-500/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-teal-300 mb-4">Use Arrow Keys</h3>
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
              <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-6">Quadtree</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Space-partitioning tree structure dividing 2D space into four quadrants recursively.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Powers location searches, game collision detection, map applications, and spatial databases.
              </p>
              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-teal-200">
                  <strong>Key Insight:</strong> O(log n) range queries. Faster than brute force O(n).
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-cyan-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-teal-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Zap className="w-24 h-24 text-teal-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-8 text-center">Structure</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Root Node</p>
                <p className="text-sm text-slate-300">Represents entire 2D space. Contains up to 4 child nodes.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Recursive Division</p>
                <p className="text-sm text-slate-300">Each node splits into NE, SE, NW, SW quadrants. Until threshold reached.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Leaf Nodes</p>
                <p className="text-sm text-slate-300">Store points or list of objects. Maximum capacity prevents infinite subdivision.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Depth Control</p>
                <p className="text-sm text-slate-300">Limited depth prevents fragmentation. Typically 3-5 levels optimal.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-8 text-center">Interactive: Visualizer</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-teal-500/30 rounded-xl p-6">
              <div className="flex flex-col items-center gap-6">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="border-2 border-teal-500/50 rounded-lg bg-slate-900"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => generateRandomPoints(numPoints)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    Generate Points
                  </button>
                  <button
                    onClick={() => setShowTree(!showTree)}
                    disabled={points.length === 0}
                    className={`px-4 py-2 text-white rounded-lg text-sm font-bold transition-colors ${showTree ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-600 hover:bg-slate-500'} ${points.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {showTree ? 'Hide Tree' : 'Show Tree'}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm text-slate-300">Points: {numPoints}</label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={numPoints}
                    onChange={(e) => setNumPoints(parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>

                {points.length > 0 && (
                  <div className="text-xs text-slate-400 text-center">
                    <p>Total Points: {points.length}</p>
                    <p>Tree Depth: {showTree ? 3 : 'N/A'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-8 text-center">Operations</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Insert Point</p>
                <p className="text-sm text-slate-300">Traverse tree from root. Find correct quadrant. O(log n) average.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Range Query</p>
                <p className="text-sm text-slate-300">Find all points in rectangular region. Prune non-overlapping branches.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Nearest Neighbor</p>
                <p className="text-sm text-slate-300">Find closest point. Depth-first search with pruning. Faster than O(n).</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Delete Point</p>
                <p className="text-sm text-slate-300">Remove from leaf. Optionally merge nodes if underpopulated.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-8 text-center">Applications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">Google Maps</h4>
                <p className="text-sm text-slate-300">Location-based search. Find nearby restaurants, gas stations.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">Gaming</h4>
                <p className="text-sm text-slate-300">Collision detection. Spatial indexing for entities.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">Image Compression</h4>
                <p className="text-sm text-slate-300">Recursive quad-tree decomposition. Stores similar-color regions.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-teal-500/30 rounded-xl">
                <h4 className="font-bold text-teal-300 mb-2">3D Graphics (Octree)</h4>
                <p className="text-sm text-slate-300">3D variant. Ray tracing, voxel rendering acceleration.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-8 text-center">Performance</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Insert: O(log n)</p>
                <p className="text-sm text-slate-300">Navigate tree depth. Much faster than unsorted list O(1) + O(n log n) sort.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Range Query: O(k + log n)</p>
                <p className="text-sm text-slate-300">k = result size. Logarithmic traversal plus output. Beats O(n) brute force.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl">
                <p className="font-bold text-teal-300 mb-2">Space: O(n)</p>
                <p className="text-sm text-slate-300">Linear with points. Overhead per node minimal. Balanced tree structure.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
