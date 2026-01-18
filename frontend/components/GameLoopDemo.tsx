
import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, Monitor, Keyboard, Code } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const GameLoopDemo: React.FC<Props> = ({ onShowCode }) => {
  const [activeStage, setActiveStage] = useState<'input' | 'update' | 'render'>('input');
  const [frame, setFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
      const interval = setInterval(() => {
          setActiveStage(prev => {
              if (prev === 'input') return 'update';
              if (prev === 'update') return 'render';
              return 'input';
          });
          setFrame(f => f + 1);
      }, 500); // Slowed down for visualization
      return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl ${isMobile ? 'p-4' : 'p-8'} border border-slate-700 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'} border-b border-slate-700 pb-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-mono text-pink-400 flex items-center gap-2`}>
                <RotateCw size={isMobile ? 18 : 24} /> The Game Loop
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className={`flex items-center gap-1 ${isMobile ? 'text-[10px]' : 'text-xs'} bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors`}>
                <Code size={isMobile ? 12 : 14} /> Show C++
            </button>
          </div>
       </div>

       <div className={`flex items-center justify-between ${isMobile ? 'px-2 gap-2' : 'px-12'} ${isMobile ? 'h-auto py-4' : 'h-64'} relative`}>
           
           {/* Loop Circle Visualization */}
           {!isMobile && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                   <div className="w-64 h-64 border-4 border-slate-600 rounded-full border-t-pink-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
               </div>
           )}

           {/* Stage: INPUT */}
           <div className={`flex flex-col items-center gap-2 ${isMobile ? 'p-2' : 'p-4'} rounded-xl border-2 transition-all ${activeStage === 'input' ? 'bg-pink-500/20 border-pink-500 scale-110' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
               <Keyboard size={isMobile ? 20 : 32} className="text-pink-400" />
               <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-white`}>1. Input</span>
               {!isMobile && <div className="text-[10px] text-slate-400 font-mono">Check Keys</div>}
           </div>

           {/* Arrow */}
           <div className={`text-slate-600 font-bold ${isMobile ? 'text-sm' : 'text-xl'}`}>&rarr;</div>

           {/* Stage: UPDATE */}
           <div className={`flex flex-col items-center gap-2 ${isMobile ? 'p-2' : 'p-4'} rounded-xl border-2 transition-all ${activeStage === 'update' ? 'bg-blue-500/20 border-blue-500 scale-110' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
               <Code size={isMobile ? 20 : 32} className="text-blue-400" />
               <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-white`}>2. Update</span>
               {!isMobile && <div className="text-[10px] text-slate-400 font-mono">x += speed * dt</div>}
           </div>

           {/* Arrow */}
           <div className={`text-slate-600 font-bold ${isMobile ? 'text-sm' : 'text-xl'}`}>&rarr;</div>

           {/* Stage: RENDER */}
           <div className={`flex flex-col items-center gap-2 ${isMobile ? 'p-2' : 'p-4'} rounded-xl border-2 transition-all ${activeStage === 'render' ? 'bg-green-500/20 border-green-500 scale-110' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
               <Monitor size={isMobile ? 20 : 32} className="text-green-400" />
               <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-white`}>3. Render</span>
               {!isMobile && <div className="text-[10px] text-slate-400 font-mono">Draw Pixels</div>}
           </div>
       </div>

       <div className={`text-center mt-4 font-mono ${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-500`}>
           Frames Rendered: <span className="text-white">{frame}</span>
       </div>
    </div>
  );
};
