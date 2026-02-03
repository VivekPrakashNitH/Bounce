'use client';

import React from 'react';

// Accent color palette (shared with SidebarNav)
export type AccentColor = 'rose' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'teal' | 'sky' | 'yellow' | 'amber' | 'emerald' | 'indigo' | 'gray';

const accentColors: Record<AccentColor, {
    border: string;
    shadow: string;
    text: string;
    textMuted: string;
    bg: string;
    bgGradient: string;
    button: string;
    buttonHover: string;
}> = {
    rose: { border: 'border-rose-400', shadow: 'shadow-[0_0_40px_rgba(251,113,133,0.3)]', text: 'text-rose-400', textMuted: 'text-rose-300', bg: 'bg-rose-900/30', bgGradient: 'from-rose-950/30 to-pink-950/30', button: 'bg-rose-600', buttonHover: 'hover:bg-rose-500' },
    blue: { border: 'border-blue-400', shadow: 'shadow-[0_0_40px_rgba(96,165,250,0.3)]', text: 'text-blue-400', textMuted: 'text-blue-300', bg: 'bg-blue-900/30', bgGradient: 'from-blue-950/30 to-indigo-950/30', button: 'bg-blue-600', buttonHover: 'hover:bg-blue-500' },
    green: { border: 'border-green-400', shadow: 'shadow-[0_0_40px_rgba(74,222,128,0.3)]', text: 'text-green-400', textMuted: 'text-green-300', bg: 'bg-green-900/30', bgGradient: 'from-green-950/30 to-emerald-950/30', button: 'bg-green-600', buttonHover: 'hover:bg-green-500' },
    purple: { border: 'border-purple-400', shadow: 'shadow-[0_0_40px_rgba(192,132,252,0.3)]', text: 'text-purple-400', textMuted: 'text-purple-300', bg: 'bg-purple-900/30', bgGradient: 'from-purple-950/30 to-violet-950/30', button: 'bg-purple-600', buttonHover: 'hover:bg-purple-500' },
    orange: { border: 'border-orange-400', shadow: 'shadow-[0_0_40px_rgba(251,146,60,0.3)]', text: 'text-orange-400', textMuted: 'text-orange-300', bg: 'bg-orange-900/30', bgGradient: 'from-orange-950/30 to-amber-950/30', button: 'bg-orange-600', buttonHover: 'hover:bg-orange-500' },
    red: { border: 'border-red-400', shadow: 'shadow-[0_0_40px_rgba(248,113,113,0.3)]', text: 'text-red-400', textMuted: 'text-red-300', bg: 'bg-red-900/30', bgGradient: 'from-red-950/30 to-rose-950/30', button: 'bg-red-600', buttonHover: 'hover:bg-red-500' },
    cyan: { border: 'border-cyan-400', shadow: 'shadow-[0_0_40px_rgba(34,211,238,0.3)]', text: 'text-cyan-400', textMuted: 'text-cyan-300', bg: 'bg-cyan-900/30', bgGradient: 'from-cyan-950/30 to-blue-950/30', button: 'bg-cyan-600', buttonHover: 'hover:bg-cyan-500' },
    teal: { border: 'border-teal-400', shadow: 'shadow-[0_0_40px_rgba(45,212,191,0.3)]', text: 'text-teal-400', textMuted: 'text-teal-300', bg: 'bg-teal-900/30', bgGradient: 'from-teal-950/30 to-cyan-950/30', button: 'bg-teal-600', buttonHover: 'hover:bg-teal-500' },
    sky: { border: 'border-sky-400', shadow: 'shadow-[0_0_40px_rgba(56,189,248,0.3)]', text: 'text-sky-400', textMuted: 'text-sky-300', bg: 'bg-sky-900/30', bgGradient: 'from-sky-950/30 to-blue-950/30', button: 'bg-sky-600', buttonHover: 'hover:bg-sky-500' },
    yellow: { border: 'border-yellow-400', shadow: 'shadow-[0_0_40px_rgba(250,204,21,0.3)]', text: 'text-yellow-400', textMuted: 'text-yellow-300', bg: 'bg-yellow-900/30', bgGradient: 'from-yellow-950/30 to-amber-950/30', button: 'bg-yellow-600', buttonHover: 'hover:bg-yellow-500' },
    amber: { border: 'border-amber-400', shadow: 'shadow-[0_0_40px_rgba(251,191,36,0.3)]', text: 'text-amber-400', textMuted: 'text-amber-300', bg: 'bg-amber-900/30', bgGradient: 'from-amber-950/30 to-yellow-950/30', button: 'bg-amber-600', buttonHover: 'hover:bg-amber-500' },
    emerald: { border: 'border-emerald-400', shadow: 'shadow-[0_0_40px_rgba(52,211,153,0.3)]', text: 'text-emerald-400', textMuted: 'text-emerald-300', bg: 'bg-emerald-900/30', bgGradient: 'from-emerald-950/30 to-green-950/30', button: 'bg-emerald-600', buttonHover: 'hover:bg-emerald-500' },
    indigo: { border: 'border-indigo-400', shadow: 'shadow-[0_0_40px_rgba(129,140,248,0.3)]', text: 'text-indigo-400', textMuted: 'text-indigo-300', bg: 'bg-indigo-900/30', bgGradient: 'from-indigo-950/30 to-purple-950/30', button: 'bg-indigo-600', buttonHover: 'hover:bg-indigo-500' },
    gray: { border: 'border-gray-400', shadow: 'shadow-[0_0_40px_rgba(156,163,175,0.3)]', text: 'text-gray-400', textMuted: 'text-gray-300', bg: 'bg-gray-900/30', bgGradient: 'from-gray-950/30 to-slate-950/30', button: 'bg-gray-600', buttonHover: 'hover:bg-gray-500' },
};

