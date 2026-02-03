import React, { useState, useEffect, useRef } from 'react';
import { BounceAvatar } from './BounceAvatar';
import { ClientServerDemo } from './ClientServerDemo'; // Your existing component
// Import other demos here as you create them:
// import { LoadBalancerDemo } from './LoadBalancerDemo';
import { GameState, Position, Obstacle, CourseLevel } from '../types';
import { COURSE_CONTENT } from '../data/courseContent';
import { ArrowRight, Map } from 'lucide-react';

const MOVEMENT_SPEED = 12;
const AVATAR_SIZE = 48;

// Simple obstacles for the playground
const OBSTACLES: Obstacle[] = [
  { id: 'wall-1', x: 400, y: 100, w: 50, h: 400, color: 'bg-zinc-800' },
  { id: 'block-1', x: 200, y: 500, w: 100, h: 100, color: 'bg-zinc-900' },
];

export const SystemDesignGame: React.FC = () => {
  // --- GAME STATE ---
  const [position, setPosition] = useState<Position>({ x: 50, y: 300 });
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYGROUND);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0); 
  const keysPressed = useRef<Set<string>>(new Set());

  // --- COLLISION LOGIC ---
  const checkCollision = (rect1: {x:number, y:number, w:number, h:number}, rect2: {x:number, y:number, w:number, h:number}) => {
    return (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.y + rect1.h > rect2.y
    );
  };

  // --- GAME LOOP (MOVEMENT) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key);
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = setInterval(() => {
      // Don't move if we are currently looking at a demo (like ClientServer)
      if (gameState !== GameState.PLAYGROUND) return;

      setPosition(prev => {
        let dx = 0;
        let dy = 0;

        if (keysPressed.current.has('ArrowUp')) dy -= MOVEMENT_SPEED;
        if (keysPressed.current.has('ArrowDown')) dy += MOVEMENT_SPEED;
        if (keysPressed.current.has('ArrowLeft')) dx -= MOVEMENT_SPEED;
        if (keysPressed.current.has('ArrowRight')) dx += MOVEMENT_SPEED;

        const nextX = prev.x + dx;
        const nextY = prev.y + dy;

        // Boundary Checks
        const boundedX = Math.max(0, Math.min(nextX, window.innerWidth - AVATAR_SIZE));
        const boundedY = Math.max(0, Math.min(nextY, window.innerHeight - AVATAR_SIZE));

        // Obstacle Collision
        const playerRect = { x: boundedX, y: boundedY, w: AVATAR_SIZE, h: AVATAR_SIZE };
        for (const obs of OBSTACLES) {
          if (checkCollision(playerRect, obs)) return prev; // Hit wall, stop
        }

        // --- LEVEL TRIGGER ---
        // If player walks to the far right edge of the screen
        if (boundedX > window.innerWidth - 100) {
           const targetLevel = COURSE_CONTENT[currentLevelIndex];
           setGameState(targetLevel.id); // Switch state to show the Demo
           return { x: 100, y: 300 }; // Reset position for when they come back
        }

        return { x: boundedX, y: boundedY };
      });
    }, 30); 

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(gameLoop);
    };
  }, [gameState, currentLevelIndex]);

  // --- HANDLERS ---
  const handleLevelComplete = () => {
    setGameState(GameState.PLAYGROUND); // Go back to walking
    // Advance to next level if available
    if (currentLevelIndex < COURSE_CONTENT.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setCurrentLevelIndex(0); // Loop back to start
    }
  };

  const handleShowCode = () => {
    console.log("Show Code Clicked - You can implement a modal here!");
  };

  // --- RENDER ---
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black">
      
      {/* HEADER UI */}
      <div className="absolute top-0 left-0 p-6 z-50 text-white">
        <h1 className="text-2xl font-bold font-mono">BOUNCE.SYS</h1>
        <p className="text-xs text-zinc-400">Current Level: {COURSE_CONTENT[currentLevelIndex]?.title}</p>
      </div>

      {/* 
          STATE MACHINE:
          If in PLAYGROUND -> Show Avatar and Obstacles.
          If in LEVEL_XXX  -> Show the specific Demo Component.
      */}

      {gameState === GameState.PLAYGROUND && (
        <>
          {/* Background Text */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 text-zinc-800 font-bold text-9xl select-none">
             0{currentLevelIndex + 1}
          </div>
          <div className="absolute right-10 top-1/2 text-zinc-500 font-mono rotate-90">
             WALK HERE &gt;&gt;&gt;
          </div>

          {/* Obstacles */}
          {OBSTACLES.map(obs => (
            <div 
              key={obs.id}
              className={`absolute ${obs.color} border border-white/5 rounded`}
              style={{ left: obs.x, top: obs.y, width: obs.w, height: obs.h }}
            />
          ))}

          {/* Player Avatar */}
          <div 
            className="absolute transition-transform duration-75 ease-linear z-50"
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          >
             <BounceAvatar />
          </div>
        </>
      )}

      {/* DEMO RENDERER */}
      {gameState !== GameState.PLAYGROUND && (
         <div className="absolute inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-8 animate-in fade-in">
             
             <button 
               onClick={handleLevelComplete}
               className="absolute top-8 left-8 text-white flex items-center gap-2 hover:text-cyan-400 transition-colors"
             >
                <ArrowRight className="rotate-180" /> Back to Map
             </button>

             {/* Render the specific demo based on state */}
             {gameState === GameState.LEVEL_CLIENT_SERVER && (
                <ClientServerDemo onShowCode={handleShowCode} />
             )}
             
             {/* Add other else-ifs here for other levels */}
             {gameState === GameState.LEVEL_LOAD_BALANCER && (
                <div className="text-white">Load Balancer Demo Component Here</div>
             )}

         </div>
      )}

    </div>
  );
};