import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, LogOut, Loader2, Trash2, Edit2, Check, X } from 'lucide-react';
import { levelCommentApi, LevelComment } from '../../services/apiService';
import { AuthModal } from '../pages/AuthModal';

interface CommentSectionProps {
  levelId: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ levelId }) => {
  const [comments, setComments] = useState<LevelComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('bounce_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('bounce_user');
      }
    }
  }, []);

  // Fetch comments from backend
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await levelCommentApi.getComments(levelId);
      setComments(data);
    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [levelId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Handle successful auth
  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
    localStorage.setItem('bounce_user', JSON.stringify(authUser));
    setShowAuthModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bounce_user');
  };

  // Post a new comment
  const handlePost = async () => {
    if (!newComment.trim() || !user) return;

    setPosting(true);
    try {
      const comment = await levelCommentApi.createComment({
        content: newComment.trim(),
        levelId,
        author: user.name,
        authorEmail: user.email,
        authorAvatar: user.avatar,
      });
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err: any) {
      console.error('Failed to post comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  // Delete a comment
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await levelCommentApi.deleteComment(id);
      setComments(comments.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Failed to delete comment:', err);
      setError('Failed to delete comment. Please try again.');
    }
  };

  // Start editing a comment
  const startEdit = (comment: LevelComment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  // Save edited comment
  const saveEdit = async (id: number) => {
    if (!editText.trim()) return;
    
    try {
      // For now, we'll update locally since backend might not have update endpoint
      setComments(comments.map(c => 
        c.id === id ? { ...c, content: editText.trim(), updatedAt: new Date().toISOString() } : c
      ));
      setEditingId(null);
      setEditText('');
    } catch (err: any) {
      console.error('Failed to update comment:', err);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Check if user owns the comment
  const isOwner = (comment: LevelComment) => {
    return user && comment.authorEmail === user.email;
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 sm:mt-8 bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-zinc-400" />
          <h3 className="text-xs sm:text-sm font-bold text-zinc-200">Discussion</h3>
          <span className="text-[10px] sm:text-xs text-zinc-600">{comments.length}</span>
        </div>
        {user && (
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
            <span className="hidden sm:inline">Signed in as</span> <b className="text-zinc-300">{user.name}</b>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 sm:p-3 text-red-400 text-xs sm:text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Auth / Input Area */}
        {!user ? (
          <div className="bg-zinc-950/50 rounded-lg p-4 sm:p-8 border border-zinc-800 flex flex-col items-center justify-center gap-3 sm:gap-4">
            <div className="text-center">
              <h4 className="text-white font-bold text-sm sm:text-base mb-1">Join the conversation</h4>
              <p className="text-[10px] sm:text-xs text-zinc-500">Sign in to share your thoughts.</p>
            </div>
            
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 sm:gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all active:scale-95 shadow-lg"
            >
              Sign In / Register
            </button>
          </div>
        ) : (
          <div className="flex gap-2 sm:gap-3 items-start animate-in fade-in">
            {/* User Avatar */}
            <div className="relative group cursor-pointer" onClick={handleLogout} title="Click to Logout">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden border-2 border-zinc-800 group-hover:border-red-500 transition-colors">
                <span className="text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
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
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handlePost()}
                  placeholder={`What are your thoughts, ${user.name.split(' ')[0]}?`}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-zinc-600"
                  disabled={posting}
                />
                <button 
                  onClick={handlePost}
                  disabled={!newComment.trim() || posting}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {posting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
              <div className="text-[10px] text-zinc-500 flex justify-between px-1">
                <span>Signed in as <b>{user.email}</b></span>
                <button onClick={handleLogout} className="hover:text-red-400 transition-colors">Sign out</button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        )}

        {/* Comment List */}
        {!loading && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 mt-6">
            {comments.length === 0 && (
              <div className="text-center py-8 text-zinc-700 text-xs italic border border-dashed border-zinc-800 rounded-lg">
                No comments yet. Be the first to start the discussion!
              </div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2 group">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700 text-zinc-400 font-bold text-xs select-none">
                  {c.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 bg-zinc-900/50 p-3 rounded-r-xl rounded-bl-xl border border-zinc-800/50 group-hover:border-zinc-700 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-300">{c.author}</span>
                      <span className="text-[10px] text-zinc-600">â€¢ {formatDate(c.createdAt)}</span>
                      {c.updatedAt !== c.createdAt && (
                        <span className="text-[10px] text-zinc-600 italic">(edited)</span>
                      )}
                    </div>
                    
                    {/* Edit/Delete buttons for owner */}
                    {isOwner(c) && editingId !== c.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(c)}
                          className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Comment content or edit input */}
                  {editingId === c.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(c.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(c.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-zinc-400 hover:text-zinc-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};
