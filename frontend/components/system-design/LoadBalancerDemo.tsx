
import React, { useState, useEffect } from 'react';
import { Activity, Globe, Server, Code2, MousePointerClick } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const LoadBalancerDemo: React.FC<Props> = ({ onShowCode }) => {
  const [activeServer, setActiveServer] = useState<number | null>(null);
  const [requests, setRequests] = useState<{id: number, target: number, x: number}[]>([]);
  const [reqCount, setReqCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const servers = [1, 2, 3];

  const sendRequest = () => {
    if (!hasInteracted) setHasInteracted(true);
    const target = (reqCount % 3) + 1; // Round robin logic
    const newReq = { id: Date.now(), target, x: 0 };
    setRequests(prev => [...prev, newReq]);
    setReqCount(prev => prev + 1);
  };

  useEffect(() => {
    if (requests.length === 0) return;

    const interval = setInterval(() => {
      setRequests(prev => prev.map(r => {
        // Move request horizontally
        if (r.x < 100) return { ...r, x: r.x + 2 }; 
        return r;
      }).filter(r => {
        if (r.x >= 100) {
          setActiveServer(r.target);
          setTimeout(() => setActiveServer(null), 200);
          return false;
        }
        return true;
      }));
    }, 16); 

    return () => clearInterval(interval);
  }, [requests]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Activity size={16} /> Load Balancer
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-[8px] sm:text-[10px] bg-white text-black hover:bg-zinc-200 border border-transparent px-2 sm:px-3 py-1 rounded-full transition-colors font-bold uppercase tracking-wide">
                <Code2 size={10} /> Code
            </button>
            <span className="text-[8px] sm:text-[10px] text-zinc-400 border border-white/10 px-2 py-1 rounded-full uppercase tracking-wide hidden sm:inline">Round Robin</span>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="flex justify-between items-center h-36 sm:h-48 px-2 sm:px-4 relative select-none">
          
          {/* Client / User */}
          <div className="flex flex-col items-center gap-2 z-20 relative">
            
            {/* NUDGE */}
            {!hasInteracted && (
                <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-50 pointer-events-none">
                    <span className="text-[8px] sm:text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full mb-1 whitespace-nowrap font-bold shadow-lg">Click Me</span>
                    <MousePointerClick className="text-blue-500 fill-blue-500" size={16} />
                </div>
            )}

            <button 
              onClick={sendRequest}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95 z-20"
            >
              <Globe size={18} className="sm:w-6 sm:h-6" />
            </button>
            <span className="text-[8px] sm:text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Client</span>
          </div>

          {/* Visualization Paths */}
          <div className="absolute left-16 sm:left-24 right-20 sm:right-28 h-full top-0 pointer-events-none">
             {/* Static SVG Lines */}
             <svg className="absolute inset-0 w-full h-full stroke-zinc-700" style={{ overflow: 'visible' }}>
                <path d="M 0 50 C 50 50, 50 20, 100% 20" fill="none" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 0 50 L 100% 50" fill="none" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 0 50 C 50 50, 50 80, 100% 80" fill="none" strokeWidth="1" strokeDasharray="4 4" />
             </svg>

             {/* Moving Packets (White dots) */}
             {requests.map(req => {
               let yOffset = 50;
               if (req.target === 1) yOffset = 20;
               if (req.target === 3) yOffset = 80;
               
               return (
                 <div 
                    key={req.id}
                    className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] z-30"
                    style={{ 
                      left: `${req.x}%`, 
                      top: `${yOffset}%`,
                      transform: 'translate(-50%, -50%)',
                      transition: 'top 0.3s ease-in-out' 
                    }}
                 />
               );
             })}
          </div>

          {/* Servers */}
          <div className="flex flex-col gap-2 sm:gap-6 z-20">
            {servers.map(id => (
              <div 
                key={id}
                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border transition-all duration-100 ${
                  activeServer === id 
                    ? 'bg-white text-black border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                <Server size={14} className="sm:w-[18px] sm:h-[18px]" />
                <div className="flex flex-col">
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">S0{id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center border-t border-white/5 pt-3 sm:pt-4">
          <p className="text-[10px] sm:text-xs text-zinc-500 font-mono">
            REQUESTS: <span className="text-white font-bold ml-1 sm:ml-2">{reqCount}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
