
import React, { useState, useEffect } from 'react';
import { Cloud, Code, Server, FileCode, Layers, ArrowRight } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

export const HldLldExplainer: React.FC = () => {
  const [view, setView] = useState<'hld' | 'lld'>('hld');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width < 768 || height < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl ${isMobile ? 'p-4' : 'p-8'} border border-slate-700 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row justify-between'} items-center border-b border-slate-700 ${isMobile ? 'pb-3 mb-4' : 'pb-4 mb-8'}`}>
          <div className="flex items-center gap-3">
             <BounceAvatar className={`${isMobile ? 'w-8 h-8' : 'w-16 h-16'}`} />
             <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-mono text-white flex items-center gap-2`}>
                <Layers className="text-purple-400" size={isMobile ? 18 : 24} /> HLD vs LLD
             </h3>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
             <button 
                onClick={() => setView('hld')}
                className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-4 py-1 text-xs'} rounded font-bold transition-all ${view === 'hld' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
                HLD (High Level)
             </button>
             <button 
                onClick={() => setView('lld')}
                className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-4 py-1 text-xs'} rounded font-bold transition-all ${view === 'lld' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
                LLD (Low Level)
             </button>
          </div>
       </div>

       <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'} ${isMobile ? 'auto-rows-auto' : 'h-80'}`}>
          
          {/* Visualizer Side */}
          <div className={`bg-black/50 rounded-xl border border-slate-700 relative overflow-hidden ${isMobile ? 'p-4' : 'p-6'} flex items-center justify-center ${isMobile ? 'min-h-[200px]' : ''}`}>
              {view === 'hld' ? (
                  <div className="flex flex-col gap-3 animate-in fade-in zoom-in duration-500 w-full">
                      <div className="flex justify-center gap-6">
                          <div className="flex flex-col items-center">
                              <Cloud size={isMobile ? 36 : 48} className="text-blue-400" />
                              <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400 mt-1`}>Load Balancer</span>
                          </div>
                      </div>
                      <div className={`${isMobile ? 'h-4' : 'h-8'} border-l-2 border-dashed border-slate-600 mx-auto`}></div>
                      <div className={`flex justify-center ${isMobile ? 'gap-4' : 'gap-8'}`}>
                           <div className={`${isMobile ? 'p-2' : 'p-4'} border border-purple-500 bg-purple-500/10 rounded-lg`}>
                               <Server size={isMobile ? 24 : 32} className="text-purple-400" />
                               <div className="text-[10px] text-center mt-1">API Service</div>
                           </div>
                           <div className={`${isMobile ? 'p-2' : 'p-4'} border border-green-500 bg-green-500/10 rounded-lg`}>
                               <Server size={isMobile ? 24 : 32} className="text-green-400" />
                               <div className="text-[10px] text-center mt-1">Worker</div>
                           </div>
                      </div>
                      <div className={`${isMobile ? 'h-4' : 'h-8'} border-l-2 border-dashed border-slate-600 mx-auto`}></div>
                      <div className="flex justify-center">
                          <div className="flex flex-col items-center">
                              <Layers size={isMobile ? 32 : 40} className="text-orange-400" />
                              <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400 mt-1`}>Database Cluster</span>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className={`w-full font-mono ${isMobile ? 'text-[10px]' : 'text-xs'} animate-in fade-in zoom-in duration-500`}>
                      <div className={`bg-[#1e1e1e] ${isMobile ? 'p-2' : 'p-4'} rounded-lg border border-slate-600 shadow-xl`}>
                          <span className="text-blue-400">class</span> <span className="text-yellow-400">RideService</span> {'{'}
                          <div className="pl-2 text-slate-400">
                              <span className="text-purple-400">private</span> db: Database;
                          </div>
                          <div className={`${isMobile ? 'pl-2' : 'pl-4'} mt-1`}>
                              <span className="text-blue-400">public</span> <span className="text-yellow-200">bookRide</span>(user): <span className="text-green-400">Ride</span> {'{'}
                          </div>
                          <div className={`${isMobile ? 'pl-4' : 'pl-8'} text-slate-500 ${isMobile ? 'text-[8px]' : ''}`}>
                              // Validate user<br/>
                              // Find Driver<br/>
                              // Create Transaction
                          </div>
                          <div className={`${isMobile ? 'pl-2' : 'pl-4'}`}>{'}'}</div>
                          <div>{'}'}</div>
                      </div>
                  </div>
              )}
          </div>

          {/* Text Content Side */}
          <div className="flex flex-col justify-center">
              <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-white mb-2`}>
                  {view === 'hld' ? 'High Level Design' : 'Low Level Design'}
              </h2>
              <p className={`text-slate-400 ${isMobile ? 'text-xs mb-3' : 'text-sm mb-6'} leading-relaxed`}>
                  {view === 'hld' 
                    ? "The 'Big Picture'. Focuses on system components, scalability, reliability, and how services talk to each other. It answers 'WHAT' components we need."
                    : "The 'Implementation Details'. Focuses on Class diagrams, Interfaces, Design Patterns (Factory, Singleton), and algorithm efficiency. It answers 'HOW' it works internally."}
              </p>

              <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                  <div className={`flex items-center gap-2 bg-slate-800 ${isMobile ? 'p-2' : 'p-3'} rounded-lg border border-slate-700`}>
                      <div className={`${isMobile ? 'p-1' : 'p-2'} bg-white/5 rounded`}>
                          {view === 'hld' ? <Cloud size={isMobile ? 12 : 16} className="text-blue-400"/> : <Code size={isMobile ? 12 : 16} className="text-blue-400"/>}
                      </div>
                      <div>
                          <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-slate-200`}>Focus</div>
                          <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-500`}>{view === 'hld' ? 'Scalability & Availability' : 'Maintainability & Clean Code'}</div>
                      </div>
                  </div>

                  <div className={`flex items-center gap-2 bg-slate-800 ${isMobile ? 'p-2' : 'p-3'} rounded-lg border border-slate-700`}>
                      <div className={`${isMobile ? 'p-1' : 'p-2'} bg-white/5 rounded`}>
                          {view === 'hld' ? <Layers size={isMobile ? 12 : 16} className="text-orange-400"/> : <FileCode size={isMobile ? 12 : 16} className="text-orange-400"/>}
                      </div>
                      <div>
                          <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-slate-200`}>Artifacts</div>
                          <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-500`}>{view === 'hld' ? 'Architecture Diagrams' : 'UML / Class Diagrams'}</div>
                      </div>
                  </div>
              </div>
          </div>

       </div>
    </div>
  );
};
