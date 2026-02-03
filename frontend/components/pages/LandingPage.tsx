
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

    const getProgress = (categories: string[]) => {
        const trackLevels = COURSE_CONTENT.filter(l => categories.includes(l.category));
        if (trackLevels.length === 0) return 0;
        const completedCount = trackLevels.filter(l => completedLevels.includes(l.id)).length;
        return Math.round((completedCount / trackLevels.length) * 100);
    };

    const systemDesignProgress = getProgress(['Fundamentals', 'Data', 'Communication', 'DevOps', 'Languages']);
    const cyberProgress = getProgress(['Cybersecurity']);
    const gameProgress = getProgress(['Gaming']);
    const lldProgress = getProgress(['Case Study']);

    const handleResetTrack = (track: TrackId, e: React.MouseEvent) => {
        e.stopPropagation(); // Don't trigger the card click
        fullResetTrack(track);
        // Reload completed levels using the proper function
        const remaining = readCompletedLevels();
        setCompletedLevels(remaining as string[]);
    };

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden py-12 sm:py-0">

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.1)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

            {/* Hero Header */}
            <div className="z-10 text-center mb-10 sm:mb-14 space-y-4 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 mt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-2 shadow-2xl">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    v2.1.0 • Live
                </div>

                <div className="relative inline-block">
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-2 leading-tight">
                        System Design <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400">
                            in 5-Minute Bites.
                        </span>
                    </h1>
                    {/* Decorative Elements */}
                    <div className="absolute -right-8 -top-8 text-yellow-400 animate-bounce delay-700 hidden sm:block">
                        <Play fill="currentColor" size={32} className="rotate-12" />
                    </div>
                </div>

                <p className="text-sm sm:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
                    No 40-minute lectures. No walls of text. <br />
                    <span className="text-zinc-200 font-semibold">Just scroll, play, and master complex systems.</span>
                </p>

                <div className="flex justify-center gap-4 pt-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold z-${10 - i}`}>
                                {['⚡', '🚀', '🧠'][i - 1]}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-500 flex items-center">
                        <span className="font-bold text-zinc-300 mr-1">10k+</span> bites consumed
                    </p>
                </div>
            </div>

            {/* "Reels" Grid Layout */}
            <div className="z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl px-4 mb-20">

                {/* Card 1: System Design */}
                <div
                    onClick={onStartGame}
                    className="group relative h-64 sm:h-80 bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/50 rounded-2xl p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] cursor-pointer overflow-hidden flex flex-col justify-end"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/80 group-hover:to-blue-900/80 transition-colors" />

                    <div className="absolute top-4 right-4 z-20">
                        {systemDesignProgress > 0 && <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">{systemDesignProgress}%</span>}
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 border border-blue-500/50">
                        <Play fill="currentColor" className="text-blue-400 ml-1" />
                    </div>

                    <div className="relative z-10 space-y-2">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-2 text-blue-400">
                            <Terminal size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white leading-none">System Design</h3>
                        <p className="text-xs text-blue-200/70 font-medium tracking-wide uppercase">Scale to 10M Users</p>
                        <p className="text-xs text-zinc-400 line-clamp-2">Load Balancers, Sharding, CAP Theorem. The building blocks of the internet.</p>
                    </div>
                </div>

                {/* Card 2: Cybersecurity */}
                <div
                    onClick={onStartCyber}
                    className="group relative h-64 sm:h-80 bg-zinc-900/40 border border-zinc-800 hover:border-purple-500/50 rounded-2xl p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] cursor-pointer overflow-hidden flex flex-col justify-end"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-950/80 group-hover:to-purple-900/80 transition-colors" />

                    <div className="absolute top-4 right-4 z-20">
                        {cyberProgress > 0 && <span className="text-[10px] font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full">{cyberProgress}%</span>}
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 border border-purple-500/50">
                        <Play fill="currentColor" className="text-purple-400 ml-1" />
                    </div>

                    <div className="relative z-10 space-y-2">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-2 text-purple-400">
                            <Lock size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white leading-none">Cybersecurity</h3>
                        <p className="text-xs text-purple-200/70 font-medium tracking-wide uppercase">Think Like a Hacker</p>
                        <p className="text-xs text-zinc-400 line-clamp-2">SQL Injection to Encryption. Break it to fix it.</p>
                    </div>
                </div>

                {/* Card 3: Game Dev */}
                <div
                    onClick={onStartGameDev}
                    className="group relative h-64 sm:h-80 bg-zinc-900/40 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] cursor-pointer overflow-hidden flex flex-col justify-end"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-red-950/80 group-hover:to-red-900/80 transition-colors" />

                    <div className="absolute top-4 right-4 z-20">
                        {gameProgress > 0 && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{gameProgress}%</span>}
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 border border-red-500/50">
                        <Play fill="currentColor" className="text-red-400 ml-1" />
                    </div>

                    <div className="relative z-10 space-y-2">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center mb-2 text-red-400">
                            <Gamepad2 size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white leading-none">Game Engine</h3>
                        <p className="text-xs text-red-200/70 font-medium tracking-wide uppercase">Under the Hood</p>
                        <p className="text-xs text-zinc-400 line-clamp-2">Game Loops, Physics, Networking. How virtual worlds tick.</p>
                    </div>
                </div>

                {/* Card 4: Case Studies */}
                <div
                    onClick={onStartLLD}
                    className="group relative h-64 sm:h-80 bg-zinc-900/40 border border-zinc-800 hover:border-green-500/50 rounded-2xl p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] cursor-pointer overflow-hidden flex flex-col justify-end"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green-950/80 group-hover:to-green-900/80 transition-colors" />

                    <div className="absolute top-4 right-4 z-20">
                        {lldProgress > 0 && <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">{lldProgress}%</span>}
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 border border-green-500/50">
                        <Play fill="currentColor" className="text-green-400 ml-1" />
                    </div>

                    <div className="relative z-10 space-y-2">
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-2 text-green-400">
                            <Layers size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white leading-none">Case Studies</h3>
                        <p className="text-xs text-green-200/70 font-medium tracking-wide uppercase">Real World Arch</p>
                        <p className="text-xs text-zinc-400 line-clamp-2">How Uber, Instagram, and URL Shorteners actually work.</p>
                    </div>
                </div>

            </div>

            <div className="absolute bottom-4 flex flex-col items-center gap-1 text-zinc-600 z-10 pointer-events-none">
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-50 flex items-center gap-1">
                    Built by Vivek • <span className="text-blue-500">BeCurious</span>
                </span>
            </div>

        </div>
    );
};
