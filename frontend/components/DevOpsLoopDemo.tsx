
import React from 'react';
import { Settings, Code2, Play, CheckCircle, UploadCloud, Activity, Eye, Server } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const DevOpsLoopDemo: React.FC<Props> = ({ onShowCode }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8 relative z-10">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-cyan-400 flex items-center gap-2">
                <Activity /> The DevOps Infinity Loop
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Workflow
            </button>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">CI/CD Automation</span>
          </div>
       </div>

       <div className="relative h-[300px] flex items-center justify-center">
           
           {/* The Infinity Path SVG */}
           <svg width="600" height="200" viewBox="0 0 600 200" className="opacity-30">
               {/* 
                   A simple infinity shape approximation:
                   M 300 100 
                   C 400 0, 500 0, 550 50 
                   C 600 100, 550 150, 500 200 
                   C 400 200, 300 100, 300 100
                   C 200 0, 100 0, 50 50
                   C 0 100, 50 150, 100 200
                   C 200 200, 300 100, 300 100
               */}
               <path 
                 d="M 300 100 C 400 10, 500 10, 550 50 C 600 100, 550 150, 500 190 C 400 190, 300 100, 300 100 C 200 10, 100 10, 50 50 C 0 100, 50 150, 100 190 C 200 190, 300 100, 300 100" 
                 fill="none" 
                 stroke="#22d3ee" 
                 strokeWidth="4"
                 strokeLinecap="round"
                 id="infinityPath"
               />
           </svg>

           {/* Labels along the path */}
           {/* Left Loop (Dev) */}
           <div className="absolute left-[15%] top-[10%] text-xs font-bold text-blue-400 flex flex-col items-center"><Settings size={16}/> PLAN</div>
           <div className="absolute left-[5%] top-[50%] text-xs font-bold text-blue-400 flex flex-col items-center"><Code2 size={16}/> CODE</div>
           <div className="absolute left-[15%] bottom-[10%] text-xs font-bold text-blue-400 flex flex-col items-center"><Play size={16}/> BUILD</div>
           <div className="absolute left-[35%] bottom-[15%] text-xs font-bold text-blue-400 flex flex-col items-center"><CheckCircle size={16}/> TEST</div>

           {/* Right Loop (Ops) */}
           <div className="absolute right-[35%] top-[15%] text-xs font-bold text-green-400 flex flex-col items-center"><UploadCloud size={16}/> RELEASE</div>
           <div className="absolute right-[15%] top-[10%] text-xs font-bold text-green-400 flex flex-col items-center"><Server size={16}/> DEPLOY</div>
           <div className="absolute right-[5%] top-[50%] text-xs font-bold text-green-400 flex flex-col items-center"><Settings size={16}/> OPERATE</div>
           <div className="absolute right-[15%] bottom-[10%] text-xs font-bold text-green-400 flex flex-col items-center"><Eye size={16}/> MONITOR</div>

           {/* The Moving Runner */}
           <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
               <div 
                  className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] z-20"
                  style={{
                      offsetPath: "path('M 300 100 C 400 10, 500 10, 550 50 C 600 100, 550 150, 500 190 C 400 190, 300 100, 300 100 C 200 10, 100 10, 50 50 C 0 100, 50 150, 100 190 C 200 190, 300 100, 300 100')",
                      animation: "moveInfinity 4s linear infinite"
                  }}
               >
               </div>
           </div>

       </div>

       <div className="text-center mt-6 text-sm text-slate-400 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          DevOps unifies Development (Left Loop) and Operations (Right Loop) into a continuous cycle.
          <br/>
          <span className="text-xs text-slate-500 font-mono">
            Plan &rarr; Code &rarr; Build &rarr; Test &rarr; Release &rarr; Deploy &rarr; Operate &rarr; Monitor
          </span>
       </div>
       
       <style>{`
          @keyframes moveInfinity {
             0% { offset-distance: 0%; }
             100% { offset-distance: 100%; }
          }
       `}</style>
    </div>
  );
};
