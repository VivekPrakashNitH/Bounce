
import React, { useState } from 'react';
import { Database, FileText, Search, Plus, ArrowDown } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const DbInternalsDemo: React.FC<Props> = ({ onShowCode }) => {
  const [dbType, setDbType] = useState<'sql' | 'nosql'>('sql');
  const [data, setData] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);

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
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative px-2 sm:px-0">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-xl font-mono text-yellow-400 flex items-center gap-2">
                <Database className="w-4 h-4 sm:w-5 sm:h-5" /> DB Internals
             </h3>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
             <button 
                onClick={() => { setDbType('sql'); setData([]); }}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${dbType === 'sql' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
             >
                B-Tree (SQL)
             </button>
             <button 
                onClick={() => { setDbType('nosql'); setData([]); }}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${dbType === 'nosql' ? 'bg-green-600 text-white' : 'text-slate-400'}`}
             >
                LSM Tree (NoSQL)
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 h-auto sm:h-64">
           {/* Visualizer */}
           <div className="col-span-1 bg-black/40 rounded-xl border border-slate-700 p-3 sm:p-4 relative overflow-hidden flex flex-col items-center min-h-[200px] sm:min-h-0">
               <button 
                  onClick={addData} 
                  disabled={animating}
                  className="mb-4 bg-white text-black px-4 py-2 rounded-full font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2"
               >
                   {animating ? 'Writing...' : <><Plus size={14}/> Insert Data</>}
               </button>

               {/* B-TREE VISUALIZATION */}
               {dbType === 'sql' && (
                   <div className="flex flex-col items-center gap-2 w-full animate-in fade-in">
                       <div className="p-2 bg-blue-900/50 border border-blue-500 rounded text-xs text-blue-200">Root Node [50]</div>
                       <ArrowDown size={14} className="text-slate-500"/>
                       <div className="flex gap-4">
                           <div className="p-2 bg-blue-900/30 border border-blue-500/50 rounded text-xs text-slate-400 w-16 text-center">&lt; 50</div>
                           <div className="p-2 bg-blue-900/30 border border-blue-500/50 rounded text-xs text-slate-400 w-16 text-center">&gt; 50</div>
                       </div>
                       {animating && <div className="text-xs text-yellow-400 mt-4 animate-pulse">Rebalancing Tree... (Slow)</div>}
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
                       <div className="w-full h-32 border-2 border-green-500/30 border-dashed rounded bg-green-900/10 relative p-2 overflow-y-auto custom-scrollbar">
                           <div className="text-[10px] text-green-500 font-bold mb-1">MemTable (RAM Log)</div>
                           {data.map((d, i) => (
                               <div key={i} className="text-[10px] font-mono text-green-300 border-b border-green-500/20">
                                   APPEND: {d}
                               </div>
                           ))}
                       </div>
                       {animating && <div className="text-xs text-green-400 animate-pulse">Fast Append!</div>}
                   </div>
               )}
           </div>

           {/* Info Panel */}
           <div className="col-span-1 flex flex-col justify-center gap-3 sm:gap-4">
               <div className="p-3 sm:p-4 bg-slate-800 rounded-lg border border-slate-700">
                   <h4 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-2">
                       {dbType === 'sql' ? <Search size={16}/> : <FileText size={16}/>}
                       {dbType === 'sql' ? 'Read Optimized' : 'Write Optimized'}
                   </h4>
                   <p className="text-xs text-slate-400 leading-relaxed">
                       {dbType === 'sql' 
                         ? "B-Trees keep data sorted. Great for reading (Binary Search), but writing is slower because we have to rearrange the tree." 
                         : "LSM Trees (Log Structured Merge) just append data to the end of a file. Writing is instant. Reading requires checking multiple files."}
                   </p>
               </div>
               <div className="text-xs text-zinc-500 font-mono">
                   {dbType === 'sql' ? "Used in: PostgreSQL, MySQL" : "Used in: Cassandra, ScyllaDB, RocksDB"}
               </div>
           </div>
       </div>
    </div>
  );
};
