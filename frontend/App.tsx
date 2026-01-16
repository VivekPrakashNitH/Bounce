
import React, { useState, useEffect, useRef } from 'react';
import { BounceAvatar } from './components/BounceAvatar';
import { LoadBalancerDemo } from './components/LoadBalancerDemo';
import { ClientServerDemo } from './components/ClientServerDemo';
import { ApiGatewayDemo } from './components/ApiGatewayDemo';
import { DatabaseShardingDemo } from './components/DatabaseShardingDemo';
import { CachingDemo } from './components/CachingDemo';
import { DockerDemo } from './components/DockerDemo';
import { MessageQueueDemo } from './components/MessageQueueDemo';
import { UrlShortenerDemo } from './components/UrlShortenerDemo';
import { InstagramDemo } from './components/InstagramDemo';
import { UberDemo } from './components/UberDemo';
import { UniversalSystemDemo } from './components/UniversalSystemDemo';
import { BackendLanguagesDemo } from './components/BackendLanguagesDemo';
import { QuadtreeVisualizer } from './components/QuadtreeVisualizer';
import { HldLldExplainer } from './components/HldLldExplainer';
import { GameArchDemo } from './components/GameArchDemo';
import { DbInternalsDemo } from './components/DbInternalsDemo';
import { GameLoopDemo } from './components/GameLoopDemo';
import { GameIntroDemo } from './components/GameIntroDemo';
import { GameNetworkingDemo } from './components/GameNetworkingDemo'; 
import { HitDetectionDemo } from './components/HitDetectionDemo'; 
import { FullStackHowTo } from './components/FullStackHowTo'; 
import { ConsistentHashingDemo } from './components/ConsistentHashingDemo'; // New
import { DbMigrationDemo } from './components/DbMigrationDemo'; // New
import { DevOpsLoopDemo } from './components/DevOpsLoopDemo';
import { ChatBubble } from './components/ChatBubble';
import { CodeViewer } from './components/CodeViewer';
import { CommentSection } from './components/CommentSection';
import { LandingPage } from './components/LandingPage';
import { QuizModal } from './components/QuizModal';
import { ProfileModal } from './components/ProfileModal';
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

type ViewState = 'HOME' | 'GAME';

