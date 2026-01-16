
import React, { useState, useEffect } from 'react';
import { Gamepad2, Play, Code2, Layers, Cpu, Power } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const GameIntroDemo: React.FC<Props> = ({ onShowCode }) => {
  const [stage, setStage] = useState<'off' | 'init' | 'loop' | 'cleanup'>('off');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev.slice(-4), msg]);

  const startGame = () => {
    if (stage !== 'off') return;
    setStage('init');
    setLog([]);
    addLog("> Booting Engine...");
    
    setTimeout(() => {
        addLog("> Loading Texture: map.png");
        addLog("> Loading Model: hero.obj");
        addLog("> Initializing Physics World...");
        
        setTimeout(() => {
            setStage('loop');
            addLog("> ENTERING GAME LOOP");
        }, 1500);
    }, 1000);
  };

  const stopGame = () => {
      setStage('cleanup');
      addLog("> Shutting down...");
      setTimeout(() => {
          addLog("> Memory Freed.");
          setStage('off');
      }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-red-400 flex items-center gap-2">
                <Gamepad2 /> Let's Build a Game Engine
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show C++
            </button>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Engine Arch</span>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-8 h-64">
           {/* Visualizer */}
           <div className="col-span-1 bg-black/50 border border-slate-700 rounded-xl p-6 relative flex flex-col items-center justify-center">
               
               {stage === 'off' && (
                   <button onClick={startGame} className="flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-colors group">
                       <Power size={48} className="group-hover:scale-110 transition-transform" />
                       <span className="text-sm font-bold">START ENGINE</span>
                   </button>
               )}

               {stage === 'init' && (
                   <div className="flex flex-col items-center gap-4 animate-pulse">
                       <Layers size={48} className="text-blue-400" />
                       <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 animate-[load_1.5s_ease-in-out_infinite]"></div>
                       </div>
                       <span className="text-xs font-mono text-blue-300">LOADING ASSETS...</span>
                   </div>
               )}

               {stage === 'loop' && (
                   <div className="flex flex-col items-center gap-4">
                       <div className="relative">
                           <div className="absolute inset-0 border-4 border-red-500/30 rounded-full animate-ping"></div>
                           <RotateIcon className="w-12 h-12 text-red-500 animate-spin" />
                       </div>
                       <div className="text-center">
                           <span className="text-xs font-mono text-red-400 block font-bold">GAME LOOP RUNNING</span>
                           <span className="text-[10px] text-slate-500">60 FPS</span>
                       </div>
                       <button onClick={stopGame} className="mt-2 px-3 py-1 bg-red-900/50 border border-red-500/50 rounded text-[10px] text-red-300 hover:bg-red-900">
                           STOP
                       </button>
                   </div>
               )}

               {stage === 'cleanup' && (
                   <div className="flex flex-col items-center gap-2 text-slate-400">
                       <Cpu size={48} className="animate-pulse" />
                       <span className="text-xs font-mono">CLEANING MEMORY...</span>
                   </div>
               )}

           </div>

           {/* Code/Concept Panel */}
           <div className="col-span-1 flex flex-col gap-4">
               <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                   <h4 className="text-sm font-bold text-white mb-2">How Games Work</h4>
                   <p className="text-xs text-slate-400 leading-relaxed mb-2">
                       Unlike web apps that wait for requests, games run in an <b>Infinite Loop</b>.
                   </p>
                   <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 bg-black/30 p-2 rounded">
                       1. Init() <span className="text-slate-600">&rarr;</span> 2. Loop() <span className="text-slate-600">&rarr;</span> 3. Cleanup()
                   </div>
               </div>

               <div className="flex-1 bg-black p-3 rounded-lg border border-slate-800 font-mono text-xs text-green-400 overflow-hidden relative">
                   <div className="absolute top-0 right-0 bg-slate-900 px-2 py-1 text-[8px] text-slate-500">CONSOLE</div>
                   {log.map((l, i) => (
                       <div key={i} className="mb-1 opacity-80">{l}</div>
                   ))}
               </div>
           </div>
       </div>
       
       <style>{`
          @keyframes load { 0% { width: 0% } 100% { width: 100% } }
       `}</style>
    </div>
  );
};

const RotateIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
