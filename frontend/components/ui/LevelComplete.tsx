'use client';

import React from 'react';

export type AccentColor = 'rose' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'teal' | 'sky' | 'yellow' | 'amber' | 'emerald' | 'indigo' | 'gray';

const accentStyles: Record<AccentColor, {
    ballGradient: string;
    ballShadow: string;
    text: string;
    achievementBg: string;
    achievementBorder: string;
}> = {
    rose: { ballGradient: 'from-rose-400 to-pink-500', ballShadow: 'shadow-[0_0_40px_rgba(251,113,133,0.8)]', text: 'text-rose-400', achievementBg: 'bg-rose-950/20', achievementBorder: 'border-rose-900/30' },
    blue: { ballGradient: 'from-blue-400 to-indigo-500', ballShadow: 'shadow-[0_0_40px_rgba(96,165,250,0.8)]', text: 'text-blue-400', achievementBg: 'bg-blue-950/20', achievementBorder: 'border-blue-900/30' },
    green: { ballGradient: 'from-green-400 to-emerald-500', ballShadow: 'shadow-[0_0_40px_rgba(74,222,128,0.8)]', text: 'text-green-400', achievementBg: 'bg-green-950/20', achievementBorder: 'border-green-900/30' },
    purple: { ballGradient: 'from-purple-400 to-violet-500', ballShadow: 'shadow-[0_0_40px_rgba(192,132,252,0.8)]', text: 'text-purple-400', achievementBg: 'bg-purple-950/20', achievementBorder: 'border-purple-900/30' },
    orange: { ballGradient: 'from-orange-400 to-amber-500', ballShadow: 'shadow-[0_0_40px_rgba(251,146,60,0.8)]', text: 'text-orange-400', achievementBg: 'bg-orange-950/20', achievementBorder: 'border-orange-900/30' },
    red: { ballGradient: 'from-red-400 to-rose-500', ballShadow: 'shadow-[0_0_40px_rgba(248,113,113,0.8)]', text: 'text-red-400', achievementBg: 'bg-red-950/20', achievementBorder: 'border-red-900/30' },
    cyan: { ballGradient: 'from-cyan-400 to-blue-500', ballShadow: 'shadow-[0_0_40px_rgba(34,211,238,0.8)]', text: 'text-cyan-400', achievementBg: 'bg-cyan-950/20', achievementBorder: 'border-cyan-900/30' },
    teal: { ballGradient: 'from-teal-400 to-cyan-500', ballShadow: 'shadow-[0_0_40px_rgba(45,212,191,0.8)]', text: 'text-teal-400', achievementBg: 'bg-teal-950/20', achievementBorder: 'border-teal-900/30' },
    sky: { ballGradient: 'from-sky-400 to-blue-500', ballShadow: 'shadow-[0_0_40px_rgba(56,189,248,0.8)]', text: 'text-sky-400', achievementBg: 'bg-sky-950/20', achievementBorder: 'border-sky-900/30' },
    yellow: { ballGradient: 'from-yellow-400 to-amber-500', ballShadow: 'shadow-[0_0_40px_rgba(250,204,21,0.8)]', text: 'text-yellow-400', achievementBg: 'bg-yellow-950/20', achievementBorder: 'border-yellow-900/30' },
    amber: { ballGradient: 'from-amber-400 to-orange-500', ballShadow: 'shadow-[0_0_40px_rgba(251,191,36,0.8)]', text: 'text-amber-400', achievementBg: 'bg-amber-950/20', achievementBorder: 'border-amber-900/30' },
    emerald: { ballGradient: 'from-emerald-400 to-green-500', ballShadow: 'shadow-[0_0_40px_rgba(52,211,153,0.8)]', text: 'text-emerald-400', achievementBg: 'bg-emerald-950/20', achievementBorder: 'border-emerald-900/30' },
    indigo: { ballGradient: 'from-indigo-400 to-purple-500', ballShadow: 'shadow-[0_0_40px_rgba(129,140,248,0.8)]', text: 'text-indigo-400', achievementBg: 'bg-indigo-950/20', achievementBorder: 'border-indigo-900/30' },
    gray: { ballGradient: 'from-gray-400 to-slate-500', ballShadow: 'shadow-[0_0_40px_rgba(156,163,175,0.8)]', text: 'text-gray-400', achievementBg: 'bg-gray-950/20', achievementBorder: 'border-gray-900/30' },
};

interface LevelCompleteProps {
    /** Controls visibility - typically tied to scroll progress */
    isVisible: boolean;
    /** Main title, e.g., "Level Complete" */
    title: string;
    /** Subtitle showing what was mastered, e.g., "Client-Server Model Mastered" */
    subtitle: string;
    /** Summary description of what was learned */
    summary: string;
    /** List of achievements/learnings */
    learnings: string[];
    /** Accent color for styling */
    accentColor?: AccentColor;
    /** Callback for "Next Level" button */
    onNextLevel?: () => void;
    /** Next level label */
    nextLevelLabel?: string;
}

/**
 * Level completion component - displays as an INLINE section (not overlay).
 * This allows the Discussion section to appear below it naturally.
 */
export const LevelComplete: React.FC<LevelCompleteProps> = ({
    isVisible,
    title,
    subtitle,
    summary,
    learnings,
    accentColor = 'cyan',
    onNextLevel,
    nextLevelLabel = 'Next Level',
}) => {
    if (!isVisible) return null;

    const styles = accentStyles[accentColor];

    return (
        <section
            id="level-complete"
            className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-16 bg-gradient-to-b from-slate-950/50 via-slate-900/30 to-slate-950/50"
        >
            <div className="max-w-md text-center">
                {/* Spinning Ball */}
                <div className="mb-8 flex justify-center">
                    <div
                        className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${styles.ballGradient} rounded-full ${styles.ballShadow} flex items-center justify-center animate-spin`}
                        style={{ animationDuration: '2s' }}
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/30" />
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    {title}
                </h2>

                <p className={`text-lg sm:text-xl ${styles.text} font-semibold mb-6`}>
                    {subtitle}
                </p>

                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 sm:p-6 mb-8">
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {summary}
                    </p>
                </div>

                {/* Achievements */}
                {learnings.length > 0 && (
                    <div className="space-y-2 mb-8">
                        <p className="text-slate-400 text-sm font-mono mb-3">What You Learned:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {learnings.map((learning, idx) => (
                                <div
                                    key={idx}
                                    className={`text-xs text-left ${styles.achievementBg} border ${styles.achievementBorder} rounded p-2`}
                                >
                                    ✓ {learning}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Next Level Button */}
                {onNextLevel && (
                    <button
                        onClick={onNextLevel}
                        className={`px-8 py-3 bg-gradient-to-r ${styles.ballGradient} hover:brightness-110 text-white font-bold rounded-xl ${styles.ballShadow} transition-all transform hover:scale-105`}
                    >
                        {nextLevelLabel}
                    </button>
                )}
            </div>
        </section>
    );
};

export default LevelComplete;
