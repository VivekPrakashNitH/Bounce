
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, LogOut, Loader2, Code, X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { JavaSpringBootGenerator } from './JavaSpringBootGenerator';
import { authApi, type User } from '../services/apiService';

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

type AuthStep = 'email' | 'otp' | 'register' | 'login' | 'authenticated';

export const CommentSection: React.FC<CommentSectionProps> = ({ levelId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showBlueprints, setShowBlueprints] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Auth states
  const [authStep, setAuthStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setAuthStep('authenticated');
      } catch (e) {
        // Invalid data
      }
    }
  }, [levelId]);

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authApi.sendOtp(email);
      
      // Check if user exists
      const existingUser = await authApi.getUserByEmail(email);
      setIsExistingUser(!!existingUser);
      
      setAuthStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userData = await authApi.verifyOtp(email, otp);
      if (isExistingUser) {
        // Existing user - check if password is required
        // If error says requiresPassword, show login form
        setUser(userData);
        localStorage.setItem('curious_google_user', JSON.stringify(userData));
        setAuthStep('authenticated');
      } else {
        // New user - need name and password
        setAuthStep('register');
      }
    } catch (err: any) {
      // Check if password is required
      if (err.message && err.message.includes('password')) {
        setAuthStep('login');
        setError('Please login with your password');
      } else {
        setError(err.message || 'Invalid OTP. Please try again.');
      }
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userData = await authApi.verifyOtp(email, otp, name, password);
      setUser(userData);
      localStorage.setItem('curious_google_user', JSON.stringify(userData));
      setAuthStep('authenticated');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userData = await authApi.login(email, password);
      setUser(userData);
      localStorage.setItem('curious_google_user', JSON.stringify(userData));
      setAuthStep('authenticated');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('curious_google_user');
    setUser(null);
    setAuthStep('email');
    setEmail('');
    setOtp('');
    setName('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const handlePost = () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now(),
      user: user.name,
      avatar: user.avatar,
      text: newComment,
      timestamp: new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem(`bounce_comments_${levelId}`, JSON.stringify(updated));
    setNewComment('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-zinc-800 bg-zinc-900 flex ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'}`}>
        <div className="flex items-center gap-2">
            <MessageSquare size={isMobile ? 14 : 16} className="text-zinc-400" />
            <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-zinc-200`}>Community Discussion</h3>
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-zinc-600`}>{comments.length} Comments</span>
        </div>
        <button 
            onClick={() => setShowBlueprints(!showBlueprints)}
            className={`${isMobile ? 'text-[10px] px-2 py-1' : 'text-xs px-3 py-1'} flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-green-400 rounded transition-colors`}
        >
            {showBlueprints ? <X size={isMobile ? 12 : 14}/> : <Code size={isMobile ? 12 : 14}/>} 
            {showBlueprints ? "Hide" : (isMobile ? "Backend" : "Build Real Backend")}
        </button>
      </div>

      {showBlueprints && (
          <div className="p-4 bg-black/20 border-b border-zinc-800 animate-in fade-in slide-in-from-top-4">
              <JavaSpringBootGenerator />
          </div>
      )}

      <div className={`${isMobile ? 'p-3' : 'p-4'} space-y-4`}>
        
        {/* Error Message */}
        {error && (
          <div className={`bg-red-900/50 border border-red-700 rounded-lg ${isMobile ? 'p-2' : 'p-3'} flex items-center gap-2 text-red-300 ${isMobile ? 'text-[10px]' : 'text-xs'} animate-in fade-in`}>
            <X size={isMobile ? 12 : 14} />
            <span>{error}</span>
          </div>
        )}
        
        {/* Auth / Input Area */}
        {authStep !== 'authenticated' ? (
            <div className={`bg-zinc-950/50 rounded-lg ${isMobile ? 'p-4' : 'p-6'} border border-zinc-800 flex flex-col items-center justify-center gap-4`}>
                <div className="text-center mb-2">
                    <h4 className={`text-white font-bold mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>Join the conversation</h4>
                    <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-zinc-500`}>Sign in with email to share your thoughts</p>
                </div>
                
                {authStep === 'email' && (
                  <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-xs'} space-y-3`}>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={isMobile ? 16 : 18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={`w-full bg-zinc-900 border border-zinc-700 rounded-lg ${isMobile ? 'px-9 py-2.5 text-xs' : 'px-10 py-3 text-sm'} text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600`}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading || !email}
                      className={`w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white ${isMobile ? 'px-4 py-2.5 text-xs' : 'px-6 py-3 text-sm'} rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={isMobile ? 14 : 18} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Mail size={isMobile ? 14 : 18} />
                          <span>Send OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {authStep === 'otp' && (
                  <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-xs'} space-y-3`}>
                    <div className="text-center mb-2">
                      <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-zinc-400`}>OTP sent to <b className="text-zinc-300">{email}</b></p>
                      <button
                        onClick={() => setAuthStep('email')}
                        className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-blue-400 hover:text-blue-300 mt-1`}
                      >
                        Change email
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={isMobile ? 16 : 18} />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        className={`w-full bg-zinc-900 border border-zinc-700 rounded-lg ${isMobile ? 'px-9 py-2.5 text-lg' : 'px-10 py-3 text-2xl'} text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600 text-center tracking-widest`}
                        maxLength={6}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.length !== 6}
                      className={`w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white ${isMobile ? 'px-4 py-2.5 text-xs' : 'px-6 py-3 text-sm'} rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={isMobile ? 14 : 18} className="animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={isMobile ? 14 : 18} />
                          <span>Verify OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {authStep === 'register' && (
                  <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-xs'} space-y-3`}>
                    <div className="text-center mb-2">
                      <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-zinc-400`}>Create your account</p>
                    </div>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={isMobile ? 16 : 18} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className={`w-full bg-zinc-900 border border-zinc-700 rounded-lg ${isMobile ? 'px-9 py-2.5 text-xs' : 'px-10 py-3 text-sm'} text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600`}
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={isMobile ? 16 : 18} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isMobile ? "Password (min 6 chars)" : "Create password (min 6 characters)"}
                        className={`w-full bg-zinc-900 border border-zinc-700 rounded-lg ${isMobile ? 'px-9 py-2.5 text-xs' : 'px-10 py-3 text-sm'} text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600`}
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={isMobile ? 16 : 18} />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className={`w-full bg-zinc-900 border border-zinc-700 rounded-lg ${isMobile ? 'px-9 py-2.5 text-xs' : 'px-10 py-3 text-sm'} text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600`}
                        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                      />
                    </div>
                    <button
                      onClick={handleRegister}
                      disabled={isLoading}
                      className={`w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white ${isMobile ? 'px-4 py-2.5 text-xs' : 'px-6 py-3 text-sm'} rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={isMobile ? 14 : 18} className="animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <UserIcon size={isMobile ? 14 : 18} />
                          <span>Create Account</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {authStep === 'login' && (
                  <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-xs'} space-y-3`}>
                    <div className="text-center mb-2">
                      <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-zinc-400`}>Login to your account</p>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={isMobile ? 16 : 18} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={`w-full bg-zinc-900 border border-zinc-700 rounded-lg ${isMobile ? 'px-9 py-2.5 text-xs' : 'px-10 py-3 text-sm'} text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600`}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      />
                    </div>
                    <button
                      onClick={handleLogin}
                      disabled={isLoading || !password}
                      className={`w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white ${isMobile ? 'px-4 py-2.5 text-xs' : 'px-6 py-3 text-sm'} rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={isMobile ? 14 : 18} className="animate-spin" />
                          <span>Logging in...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={isMobile ? 14 : 18} />
                          <span>Login</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
            </div>
        ) : (
            <div className="flex gap-3 items-start animate-in fade-in">
                <div className="relative group cursor-pointer" onClick={handleLogout} title="Click to Logout">
                    {/* User Avatar */}
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-2 border-zinc-800 group-hover:border-red-500 transition-colors`}>
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-white`}>
                              {user?.name?.charAt(0) || 'U'}
                          </span>
                        )}
                    </div>
                    {/* Logout Overlay Icon */}
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <LogOut size={isMobile ? 12 : 14} className="text-white" />
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                         <input 
                            type="text" 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                            placeholder={`Thoughts, ${user?.name?.split(' ')[0] || 'User'}?`}
                            className={`flex-1 bg-zinc-950 border border-zinc-800 rounded-lg ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'} text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600`}
                         />
                         <button 
                            onClick={handlePost}
                            disabled={!newComment.trim()}
                            className={`bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white ${isMobile ? 'px-3' : 'px-4'} rounded-lg transition-colors flex items-center justify-center`}
                        >
                            <Send size={isMobile ? 14 : 18} />
                         </button>
                    </div>
                    <div className={`${isMobile ? 'text-[8px]' : 'text-[10px]'} text-zinc-500 flex justify-between px-1`}>
                        <span>Signed in as <b>{user?.email}</b></span>
                        <button onClick={handleLogout} className="hover:text-red-400 transition-colors">Sign out</button>
                    </div>
                </div>
            </div>
        )}

        {/* Comment List */}
        <div className={`space-y-4 ${isMobile ? 'max-h-60' : 'max-h-80'} overflow-y-auto custom-scrollbar pr-2 mt-6`}>
           {comments.length === 0 && (
             <div className={`text-center ${isMobile ? 'py-6' : 'py-8'} text-zinc-700 ${isMobile ? 'text-[10px]' : 'text-xs'} italic border border-dashed border-zinc-800 rounded-lg`}>
               No comments yet. Be the first to start the discussion!
             </div>
           )}
           {comments.map((c) => (
             <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2 group">
                <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700 text-zinc-400 font-bold ${isMobile ? 'text-[10px]' : 'text-xs'} select-none overflow-hidden`}>
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.user} className="w-full h-full object-cover" />
                    ) : (
                      c.user.charAt(0).toUpperCase()
                    )}
                </div>
                <div className={`flex-1 bg-zinc-900/50 ${isMobile ? 'p-2' : 'p-3'} rounded-r-xl rounded-bl-xl border border-zinc-800/50 group-hover:border-zinc-700 transition-colors`}>
                   <div className="flex items-center gap-2 mb-1">
                      <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-zinc-300`}>{c.user}</span>
                      <span className={`${isMobile ? 'text-[8px]' : 'text-[10px]'} text-zinc-600`}>• {c.timestamp}</span>
                   </div>
                   <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-zinc-400 leading-relaxed whitespace-pre-wrap`}>{c.text}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
