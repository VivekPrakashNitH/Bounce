
import React, { useState } from 'react';
import { Laptop, Database, ArrowRight, ArrowLeft, Code2, MousePointerClick } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';
import { ArchitectureInfo } from './ArchitectureInfo'; // Import the new component
import { COURSE_CONTENT } from '../data/courseContent'; // Import data
import { GameState } from '../types';

interface Props {
    onShowCode: () => void;
}

export const ClientServerDemo: React.FC<Props> = ({ onShowCode }) => {
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'processing' | 'receiving' | 'done'>('idle');
  const [data, setData] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Find current level data
  const levelData = COURSE_CONTENT.find(l => l.id === GameState.LEVEL_CLIENT_SERVER);

  const handleRequest = () => {
    if (requestStatus !== 'idle' && requestStatus !== 'done') return;
    
    setHasInteracted(true);
    setRequestStatus('sending');
    setData(null);

    // Simulate Network Latency
    setTimeout(() => {
      setRequestStatus('processing');
      setTimeout(() => {
        setRequestStatus('receiving');
        setTimeout(() => {
          setRequestStatus('done');
          setData("JSON Data: { user: 'Alice', id: 1 }");
        }, 1000);
      }, 800);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full">
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-grid-slate-700/[0.2]" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <div className="flex items-center gap-4 relative">
             <div className="relative">
                <BounceAvatar className="w-12 h-12" />
             </div>
             <h3 className="text-xl font-mono text-cyan-400">Level 1: Client-Server Architecture</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Code
            </button>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">The Basics</span>
          </div>
        </div>

        <div className="flex justify-between items-center h-64 px-10 relative">
          
          {/* CLIENT */}
          <div className="flex flex-col items-center gap-4 z-20 relative">
            
            {/* NUDGE ANIMATION */}
            {!hasInteracted && requestStatus === 'idle' && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-50 pointer-events-none">
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full mb-1 whitespace-nowrap font-bold">Try it!</span>
                    <MousePointerClick className="text-blue-500 fill-blue-500" size={20} />
                </div>
            )}

            <div className={`p-4 rounded-2xl transition-all duration-300 ${requestStatus === 'done' ? 'bg-green-500/20 border-green-500 shadow-green-500/50' : 'bg-slate-800 border-slate-600'}`}>
               <Laptop size={64} className="text-slate-200" />
            </div>
            <button 
              onClick={handleRequest}
              disabled={requestStatus !== 'idle' && requestStatus !== 'done'}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 ${!hasInteracted ? 'ring-4 ring-blue-500/30' : ''}`}
            >
              {requestStatus === 'idle' || requestStatus === 'done' ? 'Send Request' : 'Waiting...'}
            </button>
            <span className="text-xs text-slate-400 font-mono">Client (Browser)</span>
          </div>

          {/* NETWORK ANIMATION */}
          <div className="flex-1 h-full relative mx-8">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2 rounded-full"></div>
            
            {/* Request Packet */}
            {requestStatus === 'sending' && (
              <div className="absolute top-1/2 left-0 -translate-y-1/2 animate-[moveRight_1s_linear_forwards]">
                 <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.6)]">
                    <ArrowRight size={16} className="text-black" />
                 </div>
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-yellow-400 font-mono whitespace-nowrap">GET /user</div>
              </div>
            )}

            {/* Response Packet */}
            {requestStatus === 'receiving' && (
              <div className="absolute top-1/2 right-0 -translate-y-1/2 animate-[moveLeft_1s_linear_forwards]">
                 <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.6)]">
                    <ArrowLeft size={16} className="text-black" />
                 </div>
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-green-400 font-mono whitespace-nowrap">200 OK</div>
              </div>
            )}
          </div>

          {/* SERVER */}
          <div className="flex flex-col items-center gap-4 z-20">
             <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${requestStatus === 'processing' ? 'bg-purple-500/20 border-purple-500 animate-pulse shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'bg-slate-800 border-slate-600'}`}>
               <Database size={64} className="text-slate-200" />
            </div>
            <div className="h-9 flex items-center">
                {requestStatus === 'processing' && <span className="text-xs text-purple-400 animate-bounce">Querying DB...</span>}
            </div>
            <span className="text-xs text-slate-400 font-mono">Backend Server</span>
          </div>

        </div>

        {/* LOGS / CONSOLE */}
        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm h-32 overflow-y-auto border border-slate-800">
           <div className="text-slate-500 mb-2"># Server Logs</div>
           {requestStatus !== 'idle' && (
             <>
               <div className="text-yellow-500">&gt; [OUT] Requesting data from server...</div>
             </>
           )}
           {requestStatus === 'processing' && (
             <div className="text-purple-400">&gt; [SRV] Processing request... Finding user ID:1</div>
           )}
           {(requestStatus === 'receiving' || requestStatus === 'done') && (
             <div className="text-green-400">&gt; [IN] Response received.</div>
           )}
           {data && (
             <div className="text-white mt-2 border-l-2 border-slate-600 pl-2">
               {data}
             </div>
           )}
        </div>
      </div>
      
      <style>{`
        @keyframes moveRight {
          0% { left: 0; }
          100% { left: 100%; }
        }
        @keyframes moveLeft {
          0% { right: 0; }
          100% { right: 100%; }
        }
      `}</style>
    </div>
    
    {/* ARCHITECTURE INFO SECTION */}
    {levelData && <ArchitectureInfo level={levelData} />}

    </div>
  );
};
