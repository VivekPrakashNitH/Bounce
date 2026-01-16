
import React, { useState } from 'react';
import { Cloud, Code, Server, FileCode, Layers, ArrowRight } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

export const HldLldExplainer: React.FC = () => {
  const [view, setView] = useState<'hld' | 'lld'>('hld');

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-white flex items-center gap-2">
                <Layers className="text-purple-400" /> HLD vs LLD
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

       <div className="grid grid-cols-2 gap-8 h-80">
          
          {/* Visualizer Side */}
          <div className="col-span-1 bg-black/50 rounded-xl border border-slate-700 relative overflow-hidden p-6 flex items-center justify-center">
              {view === 'hld' ? (
                  <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-500 w-full">
                      <div className="flex justify-center gap-8">
                          <div className="flex flex-col items-center">
                              <Cloud size={48} className="text-blue-400" />
                              <span className="text-xs text-slate-400 mt-2">Load Balancer</span>
                          </div>
                      </div>
                      <div className="h-8 border-l-2 border-dashed border-slate-600 mx-auto"></div>
                      <div className="flex justify-center gap-8">
                           <div className="p-4 border border-purple-500 bg-purple-500/10 rounded-lg">
                               <Server size={32} className="text-purple-400" />
                               <div className="text-[10px] text-center mt-1">API Service</div>
                           </div>
                           <div className="p-4 border border-green-500 bg-green-500/10 rounded-lg">
                               <Server size={32} className="text-green-400" />
                               <div className="text-[10px] text-center mt-1">Worker</div>
                           </div>
                      </div>
                      <div className="h-8 border-l-2 border-dashed border-slate-600 mx-auto"></div>
                      <div className="flex justify-center">
                          <div className="flex flex-col items-center">
                              <Layers size={40} className="text-orange-400" />
                              <span className="text-xs text-slate-400 mt-2">Database Cluster</span>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="w-full font-mono text-xs animate-in fade-in zoom-in duration-500">
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
