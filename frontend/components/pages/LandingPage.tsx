
import React, { useState, useEffect } from 'react';
import { Play, Layers, Brain, Terminal, ArrowRight, Code, LineChart, Bot, Lock, MessageCircle, X, Mail, RotateCcw, Gamepad2, ShieldAlert } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';
import { ChatBubble } from '../ui/ChatBubble';
import { COURSE_CONTENT } from '../../data/courseContent';
import { fullResetTrack, readCompletedLevels } from '../../routing/progress';
import { TrackId } from '../../routing/tracks';

interface Props {
    onStartGame: () => void;
    onStartLLD: () => void;
    onStartQuiz: () => void;
    onStartGameDev: () => void;
    onStartCyber: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStartGame, onStartLLD, onStartQuiz, onStartGameDev, onStartCyber }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [completedLevels, setCompletedLevels] = useState<string[]>([]);

    useEffect(() => {
        // Load Completed Levels for progress bars
        const saved = localStorage.getItem('bounce_completed_levels');
        if (saved) {
            setCompletedLevels(JSON.parse(saved));
        }
    }, []);

    const getProgress = (categories: string[], trackId: TrackId) => {
        const trackLevels = COURSE_CONTENT.filter(l => categories.includes(l.category));
        if (trackLevels.length === 0) return 0;

        let completedCount = trackLevels.filter(l => completedLevels.includes(l.id)).length;

        // Check for partial progress in current active level
        try {
            const rawProgress = localStorage.getItem('bounce_progress_v2');
            if (rawProgress) {
                const stored = JSON.parse(rawProgress);
                if (stored.track === trackId && stored.totalSections > 0 && stored.sectionIndex > 0) {
                    // Only add partial if this level is IN this track and NOT already marked complete
                    const isLevelInTrack = trackLevels.some(l => l.id === stored.levelId);
                    const isAlreadyCompleted = completedLevels.includes(stored.levelId);

                    if (isLevelInTrack && !isAlreadyCompleted) {
                        const partial = stored.sectionIndex / stored.totalSections;
                        completedCount += partial;
                    }
                }
            }
        } catch (e) { /* ignore */ }

        // Max 100%
        return Math.min(100, Math.round((completedCount / trackLevels.length) * 100));
    };

    const systemDesignProgress = getProgress(['Fundamentals', 'Data', 'Communication', 'DevOps', 'Languages'], 'system-design');
    const cyberProgress = getProgress(['Cybersecurity'], 'cybersecurity');
    const gameProgress = getProgress(['Gaming'], 'game-dev');
    const lldProgress = getProgress(['Case Study'], 'case-studies');

    const handleResetTrack = (track: TrackId, e: React.MouseEvent) => {
        e.stopPropagation(); // Don't trigger the card click
        fullResetTrack(track);
        // Reload completed levels using the proper function
        const remaining = readCompletedLevels();
        setCompletedLevels(remaining as string[]);
    };

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden py-8 sm:py-0">

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

            {/* Top Navigation */}
            <div className="absolute top-4 right-4 z-50 flex gap-3">
                <button
                    onClick={() => window.location.href = '/reviews'}
                    className="flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full transition-all group backdrop-blur-md"
                >
                    <BounceAvatar className="w-5 h-5" />
                    <span className="text-xs font-semibold text-zinc-300 group-hover:text-white">Review</span>
                </button>
            </div>

            {/* Hero Header */}
            <div className="z-10 text-center mb-4 sm:mb-8 space-y-2 sm:space-y-4 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 mt-16 sm:mt-10">
                <div className="flex justify-center mb-2 sm:mb-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                        <BounceAvatar className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-0">
                    BeCurious
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-lg mx-auto leading-relaxed px-4">
                    Tired of 40 min boring lectures and long documentation?
                    <br className="hidden sm:block" />
                    Join this and learn an overview of concepts in just a <span className="text-blue-400">few simple fun ways</span>.
                </p>

                <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 pb-2 sm:pb-4">
                    <span className="text-[8px] sm:text-[10px] text-zinc-500 font-mono tracking-wide uppercase">
                        Created by <span className="text-zinc-300 font-bold">Vivek Prakash Yadav</span>
                    </span>
                    <a href="mailto:vivekprakashydvofficial@gmail.com" className="flex items-center gap-1 text-[8px] sm:text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">
                        <Mail size={8} /> <span className="hidden sm:inline">vivekprakashydvofficial@gmail.com</span><span className="sm:hidden">Email</span>
                    </a>

                </div>
            </div>

            {/* Main Tracks Grid - Masonry-ish Layout */}
            <div className="z-10 grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-5xl px-3 sm:px-8 mb-12">

                {/* Track 1: System Design */}
                <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] cursor-pointer" onClick={onStartGame}>
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity">
                        {systemDesignProgress > 0 ? (
                            <button
                                onClick={(e) => handleResetTrack('system-design', e)}
                                className="text-blue-500 opacity-40 hover:opacity-100 hover:text-blue-400 transition-opacity z-10 p-1 rounded-full hover:bg-blue-500/20"
                                title="Reset progress"
                            >
                                <RotateCcw size={16} />
                            </button>
                        ) : <Play size={16} />}
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Terminal size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1">System Design</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed mb-2 sm:mb-4 h-6 sm:h-10 line-clamp-2">
                        Scale from 1 to 10M users. Load Balancers, Sharding, Caching.
                    </p>
                    <div className="flex items-center gap-2 w-full mb-2 sm:mb-4">
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${systemDesignProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-blue-400 font-semibold">{systemDesignProgress}%</span>
                    </div>
                    <div className="flex items-center text-blue-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest gap-1 sm:gap-2 group-hover:gap-4 transition-all">
                        START <ArrowRight size={10} />
                    </div>
                </div>

                {/* Track 2: Cybersecurity */}
                <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] cursor-pointer" onClick={onStartCyber}>
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-purple-500 opacity-20 group-hover:opacity-100 transition-opacity">
                        {cyberProgress > 0 && (
                            <button
                                onClick={(e) => handleResetTrack('cybersecurity', e)}
                                className="text-purple-500 opacity-40 hover:opacity-100 hover:text-purple-400 transition-opacity z-10 p-1 rounded-full hover:bg-purple-500/20"
                                title="Reset progress"
                            >
                                <RotateCcw size={16} />
                            </button>
                        )}
                        {!cyberProgress && <ShieldAlert size={16} />}
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Lock size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1">Cybersecurity</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed mb-2 sm:mb-4 h-6 sm:h-10 line-clamp-2">
                        Encryption, SQL Injection, OWASP Top 10.
                    </p>
                    <div className="flex items-center gap-2 w-full mb-2 sm:mb-4">
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${cyberProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-purple-400 font-semibold">{cyberProgress}%</span>
                    </div>
                    <div className="flex items-center text-purple-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest gap-1 sm:gap-2 group-hover:gap-4 transition-all">
                        START <ArrowRight size={10} />
                    </div>
                </div>

                {/* Track 3: Game Engineering */}
                <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] cursor-pointer" onClick={onStartGameDev}>
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-red-500 opacity-20 group-hover:opacity-100 transition-opacity">
                        {gameProgress > 0 && (
                            <button
                                onClick={(e) => handleResetTrack('game-dev', e)}
                                className="text-red-500 opacity-40 hover:opacity-100 hover:text-red-400 transition-opacity z-10 p-1 rounded-full hover:bg-red-500/20"
                                title="Reset progress"
                            >
                                <RotateCcw size={16} />
                            </button>
                        )}
                        {!gameProgress && <Gamepad2 size={16} />}
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <Gamepad2 size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1">Game Dev</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed mb-2 sm:mb-4 h-6 sm:h-10 line-clamp-2">
                        Understand Engines. Concurrency in PUBG. The Game Loop.
                    </p>
                    <div className="flex items-center gap-2 w-full mb-2 sm:mb-4">
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${gameProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-red-400 font-semibold">{gameProgress}%</span>
                    </div>
                    <div className="flex items-center text-red-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest gap-1 sm:gap-2 group-hover:gap-4 transition-all">
                        START <ArrowRight size={10} />
                    </div>
                </div>

                {/* Track 4: LLD */}
                <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-green-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] cursor-pointer" onClick={onStartLLD}>
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-green-500 opacity-20 group-hover:opacity-100 transition-opacity">
                        {lldProgress > 0 && (
                            <button
                                onClick={(e) => handleResetTrack('case-studies', e)}
                                className="text-green-500 opacity-40 hover:opacity-100 hover:text-green-400 transition-opacity z-10 p-1 rounded-full hover:bg-green-500/20"
                                title="Reset progress"
                            >
                                <RotateCcw size={16} />
                            </button>
                        )}
                        {!lldProgress && <Code size={16} />}
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Layers size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1">Case Studies</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed mb-2 sm:mb-4 h-6 sm:h-10 line-clamp-2">
                        Instagram, Uber, URL Shortener, Quadtrees.
                    </p>
                    <div className="flex items-center gap-2 w-full mb-2 sm:mb-4">
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${lldProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-green-400 font-semibold">{lldProgress}%</span>
                    </div>
                    <div className="flex items-center text-green-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest gap-1 sm:gap-2 group-hover:gap-4 transition-all">
                        START <ArrowRight size={10} />
                    </div>
                </div>

                {/* Track 5: Quant & HFT - COMING SOON */}
                <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md cursor-not-allowed opacity-60 col-span-2">
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2">
                        <span className="text-[8px] sm:text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-bold uppercase">Coming Soon</span>
                        <Lock size={16} className="text-amber-500" />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-amber-400">
                        <LineChart size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1">Quant & HFT</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed mb-2 sm:mb-4 h-6 sm:h-10 line-clamp-2">
                        High-Frequency Trading, Market Making, Order Books, Latency Arbitrage.
                    </p>
                    <div className="flex items-center gap-2 w-full mb-2 sm:mb-4">
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `0%` }}></div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-amber-400 font-semibold">0%</span>
                    </div>
                    <div className="flex items-center text-amber-400/50 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest gap-1 sm:gap-2">
                        <Lock size={10} /> LOCKED
                    </div>
                </div>

            </div>



            <div className="absolute bottom-4 flex flex-col items-center gap-1 text-zinc-600 z-10 pointer-events-none">
                <div className="text-[10px] font-mono tracking-widest uppercase opacity-50">
                    BeCurious • v2.1.0
                </div>
            </div>

        </div>
    );
};
