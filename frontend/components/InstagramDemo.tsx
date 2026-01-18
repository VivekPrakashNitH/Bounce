
import React, { useState, useEffect } from 'react';
import { Camera, Users, Database, ArrowRight, Code2, Heart, MousePointerClick } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const InstagramDemo: React.FC<Props> = ({ onShowCode }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [feedItems, setFeedItems] = useState<number[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePost = () => {
    if (isPosting) return;
    if (!hasInteracted) setHasInteracted(true);
    setIsPosting(true);
    
    // Simulate Fan-out
    setTimeout(() => {
        setFeedItems(prev => [Date.now(), ...prev].slice(0, 3));
        setIsPosting(false);
    }, 2000);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl ${isMobile ? 'p-4' : 'p-6'} border border-white/10 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} items-center border-b border-white/10 pb-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold tracking-tight text-white flex items-center gap-2`}>
                <Camera className="text-pink-500" size={isMobile ? 16 : 24} /> {isMobile ? 'Instagram' : 'Case Study: Instagram'}
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-[10px] bg-white text-black hover:bg-zinc-200 border border-transparent px-3 py-1 rounded-full transition-colors font-bold uppercase tracking-wide">
                <Code2 size={12} /> Show Code
            </button>
            <span className="text-[10px] text-zinc-400 border border-white/10 px-2 py-1 rounded-full uppercase tracking-wide">Fan-out Service</span>
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-8'}`}>
            {/* User Posting */}
            <div className={`col-span-1 flex flex-col items-center gap-4 ${isMobile ? 'border-b pb-4' : 'border-r pr-8'} border-white/5 relative`}>
                
                 {/* NUDGE */}
                 {!hasInteracted && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-50 pointer-events-none">
                        <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full mb-1 whitespace-nowrap font-bold shadow-lg">Try it</span>
                        <MousePointerClick className="text-blue-500 fill-blue-500" size={20} />
                    </div>
                )}

                <div className="w-full aspect-[9/16] bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex flex-col relative overflow-hidden">
                    <div className="flex-1 bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                        <Camera className="text-zinc-600" size={32} />
                    </div>
                    <button 
                        onClick={handlePost} 
                        disabled={isPosting}
                        className="w-full bg-pink-600 hover:bg-pink-500 text-white py-2 rounded-lg font-bold text-xs shadow-lg disabled:opacity-50"
                    >
                        {isPosting ? 'Uploading...' : 'Post Photo'}
                    </button>

                    {isPosting && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                <span className="text-xs text-zinc-500 font-mono">User (Celebrity)</span>
            </div>

            {/* Backend Logic */}
            <div className={`col-span-1 flex ${isMobile ? 'flex-row justify-around py-4' : 'flex-col items-center justify-center'} gap-6 relative`}>
                 {/* Animation Path */}
                 {isPosting && (
                     <>
                        <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-zinc-800">
                             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-pink-500 rounded-full animate-[ping_1s_linear_infinite]"></div>
                        </div>
                        <div className="absolute top-1/2 right-0 w-1/2 h-0.5 bg-zinc-800">
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-pink-500 rounded-full animate-[ping_1s_linear_infinite]"></div>
                        </div>
                     </>
                 )}

                 <div className={`p-4 rounded-lg border border-zinc-700 bg-zinc-900 flex flex-col items-center ${isPosting ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : ''}`}>
                     <Database className="text-zinc-400 mb-2" />
                     <span className="text-[10px] font-bold text-white">Main DB</span>
                 </div>

                 <ArrowRight className="text-zinc-600 rotate-90" />

                 <div className={`p-4 rounded-lg border border-zinc-700 bg-zinc-900 flex flex-col items-center ${isPosting ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : ''}`}>
                     <Users className="text-zinc-400 mb-2" />
                     <span className="text-[10px] font-bold text-white">Fan-out Service</span>
                     <span className="text-[8px] text-zinc-500">Async Workers</span>
                 </div>
            </div>

            {/* Followers Feeds */}
            <div className={`col-span-1 flex flex-col gap-4 ${isMobile ? 'border-t pt-4' : 'border-l pl-8'} border-white/5`}>
                <span className="text-xs text-zinc-500 font-mono text-center">Followers' Feeds (Redis)</span>
                {[1, 2].map((follower) => (
                    <div key={follower} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
                             <div className="w-4 h-4 rounded-full bg-zinc-700"></div>
                             <span className="text-[10px] text-zinc-400">User_{follower}</span>
                        </div>
                        <div className="space-y-2">
                            {feedItems.map(item => (
                                <div key={item} className="h-6 bg-pink-500/10 border border-pink-500/30 rounded flex items-center px-2 animate-in fade-in slide-in-from-left-4">
                                    <Heart size={8} className="text-pink-500 mr-2" />
                                    <span className="text-[8px] text-pink-200">New Post ID: {item.toString().slice(-4)}</span>
                                </div>
                            ))}
                            {feedItems.length === 0 && <div className="text-[8px] text-zinc-600 italic">No new posts</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
