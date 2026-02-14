
import React, { useState, useEffect } from 'react';
import { Play, Layers, Brain, Terminal, ArrowRight, Code, LineChart, Bot, Lock, MessageCircle, X, RotateCw, Mail, RotateCcw, Gamepad2, ShieldAlert } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';
import { ChatBubble } from './ChatBubble';
import { COURSE_CONTENT } from '../data/courseContent';

interface Props {
    onStartGame: () => void;
    onStartLLD: () => void;
    onStartQuiz: () => void;
    onStartGameDev: () => void;
    onStartCyber: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStartGame, onStartLLD, onStartQuiz, onStartGameDev, onStartCyber }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isPortraitMobile, setIsPortraitMobile] = useState(false);
    const [completedLevels, setCompletedLevels] = useState<string[]>([]);

    useEffect(() => {
        const checkOrientation = () => {
            const isMobile = window.innerWidth < 768;
            const isPortrait = window.innerHeight > window.innerWidth;
            setIsPortraitMobile(isMobile && isPortrait);
        };

        // Load Completed Levels for progress bars
        const saved = localStorage.getItem('bounce_completed_levels');
        if (saved) {
            setCompletedLevels(JSON.parse(saved));
        }

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    const getProgress = (categories: string[]) => {
        const trackLevels = COURSE_CONTENT.filter(l => categories.includes(l.category));
        if (trackLevels.length === 0) return 0;
        const completedCount = trackLevels.filter(l => completedLevels.includes(l.id)).length;
        return Math.round((completedCount / trackLevels.length) * 100);
    };

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">

            {isPortraitMobile && (
                <div className="fixed top-0 left-0 w-full bg-yellow-600/90 backdrop-blur-md text-white px-4 py-3 z-[100] flex items-center justify-center gap-3 shadow-lg animate-in slide-in-from-top-full duration-500">
                    <RotateCw size={18} className="animate-spin duration-[3000ms]" />
                    <span className="text-xs font-bold tracking-wide text-center">
                        For the best experience, please rotate your device to landscape.
                    </span>
                </div>
            )}

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

            {/* Hero Header */}
            <div className="z-10 text-center mb-4 sm:mb-8 space-y-2 sm:space-y-4 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 mt-16 sm:mt-10">
                <div className="flex justify-center mb-2 sm:mb-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                        <BounceAvatar className="w-12 h-12 sm:w-16 sm:h-16" />
                    </div>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-0">
                    CURIOUS.SYS
                </h1>

                <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 pb-2 sm:pb-4">
                    <span className="text-[8px] sm:text-[10px] text-zinc-500 font-mono tracking-wide uppercase">
                        Created by <span className="text-zinc-300 font-bold">Vivek Prakash Yadav</span>
                    </span>
                    <a href="mailto:vivekprakashydvofficial@gmail.com" className="flex items-center gap-1 text-[8px] sm:text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">
                        <Mail size={8} /> <span className="hidden sm:inline">vivekprakashydvofficial@gmail.com</span><span className="sm:hidden">Email</span>
                    </a>
                    <div className="mt-1 px-2 sm:px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-1 sm:gap-2">
                        <Bot size={10} className="text-green-400" />
                        <span className="text-[8px] sm:text-[10px] text-zinc-400 font-bold tracking-wider">POWERED BY PUTER.AI</span>
                    </div>
                </div>
            </div>

            {/* Main Tracks Grid - Masonry-ish Layout */}
            <div className="z-10 grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-5xl px-3 sm:px-8 mb-12">

                {/* Track 1: System Design */}
                <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] cursor-pointer" onClick={onStartGame}>
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity">
                        {getProgress(['Fundamentals', 'Data', 'Communication', 'DevOps']) > 0 ? <RotateCcw size={16} /> : <Play size={16} />}
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Terminal size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1">System Design</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed mb-2 sm:mb-4 h-6 sm:h-10 line-clamp-2">
                        Scale from 1 to 10M users. Load Balancers, Sharding, Caching.
                    </p>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-2 sm:mb-4">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${getProgress(['Fundamentals', 'Data', 'Communication', 'DevOps', 'Languages'])}%` }}></div>
                    </div>
                    <div className="flex items-center text-blue-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest gap-1 sm:gap-2 group-hover:gap-4 transition-all">
                        START <ArrowRight size={10} />
                    </div>
                </div>

                {/* Track 2: Cybersecurity */}
                <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] cursor-pointer" onClick={onStartCyber}>
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-purple-500 opacity-20 group-hover:opacity-100 transition-opacity">
                        <ShieldAlert size={16} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Lock size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1">Cybersecurity</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed mb-2 sm:mb-4 h-6 sm:h-10 line-clamp-2">
                        Encryption, SQL Injection, OWASP Top 10.
                    </p>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-2 sm:mb-4">
                        <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${getProgress(['Cybersecurity'])}%` }}></div>
                    </div>
                    <div className="flex items-center text-purple-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest gap-1 sm:gap-2 group-hover:gap-4 transition-all">
                        START <ArrowRight size={10} />
                    </div>
                </div>

                {/* Track 3: Game Engineering */}
                <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] cursor-pointer" onClick={onStartGameDev}>
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-red-500 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Gamepad2 size={16} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <Gamepad2 size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1">Game Dev</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed mb-2 sm:mb-4 h-6 sm:h-10 line-clamp-2">
                        Understand Engines. Concurrency in PUBG. The Game Loop.
                    </p>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-2 sm:mb-4">
                        <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${getProgress(['Gaming'])}%` }}></div>
                    </div>
                    <div className="flex items-center text-red-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest gap-1 sm:gap-2 group-hover:gap-4 transition-all">
                        START <ArrowRight size={10} />
                    </div>
                </div>

                {/* Track 4: LLD */}
                <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-green-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] cursor-pointer" onClick={onStartLLD}>
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-green-500 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Code size={16} />
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Layers size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1">LLD & Patterns</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed mb-2 sm:mb-4 h-6 sm:h-10 line-clamp-2">
                        Factory Pattern, Observer, Clean Code.
                    </p>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-2 sm:mb-4">
                        <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${getProgress(['LLD & Patterns', 'Case Study'])}%` }}></div>
                    </div>
                    <div className="flex items-center text-green-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest gap-1 sm:gap-2 group-hover:gap-4 transition-all">
                        START <ArrowRight size={10} />
                    </div>
                </div>

            </div>

            <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-[200] flex flex-col items-end">
                <div className="relative">
                    <ChatBubble isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                </div>
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="bg-white hover:bg-zinc-200 text-black p-3 sm:p-4 rounded-full shadow-2xl transition-transform hover:scale-110 border border-zinc-400 flex items-center justify-center animate-bounce"
                >
                    {isChatOpen ? <X size={20} /> : <MessageCircle size={20} />}
                </button>
            </div>

            <div className="absolute bottom-4 flex flex-col items-center gap-1 text-zinc-600 z-10 pointer-events-none">
                <div className="text-[10px] font-mono tracking-widest uppercase opacity-50">
                    CURIOUS.SYS • v2.1.0
                </div>
            </div>

        </div>
    );
};
