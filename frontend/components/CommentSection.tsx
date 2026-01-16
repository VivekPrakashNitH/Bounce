
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, LogOut, Loader2, Code, X, AlertCircle } from 'lucide-react';
import { JavaSpringBootGenerator } from './JavaSpringBootGenerator';
import { levelCommentApi, authApi, type LevelComment, type User, type GitHubAuthRequest } from '../services/apiService';

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

// GitHub Logo SVG
const GitHubLogo = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export const CommentSection: React.FC<CommentSectionProps> = ({ levelId }) => {
  const [comments, setComments] = useState<LevelComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showBlueprints, setShowBlueprints] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // Load comments from backend
  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedComments = await levelCommentApi.getComments(levelId);
        setComments(fetchedComments);
      } catch (err) {
        console.error('Failed to load comments:', err);
        setError('Failed to load comments. Using fallback mode.');
        // Fallback to localStorage if backend is unavailable
        const saved = localStorage.getItem(`bounce_comments_${levelId}`);
        if (saved) {
          try {
            setComments(JSON.parse(saved));
          } catch (e) {
            setComments([]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();

    // Check for logged in user (from localStorage for now, can be enhanced with JWT)
    const savedUser = localStorage.getItem('curious_google_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Try to sync with backend
        if (userData.email) {
          authApi.getUserByEmail(userData.email).then(backendUser => {
            if (backendUser) {
              setUser(backendUser);
              localStorage.setItem('curious_google_user', JSON.stringify(backendUser));
            }
          }).catch(() => {
            // Backend unavailable, use local user
          });
        }
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
  }, [levelId]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    
    try {
      // In production, this will use real Google OAuth
      // For now, using mock (will be replaced with @react-oauth/google)
      const mockUser = {
        name: "Alex Developer",
        email: "alex.dev@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        googleId: "mock-google-id-123"
      };

      // Register/login with backend
      const backendUser = await authApi.googleAuth(mockUser);
      setUser(backendUser);
      localStorage.setItem('curious_google_user', JSON.stringify(backendUser));
    } catch (err) {
      console.error('Login failed:', err);
      // Fallback: use local storage
      const mockUser = {
        name: "Alex Developer",
        email: "alex.dev@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c"
      };
      setUser(mockUser);
      localStorage.setItem('curious_google_user', JSON.stringify(mockUser));
      setError('Backend unavailable. Using offline mode.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    
    try {
      // In production, this will use real GitHub OAuth
      // For now, using mock (will be replaced with real OAuth)
      const mockUser: GitHubAuthRequest = {
        name: "GitHub User",
        email: "github.user@example.com",
        avatar: "https://github.com/identicons/github.png",
        githubId: "mock-github-id-123"
      };

      // Register/login with backend
      const backendUser = await authApi.githubAuth(mockUser);
      setUser(backendUser);
      localStorage.setItem('curious_google_user', JSON.stringify(backendUser));
    } catch (err) {
      console.error('Login failed:', err);
      // Fallback: use local storage
      const mockUser = {
        name: "GitHub User",
        email: "github.user@example.com",
        avatar: "https://github.com/identicons/github.png"
      };
      setUser(mockUser);
      localStorage.setItem('curious_google_user', JSON.stringify(mockUser));
      setError('Backend unavailable. Using offline mode.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('curious_google_user');
    setUser(null);
  };

  const handlePost = async () => {
    if (!newComment.trim() || !user) return;

    setIsPosting(true);
    setError(null);

    try {
      const newCommentData = await levelCommentApi.createComment({
        content: newComment,
        levelId: levelId,
        author: user.name,
        authorEmail: user.email,
        authorAvatar: user.avatar,
      });

      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError('Failed to post comment. Please try again.');
      
      // Fallback: save to localStorage
      const fallbackComment: LevelComment = {
        id: Date.now(),
        content: newComment,
        levelId: levelId,
        author: user.name,
        authorEmail: user.email,
        authorAvatar: user.avatar,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setComments(prev => [fallbackComment, ...prev]);
      const saved = localStorage.getItem(`bounce_comments_${levelId}`);
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem(`bounce_comments_${levelId}`, JSON.stringify([fallbackComment, ...existing]));
      setNewComment('');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-zinc-400" />
            <h3 className="text-sm font-bold text-zinc-200">Community Discussion</h3>
            <span className="text-xs text-zinc-600">{isLoading ? 'Loading...' : `${comments.length} Comments`}</span>
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
        
        {/* Error Message */}
        {error && (
          <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-3 flex items-center gap-2 text-yellow-300 text-xs animate-in fade-in">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
        
        {/* Auth / Input Area */}
        {!user ? (
            <div className="bg-zinc-950/50 rounded-lg p-8 border border-zinc-800 flex flex-col items-center justify-center gap-4">
                <div className="text-center">
                    <h4 className="text-white font-bold mb-1">Join the conversation</h4>
                    <p className="text-xs text-zinc-500">Sign in to share your system design thoughts.</p>
                </div>
                
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={isLoggingIn}
                        className="flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full font-medium text-sm transition-all active:scale-95 shadow-lg border border-gray-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoggingIn ? (
                            <Loader2 size={20} className="animate-spin text-gray-500" />
                        ) : (
                            <GoogleLogo />
                        )}
                        <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                    </button>
                    
                    <button 
                        onClick={handleGitHubLogin}
                        disabled={isLoggingIn}
                        className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all active:scale-95 shadow-lg border border-gray-700 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoggingIn ? (
                            <Loader2 size={20} className="animate-spin text-gray-400" />
                        ) : (
                            <GitHubLogo />
                        )}
                        <span>{isLoggingIn ? 'Connecting...' : 'Sign in with GitHub'}</span>
                    </button>
                </div>
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
                            disabled={!newComment.trim() || isPosting}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {isPosting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
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
           {isLoading ? (
             <div className="text-center py-8 text-zinc-600 text-xs">
               <Loader2 size={20} className="animate-spin mx-auto mb-2" />
               Loading comments...
             </div>
           ) : comments.length === 0 ? (
             <div className="text-center py-8 text-zinc-700 text-xs italic border border-dashed border-zinc-800 rounded-lg">
               No comments yet. Be the first to start the discussion!
             </div>
           ) : (
             comments.map((c) => (
               <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2 group">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700 text-zinc-400 font-bold text-xs select-none overflow-hidden">
                      {c.authorAvatar ? (
                        <img src={c.authorAvatar} alt={c.author} className="w-full h-full object-cover" />
                      ) : (
                        c.author.charAt(0).toUpperCase()
                      )}
                  </div>
                  <div className="flex-1 bg-zinc-900/50 p-3 rounded-r-xl rounded-bl-xl border border-zinc-800/50 group-hover:border-zinc-700 transition-colors">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-zinc-300">{c.author}</span>
                        <span className="text-[10px] text-zinc-600">• {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                     </div>
                     <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};
