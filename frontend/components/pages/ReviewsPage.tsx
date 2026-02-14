import { useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Send, MessageCircle, Lock, User as UserIcon, Calendar, ThumbsUp } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';
import { AuthModal } from './AuthModal';

interface Review {
    id: string;
    userId: number;
    userName: string;
    userAvatar?: string;
    rating: number;
    text: string;
    suggestions?: string;
    date: string;
    likes: number;
}

export const ReviewsPage: React.FC = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [review, setReview] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [reviews, setReviews] = useState<Review[]>(() => {
        const saved = localStorage.getItem('bounce_reviews');
        if (saved) return JSON.parse(saved);
        // Mock data
        return [
            { id: '1', userId: 99, userName: 'Alex Chen', rating: 5, text: 'The visualization of the quadtree was super helpful! I finally understand how it works.', date: new Date(Date.now() - 86400000 * 2).toISOString(), likes: 12 },
            { id: '2', userId: 98, userName: 'Sarah Jones', rating: 4, text: 'Great interactive demos. Would love to see more about Distributed Systems.', suggestions: 'Add consistent hashing demo!', date: new Date(Date.now() - 86400000 * 5).toISOString(), likes: 8 }
        ];
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            setShowAuthModal(true);
            return;
        }

        const newReview: Review = {
            id: Date.now().toString(),
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            rating,
            text: review,
            suggestions,
            date: new Date().toISOString(),
            likes: 0
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem('bounce_reviews', JSON.stringify(updatedReviews));

        // Simulate submission
        setTimeout(() => {
            setSubmitted(true);
        }, 600);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-500">
                    <div className="mb-6 flex justify-center">
                        <BounceAvatar className="w-24 h-24" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
                    <p className="text-slate-400 mb-8">Your feedback helps us make this learning experience even better.</p>

                    <button
                        onClick={() => navigate('/home')}
                        className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold rounded-lg transition-all transform hover:scale-105"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-teal-500/30">
            {/* Header-like Nav */}
            <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </button>
                    <div className="font-mono text-teal-400 font-bold">FEEDBACK LOOP</div>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-block mb-4 relative">
                        <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full"></div>
                        <BounceAvatar className="w-20 h-20 relative z-10" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">How are we doing?</h1>
                    <p className="text-slate-400 text-lg max-w-lg mx-auto">
                        We're building this to help you learn faster. Tell us what's working and what's not.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/50 p-6 sm:p-10 rounded-2xl border border-slate-800">

                    {/* Rating Section */}
                    <div className="flex flex-col items-center gap-4">
                        <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Rate your experience</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={32}
                                        className={`${(hoveredRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-amber-500/80 h-5 font-mono">
                            {hoveredRating === 1 && "Start of a journey"}
                            {hoveredRating === 2 && "Getting there"}
                            {hoveredRating === 3 && "Good"}
                            {hoveredRating === 4 && "Great!"}
                            {hoveredRating === 5 && "Mind blowing!"}
                        </p>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                        <label htmlFor="review" className="block text-sm font-semibold text-slate-300">
                            What did you like the most?
                        </label>
                        <textarea
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="The visualization of the quadtree was super helpful..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none h-32"
                        />
                    </div>

                    {/* Suggestions Text */}
                    <div className="space-y-2">
                        <label htmlFor="suggestions" className="block text-sm font-semibold text-slate-300">
                            Any suggestions for improvement?
                        </label>
                        <textarea
                            id="suggestions"
                            value={suggestions}
                            onChange={(e) => setSuggestions(e.target.value)}
                            placeholder="It would be cool if I could customize the speed of the simulation..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none h-32"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={rating === 0 && !!currentUser}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${rating > 0 || !currentUser
                            ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 active:scale-[0.98]'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {!currentUser ? <Lock size={20} /> : <Send size={20} />}
                        {!currentUser ? 'Sign in to Submit Review' : 'Submit Review'}
                    </button>
                </form>

                {/* Reviews Display Section */}
                <div className="mt-16 border-t border-slate-800 pt-10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <MessageCircle className="text-teal-400" /> Community Reviews
                    </h3>

                    <div className="space-y-4">
                        {reviews.map((rev) => (
                            <div key={rev.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {rev.userAvatar ? <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full rounded-full" /> : <UserIcon size={18} />}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">{rev.userName}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <Calendar size={10} /> {new Date(rev.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                    {rev.text}
                                </p>
                                {rev.suggestions && (
                                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 mb-3">
                                        <div className="text-xs text-teal-500 font-semibold mb-1 uppercase tracking-wider">Suggestion</div>
                                        <p className="text-slate-400 text-xs italic">{rev.suggestions}</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 pt-2 border-t border-slate-800/50">
                                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-400 transition-colors">
                                        <ThumbsUp size={12} /> Helpful ({rev.likes})
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-xs">
                        Your feedback directly influences what we build next.
                    </p>
                </div>
            </main>

            {showAuthModal && (
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={(user) => {
                        setCurrentUser(user);
                        localStorage.setItem('bounce_user', JSON.stringify(user));
                        setShowAuthModal(false);
                    }}
                />
            )}
        </div>
    );
};
