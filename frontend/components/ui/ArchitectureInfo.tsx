
import React from 'react';
import { CourseLevel } from '../../types';
import { Check, X, Globe, BookOpen } from 'lucide-react';

interface Props {
  level: CourseLevel;
}

export const ArchitectureInfo: React.FC<Props> = ({ level }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-2 sm:px-0 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Real World Uses */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 sm:p-6 backdrop-blur-sm">
        <h4 className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Globe size={16} /> Real World Scenarios
        </h4>
        <ul className="space-y-3">
          {level.realWorldUses?.map((use, i) => (
            <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
              {use}
            </li>
          )) || <li className="text-zinc-500 text-sm italic">No data available.</li>}
        </ul>
      </div>

      {/* Pros & Cons */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 sm:p-6 backdrop-blur-sm">
        <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen size={16} /> Trade-offs
        </h4>
        
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-green-500 block mb-2">PROS</span>
            <ul className="space-y-1">
              {level.pros?.map((pro, i) => (
                <li key={i} className="text-zinc-400 text-xs flex items-center gap-2">
                  <Check size={12} className="text-green-500" /> {pro}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-bold text-red-500 block mb-2">CONS</span>
             <ul className="space-y-1">
              {level.cons?.map((con, i) => (
                <li key={i} className="text-zinc-400 text-xs flex items-center gap-2">
                  <X size={12} className="text-red-500" /> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
