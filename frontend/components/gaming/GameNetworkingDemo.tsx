
import React, { useState, useEffect } from 'react';
import { Send, ShieldCheck, Zap, Code2, WifiOff } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const GameNetworkingDemo: React.FC<Props> = ({ onShowCode }) => {
  const [protocol, setProtocol] = useState<'tcp' | 'udp'>('tcp');
  const [packets, setPackets] = useState<{id: number, x: number, lost: boolean, acked: boolean}[]>([]);
  const [serverState, setServerState] = useState<string[]>([]);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
        setPackets(prev => {
            return prev.map(p => {
                // Move packet
                let newX = p.x + (protocol === 'udp' ? 5 : 2); // UDP is faster (conceptually)
                
                // TCP Ack Logic (Visualizing the round trip delay)
                if (protocol === 'tcp' && newX >= 90 && !p.acked && !p.lost) {
                    return { ...p, x: 90, acked: true }; // Pause at server for ACK
                }
                if (protocol === 'tcp' && p.acked && newX >= 90) {
                     // Simulate Ack return
                     // For viz simplicity, we just clear it after a delay
                }

                return { ...p, x: newX };
            }).filter(p => p.x < 110);
        });
    }, 50);

    return () => clearInterval(interval);
  }, [protocol]);

  const sendPacket = () => {
      // 20% chance of packet loss
      const isLost = Math.random() < 0.2; 
      const id = Date.now();
      setPackets(prev => [...prev, { id, x: 0, lost: isLost, acked: false }]);
      
      if (!isLost) {
          setTimeout(() => {
              setServerState(prev => [`Packet ${id.toString().slice(-4)}`, ...prev].slice(0, 5));
          }, protocol === 'tcp' ? 2000 : 800); // UDP arrives faster
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative px-2 sm:px-0">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-xl font-mono text-cyan-400 flex items-center gap-2">
                <WifiOff /> Networking: TCP vs UDP
             </h3>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={() => setProtocol('tcp')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${protocol === 'tcp' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
             >
                TCP (Reliable)
             </button>
             <button 
                onClick={() => setProtocol('udp')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${protocol === 'udp' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}
             >
                UDP (Fast)
             </button>
             <button onClick={onShowCode} className="ml-4 flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400">
                <Code2 size={14} /> Code
            </button>
          </div>
       </div>

       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 h-auto sm:h-64">
           
           {/* Client */}
           <div className="col-span-1 flex flex-col items-center justify-center border-r border-slate-700">
               <button onClick={sendPacket} className="w-20 h-20 rounded-full bg-slate-800 border-2 border-white hover:bg-white hover:text-black transition-colors flex flex-col items-center justify-center gap-1 active:scale-95">
                   <Send size={24} />
                   <span className="text-[10px] font-bold">SEND</span>
               </button>
               <span className="text-xs text-slate-500 mt-2">Client Input</span>
           </div>

           {/* The Internet (Tube) */}
           <div className="col-span-2 relative bg-black/20 rounded-lg overflow-hidden flex flex-col justify-center">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -translate-y-1/2"></div>
               
               {/* Packets */}
               {packets.map(p => (
                   <div 
                     key={p.id}
                     className={`absolute top-1/2 w-8 h-8 -translate-y-1/2 flex items-center justify-center rounded text-[8px] font-bold transition-opacity ${p.lost ? 'opacity-0 duration-[1000ms]' : 'opacity-100'}`}
                     style={{ left: `${p.x}%` }}
                   >
                       <div className={`w-full h-full flex items-center justify-center rounded shadow-lg ${protocol === 'tcp' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                           {p.lost ? 'âŒ' : 'PKT'}
                       </div>
                   </div>
               ))}
               
               {/* Packet Loss Visualizer */}
               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-red-500 font-mono animate-pulse">
                   ~20% Packet Loss Simulation
               </div>
           </div>

           {/* Server */}
           <div className="col-span-1 bg-slate-800 rounded-lg p-4 border border-slate-700 flex flex-col">
               <div className="flex items-center gap-2 mb-2 border-b border-slate-600 pb-2">
                   {protocol === 'tcp' ? <ShieldCheck size={16} className="text-blue-400"/> : <Zap size={16} className="text-orange-400"/>}
                   <span className="text-xs font-bold text-white">Server Recv</span>
               </div>
               <div className="flex-1 overflow-hidden space-y-1">
                   {serverState.map((msg, i) => (
                       <div key={i} className="text-[10px] font-mono text-green-400 animate-in slide-in-from-left-2">
                           {msg}
                       </div>
                   ))}
               </div>
           </div>

       </div>

       <div className="mt-4 p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-700">
           <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
               {protocol === 'tcp' ? 'Why TCP is bad for FPS games:' : 'Why UDP is king for FPS:'}
           </h4>
           <p className="text-xs text-slate-400">
               {protocol === 'tcp' 
                 ? "TCP guarantees delivery. If a packet is lost, everything STOPS and waits for it to be resent. This causes 'Rubber-banding' lag." 
                 : "UDP sends packets like a firehose. If one is lost? Who cares! The next one has newer data (current player position) anyway. No waiting = Smooth movement."}
           </p>
       </div>
    </div>
  );
};
