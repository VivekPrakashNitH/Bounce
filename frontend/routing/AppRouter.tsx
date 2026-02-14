import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BeCuriousIntro } from '../components/pages/BeCuriousIntro';
import { LandingPage } from '../components/pages/LandingPage';
import { CourseCompletion } from '../components/pages/CourseCompletion.tsx';
import { ReviewsPage } from '../components/pages/ReviewsPage';
import { CourseExperience } from '../CourseExperience';
import { loadTrackProgress, persistProgress } from './progress';
import { TrackId } from './tracks';

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

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/intro" replace />} />
      <Route path="/intro" element={<IntroRoute />} />
      <Route path="/home" element={<HomeRoute />} />
      <Route path="/course/:track" element={<CourseExperience />} />
      <Route path="/course/:track/level/:levelId" element={<CourseExperience />} />
      <Route path="/course-complete" element={<CompletionRoute />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="*" element={<Navigate to="/intro" replace />} />
    </Routes>
  </BrowserRouter>
);
