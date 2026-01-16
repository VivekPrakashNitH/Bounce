
import React, { useEffect, useState } from 'react';
import { X, Trophy, Star, Clock, Map, User } from 'lucide-react';
import { COURSE_CONTENT } from '../data/courseContent';

interface Props {
  onClose: () => void;
}

export const ProfileModal: React.FC<Props> = ({ onClose }) => {
  const [user, setUser] = useState<{name: string, email: string, avatar: string} | null>(null);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    // Get User
    const savedUser = localStorage.getItem('curious_google_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Calculate total comments made by user across all levels
    let count = 0;
    COURSE_CONTENT.forEach(level => {
        const savedComments = localStorage.getItem(`bounce_comments_${level.id}`);
        if (savedComments && savedUser) {
            const parsed = JSON.parse(savedComments);
            const userEmail = JSON.parse(savedUser).name; // Using name as ID for now in simulation
            count += parsed.filter((c: any) => c.user === userEmail).length;
        }
    });
    setCommentsCount(count);
  }, []);

  if (!user) return null;

  // Simulate progress based on random "completed" levels for demo feel, 
  // or simple logic: user logged in = 10% progress
  const progress = Math.min(100, (commentsCount * 5) + 10); 

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 relative shadow-2xl overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />

        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center relative z-10 -mt-2">
            <div className="w-20 h-20 rounded-full border-4 border-zinc-900 shadow-xl overflow-hidden mb-3">
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-xs text-zinc-500">{user.email}</p>
            <div className="mt-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                System Architect Initiate
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 flex flex-col items-center">
                <Trophy className="text-yellow-500 mb-2" size={20} />
                <span className="text-2xl font-bold text-white">Lvl {Math.floor(progress / 20) + 1}</span>
                <span className="text-[10px] text-zinc-500 uppercase">Current Rank</span>
            </div>
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 flex flex-col items-center">
                <MessageSquareIcon className="text-green-500 mb-2" size={20} />
                <span className="text-2xl font-bold text-white">{commentsCount}</span>
                <span className="text-[10px] text-zinc-500 uppercase">Contributions</span>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
            <div className="flex justify-between text-xs mb-2">
                <span className="text-zinc-400">Course Progress</span>
                <span className="text-white font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-1000" 
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-[10px] text-zinc-600 mt-2 text-center italic">
                "Consistency is the key to scalability."
            </p>
        </div>

      </div>
    </div>
  );
};

// Icon helper since lucide-react exports might vary slightly in setup
const MessageSquareIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
