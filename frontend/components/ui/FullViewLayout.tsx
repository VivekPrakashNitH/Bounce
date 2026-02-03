import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { SidebarNav } from './SidebarNav';

interface Section {
    id: string;
    label: string;
}

interface FullViewLayoutProps {
    children: ReactNode;
    /** Title displayed in the header */
    title: string;
    /** Sections for the sidebar navigation */
    sections: Section[];
    /** Callback when exiting full view */
    onExit: () => void;
    /** Accent color for the sidebar */
    accentColor?: 'rose' | 'blue' | 'green' | 'purple' | 'orange';
    /** Whether to show a semi-transparent background pattern */
    showPattern?: boolean;
}

/**
 * A full-screen layout wrapper with sticky sidebar navigation.
 * 
 * Use this component to wrap level demos when in "full view" mode.
 * It provides:
 * - Full-screen container with scroll tracking
 * - Sticky sidebar navigation on the right
 * - Exit button to return to app mode
 * - Automatic section tracking based on scroll position
 * 
 * @example
 * ```tsx
 * <FullViewLayout
 *   title="Backend Languages"
 *   sections={[{ id: 'overview', label: 'Overview' }, ...]}
 *   onExit={() => setIsFullView(false)}
 * >
 *   <section className="min-h-screen">...</section>
 *   <section className="min-h-screen">...</section>
 * </FullViewLayout>
 * ```
 */
export const FullViewLayout: React.FC<FullViewLayoutProps> = ({
    children,
    title,
    sections,
    onExit,
    accentColor = 'rose',
    showPattern = true
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState(0);
    const [progressHeight, setProgressHeight] = useState(0);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

            // Calculate active section index
            const index = Math.round(scrollTop / clientHeight);
            setActiveSection(Math.min(index, sections.length - 1));

            // Calculate progress (0 to 100)
            const maxScroll = scrollHeight - clientHeight;
            const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
            setProgressHeight(progress);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [sections.length]);

    // Scroll to section
    const scrollToSection = (index: number) => {
        if (containerRef.current) {
            const height = containerRef.current.clientHeight;
            containerRef.current.scrollTo({
                top: index * height,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 md:px-8 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
                <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">{title}</h1>

                <button
                    onClick={onExit}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm"
                >
                    <Minimize2 size={16} />
                    <span className="hidden sm:inline">Exit Full View</span>
                </button>
            </div>

            {/* Background Pattern */}
            {showPattern && (
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            )}

            {/* Main Scrollable Content */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory custom-scrollbar"
            >
                {children}
            </div>

            {/* Sidebar Navigation */}
            <SidebarNav
                sections={sections}
                activeIndex={activeSection}
                onNavigate={scrollToSection}
                progressHeight={progressHeight}
                accentColor={accentColor}
                isVisible={true}
            />
        </div>
    );
};

/**
 * A button to toggle between app mode and full view mode.
 * Place this in your demo header.
 */
interface ExpandButtonProps {
    isExpanded: boolean;
    onToggle: () => void;
    className?: string;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({
    isExpanded,
    onToggle,
    className = ''
}) => {
    return (
        <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm ${className}`}
            title={isExpanded ? 'Exit Full View' : 'Expand to Full View'}
        >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
        </button>
    );
};

export default FullViewLayout;
