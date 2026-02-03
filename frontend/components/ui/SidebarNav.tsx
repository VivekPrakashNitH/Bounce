import React from 'react';

interface SidebarNavSection {
    id: string;
    label: string;
}

interface SidebarNavProps {
    sections: SidebarNavSection[];
    activeIndex: number;
    onNavigate: (index: number) => void;
    progressHeight: number;
    /** Accent color for active state (default: rose) */
    accentColor?: 'rose' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'teal' | 'sky' | 'yellow' | 'amber' | 'emerald' | 'indigo';
    /** Whether to show the component (usually tied to gate unlock state) */
    isVisible?: boolean;
}

const accentColors = {
    rose: {
        active: 'bg-rose-300 shadow-[0_0_12px_rgba(253,164,175,0.8)]',
        text: 'text-rose-300'
    },
    blue: {
        active: 'bg-blue-300 shadow-[0_0_12px_rgba(147,197,253,0.8)]',
        text: 'text-blue-300'
    },
    green: {
        active: 'bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]',
        text: 'text-emerald-300'
    },
    purple: {
        active: 'bg-purple-300 shadow-[0_0_12px_rgba(216,180,254,0.8)]',
        text: 'text-purple-300'
    },
    orange: {
        active: 'bg-orange-300 shadow-[0_0_12px_rgba(253,186,116,0.8)]',
        text: 'text-orange-300'
    },
    red: {
        active: 'bg-red-300 shadow-[0_0_12px_rgba(252,165,165,0.8)]',
        text: 'text-red-300'
    },
    cyan: {
        active: 'bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]',
        text: 'text-cyan-300'
    },
    teal: {
        active: 'bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.8)]',
        text: 'text-teal-300'
    },
    sky: {
        active: 'bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.8)]',
        text: 'text-sky-300'
    },
    yellow: {
        active: 'bg-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.8)]',
        text: 'text-yellow-300'
    },
    amber: {
        active: 'bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]',
        text: 'text-amber-300'
    },
    emerald: {
        active: 'bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]',
        text: 'text-emerald-300'
    },
    indigo: {
        active: 'bg-indigo-300 shadow-[0_0_12px_rgba(165,180,252,0.8)]',
        text: 'text-indigo-300'
    }
};

/**
 * A reusable sticky sidebar navigation component with scroll progress tracking.
 * 
 * Features:
 * - Active section highlighted in accent color
 * - Past sections (above active) in white
 * - Future sections (below active) in gray
 * - Animated progress bar
 * - Click to navigate to any section
 * 
 * @example
 * ```tsx
 * <SidebarNav
 *   sections={[{ id: 'intro', label: 'Introduction' }, { id: 'demo', label: 'Demo' }]}
 *   activeIndex={currentSection}
 *   onNavigate={(idx) => scrollToSection(idx)}
 *   progressHeight={scrollProgress}
 * />
 * ```
 */
export const SidebarNav: React.FC<SidebarNavProps> = ({
    sections,
    activeIndex,
    onNavigate,
    progressHeight,
    accentColor = 'rose',
    isVisible = true
}) => {
    const colors = accentColors[accentColor];

    return (
        <>
            {/* Desktop: Right side vertical navigation */}
            <div
                className={`fixed z-40 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    } right-4 md:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6`}
            >
                {/* Navigation Box Container */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-2xl relative">

                    {/* The "White Light" Progress Bar */}
                    <div className="absolute left-[26px] top-6 bottom-6 w-0.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="w-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] transition-all duration-300 ease-out"
                            style={{ height: `${progressHeight}%` }}
                        />
                    </div>

                    <div className="flex flex-col gap-6 relative z-10">
                        {sections.map((section, idx) => {
                            const isActive = activeIndex === idx;
                            const isPast = activeIndex > idx;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => onNavigate(idx)}
                                    className="group flex items-center gap-4 relative pl-1"
                                    aria-current={isActive ? 'step' : undefined}
                                >
                                    {/* Dot Indicator */}
                                    <div className={`
                      w-3 h-3 rounded-full transition-all duration-500 z-10 border border-slate-900
                      ${isActive
                                            ? `${colors.active} scale-125`
                                            : isPast
                                                ? 'bg-white scale-100 opacity-80'
                                                : 'bg-slate-700 scale-75'}
                    `} />

                                    <span className={`
                      text-xs font-bold tracking-wide uppercase transition-all duration-300 text-left
                      ${isActive
                                            ? `${colors.text} translate-x-1`
                                            : isPast
                                                ? 'text-slate-400 group-hover:text-slate-200'
                                                : 'text-slate-600 group-hover:text-slate-400'}
                    `}>
                                        {section.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile: Bottom horizontal navigation */}
            <div
                className={`fixed z-40 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    } bottom-4 left-1/2 -translate-x-1/2 lg:hidden flex flex-col items-center gap-2`}
            >
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 px-4 py-3 rounded-full flex items-center gap-3">
                    {/* Progress dots */}
                    <div className="flex items-center gap-2">
                        {sections.map((section, idx) => {
                            const isActive = activeIndex === idx;
                            const isPast = activeIndex > idx;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => onNavigate(idx)}
                                    className="p-1"
                                    aria-label={section.label}
                                    aria-current={isActive ? 'step' : undefined}
                                >
                                    <div className={`
                                        w-2 h-2 rounded-full transition-all duration-300
                                        ${isActive
                                            ? `${colors.active} scale-150`
                                            : isPast
                                                ? 'bg-white opacity-80'
                                                : 'bg-slate-600'}
                                    `} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Current section label */}
                    <div className="border-l border-slate-700 pl-3">
                        <span className={`text-xs font-bold tracking-wide ${colors.text}`}>
                            {sections[activeIndex]?.label || ''}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SidebarNav;
