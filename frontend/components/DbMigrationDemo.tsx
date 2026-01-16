
import React, { useState } from 'react';
import { GitBranch, Database, ArrowUp, ArrowDown, FileText, Code2 } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const DbMigrationDemo: React.FC<Props> = ({ onShowCode }) => {
  const [version, setVersion] = useState(1);
  const maxVersion = 3;

  const versions = [
      { id: 1, hash: 'a1b2', desc: 'create_users_table', schema: ['id: int', 'username: varchar'] },
      { id: 2, hash: 'c3d4', desc: 'add_email_column', schema: ['id: int', 'username: varchar', 'email: varchar'] },
      { id: 3, hash: 'e5f6', desc: 'create_posts_table', schema: ['id: int', 'username: varchar', 'email: varchar', 'posts_table (new)'] }
  ];

  const current = versions[version - 1];

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-cyan-400 flex items-center gap-2">
                <GitBranch /> Database Migrations (Alembic)
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Python
            </button>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-12 h-64">
           
           {/* Timeline Control */}
           <div className="col-span-1 flex flex-col justify-center gap-4 relative pl-8 border-r border-slate-700">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 rounded-full"></div>
               
               {versions.map((v) => (
                   <div key={v.id} className={`relative flex items-center gap-4 transition-all duration-300 ${version === v.id ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                       <div className={`w-4 h-4 rounded-full border-2 z-10 ${version === v.id ? 'bg-cyan-500 border-cyan-300' : 'bg-slate-800 border-slate-600'} -ml-[10px]`}></div>
                       <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex-1">
                           <div className="flex justify-between items-center mb-1">
                               <span className="text-xs font-mono text-cyan-400">{v.hash}</span>
                               <span className="text-[10px] text-slate-500">Rev {v.id}</span>
                           </div>
                           <div className="text-sm font-bold text-white">{v.desc}</div>
                       </div>
                   </div>
               ))}
           </div>

           {/* Current Schema State */}
           <div className="col-span-1 flex flex-col justify-between">
               <div className="bg-[#1e1e1e] p-6 rounded-xl border border-slate-700 shadow-xl flex-1 flex flex-col relative overflow-hidden">
                   <div className="absolute top-2 right-2 text-slate-600">
                       <Database size={64} opacity={0.1} />
                   </div>
                   <h4 className="text-slate-400 text-xs font-bold uppercase mb-4">Current Database Schema</h4>
                   <div className="space-y-2 font-mono text-sm text-green-300">
                       {current.schema.map((field, i) => (
                           <div key={i} className="animate-in slide-in-from-left-2 fade-in duration-300">
                               {field}
                           </div>
                       ))}
                   </div>
               </div>

               <div className="flex gap-4 mt-6">
                   <button 
                     onClick={() => setVersion(Math.max(1, version - 1))}
                     disabled={version === 1}
                     className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white py-2 rounded font-bold flex items-center justify-center gap-2"
                   >
                       <ArrowDown size={16} /> Downgrade
                   </button>
                   <button 
                     onClick={() => setVersion(Math.min(maxVersion, version + 1))}
                     disabled={version === maxVersion}
                     className="flex-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white py-2 rounded font-bold flex items-center justify-center gap-2"
                   >
                       <ArrowUp size={16} /> Upgrade
                   </button>
               </div>
           </div>

       </div>
    </div>
  );
};
