
import React, { useState } from 'react';
import { MousePointerClick, RefreshCw, Box, Search } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface Point {
  x: number;
  y: number;
}

// Simple quadtree conceptual simulation for visualization
interface QuadNode {
  x: number;
  y: number;
  w: number;
  h: number;
  points: Point[];
  children?: QuadNode[];
}

export const QuadtreeVisualizer: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const capacity = 4; // Max points before split

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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints(prev => [...prev, { x, y }]);
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

  const tree = buildTree(0, 0, 400, 400, points);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0 bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-xl font-mono text-green-400 flex items-center gap-2">
                <Box size={16} /> Level 6: Quadtree Indexing
             </h3>
          </div>
          <div className="flex gap-2">
             <span className="text-[10px] sm:text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Spatial Partitioning</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          
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
                  className="w-full max-w-[400px] h-[300px] sm:h-[400px] bg-black relative overflow-hidden border-2 border-slate-700 cursor-crosshair rounded-lg shadow-inner"
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
          <div className="flex flex-col justify-center space-y-3 sm:space-y-6">
             <div className="bg-slate-800 p-3 sm:p-4 rounded-xl border border-slate-700">
                <h4 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Search size={14} className="text-green-400" /> How it works
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed mb-4">
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

             <div className="bg-blue-900/10 border border-blue-900/30 p-3 sm:p-4 rounded-xl">
                 <h4 className="text-xs sm:text-sm font-bold text-blue-400 mb-2">Why is it fast?</h4>
                 <p className="text-[10px] sm:text-xs text-blue-200 leading-relaxed">
                     Instead of checking distance to <b>ALL</b> drivers (O(N)), we only check drivers in the user's specific quadrant (O(log N)).
                 </p>
             </div>
             
             <div className="text-xs text-zinc-500 font-mono">
                 Used by: Uber, Google Maps, PostGIS.
             </div>
          </div>

       </div>
    </div>
  );
};
