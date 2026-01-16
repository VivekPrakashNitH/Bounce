
import React, { useState } from 'react';
import { Cloud, Code, Server, FileCode, Layers, ArrowRight } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

export const HldLldExplainer: React.FC = () => {
  const [view, setView] = useState<'hld' | 'lld'>('hld');

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative px-2 sm:px-2">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-xl font-mono text-white flex items-center gap-2">
                <Layers className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5" /> HLD vs LLD
             </h3>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
             <button 
                onClick={() => setView('hld')}
                className={`px-4 py-1 rounded text-xs font-bold transition-all ${view === 'hld' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
                HLD (High Level)
             </button>
             <button 
                onClick={() => setView('lld')}
                className={`px-4 py-1 rounded text-xs font-bold transition-all ${view === 'lld' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
                LLD (Low Level)
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 h-auto sm:h-80">
          
          {/* Visualizer Side */}
          <div className="col-span-1 bg-black/50 rounded-xl border border-slate-700 relative overflow-hidden p-4 sm:p-8 flex items-center justify-center min-h-[250px] sm:min-h-0">
              <div 
                key={view} 
                className="w-full transition-all duration-500 ease-in-out"
                style={{ animation: 'fadeInZoom 0.5s ease-out' }}
              >
              {view === 'hld' ? (
                  <div className="flex flex-col gap-3 w-full">
                      <div className="flex justify-center">
                          <div className="flex flex-col items-center">
                              <Cloud size={48} className="text-blue-400" />
                              <span className="text-xs text-slate-400 mt-2">Load Balancer</span>
                          </div>
                      </div>
                      <div className="h-6 border-l-2 border-dashed border-slate-600 mx-auto"></div>
                      <div className="flex justify-center gap-6">
                           <div className="p-3 sm:p-4 border-2 border-purple-500 bg-purple-500/10 rounded-lg">
                               <Server size={28} className="text-purple-400 mx-auto" />
                               <div className="text-[10px] text-center mt-2 text-slate-300">API Service</div>
                           </div>
                           <div className="p-3 sm:p-4 border-2 border-green-500 bg-green-500/10 rounded-lg">
                               <Server size={28} className="text-green-400 mx-auto" />
                               <div className="text-[10px] text-center mt-2 text-slate-300">Worker</div>
                           </div>
                      </div>
                      <div className="h-6 border-l-2 border-dashed border-slate-600 mx-auto"></div>
                      <div className="flex justify-center">
                          <div className="flex flex-col items-center">
                              <Layers size={36} className="text-orange-400" />
                              <span className="text-xs text-slate-400 mt-2">Database Cluster</span>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="w-full font-mono text-xs">
                      <div className="bg-[#1e1e1e] p-4 rounded-lg border border-slate-600 shadow-xl">
                          <span className="text-blue-400">class</span> <span className="text-yellow-400">RideService</span> {'{'}
                          <div className="pl-4 text-slate-400">
                              <span className="text-purple-400">private</span> db: Database;
                          </div>
                          <div className="pl-4 mt-2">
                              <span className="text-blue-400">public</span> <span className="text-yellow-200">bookRide</span>(user: User): <span className="text-green-400">Ride</span> {'{'}
                          </div>
                          <div className="pl-8 text-slate-500">
                              // Validate user<br/>
                              // Find Driver (Strategy Pattern)<br/>
                              // Create Transaction
                          </div>
                          <div className="pl-4">{'}'}</div>
                          <div>{'}'}</div>
                      </div>
                  </div>
              )}
              </div>
              <style>{`
                @keyframes fadeInZoom {
                  from {
                    opacity: 0;
                    transform: scale(0.95);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}</style>
          </div>

          {/* Text Content Side */}
          <div className="col-span-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                  {view === 'hld' ? 'High Level Design' : 'Low Level Design'}
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {view === 'hld' 
                    ? "The 'Big Picture'. Focuses on system components, scalability, reliability, and how services talk to each other. It answers 'WHAT' components we need."
                    : "The 'Implementation Details'. Focuses on Class diagrams, Interfaces, Design Patterns (Factory, Singleton), and algorithm efficiency. It answers 'HOW' it works internally."}
              </p>

              <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                      <div className="p-2 bg-white/5 rounded">
                          {view === 'hld' ? <Cloud size={16} className="text-blue-400"/> : <Code size={16} className="text-blue-400"/>}
                      </div>
                      <div>
                          <div className="text-xs font-bold text-slate-200">Focus</div>
                          <div className="text-xs text-slate-500">{view === 'hld' ? 'Scalability & Availability' : 'Maintainability & Clean Code'}</div>
                      </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                      <div className="p-2 bg-white/5 rounded">
                          {view === 'hld' ? <Layers size={16} className="text-orange-400"/> : <FileCode size={16} className="text-orange-400"/>}
                      </div>
                      <div>
                          <div className="text-xs font-bold text-slate-200">Artifacts</div>
                          <div className="text-xs text-slate-500">{view === 'hld' ? 'Architecture Diagrams' : 'UML / Class Diagrams'}</div>
                      </div>
                  </div>
              </div>
          </div>

       </div>
    </div>
  );
};
