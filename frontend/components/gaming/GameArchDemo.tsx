
import React, { useState, useEffect } from 'react';
import { Gamepad2, Server, User, Code2, Zap } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const GameArchDemo: React.FC<Props> = ({ onShowCode }) => {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [requests, setRequests] = useState<{id: number, x: number, processed: boolean}[]>([]);
  const [processingTime, setProcessingTime] = useState(0);

  useEffect(() => {
     // Spawn requests
     const spawnInterval = setInterval(() => {
         if (requests.length < 15) {
             setRequests(prev => [...prev, { id: Date.now(), x: 0, processed: false }]);
         }
     }, mode === 'single' ? 800 : 300); // Faster spawn in multi mode

     // Move requests
     const moveInterval = setInterval(() => {
         setRequests(prev => prev.map(r => {
             if (r.processed) return { ...r, x: r.x + 5 }; // Move out fast
             
             // Single Thread Block Logic
             if (mode === 'single') {
                 // Stop at x=50 if processing
                 if (r.x >= 50 && r.x < 55) {
                     // Only process one at a time logic handled by UI effect below
                     return r; 
                 }
             }
             return { ...r, x: r.x + 1 };
         }).filter(r => r.x < 100));
     }, 30);

     return () => {
         clearInterval(spawnInterval);
         clearInterval(moveInterval);
     };
  }, [mode, requests.length]);

  // Processing Logic
  useEffect(() => {
      const interval = setInterval(() => {
          setRequests(prev => {
              const waiting = prev.filter(r => r.x >= 50 && !r.processed);
              if (waiting.length === 0) return prev;

              // Single Thread: Process 1 by 1
              if (mode === 'single') {
                   const target = waiting[0]; // First one
                   // Random chance to finish processing
                   if (Math.random() > 0.8) {
                       return prev.map(r => r.id === target.id ? { ...r, processed: true } : r);
                   }
              } 
              // Multi Thread: Process all concurrently
              else {
                  return prev.map(r => {
                      if (r.x >= 50 && !r.processed && Math.random() > 0.2) {
                          return { ...r, processed: true };
                      }
                      return r;
                  });
              }
              return prev;
          });
      }, 100);
      return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative px-2 sm:px-0">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-xl font-mono text-purple-400 flex items-center gap-2">
                <Gamepad2 /> Game Concurrency
             </h3>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
             <button 
                onClick={() => { setMode('single'); setRequests([]); }}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${mode === 'single' ? 'bg-red-500 text-white' : 'text-slate-400'}`}
             >
                Single Thread (Node.js)
             </button>
             <button 
                onClick={() => { setMode('multi'); setRequests([]); }}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${mode === 'multi' ? 'bg-green-500 text-white' : 'text-slate-400'}`}
             >
                Multi-Thread/Goroutines
             </button>
          </div>
       </div>

       <div className="relative h-48 sm:h-64 border border-slate-700 bg-black/40 rounded-xl overflow-hidden mb-4">
           {/* Server Core */}
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-slate-800 border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center z-10">
               <Server className={mode === 'single' ? 'text-red-400' : 'text-green-400'} />
               <span className="text-[10px] text-slate-300 mt-1">{mode === 'single' ? '1 Core' : 'N Cores'}</span>
           </div>

           {/* Requests */}
           {requests.map(r => (
               <div 
                 key={r.id}
                 className={`absolute top-1/2 w-4 h-4 rounded-full shadow-[0_0_10px_currentColor] transition-colors ${r.processed ? 'bg-green-400 text-green-400' : 'bg-blue-500 text-blue-500'}`}
                 style={{ left: `${r.x}%`, transform: 'translate(-50%, -50%)' }}
               >
                   <User size={10} className="text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </div>
           ))}

           {/* Labels */}
           <div className="absolute left-4 top-4 text-xs text-slate-500">Clients (Players)</div>
           <div className="absolute right-4 top-4 text-xs text-slate-500">Processed</div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
           <div className="p-3 sm:p-4 bg-slate-800 rounded-lg border border-slate-700">
               <h4 className="text-xs sm:text-sm font-bold text-white mb-2">Single Threaded (Node.js)</h4>
               <p className="text-xs text-slate-400">
                   Great for I/O, but if one calculation takes time (blocking), everyone waits. 
                   <br/><span className="text-red-400">Lag in games if logic is heavy.</span>
               </p>
           </div>
           <div className="p-3 sm:p-4 bg-slate-800 rounded-lg border border-slate-700">
               <h4 className="text-xs sm:text-sm font-bold text-white mb-2">Concurrent (Go/C++/Rust)</h4>
               <p className="text-xs text-slate-400">
                   Spawns lightweight threads (Goroutines) for every player. 
                   <br/><span className="text-green-400">Ideal for high-concurrency real-time games (PUBG).</span>
               </p>
           </div>
       </div>
    </div>
  );
};
