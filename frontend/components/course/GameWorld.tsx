import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';
import { Position, Obstacle, GameState } from '../../types';

const MOVEMENT_SPEED = 12;
const AVATAR_SIZE = 48;
const ROTATION_SPEED = 15;

const OBSTACLES: Obstacle[] = [
    { id: 'wall-1', x: 400, y: 100, w: 50, h: 400, color: 'bg-zinc-800' },
    { id: 'block-1', x: 200, y: 500, w: 100, h: 100, color: 'bg-zinc-900' },
    { id: 'block-2', x: 600, y: 100, w: 200, h: 50, color: 'bg-zinc-900' },
    { id: 'block-3', x: 800, y: 400, w: 50, h: 200, color: 'bg-zinc-800' },
];

interface GameWorldProps {
    gameState: GameState;
    currentLevelIndex: number;
    trackId: string;
    trackLevels: GameState[];
    isOverlayActive: boolean; // true when snippet/quiz/profile modals are open
    onEnterLevel: (level: GameState) => void;
}

export const GameWorld: React.FC<GameWorldProps> = ({
    gameState,
    currentLevelIndex,
    trackId,
    trackLevels,
    isOverlayActive,
    onEnterLevel,
}) => {
    const [position, setPosition] = useState<Position>({ x: 50, y: 300 });
    const [rotation, setRotation] = useState(0);

    const keysPressed = useRef<Set<string>>(new Set());
    const virtualKeys = useRef<Set<string>>(new Set());

    // Reset position when entering playground
    useEffect(() => {
        if (gameState === GameState.PLAYGROUND) {
            setPosition({ x: 50, y: 300 });
        }
    }, [gameState]);

    useEffect(() => {
        if (!trackId || gameState !== GameState.PLAYGROUND) return;

        const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key);
        const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const gameLoop = setInterval(() => {
            if (isOverlayActive) return;

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
                    if (
                        playerRect.x < obs.x + obs.w &&
                        playerRect.x + playerRect.w > obs.x &&
                        playerRect.y < obs.y + obs.h &&
                        playerRect.y + playerRect.h > obs.y
                    ) {
                        hasCollision = true;
                        break;
                    }
                }

                if (hasCollision) {
                    const playerRectX = { x: boundedX, y: prev.y, w: AVATAR_SIZE, h: AVATAR_SIZE };
                    let collisionX = false;
                    for (const obs of OBSTACLES) {
                        if (
                            playerRectX.x < obs.x + obs.w &&
                            playerRectX.x + playerRectX.w > obs.x &&
                            playerRectX.y < obs.y + obs.h &&
                            playerRectX.y + playerRectX.h > obs.y
                        ) {
                            collisionX = true;
                        }
                    }

                    if (!collisionX) return { x: boundedX, y: prev.y };

                    const playerRectY = { x: prev.x, y: boundedY, w: AVATAR_SIZE, h: AVATAR_SIZE };
                    let collisionY = false;
                    for (const obs of OBSTACLES) {
                        if (
                            playerRectY.x < obs.x + obs.w &&
                            playerRectY.x + playerRectY.w > obs.x &&
                            playerRectY.y < obs.y + obs.h &&
                            playerRectY.y + playerRectY.h > obs.y
                        ) {
                            collisionY = true;
                        }
                    }

                    if (!collisionY) return { x: prev.x, y: boundedY };
                    return prev;
                }

                // Enter level zone — right edge
                if (boundedX > window.innerWidth - 100) {
                    const targetLevel = trackLevels[currentLevelIndex];
                    if (targetLevel) {
                        onEnterLevel(targetLevel);
                    }
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
    }, [gameState, isOverlayActive, trackId, trackLevels, currentLevelIndex, onEnterLevel]);

    const handleTouchStart = (key: string) => () => {
        virtualKeys.current.add(key);
    };

    const handleTouchEnd = (key: string) => () => {
        virtualKeys.current.delete(key);
    };

    if (gameState !== GameState.PLAYGROUND) return null;

    return (
        <>
            {/* Desktop hint */}
            <div className="hidden md:flex absolute bottom-20 left-10 max-w-xs text-zinc-500 text-xs pointer-events-none font-mono z-0 flex-col gap-2">
                <div className="flex items-center">
                    USE <span className="text-white border border-zinc-700 px-1 rounded mx-1">ARROWS</span> TO MOVE AROUND
                </div>
            </div>

            {/* Mobile touch controls */}
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

            {/* Obstacles */}
            {OBSTACLES.map(obs => (
                <div
                    key={obs.id}
                    className={`absolute border border-white/5 shadow-2xl backdrop-blur-sm ${obs.color}`}
                    style={{ left: obs.x, top: obs.y, width: obs.w, height: obs.h, borderRadius: '4px' }}
                >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                </div>
            ))}

            {/* Level number watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/5 pointer-events-none select-none z-0 tracking-tighter">
                {(currentLevelIndex + 1).toString().padStart(2, '0')}
            </div>

            {/* Enter zone indicator */}
            <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white/10 to-transparent flex items-center justify-center border-l border-white/5 backdrop-blur-sm animate-pulse">
                <div className="text-white font-mono text-xs rotate-90 whitespace-nowrap tracking-[0.3em] font-bold opacity-70">ENTER ZONE</div>
            </div>

            {/* Avatar */}
            <div
                className="absolute transition-transform duration-75 linear z-[100]"
                style={{ transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`, pointerEvents: 'auto' }}
            >
                <div className="relative group cursor-pointer">
                    <BounceAvatar className="w-14 h-14 sm:w-20 sm:h-20" />
                </div>
            </div>
        </>
    );
};
