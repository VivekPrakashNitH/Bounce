
import React, { useState, useEffect } from 'react';
import { Database, FileText, Search, Plus, ArrowDown } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const DbInternalsDemo: React.FC<Props> = ({ onShowCode }) => {
  const [dbType, setDbType] = useState<'sql' | 'nosql'>('sql');
  const [data, setData] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const addData = () => {
      if (animating) return;
      setAnimating(true);
      const num = Math.floor(Math.random() * 99);
      
      // Animation simulation
      setTimeout(() => {
          setData(prev => [...prev, num]);
          setAnimating(false);
      }, dbType === 'sql' ? 1000 : 300); // SQL slower writes, NoSQL faster writes
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl ${isMobile ? 'p-4' : 'p-8'} border border-slate-700 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} items-center border-b border-slate-700 pb-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-mono text-yellow-400 flex items-center gap-2`}>
                <Database size={isMobile ? 16 : 24} /> DB Internals
             </h3>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
             <button 
                onClick={() => { setDbType('sql'); setData([]); }}
                className={`${isMobile ? 'px-2 text-[10px]' : 'px-3 text-xs'} py-1 font-bold rounded transition-colors ${dbType === 'sql' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
             >
                B-Tree (SQL)
             </button>
             <button 
                onClick={() => { setDbType('nosql'); setData([]); }}
                className={`${isMobile ? 'px-2 text-[10px]' : 'px-3 text-xs'} py-1 font-bold rounded transition-colors ${dbType === 'nosql' ? 'bg-green-600 text-white' : 'text-slate-400'}`}
             >
                LSM Tree (NoSQL)
             </button>
          </div>
       </div>

       <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'} ${isMobile ? 'h-auto' : 'h-64'}`}>
           {/* Visualizer */}
           <div className={`${isMobile ? '' : 'col-span-1'} bg-black/40 rounded-xl border border-slate-700 ${isMobile ? 'p-3' : 'p-4'} relative overflow-hidden flex flex-col items-center`}>
               <button 
                  onClick={addData} 
                  disabled={animating}
                  className={`mb-4 bg-white text-black ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-full font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2`}
               >
                   {animating ? 'Writing...' : <><Plus size={14}/> Insert Data</>}
               </button>

               {/* B-TREE VISUALIZATION */}
               {dbType === 'sql' && (
                   <div className="flex flex-col items-center gap-2 w-full animate-in fade-in">
                       <div className={`${isMobile ? 'p-1.5 text-[10px]' : 'p-2 text-xs'} bg-blue-900/50 border border-blue-500 rounded text-blue-200`}>Root Node [50]</div>
                       <ArrowDown size={isMobile ? 12 : 14} className="text-slate-500"/>
                       <div className="flex gap-4">
                           <div className={`${isMobile ? 'p-1.5 text-[10px] w-12' : 'p-2 text-xs w-16'} bg-blue-900/30 border border-blue-500/50 rounded text-slate-400 text-center`}>&lt; 50</div>
                           <div className={`${isMobile ? 'p-1.5 text-[10px] w-12' : 'p-2 text-xs w-16'} bg-blue-900/30 border border-blue-500/50 rounded text-slate-400 text-center`}>&gt; 50</div>
                       </div>
                       {animating && <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-yellow-400 mt-4 animate-pulse`}>Rebalancing Tree... (Slow)</div>}
                       <div className="flex flex-wrap gap-1 mt-2 justify-center">
                           {data.sort((a,b)=>a-b).map((d, i) => (
                               <span key={i} className="text-[10px] bg-blue-500 text-white px-1 rounded animate-in zoom-in">{d}</span>
                           ))}
                       </div>
                   </div>
               )}

               {/* LSM TREE VISUALIZATION */}
               {dbType === 'nosql' && (
                   <div className="flex flex-col items-center gap-2 w-full animate-in fade-in">
                       <div className={`w-full ${isMobile ? 'h-24' : 'h-32'} border-2 border-green-500/30 border-dashed rounded bg-green-900/10 relative p-2 overflow-y-auto custom-scrollbar`}>
                           <div className="text-[10px] text-green-500 font-bold mb-1">MemTable (RAM Log)</div>
                           {data.map((d, i) => (
                               <div key={i} className="text-[10px] font-mono text-green-300 border-b border-green-500/20">
                                   APPEND: {d}
                               </div>
                           ))}
                       </div>
                       {animating && <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-green-400 animate-pulse`}>Fast Append!</div>}
                   </div>
               )}
           </div>

           {/* Info Panel */}
           <div className={`${isMobile ? '' : 'col-span-1'} flex flex-col justify-center gap-4`}>
               <div className={`${isMobile ? 'p-3' : 'p-4'} bg-slate-800 rounded-lg border border-slate-700`}>
                   <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-white mb-2 flex items-center gap-2`}>
                       {dbType === 'sql' ? <Search size={isMobile ? 14 : 16}/> : <FileText size={isMobile ? 14 : 16}/>}
                       {dbType === 'sql' ? 'Read Optimized' : 'Write Optimized'}
                   </h4>
                   <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400 leading-relaxed`}>
                       {dbType === 'sql' 
                         ? "B-Trees keep data sorted. Great for reading (Binary Search), but writing is slower because we have to rearrange the tree." 
                         : "LSM Trees (Log Structured Merge) just append data to the end of a file. Writing is instant. Reading requires checking multiple files."}
                   </p>
               </div>
               <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-zinc-500 font-mono`}>
                   {dbType === 'sql' ? "Used in: PostgreSQL, MySQL" : "Used in: Cassandra, ScyllaDB, RocksDB"}
               </div>
           </div>
       </div>
    </div>
  );
};
