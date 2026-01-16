
import React, { useState } from 'react';
import { Database, ShieldAlert, CheckCircle, Code2, Lock } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const SqlInjectionDemo: React.FC<Props> = ({ onShowCode }) => {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState("SELECT * FROM users WHERE name = '...'");
  const [result, setResult] = useState<'idle' | 'success' | 'hacked'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInput(val);
      setQuery(`SELECT * FROM users WHERE name = '${val}'`);
  };

  const execute = () => {
      // Simple simulation of the classic ' OR '1'='1 hack
      if (input.includes("' OR '1'='1")) {
          setResult('hacked');
      } else if (input === 'Admin') {
          setResult('success');
      } else {
          setResult('idle');
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative px-2 sm:px-0">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-xl font-mono text-red-400 flex items-center gap-2">
                <Database /> SQL Injection (SQLi)
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Fix
            </button>
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
           
           {/* Attacker View */}
           <div className="col-span-1 flex flex-col gap-3 sm:gap-4">
               <div className="bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700">
                   <label className="text-xs font-bold text-white uppercase mb-2 block">Login Form</label>
                   <input 
                     type="text" 
                     value={input}
                     onChange={handleChange}
                     placeholder="Enter Username"
                     className="w-full bg-slate-900 border border-slate-600 rounded p-2 sm:p-3 text-white focus:border-red-500 outline-none font-mono text-[10px] sm:text-sm"
                   />
                   <button 
                     onClick={execute}
                     className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded transition-colors"
                   >
                       Login
                   </button>
               </div>

               <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                   <h4 className="text-xs font-bold text-yellow-500 mb-1">Hacker Hint:</h4>
                   <p className="text-xs text-yellow-200">
                       Try to trick the logic. The code connects your string directly. 
                       <br/>Try typing: <span className="font-mono bg-black px-1 rounded text-white">' OR '1'='1</span>
                   </p>
               </div>
           </div>

           {/* Backend View */}
           <div className="col-span-1 flex flex-col gap-3 sm:gap-4">
               <div className="flex-1 bg-black p-3 sm:p-4 rounded-xl border border-slate-700 font-mono text-[10px] sm:text-sm relative overflow-hidden">
                   <div className="text-slate-500 text-xs mb-2">// Server-side Query Builder</div>
                   <div className="text-purple-400">const query = </div>
                   <div className="text-green-300 break-words">
                       "SELECT * FROM users WHERE name = '<span className="text-white bg-slate-800 px-1 rounded">{input}</span>'"
                   </div>
                   
                   {result === 'hacked' && (
                       <div className="mt-4 p-2 bg-red-900/50 border border-red-500 rounded text-red-200 text-xs animate-pulse">
                           Ã¢Å¡Â Ã¯Â¸Â CRITICAL: Query is always TRUE because '1'='1'. <br/>
                           Database dumps ALL users.
                       </div>
                   )}
                   {result === 'success' && (
                       <div className="mt-4 p-2 bg-green-900/50 border border-green-500 rounded text-green-200 text-xs">
                           Ã¢Å“â€¦ Valid user found. Logged in.
                       </div>
                   )}
               </div>

               {/* Database Status */}
               <div className={`p-4 rounded-lg border flex items-center gap-4 transition-all ${result === 'hacked' ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 border-slate-700'}`}>
                   <Database size={24} />
                   <div>
                       <div className="text-sm font-bold">{result === 'hacked' ? 'DB BREACHED' : 'Database Secure'}</div>
                       <div className="text-xs opacity-70">{result === 'hacked' ? 'dumping all_users table...' : 'Waiting for query...'}</div>
                   </div>
               </div>
           </div>

       </div>
    </div>
  );
};
