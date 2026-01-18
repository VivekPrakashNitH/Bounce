
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Code2, MousePointerClick } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const UberDemo: React.FC<Props> = ({ onShowCode }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [drivers, setDrivers] = useState<{id: number, top: number, left: number}[]>([
      {id: 1, top: 20, left: 20},
      {id: 2, top: 80, left: 30},
      {id: 3, top: 40, left: 80},
      {id: 4, top: 70, left: 70}
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedDriver, setMatchedDriver] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleRequestRide = () => {
     if (!hasInteracted) setHasInteracted(true);
     setIsSearching(true);
     setMatchedDriver(null);
     
     // Simulate Quadtree search
     setTimeout(() => {
         setIsSearching(false);
         setMatchedDriver(4); // Match the closest visual one
     }, 2000);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative ${isMobile ? 'p-3' : 'p-6'}`}>
       <div className={`flex justify-between items-center border-b border-white/10 ${isMobile ? 'pb-2 mb-4 flex-col gap-2' : 'pb-4 mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`font-bold tracking-tight text-white flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                <Car className="text-white" size={isMobile ? 16 : 24} /> Case Study: Uber
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-[10px] bg-white text-black hover:bg-zinc-200 border border-transparent px-3 py-1 rounded-full transition-colors font-bold uppercase tracking-wide">
                <Code2 size={12} /> Show Code
            </button>
            {!isMobile && <span className="text-[10px] text-zinc-400 border border-white/10 px-2 py-1 rounded-full uppercase tracking-wide">Quadtree Index</span>}
          </div>
        </div>

        <div className={`grid gap-8 ${isMobile ? 'grid-cols-1 h-auto' : 'grid-cols-2 h-80'}`}>
            
            {/* Map Visualization */}
            <div className={`relative bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden group ${isMobile ? 'h-48' : 'col-span-1'}`}>
                {/* Grid Lines (Quadtree visualization) */}
                <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 border-b border-zinc-800/50 flex">
                        <div className="flex-1 border-r border-zinc-800/50"></div>
                        <div className="flex-1"></div>
                    </div>
                    <div className="flex-1 flex">
                        <div className="flex-1 border-r border-zinc-800/50"></div>
                        <div className="flex-1"></div>
                    </div>
                </div>

                {/* User */}
                <div className="absolute top-[60%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                    <div className="w-4 h-4 bg-white rounded-full border-2 border-black shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                    <span className="text-[8px] bg-black text-white px-1 rounded mt-1">You</span>
                    
                    {/* Radar Pulse */}
                    {isSearching && (
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                    )}
                </div>

                {/* Drivers */}
                {drivers.map(d => (
                    <div 
                       key={d.id} 
                       className={`absolute transition-all duration-500 flex flex-col items-center ${matchedDriver === d.id ? 'z-30 scale-125' : 'z-10'}`}
                       style={{ top: `${d.top}%`, left: `${d.left}%` }}
                    >
                        <Car size={16} className={matchedDriver === d.id ? 'text-green-400' : 'text-zinc-600'} />
                        {matchedDriver === d.id && <span className="text-[8px] text-green-400 font-bold bg-black/80 px-1 rounded">MATCHED</span>}
                    </div>
                ))}

            </div>

            {/* Controls */}
            <div className={`flex flex-col justify-center relative ${isMobile ? 'gap-4' : 'col-span-1 gap-6'}`}>
                
                 {/* NUDGE */}
                 {!hasInteracted && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-50 pointer-events-none">
                        <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full mb-1 whitespace-nowrap font-bold shadow-lg">Click Me</span>
                        <MousePointerClick className="text-blue-500 fill-blue-500" size={20} />
                    </div>
                )}

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin className="text-zinc-400" size={20} />
                        <div>
                             <div className="text-xs text-zinc-400">Pickup Location</div>
                             <div className="text-sm font-bold text-white">123 System Design St.</div>
                        </div>
                    </div>
                    <button 
                       onClick={handleRequestRide}
                       disabled={isSearching}
                       className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSearching ? 'Finding Driver...' : 'Request UberX'}
                    </button>
                </div>

                <div className="text-xs text-zinc-500 font-mono space-y-2">
                    <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-zinc-600 rounded-full"></span> 
                        Drivers location updated every 5s
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-zinc-600 rounded-full"></span> 
                        Quadtree efficient search
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};
