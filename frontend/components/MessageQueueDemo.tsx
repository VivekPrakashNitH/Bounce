import React, { useState, useEffect } from 'react';
import { Send, Server, Inbox, Code2 } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const MessageQueueDemo: React.FC<Props> = ({ onShowCode }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [messages, setMessages] = useState<{id: number, x: number, status: 'producing'|'queued'|'consuming'}[]>([]);
  const [consumers, setConsumers] = useState<{id: number, busy: boolean}[]>([{id: 1, busy: false}, {id: 2, busy: false}]);

  const produceMessage = () => {
    const newMsg = { id: Date.now(), x: 0, status: 'producing' as const };
    setMessages(prev => [...prev, newMsg]);
  };

  useEffect(() => {
    if (messages.length === 0) return;
    const interval = setInterval(() => {
      setMessages(prev => {
        let updated = [...prev];
        
        // Move messages
        updated = updated.map(m => {
          if (m.status === 'producing') {
             if (m.x < 45) return { ...m, x: m.x + 2 };
             return { ...m, status: 'queued' };
          }
          return m;
        });

        // Consume Logic
        const queued = updated.filter(m => m.status === 'queued');
        const availableConsumer = consumers.find(c => !c.busy);
        
        if (queued.length > 0 && availableConsumer) {
             const msgToConsume = queued[0];
             // Mark consumer busy
             setConsumers(c => c.map(cons => cons.id === availableConsumer.id ? { ...cons, busy: true } : cons));
             
             // Remove message
             updated = updated.filter(m => m.id !== msgToConsume.id);

             // Simulate processing time
             setTimeout(() => {
                 setConsumers(c => c.map(cons => cons.id === availableConsumer.id ? { ...cons, busy: false } : cons));
             }, 1000);
        }

        return updated;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [messages, consumers]);

  return (
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl ${isMobile ? 'p-4' : 'p-8'} border border-slate-700 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row justify-between'} items-center border-b border-slate-700 pb-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-mono text-orange-400 flex items-center gap-2`}>
                <Inbox size={isMobile ? 16 : 20} /> {isMobile ? 'Message Queue' : 'Distributed Message Queue'}
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Code
            </button>
            {!isMobile && <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Pub/Sub Pattern</span>}
          </div>
        </div>

        <div className={`flex ${isMobile ? 'flex-col gap-6' : 'flex-row'} items-center justify-between ${isMobile ? 'h-auto py-4' : 'h-48'} relative ${isMobile ? 'px-2' : 'px-4'}`}>
             {/* Producer */}
             <div className="flex flex-col items-center gap-2">
                 <button onClick={produceMessage} className={`${isMobile ? 'p-3' : 'p-4'} bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 active:scale-95 transition-all z-20`}>
                    <Send className="text-white" size={isMobile ? 18 : 24} />
                 </button>
                 <span className="text-xs text-slate-400">Producer</span>
             </div>

             {/* The Queue */}
             <div className={`${isMobile ? 'w-40 h-16' : 'w-48 h-20'} border-2 border-orange-500/50 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden`}>
                 <span className={`absolute ${isMobile ? '-top-5 text-[10px]' : '-top-6 text-xs'} text-orange-400`}>{isMobile ? 'Queue' : 'Kafka / RabbitMQ'}</span>
                 <div className="flex gap-2 px-2 overflow-x-auto">
                     {messages.filter(m => m.status === 'queued').map(m => (
                         <div key={m.id} className="w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
                     ))}
                     {messages.filter(m => m.status === 'queued').length === 0 && <span className="text-xs text-slate-600">Empty</span>}
                 </div>
             </div>

             {/* Consumers */}
             <div className={`flex ${isMobile ? 'flex-row gap-3' : 'flex-col gap-4'}`}>
                 {consumers.map(c => (
                     <div key={c.id} className={`flex items-center gap-2 ${isMobile ? 'p-1.5' : 'p-2'} rounded border transition-colors ${c.busy ? 'bg-green-500/20 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
                         <Server size={isMobile ? 14 : 16} className={c.busy ? "text-green-400" : "text-slate-500"} />
                         <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-mono text-slate-300`}>{isMobile ? `W${c.id}` : `Worker ${c.id}`}</span>
                         {c.busy && !isMobile && <span className="text-[10px] text-green-400 animate-pulse">Processing...</span>}
                     </div>
                 ))}
             </div>

             {/* Moving Messages Animation Layer */}
             {messages.map(m => (
                 m.status === 'producing' && (
                     <div key={m.id} className="absolute top-1/2 left-16 w-4 h-4 bg-white rounded-full shadow-lg" style={{ left: `${10 + m.x}%` }}></div>
                 )
             ))}
        </div>
        
        <p className={`mt-4 ${isMobile ? 'text-xs' : 'text-sm'} text-slate-400 text-center`}>
            {isMobile ? 'Producers → Queue → Consumers (async processing)' : 'Decoupling services: Producers send messages to a Queue, and Consumers process them asynchronously.'}
        </p>
    </div>
  );
};