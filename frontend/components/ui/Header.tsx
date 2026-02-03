import React from 'react';
import { Code2 } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

export type AccentColor = 'rose' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'teal' | 'sky' | 'yellow' | 'amber' | 'emerald' | 'indigo' | 'gray';

interface Section {
  name?: string;
  label?: string;
  id: string;
}

const progressBarColors: Record<AccentColor, string> = {
  rose: 'from-rose-400 to-pink-500',
  blue: 'from-blue-400 to-indigo-500',
  green: 'from-green-400 to-emerald-500',
  purple: 'from-purple-400 to-violet-500',
  orange: 'from-orange-400 to-amber-500',
  red: 'from-red-400 to-rose-500',
  cyan: 'from-cyan-400 to-blue-500',
  teal: 'from-teal-400 to-cyan-500',
  sky: 'from-sky-400 to-blue-500',
  yellow: 'from-yellow-400 to-amber-500',
  amber: 'from-amber-400 to-orange-500',
  emerald: 'from-emerald-400 to-green-500',
  indigo: 'from-indigo-400 to-purple-500',
  gray: 'from-gray-400 to-slate-500',
};

const sectionColors: Record<AccentColor, { active: string; past: string }> = {
  rose: { active: 'bg-rose-400', past: 'bg-rose-400' },
  blue: { active: 'bg-blue-400', past: 'bg-blue-400' },
  green: { active: 'bg-green-400', past: 'bg-green-400' },
  purple: { active: 'bg-purple-400', past: 'bg-purple-400' },
  orange: { active: 'bg-orange-400', past: 'bg-orange-400' },
  red: { active: 'bg-red-400', past: 'bg-red-400' },
  cyan: { active: 'bg-cyan-400', past: 'bg-cyan-400' },
  teal: { active: 'bg-teal-400', past: 'bg-teal-400' },
  sky: { active: 'bg-sky-400', past: 'bg-sky-400' },
  yellow: { active: 'bg-yellow-400', past: 'bg-yellow-400' },
  amber: { active: 'bg-amber-400', past: 'bg-amber-400' },
  emerald: { active: 'bg-emerald-400', past: 'bg-emerald-400' },
  indigo: { active: 'bg-indigo-400', past: 'bg-indigo-400' },
  gray: { active: 'bg-gray-400', past: 'bg-gray-400' },
};

const levelCodeColors: Record<AccentColor, string> = {
  rose: 'text-rose-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  cyan: 'text-cyan-400',
  teal: 'text-teal-400',
  sky: 'text-sky-400',
  yellow: 'text-yellow-400',
  amber: 'text-amber-400',
  emerald: 'text-emerald-400',
  indigo: 'text-indigo-400',
  gray: 'text-gray-400',
};

interface HeaderProps {
  scrollProgress: number;
  currentSection: number;
  sections: Section[];
  onShowCode: () => void;
  /** Page title, e.g., "Client-Server Model" */
  title?: string;
  /** Level code, e.g., "L1", "G01" */
  levelCode?: string;
  /** Accent color for progress bar and indicators */
  accentColor?: AccentColor;
}

/**
 * Reusable sticky header component with scroll progress tracking.
 * Displays title, level code, progress bar, and section indicators.
 */
export const Header: React.FC<HeaderProps> = ({
  scrollProgress,
  currentSection,
  sections,
  onShowCode,
  title = 'Learning Module',
  levelCode,
  accentColor = 'cyan',
}) => {
  // Calculate avatar movement: starts at 0%, moves right as scroll progresses
  const avatarTranslateX = (scrollProgress / 100) * 40; // Max 40px translation
  const avatarRotation = (scrollProgress / 100) * 360; // Full rotation by end

  const progressGradient = progressBarColors[accentColor];
  const sectionColor = sectionColors[accentColor];
  const levelCodeColor = levelCodeColors[accentColor];

  return (
    <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 sm:px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            style={{
              transform: `translateX(${avatarTranslateX}px) rotate(${avatarRotation}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            {/* <BounceAvatar className="w-6 h-6 sm:w-8 sm:h-8" /> */}
          </div>
          <div>
            {levelCode && (
              <h1 className={`text-xs sm:text-sm font-mono ${levelCodeColor}`}>{levelCode}</h1>
            )}
            <h2 className="text-sm sm:text-lg font-semibold text-white">{title}</h2>
          </div>
        </div>
        <button
          onClick={onShowCode}
          className={`flex items-center gap-1 text-[10px] sm:text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 sm:px-3 py-1.5 rounded ${levelCodeColor} transition-colors`}
        >
          <Code2 size={14} /> Code
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
            {Math.round(scrollProgress)}%
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
            {sections[currentSection]?.name || sections[currentSection]?.label}
          </span>
        </div>

        {/* Main Progress Bar with Rolling Ball */}
        <div className="relative w-full h-4 mb-3">
          {/* Progress Bar Track */}
          <div className="absolute top-1.5 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${progressGradient} transition-all duration-300`}
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          {/* Rolling Ball */}
          <div
            className="absolute top-0 w-4 h-4 transition-all duration-200 ease-out"
            style={{ left: `calc(${scrollProgress}% - 8px)` }}
          >
            <div style={{ transform: `rotate(${(scrollProgress / 100) * 720}deg)`, transition: 'transform 0.1s linear' }}>
              <BounceAvatar className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Section Indicators */}
        <div className="flex gap-1 w-full">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${idx < currentSection
                ? sectionColor.past
                : idx === currentSection
                  ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                  : 'bg-slate-700'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
