import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { BeCuriousIntro } from './components/pages/BeCuriousIntro';
import { LandingPage } from './components/pages';
import GamePage from './pages/GamePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/intro" replace />,
  },
  {
    path: '/intro',
    element: <BeCuriousIntro />,
  },
  {
    path: '/home',
    element: <LandingPage />,
  },
  {
    path: '/system-design',
    element: <GamePage />,
  },
  {
    path: '/system-design/level-:levelId',
    element: <GamePage />,
  },
  {
    path: '/system-design/hld-vs-lld',
    element: <GamePage />,
  },
  {
    path: '/case-studies',
    element: <GamePage />,
  },
  {
    path: '/case-studies/:caseId',
    element: <GamePage />,
  },
  {
    path: '/gaming',
    element: <GamePage />,
  },
  {
    path: '/gaming/:gameLevel',
    element: <GamePage />,
  },
  {
    path: '/cybersecurity',
    element: <GamePage />,
  },
  {
    path: '/cybersecurity/:cyberTopic',
    element: <GamePage />,
  },
  {
    path: '*',
    element: <Navigate to="/intro" replace />,
  },
]);
