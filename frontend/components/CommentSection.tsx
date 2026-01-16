
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, LogOut, Loader2, Code, X } from 'lucide-react';
import { JavaSpringBootGenerator } from './JavaSpringBootGenerator';

interface Comment {
  id: number;
  user: string;
  avatar?: string;
  text: string;
  timestamp: string;
}

interface CommentSectionProps {
  levelId: string;
}

// Google "G" Logo SVG
const GoogleLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const CommentSection: React.FC<CommentSectionProps> = ({ levelId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<{name: string, email: string, avatar: string} | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showBlueprints, setShowBlueprints] = useState(false);

  // Load comments from localStorage specific to this levelId
  useEffect(() => {
    const saved = localStorage.getItem(`bounce_comments_${levelId}`);
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
      setComments([]);
    }

    // Check for logged in user
    const savedUser = localStorage.getItem('curious_google_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, [levelId]);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    
    // Simulate Network/OAuth Delay
    setTimeout(() => {
        const mockUser = {
            name: "Alex Developer",
            email: "alex.dev@gmail.com",
            avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c" 
        };
        localStorage.setItem('curious_google_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsLoggingIn(false);
    }, 1500);
  };

  const handleLogout = () => {
      localStorage.removeItem('curious_google_user');
      setUser(null);
  };

  const handlePost = () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now(),
      user: user.name,
      avatar: user.avatar,
      text: newComment,
      timestamp: new Date().toLocaleDateString(),
    };

    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem(`bounce_comments_${levelId}`, JSON.stringify(updated));
    setNewComment('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-zinc-400" />
            <h3 className="text-sm font-bold text-zinc-200">Community Discussion</h3>
            <span className="text-xs text-zinc-600">{comments.length} Comments</span>
        </div>
        <button 
            onClick={() => setShowBlueprints(!showBlueprints)}
            className="text-xs flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-green-400 px-3 py-1 rounded transition-colors"
        >
            {showBlueprints ? <X size={14}/> : <Code size={14}/>} 
            {showBlueprints ? "Hide Blueprints" : "Build Real Backend"}
        </button>
      </div>

      {showBlueprints && (
          <div className="p-4 bg-black/20 border-b border-zinc-800 animate-in fade-in slide-in-from-top-4">
              <JavaSpringBootGenerator />
          </div>
      )}

      <div className="p-4 space-y-4">
        
        {/* Auth / Input Area */}
        {!user ? (
            <div className="bg-zinc-950/50 rounded-lg p-8 border border-zinc-800 flex flex-col items-center justify-center gap-4">
                <div className="text-center">
                    <h4 className="text-white font-bold mb-1">Join the conversation</h4>
                    <p className="text-xs text-zinc-500">Sign in to share your system design thoughts.</p>
                </div>
                
                <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="flex items-center gap-3 bg-white hover:bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full font-medium text-sm transition-all active:scale-95 shadow-lg border border-gray-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoggingIn ? (
                        <Loader2 size={20} className="animate-spin text-gray-500" />
                    ) : (
                        <GoogleLogo />
                    )}
                    <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
                <div className="text-[10px] text-zinc-600 mt-2">
                   This is a secure simulation. No real credentials needed.
                </div>
            </div>
        ) : (
            <div className="flex gap-3 items-start animate-in fade-in">
                <div className="relative group cursor-pointer" onClick={handleLogout} title="Click to Logout">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-2 border-zinc-800 group-hover:border-red-500 transition-colors">
                        <span className="text-sm font-bold text-white">
                            {user.name.charAt(0)}
                        </span>
                    </div>
                    {/* Logout Overlay Icon */}
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <LogOut size={14} className="text-white" />
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                         <input 
                            type="text" 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                            placeholder={`What are your thoughts, ${user.name.split(' ')[0]}?`}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600"
                         />
                         <button 
                            onClick={handlePost}
                            disabled={!newComment.trim()}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <Send size={18} />
                         </button>
                    </div>
                    <div className="text-[10px] text-zinc-500 flex justify-between px-1">
                        <span>Signed in as <b>{user.email}</b></span>
                        <button onClick={handleLogout} className="hover:text-red-400 transition-colors">Sign out</button>
                    </div>
                </div>
            </div>
        )}

        {/* Comment List */}
        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2 mt-6">
           {comments.length === 0 && (
             <div className="text-center py-8 text-zinc-700 text-xs italic border border-dashed border-zinc-800 rounded-lg">
               No comments yet. Be the first to start the discussion!
             </div>
           )}
           {comments.map((c) => (
             <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2 group">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700 text-zinc-400 font-bold text-xs select-none">
                    {c.user.charAt(0)}
                </div>
                <div className="flex-1 bg-zinc-900/50 p-3 rounded-r-xl rounded-bl-xl border border-zinc-800/50 group-hover:border-zinc-700 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-300">{c.user}</span>
                      <span className="text-[10px] text-zinc-600">• {c.timestamp}</span>
                   </div>
                   <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{c.text}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
