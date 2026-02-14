'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Zap, MousePointerClick, RefreshCw, Box, Search } from 'lucide-react';
import { BounceAvatar, SidebarNav } from '../ui';
import { Header } from '../ui/Header';

interface Point {
  x: number;
  y: number;
}

interface QuadNode {
  x: number;
  y: number;
  w: number;
  h: number;
  points: Point[];
  children?: QuadNode[];
}

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const QuadtreeVisualizer: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const capacity = 4;

  const buildTree = (x: number, y: number, w: number, h: number, pts: Point[]): QuadNode => {
    if (pts.length <= capacity) {
      return { x, y, w, h, points: pts };
    }

    const halfW = w / 2;
    const halfH = h / 2;

    const nw = pts.filter(p => p.x < x + halfW && p.y < y + halfH);
    const ne = pts.filter(p => p.x >= x + halfW && p.y < y + halfH);
    const sw = pts.filter(p => p.x < x + halfW && p.y >= y + halfH);
    const se = pts.filter(p => p.x >= x + halfW && p.y >= y + halfH);

    return {
      x, y, w, h, points: pts,
      children: [
        buildTree(x, y, halfW, halfH, nw),         // NW
        buildTree(x + halfW, y, halfW, halfH, ne), // NE
        buildTree(x, y + halfH, halfW, halfH, sw), // SW
        buildTree(x + halfW, y + halfH, halfW, halfH, se) // SE
      ]
    };
  };

  const renderNode = (node: QuadNode, depth: number = 0) => {
    return (
      <React.Fragment key={`${node.x}-${node.y}-${depth}`}>
        <div
          className="absolute border border-green-500/30 transition-all duration-500"
          style={{
            left: node.x,
            top: node.y,
            width: node.w,
            height: node.h,
            borderColor: `rgba(34, 197, 94, ${0.3 + (depth * 0.2)})`
          }}
        />
        {node.children && node.children.map(child => renderNode(child, depth + 1))}
      </React.Fragment>
    );
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints(prev => [...prev, { x, y }]);
  };

  const tree = buildTree(0, 0, 400, 400, points);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);

  const sections = [
    { id: 'section-1', label: 'Quadtree' },
    { id: 'section-2', label: 'Structure' },
    { id: 'section-3', label: 'Visualizer' },
    { id: 'section-4', label: 'Operations' },
    { id: 'section-5', label: 'Applications' },
    { id: 'section-6', label: 'Performance' },
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
        isVisible={true}
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





      {ballVisible && (
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

            <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
                <div className="flex items-center gap-4">
                  <BounceAvatar className="w-10 h-10" />
                  <h3 className="text-xl font-mono text-green-400 flex items-center gap-2">
                    <Box /> Level 6: Quadtree Indexing
                  </h3>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Spatial Partitioning</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Interactive Area */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    {points.length === 0 && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce z-20 pointer-events-none">
                        <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full mb-1 font-bold">Click to Add Drivers</span>
                        <MousePointerClick className="text-blue-500 fill-blue-500" size={24} />
                      </div>
                    )}
                    <div
                      className="w-[400px] h-[400px] bg-black relative overflow-hidden border-2 border-slate-700 cursor-crosshair rounded-lg shadow-inner"
                      onClick={handleClick}
                    >
                      {/* Render Grid Lines */}
                      {renderNode(tree)}

                      {/* Render Points */}
                      {points.map((p, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white] animate-in zoom-in duration-300"
                          style={{ left: p.x - 2, top: p.y - 2 }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setPoints([])} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
                      <RefreshCw size={12} /> Reset Grid
                    </button>
                    <span className="text-xs text-zinc-500">Points: {points.length} | Capacity per block: {capacity}</span>
                  </div>
                </div>

                {/* Explanation Area */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Search size={16} className="text-green-400" /> How it works
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      A Quadtree recursively divides a 2D region into four quadrants.
                      When a quadrant reaches its capacity (4 points here), it splits.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-4 h-4 border border-green-500/30 bg-transparent block"></span>
                        <span>Node (Region)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-2 h-2 bg-white rounded-full block"></span>
                        <span>Data Point (Driver)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-blue-400 mb-2">Why is it fast?</h4>
                    <p className="text-xs text-blue-200 leading-relaxed">
                      Instead of checking distance to <b>ALL</b> drivers (O(N)), we only check drivers in the user's specific quadrant (O(log N)).
                    </p>
                  </div>

                  <div className="text-xs text-zinc-500 font-mono">
                    Used by: Uber, Google Maps, PostGIS.
                  </div>
                </div>

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
