
import React, { useState } from 'react';
import { Database, Zap, Clock, Code2, MousePointerClick, RefreshCcw } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
    onShowCode: () => void;
}

export const CachingDemo: React.FC<Props> = ({ onShowCode }) => {
  // Simple Cache: key -> val. Ordered array simulates LRU (index 0 is least recently used)
  const [cache, setCache] = useState<{key: string, val: string}[]>([]);
  const [dbData] = useState(['User_A', 'User_B', 'User_C', 'User_D', 'User_E']);
  const [status, setStatus] = useState<'idle' | 'checking' | 'fetching' | 'evicting' | 'writing'>('idle');
  const [log, setLog] = useState<string>('System Ready.');
  const [reqKey, setReqKey] = useState('User_A');
  const CACHE_SIZE = 3;

  const handleRequest = () => {
      if (status !== 'idle') return;
      
      setStatus('checking');
      setLog(`Checking Cache for ${reqKey}...`);

      setTimeout(() => {
          const foundIdx = cache.findIndex(item => item.key === reqKey);
          
          if (foundIdx !== -1) {
              // HIT
              setLog(`✅ Cache HIT! Moved ${reqKey} to Most Recently Used.`);
              // Move to end (Most recently used)
              setCache(prev => {
                  const newCache = [...prev];
                  const item = newCache.splice(foundIdx, 1)[0];
                  newCache.push(item);
                  return newCache;
              });
              setStatus('idle');
          } else {
              // MISS
              setLog(`❌ Cache MISS. Fetching from DB...`);
              setStatus('fetching');
              
              setTimeout(() => {
                  setStatus('writing');
                  setCache(prev => {
                      let newCache = [...prev];
                      if (newCache.length >= CACHE_SIZE) {
                          setLog(`⚠️ Cache FULL. Evicting LRU: ${newCache[0].key}`);
                          newCache.shift(); // Remove first element (Least Recently Used)
                      }
                      newCache.push({ key: reqKey, val: "Data" });
                      return newCache;
                  });
                  setTimeout(() => {
                      setLog("Write Complete.");
                      setStatus('idle');
                  }, 500);
              }, 1000);
          }
      }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-yellow-400 flex items-center gap-2">
                <Zap /> Level 4: LRU Caching
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Code
            </button>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Least Recently Used</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 h-64">
            
            {/* Control Panel */}
            <div className="col-span-1 flex flex-col gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Request Data</label>
                    <div className="flex flex-wrap gap-2">
                        {dbData.map(key => (
                            <button 
                                key={key}
                                onClick={() => setReqKey(key)}
                                className={`px-3 py-1 text-xs rounded border transition-colors ${reqKey === key ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 border-slate-600 hover:border-slate-400'}`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleRequest}
                        disabled={status !== 'idle'}
                        className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded transition-colors disabled:opacity-50"
                    >
                        {status === 'idle' ? 'Fetch Data' : 'Processing...'}
                    </button>
                </div>
                
                <div className="flex-1 bg-black/50 rounded-lg p-3 font-mono text-xs text-green-400 overflow-y-auto border border-slate-800">
                    &gt; {log}
                </div>
            </div>

            {/* Visualizer */}
            <div className="col-span-1 flex flex-col items-center justify-center relative bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="absolute top-2 right-2 text-[10px] text-slate-500 uppercase font-bold">Cache Memory (Max 3)</span>
                
                <div className="flex flex-col-reverse gap-2 w-48">
                    {/* Empty Slots Filler */}
                    {Array.from({ length: Math.max(0, CACHE_SIZE - cache.length) }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-10 border-2 border-dashed border-slate-600 rounded flex items-center justify-center text-slate-600 text-xs">
                            Empty Slot
                        </div>
                    ))}

                    {/* Actual Cache Items */}
                    {cache.map((item, index) => (
                        <div key={item.key} className="h-10 bg-green-900/50 border border-green-500 rounded flex items-center justify-between px-4 animate-in slide-in-from-left-4 fade-in duration-300">
                            <span className="text-sm font-bold text-white">{item.key}</span>
                            {index === cache.length - 1 && <span className="text-[9px] bg-green-500 text-black px-1 rounded font-bold">MRU</span>}
                            {index === 0 && <span className="text-[9px] bg-red-500 text-white px-1 rounded font-bold">LRU</span>}
                        </div>
                    ))}
                </div>
                
                <div className="mt-4 text-[10px] text-slate-400 text-center">
                    New items enter at TOP (MRU).<br/>
                    Old items fall off BOTTOM (LRU).
                </div>
            </div>

        </div>
    </div>
  );
};
