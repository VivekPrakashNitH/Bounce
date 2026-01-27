
import React, { useState, useEffect, useRef } from 'react';

// UI Components
import { BounceAvatar, ChatBubble, CodeViewer, CommentSection, QuizModal, UniversalSystemDemo } from './components/ui';

// Page Components
import { LandingPage, ProfileModal, AuthModal } from './components/pages';
import { BeCuriousIntro } from './components/pages/BeCuriousIntro';

// System Design Components
import { LoadBalancerDemo, ClientServerDemo, ApiGatewayDemo, DatabaseShardingDemo, CachingDemo, DockerDemo, MessageQueueDemo, BackendLanguagesDemo, HldLldExplainer, DbInternalsDemo, FullStackHowTo, ConsistentHashingDemo, DbMigrationDemo, DevOpsLoopDemo } from './components/system-design';

// Case Studies Components
import { UrlShortenerDemo, InstagramDemo, UberDemo, QuadtreeVisualizer } from './components/case-studies';

// Gaming Components
import { GameArchDemo, GameLoopDemo, GameIntroDemo, GameNetworkingDemo, HitDetectionDemo, OrderMatchingDemo } from './components/gaming';

// Cybersecurity Components
import { EncryptionDemo, SqlInjectionDemo } from './components/Cybersecurity';

import { Position, GameState, Obstacle, CodeSnippet } from './types';
import { COURSE_CONTENT } from './data/courseContent';
import { ArrowRight, MessageCircle, Map, X, GraduationCap, Home, ArrowUp, ArrowDown, ArrowLeft, User } from 'lucide-react';

const MOVEMENT_SPEED = 12;
const AVATAR_SIZE = 48;
const ROTATION_SPEED = 15;

const OBSTACLES: Obstacle[] = [
  { id: 'wall-1', x: 400, y: 100, w: 50, h: 400, color: 'bg-zinc-800' },
  { id: 'block-1', x: 200, y: 500, w: 100, h: 100, color: 'bg-zinc-900' },
  { id: 'block-2', x: 600, y: 100, w: 200, h: 50, color: 'bg-zinc-900' },
  { id: 'block-3', x: 800, y: 400, w: 50, h: 200, color: 'bg-zinc-800' },
];

type ViewState = 'INTRO' | 'HOME' | 'GAME';

