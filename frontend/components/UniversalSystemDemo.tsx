
import React, { useState, useEffect } from 'react';
import { CourseLevel } from '../types';
import { Network, Code2, BookOpen } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';
import { ArchitectureInfo } from './ArchitectureInfo';

interface Props {
  level: CourseLevel;
  onShowCode: () => void;
}

export const UniversalSystemDemo: React.FC<Props> = ({ level, onShowCode }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl ${isMobile ? 'p-4' : 'p-8'} border border-slate-700 shadow-2xl relative flex flex-col items-center text-center`}>
       
       {/* Header */}
       <div className={`w-full flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'} border-b border-slate-700 ${isMobile ? 'pb-3 mb-4' : 'pb-4 mb-8'}`}>
          <div className="flex items-center gap-3">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-mono text-white flex items-center gap-2`}>
                <Network className="text-cyan-400" size={isMobile ? 16 : 20} /> {level.title}
             </h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={onShowCode} className={`flex items-center gap-1 ${isMobile ? 'text-[10px] px-2 py-1' : 'text-xs px-3 py-1'} bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-cyan-400 transition-colors`}>
                <Code2 size={isMobile ? 10 : 14} /> Show Code
            </button>
            <span className={`${isMobile ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'} text-slate-400 bg-slate-800 rounded uppercase`}>{level.category}</span>
          </div>
        </div>

        {/* Dynamic Concept Visualization Area (Placeholder for Generic Topics) */}
        <div className={`w-full ${isMobile ? 'h-48' : 'h-64'} bg-slate-800/50 rounded-xl border border-slate-700 border-dashed flex flex-col items-center justify-center ${isMobile ? 'p-4' : 'p-8'} relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-grid-white/[0.05]" />
            
            <div className={`z-10 bg-slate-900 ${isMobile ? 'p-4' : 'p-6'} rounded-2xl border border-slate-600 shadow-2xl max-w-lg`}>
                <BookOpen size={isMobile ? 32 : 48} className="text-cyan-500 mx-auto mb-3" />
                <h4 className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-white mb-2`}>Concept Visualization</h4>
                <p className={`text-slate-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                   {level.description}
                </p>
            </div>

            {/* Decorative Nodes */}
            <div className={`absolute top-10 left-10 ${isMobile ? 'w-10 h-10' : 'w-16 h-16'} bg-blue-500/10 rounded-full blur-xl animate-pulse`}></div>
            <div className={`absolute bottom-10 right-10 ${isMobile ? 'w-14 h-14' : 'w-24 h-24'} bg-purple-500/10 rounded-full blur-xl animate-pulse delay-700`}></div>
        </div>

        <div className={`${isMobile ? 'mt-4' : 'mt-8'} grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-4 gap-4'} w-full`}>
            {level.topics.map((t, i) => (
                <div key={i} className={`bg-slate-800 border border-slate-700 ${isMobile ? 'p-2' : 'p-3'} rounded ${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-300 font-mono`}>
                   {t}
                </div>
            ))}
        </div>

    </div>
    
    <ArchitectureInfo level={level} />

    </div>
  );
};
