
import React, { useState, useEffect } from 'react';
import { Play, Layers, Brain, Terminal, ArrowRight, Code, LineChart, Bot, Lock, MessageCircle, X, RotateCw, Mail, RotateCcw, Gamepad2 } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';
import { ChatBubble } from './ChatBubble';

interface Props {
  onStartGame: () => void;
  onStartLLD: () => void;
  onStartQuiz: () => void;
  onStartGameDev: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStartGame, onStartLLD, onStartQuiz, onStartGameDev }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [hasSavedState, setHasSavedState] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortraitMobile(isMobile && isPortrait);
    };

    // Check saved state
    const saved = localStorage.getItem('bounce_current_level');
    if (saved && parseInt(saved) > 0) setHasSavedState(true);

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

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
      <div className="z-10 text-center mb-8 space-y-4 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 mt-10">
        <div className="flex justify-center mb-4">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                <BounceAvatar className="w-16 h-16" />
            </div>
        </div>
        
        <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-0">
          CURIOUS.SYS
        </h1>

        <div className="flex flex-col items-center justify-center gap-1 pb-4">
             <span className="text-[10px] text-zinc-500 font-mono tracking-wide uppercase">
                Created by <span className="text-zinc-300 font-bold">Vivek Prakash Yadav</span>
             </span>
             <a href="mailto:vivekprakashydvofficial@gmail.com" className="flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">
                <Mail size={8} /> vivekprakashydvofficial@gmail.com
             </a>
        </div>
      </div>

      {/* Main Tracks Grid - 2x2 Layout */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-8 mb-12">
        
        {/* Track 1: System Design */}
        <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 rounded-2xl p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] cursor-pointer" onClick={onStartGame}>
            <div className="absolute top-4 right-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity">
                {hasSavedState ? <RotateCcw size={20} /> : <Play size={20} />}
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Terminal size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">System Design</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4 h-10">
                Scale from 1 to 10M users. Load Balancers, Sharding, Caching.
            </p>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-blue-500 w-[15%]"></div>
            </div>
            <div className="flex items-center text-blue-400 text-[10px] font-bold uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                {hasSavedState ? "RESUME" : "START TRACK"} <ArrowRight size={10} />
            </div>
        </div>

        {/* Track 2: LLD & Patterns */}
        <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 rounded-2xl p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] cursor-pointer" onClick={onStartLLD}>
            <div className="absolute top-4 right-4 text-purple-500 opacity-20 group-hover:opacity-100 transition-opacity">
                <Code size={20} />
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Layers size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">LLD & Patterns</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4 h-10">
                Factory Pattern, Observer, Clean Code principles & Class Design.
            </p>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-purple-500 w-[0%]"></div>
            </div>
            <div className="flex items-center text-purple-400 text-[10px] font-bold uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                START TRACK <ArrowRight size={10} />
            </div>
        </div>

        {/* Track 3: Real World */}
        <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-green-500/50 rounded-2xl p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] cursor-pointer" onClick={onStartQuiz}>
            <div className="absolute top-4 right-4 text-green-500 opacity-20 group-hover:opacity-100 transition-opacity">
                <Brain size={20} />
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Brain size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Real World Scenarios</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4 h-10">
                Design Uber, TinyURL, Instagram. Practical system interviews.
            </p>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-green-500 w-[5%]"></div>
            </div>
            <div className="flex items-center text-green-400 text-[10px] font-bold uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                VIEW CASES <ArrowRight size={10} />
            </div>
        </div>

        {/* Track 4: Game Engineering */}
        <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-6 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] cursor-pointer" onClick={onStartGameDev}>
            <div className="absolute top-4 right-4 text-red-500 opacity-20 group-hover:opacity-100 transition-opacity">
                <Gamepad2 size={20} />
            </div>
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center mb-4 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <Gamepad2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Game Engineering</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4 h-10">
                Build a Game Engine. Concurrency in PUBG. The Game Loop.
            </p>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-red-500 w-[0%]"></div>
            </div>
            <div className="flex items-center text-red-400 text-[10px] font-bold uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                BUILD ENGINE <ArrowRight size={10} />
            </div>
        </div>

      </div>

      <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end">
         <div className="relative">
            <ChatBubble isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
         </div>
         <button 
           onClick={() => setIsChatOpen(!isChatOpen)}
           className="bg-white hover:bg-zinc-200 text-black p-4 rounded-full shadow-2xl transition-transform hover:scale-110 border border-zinc-400 flex items-center justify-center animate-bounce"
         >
           {isChatOpen ? <X size={20} /> : <MessageCircle size={20} />}
         </button>
      </div>

      <div className="absolute bottom-4 flex flex-col items-center gap-1 text-zinc-600 z-10 pointer-events-none">
        <div className="text-[10px] font-mono tracking-widest uppercase opacity-50">
           CURIOUS.SYS • v2.0.0
        </div>
      </div>

    </div>
  );
};