export default function App() {
  const [viewState, setViewState] = useState<ViewState>('INTRO');
  const [position, setPosition] = useState<Position>({ x: 50, y: 300 });
  const [rotation, setRotation] = useState(0); 
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYGROUND);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0); 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState<CodeSnippet | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const keysPressed = useRef<Set<string>>(new Set());
  const virtualKeys = useRef<Set<string>>(new Set()); 

  // --- STATE PERSISTENCE LOGIC ---
  useEffect(() => {
     // Save progress whenever currentLevelIndex changes
     localStorage.setItem('bounce_current_level', currentLevelIndex.toString());
  }, [currentLevelIndex]);

  const loadSavedProgress = () => {
     const saved = localStorage.getItem('bounce_current_level');
     if (saved) {
         const idx = parseInt(saved);
         if (!isNaN(idx) && idx >= 0 && idx < COURSE_CONTENT.length) {
             setCurrentLevelIndex(idx);
             return true;
         }
     }
     return false;
  };
  
  const saveCompletedLevel = (levelId: string) => {
      const saved = localStorage.getItem('bounce_completed_levels');
      let completed = saved ? JSON.parse(saved) : [];
      if (!completed.includes(levelId)) {
          completed.push(levelId);
          localStorage.setItem('bounce_completed_levels', JSON.stringify(completed));
      }
  };
  // -------------------------------

  // Check for user login
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

  // Helper function to get user initials (e.g., "VP" for "Vivek Prakash")
  const getUserInitials = (name: string) => {
     const parts = name.trim().split(/\s+/);
     if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
     }
     return name.substring(0, 2).toUpperCase();
  };

  // Listen for global BounceAvatar click events to open chat
  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    window.addEventListener('openBounceChat', handleOpenChat);
    return () => window.removeEventListener('openBounceChat', handleOpenChat);
  }, []);

  const checkCollision = (rect1: {x:number, y:number, w:number, h:number}, rect2: {x:number, y:number, w:number, h:number}) => {
    return (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.y + rect1.h > rect2.y
    );
  };

  const handleTouchStart = (key: string) => (e: React.SyntheticEvent) => {
    virtualKeys.current.add(key);
  };

  const handleTouchEnd = (key: string) => (e: React.SyntheticEvent) => {
    virtualKeys.current.delete(key);
  };

  useEffect(() => {
    if (viewState === 'HOME' || viewState === 'INTRO') return;

    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key);
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = setInterval(() => {
      if (isChatOpen || gameState !== GameState.PLAYGROUND || activeSnippet || showQuiz || showProfile) return;

      const isUp = keysPressed.current.has('ArrowUp') || virtualKeys.current.has('ArrowUp');
      const isDown = keysPressed.current.has('ArrowDown') || virtualKeys.current.has('ArrowDown');
      const isLeft = keysPressed.current.has('ArrowLeft') || virtualKeys.current.has('ArrowLeft');
      const isRight = keysPressed.current.has('ArrowRight') || virtualKeys.current.has('ArrowRight');

      if (isRight) setRotation(r => r + ROTATION_SPEED);
      if (isLeft) setRotation(r => r - ROTATION_SPEED);
      if (isUp) setRotation(r => r + ROTATION_SPEED);
      if (isDown) setRotation(r => r - ROTATION_SPEED);

      setPosition(prev => {
        let dx = 0;
        let dy = 0;

        if (isUp) dy -= MOVEMENT_SPEED;
        if (isDown) dy += MOVEMENT_SPEED;
        if (isLeft) dx -= MOVEMENT_SPEED;
        if (isRight) dx += MOVEMENT_SPEED;

        const nextX = prev.x + dx;
        const nextY = prev.y + dy;

        const boundedX = Math.max(0, Math.min(nextX, window.innerWidth - AVATAR_SIZE));
        const boundedY = Math.max(0, Math.min(nextY, window.innerHeight - AVATAR_SIZE));

        const playerRect = { x: boundedX, y: boundedY, w: AVATAR_SIZE, h: AVATAR_SIZE };
        let hasCollision = false;

        for (const obs of OBSTACLES) {
          if (checkCollision(playerRect, obs)) {
             hasCollision = true;
             break;
          }
        }

        if (hasCollision) {
           const playerRectX = { x: boundedX, y: prev.y, w: AVATAR_SIZE, h: AVATAR_SIZE };
           let collisionX = false;
           for (const obs of OBSTACLES) { if (checkCollision(playerRectX, obs)) collisionX = true; }
           
           if (!collisionX) return { x: boundedX, y: prev.y };

           const playerRectY = { x: prev.x, y: boundedY, w: AVATAR_SIZE, h: AVATAR_SIZE };
           let collisionY = false;
           for (const obs of OBSTACLES) { if (checkCollision(playerRectY, obs)) collisionY = true; }

           if (!collisionY) return { x: prev.x, y: boundedY };
           return prev; 
        }

        if (boundedX > window.innerWidth - 100) {
           const targetLevel = COURSE_CONTENT[currentLevelIndex];
           setGameState(targetLevel.id);
           return { x: 100, y: 300 }; 
        }

        return { x: boundedX, y: boundedY };
      });
    }, 30); 

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(gameLoop);
    };
  }, [isChatOpen, gameState, currentLevelIndex, activeSnippet, viewState, showQuiz, showProfile]);

  const handleLevelComplete = () => {
    // Save completion
    const currentLevel = COURSE_CONTENT[currentLevelIndex];
    saveCompletedLevel(currentLevel.id);

    if (currentLevel.quiz && !showQuiz) {
        setShowQuiz(true);
        return; 
    }

    setGameState(GameState.PLAYGROUND);
    if (currentLevelIndex < COURSE_CONTENT.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setPosition({ x: 50, y: 300 }); 
    } else {
      setCurrentLevelIndex(0);
      setPosition({ x: 50, y: 300 });
    }
  };

  const onQuizClose = () => {
      setShowQuiz(false);
      setGameState(GameState.PLAYGROUND);
      if (currentLevelIndex < COURSE_CONTENT.length - 1) {
        setCurrentLevelIndex(prev => prev + 1);
        setPosition({ x: 50, y: 300 }); 
      }
  };

  const handleJumpToLevel = (index: number) => {
    setCurrentLevelIndex(index);
    setGameState(COURSE_CONTENT[index].id);
    setShowRoadmap(false);
  };

  const handleShowCode = () => {
    const currentLevel = COURSE_CONTENT[currentLevelIndex];
    if (currentLevel && currentLevel.codeSnippet) {
        setActiveSnippet(currentLevel.codeSnippet);
    }
  };

  // Helper to find level index by ID
  const startTrack = (levelId: GameState) => {
      const idx = COURSE_CONTENT.findIndex(l => l.id === levelId);
      if (idx !== -1) {
          setCurrentLevelIndex(idx);
          setViewState('GAME');
          setGameState(GameState.PLAYGROUND);
      }
  };

  // --- COMPONENT MAPPING ---
  const renderLevelComponent = () => {
      switch(gameState) {
          // System Design & Core
          case GameState.LEVEL_HLD_LLD: return <HldLldExplainer />;
          case GameState.LEVEL_BACKEND_LANGUAGES: return <BackendLanguagesDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_CLIENT_SERVER: return <ClientServerDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_LOAD_BALANCER: return <LoadBalancerDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_API_GATEWAY: return <ApiGatewayDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_CACHING: return <CachingDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DB_SHARDING: return <DatabaseShardingDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DOCKER: return <DockerDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_MESSAGE_QUEUES: return <MessageQueueDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DB_INTERNALS: return <DbInternalsDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DEVOPS_LOOP: return <DevOpsLoopDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_FULL_STACK_HOWTO: return <FullStackHowTo onShowCode={handleShowCode} />;
          case GameState.LEVEL_CONSISTENT_HASHING: return <ConsistentHashingDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DB_MIGRATIONS: return <DbMigrationDemo onShowCode={handleShowCode} />;
          
          // Case Studies
          case GameState.CASE_URL_SHORTENER: return <UrlShortenerDemo onShowCode={handleShowCode} />;
          case GameState.CASE_INSTAGRAM: return <InstagramDemo onShowCode={handleShowCode} />;
          case GameState.CASE_UBER: return <UberDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_QUADTREE_DEEP_DIVE: return <QuadtreeVisualizer />;
          
          // Game Engineering
          case GameState.LEVEL_GAME_INTRO: return <GameIntroDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_GAME_ARCH: return <GameArchDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_GAME_NETWORKING: return <GameNetworkingDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_GAME_PHYSICS: return <HitDetectionDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_GAME_LOOP: return <GameLoopDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_ORDER_BOOK: return <OrderMatchingDemo onShowCode={handleShowCode} />;

          // Cybersecurity (NEW)
          case GameState.LEVEL_CYBER_ENCRYPTION: return <EncryptionDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_CYBER_SQLI: return <SqlInjectionDemo onShowCode={handleShowCode} />;

          default: 
            return <UniversalSystemDemo level={COURSE_CONTENT[currentLevelIndex]} onShowCode={handleShowCode} />;
      }
  };
  if (viewState === 'INTRO') {
    return <BeCuriousIntro onComplete={() => setViewState('HOME')} />;
  }

  if (viewState === 'HOME') {
    return (
        <LandingPage 
            onStartGame={() => {
                const hasSaved = loadSavedProgress();
                if (!hasSaved) startTrack(GameState.LEVEL_CLIENT_SERVER); 
                else setViewState('GAME');
            }} 
            onStartLLD={() => startTrack(GameState.LEVEL_HLD_LLD)}
            onStartQuiz={() => startTrack(GameState.CASE_URL_SHORTENER)}
            onStartGameDev={() => startTrack(GameState.LEVEL_GAME_INTRO)}
            onStartCyber={() => startTrack(GameState.LEVEL_CYBER_ENCRYPTION)}
        />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black text-zinc-100 overflow-hidden relative selection:bg-white/20 antialiased font-sans">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header UI */}
      <div className="fixed top-0 left-0 w-full p-3 sm:p-6 z-50 pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto">
           <h1 className="text-xl sm:text-3xl font-bold tracking-tighter text-white flex items-center gap-2 cursor-pointer" onClick={() => setViewState('HOME')}>
             CURIOUS<span className="text-zinc-500 text-sm sm:text-lg font-normal tracking-wide">.SYS</span>
           </h1>
           <p className="text-zinc-500 text-[10px] sm:text-xs font-medium tracking-wide pl-0.5 hidden sm:block">
             FULL STACK ARCHITECTURE
           </p>
           
           <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-4">
               <button onClick={() => setViewState('HOME')} className="text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center gap-1 sm:gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/5 hover:border-white/20">
                 <Home size={10} /> <span className="hidden sm:inline">Home</span>
               </button>
               <button onClick={() => setShowRoadmap(true)} className="text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center gap-1 sm:gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/5 hover:border-white/20">
                 <Map size={10} /> <span className="hidden sm:inline">Roadmap</span>
               </button>
           </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 pointer-events-auto items-center">
             <div className="bg-black/80 backdrop-blur-md border border-white/10 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-zinc-400 shadow-xl flex items-center">
                <span className="text-white font-bold mr-1 sm:mr-2">L{currentLevelIndex + 1}</span> <span className="hidden md:inline">{COURSE_CONTENT[currentLevelIndex]?.title}</span>
            </div>
            
            {currentUser ? (
                <button 
                  onClick={() => setShowProfile(true)}
                  className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-500/50 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg group relative overflow-hidden"
                >
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-xs">{getUserInitials(currentUser.name)}</span>
                    )}
                </button>
            ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 px-3 h-9 rounded-full flex flex-col items-center justify-center transition-colors shadow-lg group relative gap-0"
                >
                    <User size={12} className="text-zinc-300" />
                    <span className="text-[8px] text-zinc-400 font-medium">Sign In</span>
                </button>
            )}
        </div>
      </div>

      {activeSnippet && <CodeViewer snippet={activeSnippet} onClose={() => setActiveSnippet(null)} />}
      
      {showQuiz && (
          <QuizModal 
             quiz={COURSE_CONTENT[currentLevelIndex].quiz!} 
             onClose={onQuizClose} 
          />
      )}

      {showProfile && currentUser && (
          <ProfileModal onClose={() => setShowProfile(false)} />
      )}

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

      {showRoadmap && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 max-w-2xl w-full relative max-h-[90vh] flex flex-col shadow-2xl">
            <button onClick={() => setShowRoadmap(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <X />
            </button>
            <div className="flex-shrink-0 mb-8 border-b border-zinc-900 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                    <GraduationCap className="text-white" /> System Design Syllabus
                </h2>
            </div>
            
            <div className="space-y-4 relative overflow-y-auto custom-scrollbar flex-1 pr-4">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-zinc-800"></div>
              {COURSE_CONTENT.map((level, idx) => (
                <div 
                    key={level.id} 
                    onClick={() => handleJumpToLevel(idx)}
                    className="relative pl-10 py-3 group cursor-pointer hover:bg-zinc-900 rounded-xl transition-all border border-transparent hover:border-zinc-800"
                >
                   <div className={`absolute left-[5px] top-5 w-2 h-2 rounded-full ring-4 ring-zinc-950 transition-colors ${idx <= currentLevelIndex ? 'bg-white' : 'bg-zinc-800 group-hover:bg-zinc-600'}`}></div>
                   <h3 className={`font-bold text-sm tracking-wide ${idx === currentLevelIndex ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-200'}`}>
                       {level.title}
                   </h3>
                   <p className="text-xs text-zinc-600 mt-1 leading-relaxed group-hover:text-zinc-500">{level.description}</p>
                   {idx === currentLevelIndex && <span className="inline-block mt-2 text-[9px] bg-white text-black font-bold px-2 py-0.5 rounded-sm shadow-lg shadow-white/20">CURRENT</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === GameState.PLAYGROUND && (
        <>
          <div className="hidden md:flex absolute bottom-20 left-10 max-w-xs text-zinc-500 text-xs pointer-events-none font-mono z-0 flex-col gap-2">
             <div className="flex items-center">
                USE <span className="text-white border border-zinc-700 px-1 rounded mx-1">ARROWS</span> TO MOVE
             </div>
             <div className="flex items-center">
                CLICK <span className="text-white border border-zinc-700 px-1 rounded mx-1">CHAT ICON</span> TO ASK AI
             </div>
          </div>

          <div className="fixed bottom-8 left-8 z-[150] md:hidden flex flex-col items-center gap-2 select-none touch-none">
             <button 
                className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center active:bg-white/30 text-white touch-none"
                onTouchStart={handleTouchStart('ArrowUp')}
                onTouchEnd={handleTouchEnd('ArrowUp')}
                onMouseDown={handleTouchStart('ArrowUp')}
                onMouseUp={handleTouchEnd('ArrowUp')}
             >
                <ArrowUp size={24} />
             </button>
             <div className="flex gap-4">
                <button 
                    className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center active:bg-white/30 text-white touch-none"
                    onTouchStart={handleTouchStart('ArrowLeft')}
                    onTouchEnd={handleTouchEnd('ArrowLeft')}
                    onMouseDown={handleTouchStart('ArrowLeft')}
                    onMouseUp={handleTouchEnd('ArrowLeft')}
                >
                    <ArrowLeft size={24} />
                </button>
                <button 
                    className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center active:bg-white/30 text-white touch-none"
                    onTouchStart={handleTouchStart('ArrowDown')}
                    onTouchEnd={handleTouchEnd('ArrowDown')}
                    onMouseDown={handleTouchStart('ArrowDown')}
                    onMouseUp={handleTouchEnd('ArrowDown')}
                >
                    <ArrowDown size={24} />
                </button>
                <button 
                    className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center active:bg-white/30 text-white touch-none"
                    onTouchStart={handleTouchStart('ArrowRight')}
                    onTouchEnd={handleTouchEnd('ArrowRight')}
                    onMouseDown={handleTouchStart('ArrowRight')}
                    onMouseUp={handleTouchEnd('ArrowRight')}
                >
                    <ArrowRight size={24} />
                </button>
             </div>
          </div>

          {OBSTACLES.map(obs => (
            <div 
              key={obs.id}
              className={`absolute border border-white/5 shadow-2xl backdrop-blur-sm ${obs.color}`}
              style={{ left: obs.x, top: obs.y, width: obs.w, height: obs.h, borderRadius: '4px' }}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
            </div>
          ))}

          {/* NEW: Large Background Level Number */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/5 pointer-events-none select-none z-0 tracking-tighter">
             {(currentLevelIndex + 1).toString().padStart(2, '0')}
          </div>

          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white/10 to-transparent flex items-center justify-center border-l border-white/5 backdrop-blur-sm">
             <div className="text-white font-mono text-xs rotate-90 whitespace-nowrap tracking-[0.3em] font-bold opacity-70">
                ENTER ZONE
             </div>
          </div>
        </>
      )}

      {gameState !== GameState.PLAYGROUND && (
         <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 sm:pt-20 pb-20 bg-zinc-950/95 z-40 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto custom-scrollbar">
             <button 
               onClick={handleLevelComplete}
               className="absolute top-20 sm:top-8 left-4 sm:left-8 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors z-50 cursor-pointer pointer-events-auto group"
             >
                
             </button>

             <div className="w-full max-w-5xl px-2 sm:px-4">
                {renderLevelComponent()}
             </div>

             <div className="w-full max-w-5xl px-2 sm:px-4 mt-4 sm:mt-8 pb-10">
                <CommentSection levelId={gameState} />
             </div>
             
             <div className="w-full flex justify-center pb-20 px-4">
                <button onClick={handleLevelComplete} className="px-4 sm:px-8 py-2 sm:py-3 bg-white text-black hover:bg-zinc-200 font-bold rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-xs sm:text-sm tracking-wide">
                  {currentLevelIndex < COURSE_CONTENT.length - 1 ? "NEXT LEVEL" : "RESET"}
                </button>
             </div>
         </div>
      )}

      {gameState === GameState.PLAYGROUND && (
        <div 
          className="absolute transition-transform duration-75 linear z-[100]"
          style={{
              transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
              pointerEvents: 'auto' 
          }}
        >
          <div className="relative group cursor-pointer" onClick={() => setIsChatOpen(!isChatOpen)}>
              <BounceAvatar className="w-14 h-14 sm:w-20 sm:h-20" />
          </div>
        </div>
      )}

      <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-[200] flex flex-col items-end">
         <div className="relative">
            <ChatBubble isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
         </div>

         {/* Chat Icon with Ripple Effect */}
         <div className="flex flex-col items-center gap-1 sm:gap-2">
           <button 
             onClick={() => setIsChatOpen(!isChatOpen)}
             className="relative bg-white hover:bg-zinc-200 text-black p-3 sm:p-4 rounded-full shadow-2xl transition-transform hover:scale-110 border border-zinc-400 flex items-center justify-center overflow-hidden group"
           >
             <span className="absolute inset-0 rounded-full animate-pulse"></span>
             <span className="relative z-10">
               {isChatOpen ? <X size={18} /> : <MessageCircle size={18} />}
             </span>
           </button>
           {!isChatOpen && (
             <span className="text-[8px] sm:text-[10px] text-zinc-400 font-medium tracking-wide text-center whitespace-nowrap animate-pulse hidden sm:block">
               Chat with AI
             </span>
           )}
         </div>
      </div>

    </div>
  );
}
