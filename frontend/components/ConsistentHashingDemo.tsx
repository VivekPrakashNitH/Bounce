
import React, { useState, useEffect } from 'react';
import { Circle, Server, Database, Plus, Minus, Code2 } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const ConsistentHashingDemo: React.FC<Props> = ({ onShowCode }) => {
  const [nodes, setNodes] = useState([0, 120, 240]); // Angles on the circle
  const [keys, setKeys] = useState<number[]>([]); 

  useEffect(() => {
      // Seed random keys
      const initialKeys = Array.from({length: 12}, () => Math.floor(Math.random() * 360));
      setKeys(initialKeys);
  }, []);

  const addNode = () => {
      // Add node at random angle
      const angle = Math.floor(Math.random() * 360);
      setNodes(prev => [...prev, angle].sort((a,b) => a-b));
  };

  const removeNode = () => {
      if (nodes.length <= 1) return;
      const r = Math.floor(Math.random() * nodes.length);
      setNodes(prev => prev.filter((_, i) => i !== r));
  };

  // Helper to find owner of a key (next clockwise node)
  const getOwner = (keyAngle: number) => {
      const owner = nodes.find(n => n >= keyAngle);
      return owner !== undefined ? owner : nodes[0];
  };

  // Colors for nodes
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-purple-400 flex items-center gap-2">
                <Database /> Consistent Hashing Ring
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Code
            </button>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-8 h-80">
           
           {/* Visualizer */}
           <div className="col-span-1 flex items-center justify-center relative">
               {/* Ring */}
               <div className="w-64 h-64 border-4 border-slate-700 rounded-full relative">
                   
                   {/* Nodes */}
                   {nodes.map((angle, i) => (
                       <div 
                         key={angle}
                         className="absolute w-8 h-8 -ml-4 -mt-4 bg-slate-900 border-2 rounded-full flex items-center justify-center z-20 transition-all duration-500"
                         style={{ 
                             left: `${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}%`, 
                             top: `${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%`,
                             borderColor: colors[i % colors.length]
                         }}
                       >
                           <Server size={14} style={{ color: colors[i % colors.length] }} />
                       </div>
                   ))}

                   {/* Keys */}
                   {keys.map((k, i) => {
                       const owner = getOwner(k);
                       const colorIdx = nodes.indexOf(owner);
                       return (
                           <div 
                             key={i}
                             className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full z-10 transition-colors duration-500"
                             style={{ 
                                 left: `${50 + 42 * Math.cos((k - 90) * Math.PI / 180)}%`, 
                                 top: `${50 + 42 * Math.sin((k - 90) * Math.PI / 180)}%`,
                                 backgroundColor: colors[colorIdx % colors.length]
                             }}
                           ></div>
                       );
                   })}

               </div>
           </div>

           {/* Controls & Explanation */}
           <div className="col-span-1 flex flex-col justify-center">
               <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
                   <h4 className="text-sm font-bold text-white mb-2">Why use this?</h4>
                   <p className="text-xs text-slate-400 leading-relaxed">
                       In standard hashing (Hash % N), adding a server changes N, forcing <b>ALL</b> keys to move. 
                       <br/><br/>
                       In <b>Consistent Hashing</b>, keys map to the nearest clockwise node. Adding a node only takes keys from its neighbor. 
                       <br/>
                       <span className="text-green-400 font-bold">Try adding a node and watch how few dots change color!</span>
                   </p>
               </div>

               <div className="flex gap-4">
                   <button onClick={addNode} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded font-bold flex items-center justify-center gap-2">
                       <Plus size={16} /> Add Node
                   </button>
                   <button onClick={removeNode} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded font-bold flex items-center justify-center gap-2">
                       <Minus size={16} /> Remove Node
                   </button>
               </div>
               
               <div className="mt-4 text-center text-xs text-slate-500">
                   Nodes: {nodes.length} | Keys: {keys.length}
               </div>
           </div>

       </div>
    </div>
  );
};
