
import React, { useState } from 'react';
import { Laptop, Database, ArrowRight, ArrowLeft, Code2, MousePointerClick } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';
import { ArchitectureInfo } from '../ui/ArchitectureInfo'; // Import the new component
import { COURSE_CONTENT } from '../../data/courseContent'; // Import data
import { GameState } from '../../types';

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
    <div className="flex flex-col items-center w-full px-2 sm:px-0">
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-grid-slate-700/[0.2]" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-700 pb-4 gap-2">
          <div className="flex items-center gap-2 sm:gap-4 relative">
             <div className="relative">
                <BounceAvatar className="w-8 h-8 sm:w-12 sm:h-12" />
             </div>
             <h3 className="text-sm sm:text-xl font-mono text-cyan-400">Level 1: Client-Server</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-[10px] sm:text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 sm:px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={12} /> Code
            </button>
            <span className="text-[10px] sm:text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded hidden sm:inline">The Basics</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-64 px-2 sm:px-10 relative gap-4 sm:gap-0">
          
          {/* CLIENT */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 z-20 relative">
            
            {/* NUDGE ANIMATION */}
            {!hasInteracted && requestStatus === 'idle' && (
                <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-50 pointer-events-none">
                    <span className="text-[8px] sm:text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full mb-1 whitespace-nowrap font-bold">Try it!</span>
                    <MousePointerClick className="text-blue-500 fill-blue-500" size={16} />
                </div>
            )}

            <div className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${requestStatus === 'done' ? 'bg-green-500/20 border-green-500 shadow-green-500/50' : 'bg-slate-800 border-slate-600'}`}>
               <Laptop size={40} className="sm:w-16 sm:h-16 text-slate-200" />
            </div>
            <button 
              onClick={handleRequest}
              disabled={requestStatus !== 'idle' && requestStatus !== 'done'}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 ${!hasInteracted ? 'ring-4 ring-blue-500/30' : ''}`}
            >
              {requestStatus === 'idle' || requestStatus === 'done' ? 'Send Request' : 'Waiting...'}
            </button>
            <span className="text-[10px] sm:text-xs text-slate-400 font-mono">Client</span>
          </div>

          {/* NETWORK ANIMATION */}
          <div className="flex-1 h-16 sm:h-full relative mx-2 sm:mx-8 w-full sm:w-auto">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2 rounded-full"></div>
            
            {/* Request Packet */}
            {requestStatus === 'sending' && (
              <div className="absolute top-1/2 left-0 -translate-y-1/2 animate-[moveRight_1s_linear_forwards]">
                 <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.6)]">
                    <ArrowRight size={12} className="text-black" />
                 </div>
              </div>
            )}

            {/* Response Packet */}
            {requestStatus === 'receiving' && (
              <div className="absolute top-1/2 right-0 -translate-y-1/2 animate-[moveLeft_1s_linear_forwards]">
                 <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.6)]">
                    <ArrowLeft size={12} className="text-black" />
                 </div>
              </div>
            )}
          </div>

          {/* SERVER */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 z-20">
             <div className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${requestStatus === 'processing' ? 'bg-purple-500/20 border-purple-500 animate-pulse shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'bg-slate-800 border-slate-600'}`}>
               <Database size={40} className="sm:w-16 sm:h-16 text-slate-200" />
            </div>
            <div className="h-6 sm:h-9 flex items-center">
                {requestStatus === 'processing' && <span className="text-[10px] sm:text-xs text-purple-400 animate-bounce">Querying DB...</span>}
            </div>
            <span className="text-[10px] sm:text-xs text-slate-400 font-mono">Server</span>
          </div>

        </div>

        {/* LOGS / CONSOLE */}
        <div className="bg-black/50 rounded-lg p-2 sm:p-4 font-mono text-[10px] sm:text-sm h-24 sm:h-32 overflow-y-auto border border-slate-800">
           <div className="text-slate-500 mb-2"># Server Logs</div>
           {requestStatus !== 'idle' && (
             <>
               <div className="text-yellow-500">&gt; [OUT] Requesting data...</div>
             </>
           )}
           {requestStatus === 'processing' && (
             <div className="text-purple-400">&gt; [SRV] Processing...</div>
           )}
           {(requestStatus === 'receiving' || requestStatus === 'done') && (
             <div className="text-green-400">&gt; [IN] Response received.</div>
           )}
           {data && (
             <div className="text-white mt-2 border-l-2 border-slate-600 pl-2 text-[9px] sm:text-sm">
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
