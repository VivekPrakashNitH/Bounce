import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { loadTrackProgress, persistProgress } from './progress';
import { TrackId } from './tracks';

// ── Lazy-loaded route components ────────────────────────
const BeCuriousIntro = lazy(() =>
  import('../components/pages/BeCuriousIntro').then(m => ({ default: m.BeCuriousIntro }))
);
const LandingPage = lazy(() =>
  import('../components/pages/LandingPage').then(m => ({ default: m.LandingPage }))
);
const CourseExperience = lazy(() =>
  import('../CourseExperience').then(m => ({ default: m.CourseExperience }))
);
const CourseCompletion = lazy(() =>
  import('../components/pages/CourseCompletion').then(m => ({ default: m.CourseCompletion }))
);
const ReviewsPage = lazy(() =>
  import('../components/pages/ReviewsPage').then(m => ({ default: m.ReviewsPage }))
);
const ProjectDashboard = lazy(() =>
  import('../components/pages/ProjectDashboard').then(m => ({ default: m.ProjectDashboard }))
);
const NotFoundPage = lazy(() =>
  import('../components/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage }))
);
const AdminDashboard = lazy(() =>
  import('../components/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard }))
);

// ── Loading fallback ────────────────────────────────────
const LoadingFallback = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#0a0a1a',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px', height: '40px', border: '3px solid #1e293b',
        borderTop: '3px solid #6366f1', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
      }} />
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  </div>
);

// ── Route components ────────────────────────────────────
const IntroRoute = () => {
  const navigate = useNavigate();
  return <BeCuriousIntro onComplete={() => navigate('/home')} />;
};

const HomeRoute = () => {
  const navigate = useNavigate();

  const startTrack = (track: TrackId) => {
    const level = loadTrackProgress(track);
    if (level) {
      persistProgress(track, level);
    }
    navigate(`/course/${track}`);
  };

  return (
    <LandingPage
      onStartGame={() => startTrack('system-design')}
      onStartLLD={() => startTrack('case-studies')}
      onStartQuiz={() => startTrack('case-studies')}
      onStartGameDev={() => startTrack('game-dev')}
      onStartCyber={() => startTrack('cybersecurity')}
    />
  );
};

const CompletionRoute = () => <CourseCompletion />;

// ── Router ──────────────────────────────────────────────
export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/intro" replace />} />
        <Route path="/intro" element={<IntroRoute />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/course/:track" element={<CourseExperience />} />
        <Route path="/course/:track/level/:levelId" element={<CourseExperience />} />
        <Route path="/course-complete" element={<CompletionRoute />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/my-project" element={<ProjectDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
