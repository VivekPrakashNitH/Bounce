
import React, { useState, useEffect } from 'react';
import { Layout, Server, Database, ArrowRight, Code2, ArrowDown } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const FullStackHowTo: React.FC<Props> = ({ onShowCode }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [step, setStep] = useState(0);

  const steps = [
      { label: 'Idle', desc: 'User writes a comment on Frontend.' },
      { label: 'Frontend', desc: 'React sends JSON via HTTP POST.' },
      { label: 'API', desc: 'Node.js/Go API receives request.' },
      { label: 'Database', desc: 'Data is saved to Postgres/Mongo.' },
      { label: 'Response', desc: 'Server says "200 OK" to Frontend.' }
  ];

  const advance = () => {
      setStep(prev => (prev + 1) % steps.length);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl border border-slate-700 shadow-2xl relative ${isMobile ? 'p-4' : 'p-8'}`}>
       <div className={`flex justify-between items-center border-b border-slate-700 ${isMobile ? 'pb-2 mb-4 flex-col gap-2' : 'pb-4 mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`font-mono text-white flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-xl'}`}>
                <Layout className="text-blue-400" size={isMobile ? 16 : 24} /> How This App Works
             </h3>
          </div>
          <div className="flex gap-2">
             <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400">
                <Code2 size={14} /> Full Stack Code
            </button>
          </div>
       </div>

       <div className={`grid items-center ${isMobile ? 'grid-cols-1 gap-3 h-auto' : 'grid-cols-3 gap-4 h-64'}`}>
           
           {/* Frontend */}
           <div className={`flex flex-col items-center rounded-xl border-2 transition-all ${isMobile ? 'p-3' : 'col-span-1 p-4'} ${step === 1 ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-slate-700 bg-slate-800'}`}>
               <Layout size={isMobile ? 28 : 40} className="text-blue-400 mb-2" />
               <h4 className={`font-bold text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>Frontend (React)</h4>
               <p className="text-[10px] text-slate-400 text-center mt-1">"This Website"</p>
               {step === 1 && <div className="mt-2 text-[10px] bg-black px-2 py-1 rounded text-green-400 font-mono">fetch('/api/comment')</div>}
           </div>

           {/* Arrow 1 */}
           <div className="flex justify-center">
               {isMobile ? (
                   <ArrowDown size={24} className={`transition-colors ${step >= 2 ? 'text-green-500' : 'text-slate-700'}`} />
               ) : (
                   <ArrowRight size={32} className={`transition-colors ${step >= 2 ? 'text-green-500' : 'text-slate-700'}`} />
               )}
           </div>

           {/* Backend Group */}
           <div className={`flex flex-col ${isMobile ? 'gap-3' : 'col-span-1 gap-4'}`}>
               {/* API Server */}
               <div className={`flex flex-col items-center rounded-xl border-2 transition-all ${isMobile ? 'p-3' : 'p-4'} ${step === 2 ? 'border-purple-500 bg-purple-500/10 scale-105' : 'border-slate-700 bg-slate-800'}`}>
                   <Server size={isMobile ? 28 : 40} className="text-purple-400 mb-2" />
                   <h4 className={`font-bold text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>Backend (Node/Go)</h4>
                   {step === 2 && <div className="mt-2 text-[10px] bg-black px-2 py-1 rounded text-green-400 font-mono">Processing...</div>}
               </div>

               {/* DB Connection Visual */}
               {step >= 3 && <div className="h-4 w-1 bg-green-500 mx-auto"></div>}

               {/* Database */}
               <div className={`flex flex-col items-center rounded-xl border-2 transition-all ${isMobile ? 'p-3' : 'p-4'} ${step === 3 ? 'border-orange-500 bg-orange-500/10 scale-105' : 'border-slate-700 bg-slate-800'}`}>
                   <Database size={isMobile ? 28 : 40} className="text-orange-400 mb-2" />
                   <h4 className={`font-bold text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>Database (SQL)</h4>
                   {step === 3 && <div className="mt-2 text-[10px] bg-black px-2 py-1 rounded text-green-400 font-mono">INSERT INTO comments...</div>}
               </div>
           </div>

       </div>

       <div className={`flex flex-col items-center ${isMobile ? 'mt-4' : 'mt-8'}`}>
           <div className={`text-center ${isMobile ? 'h-10 mb-2' : 'h-12 mb-4'}`}>
               <p className={`font-bold text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>{steps[step].label}</p>
               <p className={`text-slate-400 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{steps[step].desc}</p>
           </div>
           
           <button onClick={advance} className={`bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors ${isMobile ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'}`}>
               {step === 4 ? 'Reset Flow' : 'Next Step'}
           </button>
           
           <div className={`bg-blue-900/20 border border-blue-500/30 rounded text-blue-200 text-center max-w-lg ${isMobile ? 'mt-4 p-2 text-[10px]' : 'mt-6 p-3 text-xs'}`}>
               <b>Does this app use a real backend?</b><br/>
               Currently, this app is a <i>simulation</i> running entirely in your browser (Frontend Only) using <code>localStorage</code> to save comments. To make it real (so other people see your comments), we would need to build the Backend & Database shown above!
           </div>
       </div>

    </div>
  );
};
