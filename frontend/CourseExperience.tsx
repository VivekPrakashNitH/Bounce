import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CodeViewer, CommentSection, QuizModal } from './components/ui';
import { ProfileModal, AuthModal } from './components/pages';
import { CourseHeader, RoadmapModal, GameWorld, LevelRenderer } from './components/course';
import { GameState, CodeSnippet } from './types';
import { COURSE_CONTENT } from './data/courseContent';
import { resolveTrackId, validateLevelForTrack, getTrackLevels, getDefaultLevelForTrack, TRACK_LABELS } from './routing/tracks';
import { loadTrackProgress, persistProgress, markLevelComplete, readCompletedLevels } from './routing/progress';
import { usePageTimeTracker } from './hooks/usePageTimeTracker';
import { useScrollDepthTracker } from './hooks/useScrollDepthTracker';
import { engagementApi } from './services/api';

export const CourseExperience: React.FC = () => {
  const { track, levelId } = useParams();
  const navigate = useNavigate();
  const trackId = resolveTrackId(track);
  const trackLevels = useMemo(() => (trackId ? getTrackLevels(trackId) : []), [trackId]);
  const defaultLevel = useMemo(() => (trackId ? getDefaultLevelForTrack(trackId) : null), [trackId]);

  const validatedLevelFromParams = useMemo(() => (trackId ? validateLevelForTrack(trackId, levelId) : null), [trackId, levelId]);
  const storedProgressLevel = useMemo(() => (trackId ? loadTrackProgress(trackId) : null), [trackId]);

  const initialLevelId = useMemo(() => {
    if (validatedLevelFromParams) return validatedLevelFromParams;
    if (storedProgressLevel && trackLevels.includes(storedProgressLevel)) return storedProgressLevel;
    if (defaultLevel) return defaultLevel;
    return trackLevels[0] ?? null;
  }, [validatedLevelFromParams, storedProgressLevel, defaultLevel, trackLevels]);

  // --- Core State ---
  const [gameState, setGameState] = useState<GameState>(validatedLevelFromParams ?? GameState.PLAYGROUND);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => Math.max(trackLevels.indexOf(initialLevelId ?? trackLevels[0]), 0));
  const [subLevelProgress, setSubLevelProgress] = useState(0);
  const [storedSectionIndex, setStoredSectionIndex] = useState<number | undefined>(undefined);

  // --- UI State ---
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState<CodeSnippet | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [, setCompletedLevels] = useState<GameState[]>(() => readCompletedLevels());

  const persistenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Derived ---
  const currentLevelId = trackLevels[currentLevelIndex];
  const currentLevel = useMemo(() => COURSE_CONTENT.find(l => l.id === currentLevelId), [currentLevelId]);
  const isOverlayActive = !!activeSnippet || showQuiz || showProfile;

  // --- Engagement Tracking ---
  usePageTimeTracker({
    onFlush: (data) => {
      if (currentLevelId) {
        engagementApi.submitPageTime(currentLevelId, data.activeTimeMs, data.totalTimeMs, data.tabSwitches).catch(() => { });
      }
    },
  });
  useScrollDepthTracker({
    onMilestone: (milestone) => {
      if (currentLevelId) {
        engagementApi.submitBatch([{
          eventType: 'SCROLL_DEPTH',
          pageId: currentLevelId,
          timestamp: Date.now(),
          scrollDepth: milestone,
        }], 'scroll-session').catch(() => { });
      }
    },
  });


  // --- Progress Handling ---
  const handleGranularProgress = useCallback((data: { sectionIndex: number; totalSections: number }) => {
    const ratio = data.totalSections > 0 ? (data.sectionIndex / data.totalSections) : 0;
    setSubLevelProgress(ratio);

    if (persistenceTimeoutRef.current) clearTimeout(persistenceTimeoutRef.current);
    persistenceTimeoutRef.current = setTimeout(() => {
      persistProgress(trackId!, gameState, data.sectionIndex, data.totalSections);
    }, 1000);
  }, [trackId, gameState]);

  // --- Effects ---

  // Load stored section index on mount or level change
  useEffect(() => {
    if (trackId && gameState) {
      const rawStored = localStorage.getItem('bounce_progress_v2');
      if (rawStored) {
        try {
          const parsed = JSON.parse(rawStored);
          if (parsed.track === trackId && parsed.levelId === gameState && parsed.sectionIndex !== undefined) {
            setStoredSectionIndex(parsed.sectionIndex);
          } else {
            setStoredSectionIndex(undefined);
          }
        } catch (e) { /* ignore */ }
      }
    }
  }, [trackId, gameState]);

  // User polling
  useEffect(() => {
    const checkUser = () => {
      const u = localStorage.getItem('bounce_user');
      if (u) setCurrentUser(JSON.parse(u));
      else setCurrentUser(null);
    };
    checkUser();
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track change handling
  useEffect(() => {
    if (!trackId || !trackLevels.length) return;
    const nextIndex = Math.max(trackLevels.indexOf(initialLevelId ?? trackLevels[0]), 0);
    setCurrentLevelIndex(nextIndex);
    if (!levelId) {
      setGameState(GameState.PLAYGROUND);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId, trackLevels.length]);

  // Level ID from URL handling
  useEffect(() => {
    if (!trackId) return;
    const validated = validateLevelForTrack(trackId, levelId);
    if (validated) {
      const idx = trackLevels.indexOf(validated);
      setCurrentLevelIndex(idx);
      setGameState(validated);
    } else {
      if (levelId) {
        navigate(`/course/${trackId}`, { replace: true });
      }
      setGameState(GameState.PLAYGROUND);
    }
    setSubLevelProgress(0);
  }, [trackId, levelId, trackLevels, navigate]);

  // Persist progress on level change
  useEffect(() => {
    if (trackId && trackLevels[currentLevelIndex]) {
      persistProgress(trackId, trackLevels[currentLevelIndex]);
    }
  }, [trackId, trackLevels, currentLevelIndex]);

  // --- Handlers ---

  const handleShowCode = useCallback(() => {
    if (currentLevel?.codeSnippet) {
      setActiveSnippet(currentLevel.codeSnippet);
    }
  }, [currentLevel]);

  const advanceToNextLevel = useCallback(() => {
    if (!trackId || !trackLevels.length) return;
    const isLastLevel = currentLevelIndex >= trackLevels.length - 1;

    if (isLastLevel) {
      navigate('/course-complete', { state: { track: trackId } });
      return;
    }

    const nextIndex = currentLevelIndex + 1;
    setCurrentLevelIndex(nextIndex);
    const nextLevel = trackLevels[nextIndex];
    if (nextLevel) {
      persistProgress(trackId, nextLevel);
    }

    setGameState(GameState.PLAYGROUND);
    navigate(`/course/${trackId}`);
  }, [trackId, trackLevels, currentLevelIndex, navigate]);

  const handleLevelComplete = useCallback(() => {
    if (!currentLevelId) return;
    const updated = markLevelComplete(currentLevelId);
    setCompletedLevels(updated);

    if (currentLevel?.quiz && !showQuiz) {
      setShowQuiz(true);
      return;
    }

    advanceToNextLevel();
  }, [currentLevelId, currentLevel, showQuiz, advanceToNextLevel]);

  const onQuizClose = useCallback(() => {
    setShowQuiz(false);
    setGameState(GameState.PLAYGROUND);
    advanceToNextLevel();
  }, [advanceToNextLevel]);

  const handleJumpToLevel = useCallback((idx: number) => {
    if (!trackId) return;
    const level = trackLevels[idx];
    if (!level) return;
    setCurrentLevelIndex(idx);
    setGameState(level);
    setShowRoadmap(false);
    persistProgress(trackId, level);
    navigate(`/course/${trackId}/level/${level}`);
  }, [trackId, trackLevels, navigate]);

  const handleEnterLevel = useCallback((targetLevel: GameState) => {
    if (!trackId) return;
    setGameState(targetLevel);
    persistProgress(trackId, targetLevel);
    navigate(`/course/${trackId}/level/${targetLevel}`);
  }, [trackId, navigate]);

  const getUserInitials = useCallback((name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }, []);

  // --- Guard ---
  if (!trackId || !trackLevels.length) {
    return <Navigate to="/home" replace />;
  }

  // --- Render ---
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black text-zinc-100 overflow-hidden relative selection:bg-white/20 antialiased font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <CourseHeader
        trackId={trackId}
        trackLabel={TRACK_LABELS[trackId]}
        currentLevelIndex={currentLevelIndex}
        currentLevelTitle={currentLevel?.title}
        subLevelProgress={subLevelProgress}
        totalLevels={trackLevels.length}
        currentUser={currentUser}
        onNavigateHome={() => navigate('/home')}
        onOpenRoadmap={() => setShowRoadmap(true)}
        onNavigateReviews={() => navigate('/reviews')}
        onOpenProfile={() => setShowProfile(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        getUserInitials={getUserInitials}
      />

      {/* Modals */}
      {activeSnippet && <CodeViewer snippet={activeSnippet} onClose={() => setActiveSnippet(null)} />}
      {showQuiz && currentLevel?.quiz && <QuizModal quiz={currentLevel.quiz} onClose={onQuizClose} />}
      {showProfile && currentUser && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={user => {
            setCurrentUser(user);
            localStorage.setItem('bounce_user', JSON.stringify(user));
            setShowAuthModal(false);
          }}
        />
      )}

      {showRoadmap && (
        <RoadmapModal
          trackId={trackId}
          trackLabel={TRACK_LABELS[trackId]}
          trackLevels={trackLevels}
          currentLevelIndex={currentLevelIndex}
          onJumpToLevel={handleJumpToLevel}
          onClose={() => setShowRoadmap(false)}
        />
      )}

      {/* Game Playground */}
      <GameWorld
        gameState={gameState}
        currentLevelIndex={currentLevelIndex}
        trackId={trackId}
        trackLevels={trackLevels}
        isOverlayActive={isOverlayActive}
        onEnterLevel={handleEnterLevel}
      />

      {/* Level Content */}
      {gameState !== GameState.PLAYGROUND && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 sm:pt-20 pb-20 bg-zinc-950/95 z-40 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto custom-scrollbar">
          <button
            onClick={handleLevelComplete}
            className="absolute top-20 sm:top-8 left-4 sm:left-8 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors z-50 cursor-pointer pointer-events-auto group"
          >
          </button>

          <div className="w-full max-w-5xl px-2 sm:px-4">
            <LevelRenderer
              gameState={gameState}
              onShowCode={handleShowCode}
              onProgress={handleGranularProgress}
              initialSectionIndex={storedSectionIndex}
            />
          </div>

          <div className="w-full max-w-5xl px-2 sm:px-4 mt-4 sm:mt-8 pb-10">
            <CommentSection levelId={gameState} />
          </div>

          <div className="w-full flex justify-center pb-20 px-4">
            <button
              onClick={handleLevelComplete}
              className="px-4 sm:px-8 py-2 sm:py-3 bg-white text-black hover:bg-zinc-200 font-bold rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-xs sm:text-sm tracking-wide"
            >
              {currentLevelIndex < trackLevels.length - 1 ? 'NEXT LEVEL' : 'RESET'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