export default function App() {
  const [viewState, setViewState] = useState<ViewState>('HOME');
  const [position, setPosition] = useState<Position>({ x: 50, y: 300 });
  const [rotation, setRotation] = useState(0); 
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYGROUND);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0); 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState<CodeSnippet | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
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
  // -------------------------------

  // Check for user login
  useEffect(() => {
     const checkUser = () => {
         const u = localStorage.getItem('curious_google_user');
         if (u) setCurrentUser(JSON.parse(u));
         else setCurrentUser(null);
     };
     checkUser();
     const interval = setInterval(checkUser, 2000);
     return () => clearInterval(interval);
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
    if (viewState === 'HOME') return;

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
    const currentLevel = COURSE_CONTENT[currentLevelIndex];
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
          case GameState.LEVEL_HLD_LLD: return <HldLldExplainer />;
          case GameState.LEVEL_BACKEND_LANGUAGES: return <BackendLanguagesDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_QUADTREE_DEEP_DIVE: return <QuadtreeVisualizer />;
          
          // New Components Mapped Here
          case GameState.LEVEL_GAME_INTRO: return <GameIntroDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_GAME_ARCH: return <GameArchDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_GAME_NETWORKING: return <GameNetworkingDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_GAME_PHYSICS: return <HitDetectionDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DB_INTERNALS: return <DbInternalsDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_GAME_LOOP: return <GameLoopDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DEVOPS_LOOP: return <DevOpsLoopDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_FULL_STACK_HOWTO: return <FullStackHowTo onShowCode={handleShowCode} />;
          case GameState.LEVEL_CONSISTENT_HASHING: return <ConsistentHashingDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DB_MIGRATIONS: return <DbMigrationDemo onShowCode={handleShowCode} />;

          case GameState.LEVEL_CLIENT_SERVER: return <ClientServerDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_LOAD_BALANCER: return <LoadBalancerDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_API_GATEWAY: return <ApiGatewayDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_CACHING: return <CachingDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DB_SHARDING: return <DatabaseShardingDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_DOCKER: return <DockerDemo onShowCode={handleShowCode} />;
          case GameState.LEVEL_MESSAGE_QUEUES: return <MessageQueueDemo onShowCode={handleShowCode} />;
          case GameState.CASE_URL_SHORTENER: return <UrlShortenerDemo onShowCode={handleShowCode} />;
          case GameState.CASE_INSTAGRAM: return <InstagramDemo onShowCode={handleShowCode} />;
          case GameState.CASE_UBER: return <UberDemo onShowCode={handleShowCode} />;
          default: 
            return <UniversalSystemDemo level={COURSE_CONTENT[currentLevelIndex]} onShowCode={handleShowCode} />;
      }
  };

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
        />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black text-zinc-100 overflow-hidden relative selection:bg-white/20 antialiased font-sans">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header UI */}
      <div className="fixed top-0 left-0 w-full p-6 z-50 pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto">
           <h1 className="text-3xl font-bold tracking-tighter text-white flex items-center gap-2 cursor-pointer" onClick={() => setViewState('HOME')}>
             CURIOUS<span className="text-zinc-500 text-lg font-normal tracking-wide">.SYS</span>
           </h1>
           <p className="text-zinc-500 text-xs font-medium tracking-wide pl-0.5">
             FULL STACK ARCHITECTURE
           </p>
           
           <div className="flex gap-2 mt-4">
               <button onClick={() => setViewState('HOME')} className="text-[10px] uppercase tracking-widest flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 px-4 py-2 rounded-lg border border-white/5 hover:border-white/20">
                 <Home size={10} /> Home
               </button>
               <button onClick={() => setShowRoadmap(true)} className="text-[10px] uppercase tracking-widest flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 px-4 py-2 rounded-lg border border-white/5 hover:border-white/20">
                 <Map size={10} /> Roadmap
               </button>
           </div>
        </div>
        
        <div className="flex gap-3 pointer-events-auto">
             <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest text-zinc-400 shadow-xl flex items-center">
                <span className="text-white font-bold mr-2">Level {currentLevelIndex + 1}</span> {COURSE_CONTENT[currentLevelIndex]?.title}
            </div>
            
            {currentUser && (
                <button 
                  onClick={() => setShowProfile(true)}
                  className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-lg group relative"
                >
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full opacity-80 group-hover:opacity-100" />
                </button>
            )}
            {!currentUser && (
                <button className="bg-zinc-900/50 border border-zinc-800 w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 cursor-not-allowed">
                    <User size={14} />
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

      {showProfile && (
          <ProfileModal onClose={() => setShowProfile(false)} />
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
                PRESS <span className="text-white border border-zinc-700 px-1 rounded mx-1">SPACE</span> TO ASK AI
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

          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white/10 to-transparent flex items-center justify-center border-l border-white/5 backdrop-blur-sm">
             <div className="text-white font-mono text-xs rotate-90 whitespace-nowrap tracking-[0.3em] font-bold opacity-70">
                ENTER ZONE
             </div>
          </div>
        </>
      )}

      {gameState !== GameState.PLAYGROUND && (
         <div className="absolute inset-0 flex flex-col items-center justify-start pt-20 pb-20 bg-zinc-950/95 z-40 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto custom-scrollbar">
             <button 
               onClick={handleLevelComplete}
               className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors z-50 cursor-pointer pointer-events-auto group"
             >
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight className="rotate-180" size={16} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wide">Back</span>
             </button>

             <div className="w-full max-w-4xl px-4">
                {renderLevelComponent()}
             </div>

             <div className="w-full max-w-4xl px-4 mt-8 pb-10">
                <CommentSection levelId={gameState} />
             </div>
             
             <div className="w-full flex justify-center pb-20">
                <button onClick={handleLevelComplete} className="px-8 py-3 bg-white text-black hover:bg-zinc-200 font-bold rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm tracking-wide">
                  {currentLevelIndex < COURSE_CONTENT.length - 1 ? "NEXT LEVEL / QUIZ" : "RESET COURSE"}
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
              <BounceAvatar />
          </div>
        </div>
      )}

      <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end">
         <div className="relative">
            <ChatBubble isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
         </div>

         <button 
           onClick={() => setIsChatOpen(!isChatOpen)}
           className="bg-white hover:bg-zinc-200 text-black p-4 rounded-full shadow-2xl transition-transform hover:scale-110 border border-zinc-400 flex items-center justify-center"
         >
           {isChatOpen ? <X size={20} /> : <MessageCircle size={20} />}
         </button>
      </div>

    </div>
  );
}
