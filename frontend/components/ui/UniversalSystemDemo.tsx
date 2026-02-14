
import React from 'react';
import { CourseLevel } from '../../types';
import { Network, Code2, BookOpen } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';
import { ArchitectureInfo } from './ArchitectureInfo';

interface Props {
  level: CourseLevel;
  onShowCode: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const UniversalSystemDemo: React.FC<Props> = ({ level, onShowCode, onProgress }) => {
  React.useEffect(() => {
    if (onProgress) {
      onProgress({ sectionIndex: 0, totalSections: 1 });
    }
  }, [onProgress]);
  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-0">
      <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-700 shadow-2xl relative flex flex-col items-center text-center">

        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
            <h3 className="text-sm sm:text-xl font-mono text-white flex items-center gap-2">
              <Network className="text-cyan-400" size={16} /> {level.title}
            </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
              <Code2 size={14} /> Show Code
            </button>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded uppercase">{level.category}</span>
          </div>
        </div>

        {/* Dynamic Concept Visualization Area (Placeholder for Generic Topics) */}
        <div className="w-full h-auto sm:h-64 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-white/[0.05]" />

          <div className="z-10 bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-600 shadow-2xl max-w-lg">
            <BookOpen size={32} className="text-cyan-500 mx-auto mb-4 sm:hidden" />
            <BookOpen size={48} className="text-cyan-500 mx-auto mb-4 hidden sm:block" />
            <h4 className="text-sm sm:text-lg font-bold text-white mb-2">Concept Visualization</h4>
            <p className="text-slate-400 text-sm">
              {level.description}
            </p>
          </div>

          {/* Decorative Nodes */}
          <div className="absolute top-10 left-10 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>

        <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 w-full">
          {level.topics.map((t, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 p-2 sm:p-3 rounded text-[10px] sm:text-xs text-slate-300 font-mono">
              {t}
            </div>
          ))}
        </div>

      </div>

      <ArchitectureInfo level={level} />

    </div>
  );
};
