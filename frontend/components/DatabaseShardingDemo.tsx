
import React, { useState, useEffect } from 'react';
import { Database, Hash, Code2, MousePointerClick } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const DatabaseShardingDemo: React.FC<Props> = ({ onShowCode }) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [animating, setAnimating] = useState<{val: number, target: number} | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const [shardA, setShardA] = useState<number[]>([]);
  const [shardB, setShardB] = useState<number[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInsert = () => {
     if (!hasInteracted) setHasInteracted(true);
     const num = parseInt(inputVal);
     if (isNaN(num)) return;
     
     // Sharding Logic: Even numbers go to Shard 0, Odd to Shard 1
     const targetShard = num % 2; 

     setAnimating({ val: num, target: targetShard });
     setInputVal('');

     setTimeout(() => {
        if (targetShard === 0) setShardA(prev => [...prev, num]);
        else setShardB(prev => [...prev, num]);
        setAnimating(null);
     }, 1000);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl ${isMobile ? 'p-4' : 'p-8'} border border-slate-700 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} items-center border-b border-slate-700 pb-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-4">
            {/* ADDED BOUNCE AVATAR HERE */}
            <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
            
            <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-mono text-pink-400 flex items-center gap-2`}>
                <Database size={isMobile ? 16 : 24} /> {isMobile ? 'DB Sharding' : 'Level 4: Database Sharding'}
            </h3>
          </div>
          
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Code
            </button>
            {!isMobile && <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Horizontal Data Scaling</span>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
            
            {/* Input Area */}
            <div className="flex gap-2 z-20 relative">
               
               {/* NUDGE */}
               {!hasInteracted && !inputVal && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-50 pointer-events-none">
                        <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full mb-1 whitespace-nowrap font-bold shadow-lg">Type ID & Click</span>
                        <MousePointerClick className="text-blue-500 fill-blue-500" size={20} />
                    </div>
                )}

               <input 
                 type="number" 
                 value={inputVal}
                 onChange={(e) => setInputVal(e.target.value)}
                 placeholder="Enter User ID (e.g. 101)"
                 className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:border-pink-500 outline-none"
               />
               <button 
                 onClick={handleInsert}
                 disabled={!inputVal || !!animating}
                 className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded font-bold transition-colors disabled:opacity-50"
               >
                 Write Data
               </button>
            </div>

            {/* Hashing Function Visualization */}
            <div className="relative my-4 p-4 border-2 border-slate-600 border-dashed rounded-lg bg-slate-800/50 flex flex-col items-center w-64">
                <Hash size={20} className="text-slate-400 mb-1" />
                <span className="text-xs font-mono text-slate-300">Hash(ID) % 2</span>
                
                {animating && (
                   <div className="absolute top-full mt-2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg animate-bounce z-50">
                      {animating.val}
                   </div>
                )}
            </div>

            {/* Shards */}
            <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between'} w-full max-w-lg ${isMobile ? 'mt-4' : 'mt-8'} relative`}>
               
               {/* Animation Paths */}
               {!isMobile && animating && animating.target === 0 && (
                   <div className="absolute top-[-20px] left-1/2 w-1 h-1 bg-transparent">
                      <div className="w-4 h-4 bg-pink-400 rounded-full animate-[flyLeft_1s_ease-in-out_forwards]"></div>
                   </div>
               )}
               {!isMobile && animating && animating.target === 1 && (
                   <div className="absolute top-[-20px] left-1/2 w-1 h-1 bg-transparent">
                      <div className="w-4 h-4 bg-pink-400 rounded-full animate-[flyRight_1s_ease-in-out_forwards]"></div>
                   </div>
               )}

               {/* Shard A */}
               <div className={`flex flex-col items-center gap-2 ${isMobile ? 'w-full' : 'w-40'}`}>
                  <div className={`w-full ${isMobile ? 'h-auto min-h-[120px]' : 'h-48'} border-2 border-slate-600 rounded-xl bg-slate-800 relative overflow-hidden flex flex-col items-center p-2 transition-all ${animating?.target === 0 ? 'border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : ''}`}>
                      <div className="w-full h-4 bg-slate-700 rounded-t-lg mb-2 opacity-50"></div>
                      <div className={`w-full flex-1 ${isMobile ? '' : 'overflow-y-auto'} custom-scrollbar flex flex-col gap-1`}>
                          {shardA.map((id, i) => (
                             <div key={i} className="text-xs font-mono bg-pink-500/20 text-pink-200 px-2 py-1 rounded border border-pink-500/30 text-center animate-in fade-in slide-in-from-top-2">
                                ID: {id}
                             </div>
                          ))}
                      </div>
                  </div>
                  <span className={`font-mono ${isMobile ? 'text-xs' : 'text-sm'} text-slate-400`}>Shard A (Evens)</span>
               </div>

               {/* Shard B */}
               <div className={`flex flex-col items-center gap-2 ${isMobile ? 'w-full' : 'w-40'}`}>
                  <div className={`w-full ${isMobile ? 'h-auto min-h-[120px]' : 'h-48'} border-2 border-slate-600 rounded-xl bg-slate-800 relative overflow-hidden flex flex-col items-center p-2 transition-all ${animating?.target === 1 ? 'border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : ''}`}>
                      <div className="w-full h-4 bg-slate-700 rounded-t-lg mb-2 opacity-50"></div>
                      <div className={`w-full flex-1 ${isMobile ? '' : 'overflow-y-auto'} custom-scrollbar flex flex-col gap-1`}>
                          {shardB.map((id, i) => (
                             <div key={i} className="text-xs font-mono bg-pink-500/20 text-pink-200 px-2 py-1 rounded border border-pink-500/30 text-center animate-in fade-in slide-in-from-top-2">
                                ID: {id}
                             </div>
                          ))}
                      </div>
                  </div>
                   <span className={`font-mono ${isMobile ? 'text-xs' : 'text-sm'} text-slate-400`}>Shard B (Odds)</span>
               </div>

            </div>
        </div>
        
        <style>{`
          @keyframes flyLeft {
            0% { transform: translate(-50%, -200%); opacity: 1; }
            50% { transform: translate(-150px, -100px); }
            100% { transform: translate(-180px, 40px); opacity: 0; }
          }
          @keyframes flyRight {
            0% { transform: translate(-50%, -200%); opacity: 1; }
            50% { transform: translate(150px, -100px); }
            100% { transform: translate(180px, 40px); opacity: 0; }
          }
        `}</style>
    </div>
  );
};
