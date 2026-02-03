'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface GameInstructionsProps {
    visible: boolean;
    onDismiss: () => void;
    onShow?: () => void;
    theme?: 'cyan' | 'purple' | 'rose' | 'green' | 'amber' | 'teal' | 'sky' | 'indigo' | 'orange' | 'violet';
    title?: string;
    subtitle?: string;
}

const themeColors = {
    cyan: {
        border: 'border-cyan-400/50',
        text: 'text-cyan-400',
        shadow: 'shadow-[0_0_40px_rgba(34,211,238,0.2)]'
    },
    purple: {
        border: 'border-purple-400/50',
        text: 'text-purple-400',
        shadow: 'shadow-[0_0_40px_rgba(168,85,247,0.2)]'
    },
    rose: {
        border: 'border-rose-400/50',
        text: 'text-rose-400',
        shadow: 'shadow-[0_0_40px_rgba(251,113,133,0.2)]'
    },
    green: {
        border: 'border-green-400/50',
        text: 'text-green-400',
        shadow: 'shadow-[0_0_40px_rgba(74,222,128,0.2)]'
    },
    amber: {
        border: 'border-amber-400/50',
        text: 'text-amber-400',
        shadow: 'shadow-[0_0_40px_rgba(251,191,36,0.2)]'
    },
    teal: {
        border: 'border-teal-400/50',
        text: 'text-teal-400',
        shadow: 'shadow-[0_0_40px_rgba(45,212,191,0.2)]'
    },
    sky: {
        border: 'border-sky-400/50',
        text: 'text-sky-400',
        shadow: 'shadow-[0_0_40px_rgba(56,189,248,0.2)]'
    },
    indigo: {
        border: 'border-indigo-400/50',
        text: 'text-indigo-400',
        shadow: 'shadow-[0_0_40px_rgba(129,140,248,0.2)]'
    },
    orange: {
        border: 'border-orange-400/50',
        text: 'text-orange-400',
        shadow: 'shadow-[0_0_40px_rgba(251,146,60,0.2)]'
    },
    violet: {
        border: 'border-violet-400/50',
        text: 'text-violet-400',
        shadow: 'shadow-[0_0_40px_rgba(139,92,246,0.2)]'
    }
};

export const GameInstructions: React.FC<GameInstructionsProps> = ({
    visible,
    onDismiss,
    onShow,
    theme = 'cyan',
    title = 'How to Play',
    subtitle = 'Use arrow keys to move. Bounce to enter the zone.'
}) => {
    const colors = themeColors[theme];

    if (!visible) {
        if (onShow) {
            return (
                <button
                    onClick={(e) => { e.stopPropagation(); onShow(); }}
                    className={`fixed top-24 right-6 z-30 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur border ${colors.border} rounded-full text-white text-xs font-bold shadow-lg hover:bg-slate-800 transition-all`}
                >
                    <HelpCircle size={14} className={colors.text} />
                    <span>Instructions</span>
                </button>
            );
        }
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500`}
            onClick={onDismiss}
        >
            <div
                className={`bg-slate-900 border-2 ${colors.border} rounded-2xl p-6 sm:p-10 max-w-md w-full mx-4 text-center ${colors.shadow}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{title}</h3>

                <p className="text-slate-300 text-sm sm:text-base mb-8">
                    Use <span className={`${colors.text} font-semibold`}>arrow keys</span> {subtitle}
                </p>

                {/* Arrow Key Icons */}
                <div className="grid grid-cols-3 gap-3 mb-8 max-w-xs mx-auto">
                    {/* Left */}
                    <div className="flex justify-center">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center ${colors.text} font-bold text-lg`}>
                            ⬅️
                        </div>
                    </div>

                    {/* Up */}
                    <div className="flex justify-center">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center ${colors.text} font-bold text-lg`}>
                            ⬆️
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex justify-center">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center ${colors.text} font-bold text-lg`}>
                            ➡️
                        </div>
                    </div>

                    {/* Down - centered below */}
                    <div className="flex justify-center col-start-2">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center ${colors.text} font-bold text-lg`}>
                            ⬇️
                        </div>
                    </div>
                </div>

                <p className="text-slate-500 text-xs sm:text-sm font-mono">
                    Press Space or Enter to continue
                </p>
            </div>
        </div>
    );
};

export default GameInstructions;