interface SectionInfo {
    label: string;
    description: string;
}

interface PageMadeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    levelCode: string;
    icon: string;
    description: string;
    sections: SectionInfo[];
    accentColor?: AccentColor;
    learningSummary: string;
}

/**
 * Reusable modal component for "How This Page Was Made" feature.
 * Shows page architecture overview with sections list.
 */
export const PageMadeModal: React.FC<PageMadeModalProps> = ({
    isOpen,
    onClose,
    title,
    levelCode,
    icon,
    description,
    sections,
    accentColor = 'cyan',
    learningSummary,
}) => {
    if (!isOpen) return null;

    const colors = accentColors[accentColor];

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
            <div className={`bg-slate-900 border-2 ${colors.border} rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto ${colors.shadow}`}>
                {/* Header */}
                <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                        <p className={`${colors.text} text-xs font-mono mt-1`}>{levelCode} — {title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Architecture Overview */}
                    <div>
                        <h4 className={`${colors.text} font-bold mb-4 flex items-center gap-2`}>
                            <span className="text-xl">{icon}</span> Page Architecture
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">{description}</p>

                        {/* Sections Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {sections.map((section, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-slate-800/40 border ${colors.bg.replace('bg-', 'border-').replace('/30', '/20')} rounded-lg p-3`}
                                >
                                    <p className={`${colors.textMuted} font-mono text-xs font-bold mb-1`}>
                                        Section {idx + 1}: {section.label}
                                    </p>
                                    <p className="text-slate-400 text-xs">{section.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Learning Summary */}
                    <div className={`bg-gradient-to-r ${colors.bgGradient} border ${colors.bg.replace('bg-', 'border-').replace('/30', '/50')} rounded-lg p-4`}>
                        <p className={`${colors.text} font-semibold mb-2`}>You Now Know</p>
                        <p className="text-slate-300 text-sm">{learningSummary}</p>
                        <button
                            onClick={onClose}
                            className={`mt-4 px-4 py-2 ${colors.button} ${colors.buttonHover} text-white text-sm font-bold rounded-lg transition-colors`}
                        >
                            Ready to Learn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageMadeModal;
