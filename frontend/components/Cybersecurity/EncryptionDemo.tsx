
import React, { useState, useEffect } from 'react';
import { Lock, Unlock, User, Ear, ArrowRight, Code2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { BounceAvatar } from '../BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const EncryptionDemo: React.FC<Props> = ({ onShowCode }) => {
  const [mode, setMode] = useState<'plaintext' | 'encrypted'>('plaintext');
  const [packet, setPacket] = useState<{x: number, data: string, captured: boolean} | null>(null);
  const [hackerLog, setHackerLog] = useState<string[]>([]);

  const sendMessage = () => {
      if (packet) return;
      setPacket({ x: 0, data: "SecretPassword123", captured: false });
  };

  useEffect(() => {
      if (!packet) return;

      const interval = setInterval(() => {
          setPacket(prev => {
              if (!prev) return null;
              
              // Hacker Interception Point (Middle)
              if (prev.x >= 45 && prev.x <= 55 && !prev.captured) {
                  const capturedData = mode === 'plaintext' ? "SecretPassword123" : "a8f9c2d1...";
                  setHackerLog(logs => [capturedData, ...logs].slice(0, 3));
                  return { ...prev, x: prev.x + 2, captured: true };
              }

              if (prev.x >= 90) {
                  return null; // Arrived
              }
              return { ...prev, x: prev.x + 2 };
          });
      }, 50);

      return () => clearInterval(interval);
  }, [packet, mode]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-purple-400 flex items-center gap-2">
                {mode === 'plaintext' ? <Unlock className="text-red-500"/> : <Lock className="text-green-500"/>} 
                Cryptography & MITM
             </h3>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
             <button 
                onClick={() => setMode('plaintext')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${mode === 'plaintext' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
             >
                HTTP (Unsafe)
             </button>
             <button 
                onClick={() => setMode('encrypted')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${mode === 'encrypted' ? 'bg-green-600 text-white' : 'text-slate-400'}`}
             >
                HTTPS (Secure)
             </button>
             <button onClick={onShowCode} className="ml-2 flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400">
                <Code2 size={14} /> Code
            </button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-64 relative">
           
           {/* Alice */}
           <div className="col-span-1 flex flex-col items-center justify-center border-r border-slate-700">
               <div className="p-4 bg-slate-800 rounded-full mb-4">
                   <User size={32} className="text-blue-400" />
               </div>
               <span className="text-xs font-bold text-white mb-2">Alice</span>
               <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-bold text-white">
                   Send "Secret"
               </button>
           </div>

           {/* The Network (MITM) */}
           <div className="col-span-1 relative flex flex-col items-center justify-start pt-10">
               <span className="text-xs text-slate-500 mb-8 font-mono">The Internet</span>
               
               {/* Eve / Hacker */}
               <div className="flex flex-col items-center gap-2 p-4 bg-red-900/10 border border-red-500/30 rounded-xl w-full">
                   <div className="flex items-center gap-2 text-red-400">
                       <Ear size={20} />
                       <span className="text-xs font-bold">Eve (Hacker)</span>
                   </div>
                   <div className="w-full h-16 bg-black rounded p-2 font-mono text-[10px] text-green-400 overflow-hidden">
                       {hackerLog.map((log, i) => (
                           <div key={i} className="animate-in slide-in-from-top-2">Captured: {log}</div>
                       ))}
                       {hackerLog.length === 0 && <span className="text-slate-600">Listening...</span>}
                   </div>
               </div>

               {/* Packet Animation */}
               {packet && (
                   <div 
                     className={`absolute top-32 w-8 h-8 rounded flex items-center justify-center shadow-lg transition-colors ${mode === 'plaintext' ? 'bg-red-500' : 'bg-green-500'}`}
                     style={{ left: `${packet.x}%`, transform: 'translateX(-50%)' }}
                   >
                       {mode === 'plaintext' ? <Unlock size={14} className="text-black"/> : <Lock size={14} className="text-black"/>}
                   </div>
               )}
           </div>

           {/* Bob */}
           <div className="col-span-1 flex flex-col items-center justify-center border-l border-slate-700">
               <div className="p-4 bg-slate-800 rounded-full mb-4">
                   <User size={32} className="text-green-400" />
               </div>
               <span className="text-xs font-bold text-white">Bob</span>
               <div className="mt-4 text-xs text-slate-400 text-center">
                   {mode === 'plaintext' ? 'Received Plaintext' : 'Decrypted Message'}
               </div>
           </div>

       </div>

       <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
           <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
               {mode === 'plaintext' ? <ShieldAlert size={16} className="text-red-500"/> : <ShieldCheck size={16} className="text-green-500"/>}
               {mode === 'plaintext' ? 'Man-in-the-Middle Vulnerable' : 'End-to-End Encrypted'}
           </h4>
           <p className="text-xs text-slate-400">
               {mode === 'plaintext' 
                 ? "Without encryption (HTTP), Eve can read the packet as it passes through the router/ISP. The data is clear text." 
                 : "With encryption (HTTPS/TLS), Eve captures the packet but sees garbage ('a8f9...'). Only Bob has the Private Key to decrypt it."}
           </p>
       </div>
    </div>
  );
};
