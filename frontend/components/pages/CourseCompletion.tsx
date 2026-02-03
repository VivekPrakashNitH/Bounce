import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, RotateCcw, Sparkles } from 'lucide-react';
import { TrackId, TRACK_LABELS, ALL_TRACK_IDS } from '../../routing/tracks';
import { resetTrackProgress, persistProgress, loadTrackProgress } from '../../routing/progress';

interface LocationState {
  track?: TrackId;
}

const fallbackTrack: TrackId = 'system-design';

export const CourseCompletion: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? {};
  const track = state.track ?? fallbackTrack;

  const goHome = () => navigate('/home');

  const startTrack = (target: TrackId) => {
    const level = loadTrackProgress(target) ?? resetTrackProgress(target);
    if (level) {
      persistProgress(target, level);
    }
    navigate(`/course/${target}`);
  };

  const retryCourse = () => startTrack(track);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.06),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.08),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 w-full max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-[0_0_60px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
            <CheckCircle className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Course Complete</p>
            <h1 className="text-2xl sm:text-3xl font-bold">{TRACK_LABELS[track]} finished</h1>
          </div>
        </div>

        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
          You cleared the final lesson. Pick your next move below without losing your completed levels.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={retryCourse}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors border border-zinc-200"
          >
            <span>Retry this course</span>
            <RotateCcw size={18} />
          </button>
          <button
            onClick={goHome}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors border border-white/10"
          >
            <span>Go to Home</span>
            <Home size={18} />
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-white">
            <Sparkles size={16} className="text-amber-300" />
            <span>Try another course</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ALL_TRACK_IDS.filter(id => id !== track).map((trackId) => (
              <button
                key={trackId}
                onClick={() => startTrack(trackId)}
                className="rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-3 text-left hover:border-white/30 transition-colors"
              >
                <div className="text-xs uppercase tracking-wide text-zinc-500">
                  {trackId === 'system-design' ? 'Start' : 'Explore'}
                </div>
                <div className="text-white font-semibold">{TRACK_LABELS[trackId]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
