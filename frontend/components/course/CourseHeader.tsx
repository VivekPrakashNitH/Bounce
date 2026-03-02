import React from 'react';
import { Map, X, GraduationCap, Home, User } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface CourseHeaderProps {
    trackId: string;
    trackLabel: string;
    currentLevelIndex: number;
    currentLevelTitle?: string;
    subLevelProgress: number;
    totalLevels: number;
    currentUser: any;
    onNavigateHome: () => void;
    onOpenRoadmap: () => void;
    onNavigateReviews: () => void;
    onOpenProfile: () => void;
    onOpenAuth: () => void;
    getUserInitials: (name: string) => string;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
    trackId,
    trackLabel,
    currentLevelIndex,
    currentLevelTitle,
    subLevelProgress,
    totalLevels,
    currentUser,
    onNavigateHome,
    onOpenRoadmap,
    onNavigateReviews,
    onOpenProfile,
    onOpenAuth,
    getUserInitials,
}) => {
    return (
        <div className="fixed top-0 left-0 w-full p-3 sm:p-6 z-50 pointer-events-none flex justify-between items-start">
            <div className="pointer-events-auto">
                <h1
                    className="text-xl sm:text-3xl font-bold tracking-tighter text-white flex items-center gap-2 cursor-pointer"
                    onClick={onNavigateHome}
                >
                    BeCurious
                </h1>

                <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-4">
                    <button
                        onClick={onNavigateHome}
                        className="text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center gap-1 sm:gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/5 hover:border-white/20"
                    >
                        <Home size={10} /> <span className="hidden sm:inline">Home</span>
                    </button>
                    <button
                        onClick={onOpenRoadmap}
                        className="text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center gap-1 sm:gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/5 hover:border-white/20"
                    >
                        <Map size={10} /> <span className="hidden sm:inline">Roadmap</span>
                    </button>
                    <button
                        onClick={onNavigateReviews}
                        className="text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center gap-1 sm:gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/5 hover:border-white/20"
                    >
                        <BounceAvatar className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Review</span>
                    </button>
                </div>
            </div>

            <div className="flex gap-2 sm:gap-3 pointer-events-auto items-center">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-zinc-400 shadow-xl flex items-center gap-2">
                    <span className="text-white font-bold">L{currentLevelIndex + 1}</span>
                    <span className="hidden md:inline">{currentLevelTitle}</span>
                    <span className="text-emerald-400 border-l border-white/10 pl-2">
                        {Math.min(100, Math.round(((currentLevelIndex + subLevelProgress) / totalLevels) * 100))}%
                    </span>
                </div>

                {currentUser ? (
                    <button
                        onClick={onOpenProfile}
                        className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-500/50 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg group relative overflow-hidden"
                    >
                        {currentUser.avatar ? (
                            <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-white font-bold text-xs">{getUserInitials(currentUser.name)}</span>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={onOpenAuth}
                        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 px-3 h-9 rounded-full flex flex-col items-center justify-center transition-colors shadow-lg group relative gap-0"
                    >
                        <User size={12} className="text-zinc-300" />
                        <span className="text-[8px] text-zinc-400 font-medium">Sign In</span>
                    </button>
                )}
            </div>
        </div>
    );
};
