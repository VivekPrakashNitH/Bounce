'use client';

import React from 'react';

export type AccentColor = 'rose' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'teal' | 'sky' | 'yellow' | 'amber' | 'emerald' | 'indigo' | 'gray';

const buttonGradients: Record<AccentColor, string> = {
    rose: 'from-rose-500 to-pink-600',
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-violet-600',
    orange: 'from-orange-500 to-amber-600',
    red: 'from-red-500 to-rose-600',
    cyan: 'from-cyan-500 to-blue-600',
    teal: 'from-teal-500 to-cyan-600',
    sky: 'from-sky-500 to-blue-600',
    yellow: 'from-yellow-500 to-amber-600',
    amber: 'from-amber-500 to-orange-600',
    emerald: 'from-emerald-500 to-green-600',
    indigo: 'from-indigo-500 to-purple-600',
    gray: 'from-gray-500 to-slate-600',
};

const buttonShadows: Record<AccentColor, string> = {
    rose: 'shadow-[0_0_20px_rgba(251,113,133,0.5)] hover:shadow-[0_0_30px_rgba(251,113,133,0.8)]',
    blue: 'shadow-[0_0_20px_rgba(96,165,250,0.5)] hover:shadow-[0_0_30px_rgba(96,165,250,0.8)]',
    green: 'shadow-[0_0_20px_rgba(74,222,128,0.5)] hover:shadow-[0_0_30px_rgba(74,222,128,0.8)]',
    purple: 'shadow-[0_0_20px_rgba(192,132,252,0.5)] hover:shadow-[0_0_30px_rgba(192,132,252,0.8)]',
    orange: 'shadow-[0_0_20px_rgba(251,146,60,0.5)] hover:shadow-[0_0_30px_rgba(251,146,60,0.8)]',
    red: 'shadow-[0_0_20px_rgba(248,113,113,0.5)] hover:shadow-[0_0_30px_rgba(248,113,113,0.8)]',
    cyan: 'shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)]',
    teal: 'shadow-[0_0_20px_rgba(45,212,191,0.5)] hover:shadow-[0_0_30px_rgba(45,212,191,0.8)]',
    sky: 'shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:shadow-[0_0_30px_rgba(56,189,248,0.8)]',
    yellow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.8)]',
    amber: 'shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.8)]',
    emerald: 'shadow-[0_0_20px_rgba(52,211,153,0.5)] hover:shadow-[0_0_30px_rgba(52,211,153,0.8)]',
    indigo: 'shadow-[0_0_20px_rgba(129,140,248,0.5)] hover:shadow-[0_0_30px_rgba(129,140,248,0.8)]',
    gray: 'shadow-[0_0_20px_rgba(156,163,175,0.5)] hover:shadow-[0_0_30px_rgba(156,163,175,0.8)]',
};

interface GearButtonProps {
    onClick: () => void;
    accentColor?: AccentColor;
    isAnimated?: boolean;
}

/**
 * Floating gear button that opens the "How This Page Was Made" modal.
 * Positioned fixed at bottom-right with accent color glow.
 */
export const GearButton: React.FC<GearButtonProps> = ({
    onClick,
    accentColor = 'cyan',
    isAnimated = true,
}) => {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${buttonGradients[accentColor]} rounded-full ${buttonShadows[accentColor]} flex items-center justify-center transition-all ${isAnimated ? 'animate-bounce' : ''}`}
            title="How this page was made"
        >
            <span className="text-xl sm:text-2xl">⚙️</span>
        </button>
    );
};

export default GearButton;
