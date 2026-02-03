
import React, { useState } from 'react';
import { Layout, Server, Database, ArrowRight, Code2 } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const FullStackHowTo: React.FC<Props> = ({ onShowCode }) => {
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
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative px-2 sm:px-8">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-xl font-mono text-white flex items-center gap-2">
                <Layout className="text-blue-400" size={18} /> How This App Works
             </h3>
          </div>
          <div className="flex gap-2">
             <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400">
                <Code2 size={14} /> Full Stack Code
            </button>
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 sm:h-64 items-center">
           
           {/* Frontend */}
           <div className={`col-span-1 flex flex-col items-center p-4 rounded-xl border-2 transition-all ${step === 1 ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-slate-700 bg-slate-800'}`}>
               <Layout size={40} className="text-blue-400 mb-2" />
               <h4 className="font-bold text-white text-sm">Frontend (React)</h4>
               <p className="text-[10px] text-slate-400 text-center mt-1">"This Website"</p>
               {step === 1 && <div className="mt-2 text-[10px] bg-black px-2 py-1 rounded text-green-400 font-mono">fetch('/api/comment')</div>}
           </div>

           {/* Arrow 1 */}
           <div className="flex justify-center">
               <ArrowRight size={32} className={`transition-colors ${step >= 2 ? 'text-green-500' : 'text-slate-700'}`} />
           </div>

           {/* Backend Group */}
           <div className="col-span-1 flex flex-col gap-4">
               {/* API Server */}
               <div className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${step === 2 ? 'border-purple-500 bg-purple-500/10 scale-105' : 'border-slate-700 bg-slate-800'}`}>
                   <Server size={40} className="text-purple-400 mb-2" />
                   <h4 className="font-bold text-white text-sm">Backend (Node/Go)</h4>
                   {step === 2 && <div className="mt-2 text-[10px] bg-black px-2 py-1 rounded text-green-400 font-mono">Processing...</div>}
               </div>

               {/* DB Connection Visual */}
               {step >= 3 && <div className="h-4 w-1 bg-green-500 mx-auto"></div>}

               {/* Database */}
               <div className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${step === 3 ? 'border-orange-500 bg-orange-500/10 scale-105' : 'border-slate-700 bg-slate-800'}`}>
                   <Database size={40} className="text-orange-400 mb-2" />
                   <h4 className="font-bold text-white text-sm">Database (SQL)</h4>
                   {step === 3 && <div className="mt-2 text-[10px] bg-black px-2 py-1 rounded text-green-400 font-mono">INSERT INTO comments...</div>}
               </div>
           </div>

       </div>

       <div className="mt-4 sm:mt-8 flex flex-col items-center">
           <div className="h-12 text-center mb-4">
               <p className="text-xs sm:text-sm font-bold text-white">{steps[step].label}</p>
               <p className="text-[10px] sm:text-xs text-slate-400">{steps[step].desc}</p>
           </div>
           
           <button onClick={advance} className="px-4 sm:px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors text-sm sm:text-base">
               {step === 4 ? 'Reset Flow' : 'Next Step'}
           </button>
           
           <div className="mt-4 sm:mt-6 p-2 sm:p-3 bg-blue-900/20 border border-blue-500/30 rounded text-[10px] sm:text-xs text-blue-200 text-center max-w-sm sm:max-w-lg">
               <b>Does this app use a real backend?</b><br/>
               Currently, this app is a <i>simulation</i> running entirely in your browser (Frontend Only) using <code>localStorage</code> to save comments. To make it real (so other people see your comments), we would need to build the Backend & Database shown above!
           </div>
       </div>

    </div>
  );
};
