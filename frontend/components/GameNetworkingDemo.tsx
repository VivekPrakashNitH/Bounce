
import React, { useState, useEffect } from 'react';
import { Send, ShieldCheck, Zap, Code2, WifiOff } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const GameNetworkingDemo: React.FC<Props> = ({ onShowCode }) => {
  const [protocol, setProtocol] = useState<'tcp' | 'udp'>('tcp');
  const [packets, setPackets] = useState<{id: number, x: number, lost: boolean, acked: boolean}[]>([]);
  const [serverState, setServerState] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl ${isMobile ? 'p-4' : 'p-8'} border border-slate-700 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'} border-b border-slate-700 pb-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-mono text-cyan-400 flex items-center gap-2`}>
                <WifiOff size={isMobile ? 18 : 24} /> {isMobile ? 'TCP vs UDP' : 'Networking: TCP vs UDP'}
             </h3>
          </div>
          <div className="flex gap-2 flex-wrap">
             <button 
                onClick={() => setProtocol('tcp')}
                className={`px-3 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} font-bold rounded transition-colors ${protocol === 'tcp' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
             >
                TCP
             </button>
             <button 
                onClick={() => setProtocol('udp')}
                className={`px-3 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} font-bold rounded transition-colors ${protocol === 'udp' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}
             >
                UDP
             </button>
             <button onClick={onShowCode} className={`${isMobile ? '' : 'ml-4'} flex items-center gap-1 ${isMobile ? 'text-[10px]' : 'text-xs'} bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400`}>
                <Code2 size={isMobile ? 12 : 14} /> Code
            </button>
          </div>
       </div>

       <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-4 gap-4'} ${isMobile ? 'h-auto' : 'h-64'}`}>
           
           {/* Client */}
           <div className={`${isMobile ? '' : 'col-span-1'} flex ${isMobile ? 'flex-row gap-4' : 'flex-col'} items-center justify-center ${isMobile ? 'py-3 border-b' : 'border-r'} border-slate-700`}>
               <button onClick={sendPacket} className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} rounded-full bg-slate-800 border-2 border-white hover:bg-white hover:text-black transition-colors flex flex-col items-center justify-center gap-1 active:scale-95`}>
                   <Send size={isMobile ? 18 : 24} />
                   <span className="text-[10px] font-bold">SEND</span>
               </button>
               <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-500 ${isMobile ? '' : 'mt-2'}`}>Client Input</span>
           </div>

           {/* The Internet (Tube) */}
           <div className={`${isMobile ? '' : 'col-span-2'} relative bg-black/20 rounded-lg overflow-hidden flex flex-col justify-center ${isMobile ? 'min-h-[80px]' : ''}`}>
               <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -translate-y-1/2"></div>
               
               {/* Packets */}
               {packets.map(p => (
                   <div 
                     key={p.id}
                     className={`absolute top-1/2 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} -translate-y-1/2 flex items-center justify-center rounded text-[8px] font-bold transition-opacity ${p.lost ? 'opacity-0 duration-[1000ms]' : 'opacity-100'}`}
                     style={{ left: `${p.x}%` }}
                   >
                       <div className={`w-full h-full flex items-center justify-center rounded shadow-lg ${protocol === 'tcp' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                           {p.lost ? '❌' : 'PKT'}
                       </div>
                   </div>
               ))}
               
               {/* Packet Loss Visualizer */}
               <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 ${isMobile ? 'text-[8px]' : 'text-[10px]'} text-red-500 font-mono animate-pulse`}>
                   ~20% Packet Loss
               </div>
           </div>

           {/* Server */}
           <div className={`${isMobile ? '' : 'col-span-1'} bg-slate-800 rounded-lg ${isMobile ? 'p-3' : 'p-4'} border border-slate-700 flex flex-col ${isMobile ? 'min-h-[80px]' : ''}`}>
               <div className="flex items-center gap-2 mb-2 border-b border-slate-600 pb-2">
                   {protocol === 'tcp' ? <ShieldCheck size={isMobile ? 14 : 16} className="text-blue-400"/> : <Zap size={isMobile ? 14 : 16} className="text-orange-400"/>}
                   <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-white`}>Server Recv</span>
               </div>
               <div className="flex-1 overflow-hidden space-y-1">
                   {serverState.map((msg, i) => (
                       <div key={i} className={`${isMobile ? 'text-[8px]' : 'text-[10px]'} font-mono text-green-400 animate-in slide-in-from-left-2`}>
                           {msg}
                       </div>
                   ))}
               </div>
           </div>

       </div>

       <div className={`mt-4 ${isMobile ? 'p-3' : 'p-4'} bg-slate-800/50 rounded-lg border border-slate-700`}>
           <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-white mb-1`}>
               {protocol === 'tcp' ? 'Why TCP is bad for FPS games:' : 'Why UDP is king for FPS:'}
           </h4>
           <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400`}>
               {protocol === 'tcp' 
                 ? "TCP guarantees delivery. If a packet is lost, everything STOPS and waits for it to be resent. This causes 'Rubber-banding' lag." 
                 : "UDP sends packets like a firehose. If one is lost? Who cares! The next one has newer data (current player position) anyway. No waiting = Smooth movement."}
           </p>
       </div>
    </div>
  );
};
