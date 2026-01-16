import React, { useState, useEffect } from 'react';
import { GitCommit, Package, CheckCircle, Server, AlertCircle } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

export const DevOpsDemo = () => {
  const [pipelineState, setPipelineState] = useState<'idle' | 'building' | 'testing' | 'deploying' | 'deployed' | 'failed'>('idle');

  const startPipeline = () => {
    if (pipelineState !== 'idle' && pipelineState !== 'deployed' && pipelineState !== 'failed') return;
    
    setPipelineState('building');
    
    setTimeout(() => {
        setPipelineState('testing');
        setTimeout(() => {
            // 80% chance of success for fun
            const success = Math.random() > 0.2;
            if (success) {
                setPipelineState('deploying');
                setTimeout(() => {
                    setPipelineState('deployed');
                }, 1500);
            } else {
                setPipelineState('failed');
            }
        }, 1500);
    }, 1500);
  };

  const Step = ({ state, current, label, icon: Icon }: any) => {
     let color = "text-slate-500 bg-slate-800 border-slate-700";
     let animate = "";

     if (state === current) {
         color = "text-yellow-400 bg-yellow-400/10 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]";
         animate = "animate-pulse";
     } else if (
         (current === 'testing' && state === 'building') || 
         (current === 'deploying' && (state === 'building' || state === 'testing')) ||
         (current === 'deployed') ||
         (current === 'failed' && state !== 'deploying') // Don't highlight deploying if failed at testing
     ) {
         color = "text-green-400 bg-green-400/10 border-green-400";
         // Handle failure case visually
         if (current === 'failed' && state === 'testing') color = "text-red-400 bg-red-400/10 border-red-400";
     }

     return (
        <div className={`flex flex-col items-center gap-2 z-10 transition-all duration-300 ${animate}`}>
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${color}`}>
                <Icon size={24} />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider">{label}</span>
        </div>
     );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-12">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-cyan-400 flex items-center gap-2">
                <Server /> Level 5: CI/CD Pipeline
             </h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">DevOps Automation</span>
        </div>

        <div className="relative flex justify-between items-center px-12 h-40">
             {/* Connecting Line */}
             <div className="absolute top-1/2 left-20 right-20 h-1 bg-slate-700 -translate-y-1/2 z-0">
                 <div 
                    className={`h-full bg-cyan-500 transition-all duration-[1500ms] ease-linear`}
                    style={{
                        width: pipelineState === 'idle' ? '0%' : 
                               pipelineState === 'building' ? '25%' :
                               pipelineState === 'testing' ? '50%' :
                               pipelineState === 'deploying' ? '75%' : 
                               pipelineState === 'deployed' ? '100%' : '50%' // stop at 50 if failed
                    }} 
                 />
             </div>

             <Step state="building" current={pipelineState} label="Build" icon={Package} />
             <Step state="testing" current={pipelineState} label="Test" icon={CheckCircle} />
             <Step state="deploying" current={pipelineState} label="Deploy" icon={Server} />
        </div>

        <div className="flex flex-col items-center mt-8">
            <button 
                onClick={startPipeline}
                disabled={pipelineState === 'building' || pipelineState === 'testing' || pipelineState === 'deploying'}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95"
            >
                {pipelineState === 'idle' ? <><GitCommit /> Push Code</> : 'Running Pipeline...'}
            </button>
            
            <div className="h-8 mt-4">
                {pipelineState === 'deployed' && <span className="text-green-400 font-bold animate-bounce">🚀 Successfully Deployed to Production!</span>}
                {pipelineState === 'failed' && <span className="text-red-400 font-bold flex items-center gap-2"><AlertCircle size={16}/> Tests Failed! Rollback initiated.</span>}
            </div>
        </div>
    </div>
  );
};