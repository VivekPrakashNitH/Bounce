
import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, Target, Code2, MousePointerClick } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const HitDetectionDemo: React.FC<Props> = ({ onShowCode }) => {
  const [mode, setMode] = useState<'hitscan' | 'projectile'>('hitscan');
  const [shots, setShots] = useState<{id: number, x: number, y: number, angle: number, active: boolean}[]>([]);
  const [target, setTarget] = useState({ x: 300, y: 100, hit: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Projectile Loop
  useEffect(() => {
     const interval = setInterval(() => {
         setShots(prev => prev.map(s => {
             if (!s.active) return s;
             if (mode === 'hitscan') {
                 // Hitscan logic is instant, handled in click. This is just for visual fade
                 return { ...s, active: false };
             } else {
                 // Projectile physics (move forward)
                 const speed = 15;
                 const newX = s.x + Math.cos(s.angle) * speed;
                 const newY = s.y + Math.sin(s.angle) * speed;
                 
                 // Distance check for hit
                 const dist = Math.hypot(newX - target.x, newY - target.y);
                 if (dist < 20) {
                     setTarget(t => ({ ...t, hit: true }));
                     setTimeout(() => setTarget(t => ({ ...t, hit: false })), 200);
                     return { ...s, active: false };
                 }

                 if (newX > 600 || newY > 400 || newX < 0 || newY < 0) return { ...s, active: false };
                 return { ...s, x: newX, y: newY };
             }
         }).filter(s => s.active));
     }, 30);
     return () => clearInterval(interval);
  }, [mode, target.x, target.y]);

  const fire = (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Calculate angle from center-bottom (player position)
      const playerX = rect.width / 2;
      const playerY = rect.height - 20;
      const angle = Math.atan2(clickY - playerY, clickX - playerX);

      // Hitscan Logic (Instant)
      if (mode === 'hitscan') {
          // Simple line vs circle intersection check (Simplified)
          // We just check if click was close to target for demo purposes
          const dist = Math.hypot(clickX - target.x, clickY - target.y);
          if (dist < 30) {
             setTarget(t => ({ ...t, hit: true }));
             setTimeout(() => setTarget(t => ({ ...t, hit: false })), 200);
          }
          // Visual line
          setShots([{ id: Date.now(), x: playerX, y: playerY, angle, active: true }]); // Show laser for 1 frame
      } else {
          // Spawn Projectile
          setShots(prev => [...prev, { id: Date.now(), x: playerX, y: playerY, angle, active: true }]);
      }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl ${isMobile ? 'p-4' : 'p-8'} border border-slate-700 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} items-center border-b border-slate-700 pb-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-mono text-green-400 flex items-center gap-2`}>
                <Crosshair size={isMobile ? 16 : 24} /> Hit Detection Math
             </h3>
          </div>
          <div className={`flex ${isMobile ? 'flex-wrap justify-center' : ''} gap-2`}>
             <button 
                onClick={() => setMode('hitscan')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${mode === 'hitscan' ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400'}`}
             >
                Hitscan (Laser)
             </button>
             <button 
                onClick={() => setMode('projectile')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${mode === 'projectile' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
             >
                Projectile (Bullet)
             </button>
             <button onClick={onShowCode} className="ml-4 flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400">
                <Code2 size={14} /> Code
            </button>
          </div>
       </div>

       <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-8'} ${isMobile ? 'h-auto' : 'h-80'}`}>
           
           {/* Game View */}
           <div 
             ref={containerRef}
             className={`${isMobile ? 'col-span-1 h-48' : 'col-span-2'} bg-black border border-slate-700 rounded-lg relative overflow-hidden cursor-crosshair`}
             onClick={fire}
           >
               <div className="absolute top-2 left-2 text-[10px] text-slate-500 font-mono">CLICK TO SHOOT</div>

               {/* Target */}
               <div 
                 className={`absolute w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${target.hit ? 'bg-red-500 border-red-200 scale-110' : 'bg-slate-800 border-red-500'}`}
                 style={{ left: target.x - 20, top: target.y - 20 }}
               >
                   <Target size={20} className="text-white" />
               </div>

               {/* Player Gun */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-slate-600 rounded-t-lg"></div>

               {/* Shots */}
               {shots.map(s => {
                   if (mode === 'hitscan') {
                       // Draw Laser Line
                       return (
                           <div 
                             key={s.id}
                             className="absolute bg-yellow-400 opacity-80 origin-left animate-ping"
                             style={{ 
                                 height: '2px', 
                                 width: '1000px', 
                                 left: s.x, 
                                 top: s.y, 
                                 transform: `rotate(${s.angle}rad)` 
                             }}
                           ></div>
                       );
                   } else {
                       // Draw Projectile Dot
                       return (
                           <div 
                             key={s.id}
                             className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_blue]"
                             style={{ left: s.x, top: s.y }}
                           ></div>
                       );
                   }
               })}
           </div>

           {/* Info Panel */}
           <div className={`col-span-1 flex flex-col justify-center ${isMobile ? 'space-y-3' : 'space-y-6'}`}>
               <div className={`bg-slate-800 ${isMobile ? 'p-3' : 'p-4'} rounded-xl border border-slate-700`}>
                  <h4 className="text-sm font-bold text-white mb-2">
                      {mode === 'hitscan' ? 'Raycasting (Hitscan)' : 'Physics Object (Projectile)'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                      {mode === 'hitscan' 
                        ? "Math: Checks if a line (Ray) intersects with a box. Instant. Used in Call of Duty, CS:GO for most guns."
                        : "Math: Updates X/Y position every frame based on velocity. Can have gravity/drop. Used in Battlefield, PUBG snipers."}
                  </p>
               </div>
               
               <div className="p-3 bg-black rounded font-mono text-[10px] text-green-400 border border-slate-800">
                   {mode === 'hitscan' ? (
                       <>
                         bool Raycast() {'{'}<br/>
                         &nbsp;&nbsp;return Intersect(ray, enemy);<br/>
                         {'}'}
                       </>
                   ) : (
                       <>
                         void Update() {'{'}<br/>
                         &nbsp;&nbsp;pos.x += vel.x * dt;<br/>
                         &nbsp;&nbsp;pos.y += vel.y * dt;<br/>
                         {'}'}
                       </>
                   )}
               </div>
           </div>

       </div>
    </div>
  );
};
