
import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, Monitor, Keyboard, Code } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const GameLoopDemo: React.FC<Props> = ({ onShowCode }) => {
  const [activeStage, setActiveStage] = useState<'input' | 'update' | 'render'>('input');
  const [frame, setFrame] = useState(0);

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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
    <div className="bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-xl font-mono text-pink-400 flex items-center gap-2">
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" /> The Game Loop
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code size={14} /> Show C++
            </button>
          </div>
       </div>

       <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-12 gap-4 sm:gap-0 h-auto sm:h-64 relative">
           
           {/* Loop Circle Visualization */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 hidden sm:flex">
               <div className="w-64 h-64 border-4 border-slate-600 rounded-full border-t-pink-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
           </div>

           {/* Stage: INPUT */}
           <div className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all ${activeStage === 'input' ? 'bg-pink-500/20 border-pink-500 scale-110' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
               <Keyboard size={24} className="sm:w-8 sm:h-8 text-pink-400" />
               <span className="text-xs font-bold text-white">1. Input</span>
               <div className="text-[10px] text-slate-400 font-mono">Check Keys</div>
           </div>

           {/* Arrow */}
           <div className="text-slate-600 font-bold text-xl">&rarr;</div>

           {/* Stage: UPDATE */}
           <div className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all ${activeStage === 'update' ? 'bg-blue-500/20 border-blue-500 scale-110' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
               <Code size={24} className="sm:w-8 sm:h-8 text-blue-400" />
               <span className="text-xs font-bold text-white">2. Update</span>
               <div className="text-[10px] text-slate-400 font-mono">x += speed * dt</div>
           </div>

           {/* Arrow */}
           <div className="text-slate-600 font-bold text-xl">&rarr;</div>

           {/* Stage: RENDER */}
           <div className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all ${activeStage === 'render' ? 'bg-green-500/20 border-green-500 scale-110' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
               <Monitor size={24} className="sm:w-8 sm:h-8 text-green-400" />
               <span className="text-xs font-bold text-white">3. Render</span>
               <div className="text-[10px] text-slate-400 font-mono">Draw Pixels</div>
           </div>
       </div>

       <div className="text-center mt-4 font-mono text-xs text-slate-500">
           Frames Rendered: <span className="text-white">{frame}</span>
       </div>
    </div>
    </div>
  );
};
