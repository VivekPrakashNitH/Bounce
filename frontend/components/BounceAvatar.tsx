import React, { useState, useEffect, useRef } from 'react';

interface BounceAvatarProps {
  className?: string; // Allow custom sizing/positioning
}

export const BounceAvatar: React.FC<BounceAvatarProps> = ({ className = "w-14 h-14" }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [mood, setMood] = useState<'neutral' | 'yawn' | 'smile'>('neutral');
  const avatarRef = useRef<HTMLDivElement>(null);

  // 1. Blinking Logic
  useEffect(() => {
    const interval = setInterval(() => {
        setIsBlinking(true); 
        setTimeout(() => {
            setIsBlinking(false); 
        }, 150); 
    }, 1000); // Blink every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // 2. Eye Tracking Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current) return;
      const rect = avatarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      
      // Increased max distance to 4 (was 2.5) to allow eyes to look further down/around
      // Decreased divisor to 10 (was 15) to make eyes more sensitive to mouse movement
      const distance = Math.min(4, Math.hypot(deltaX, deltaY) / 10);
      
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      setEyePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Mood Cycling Logic
  // Sequence: Neutral (Small) -> Yawn (Big Circle) -> Smile (Inverted D) -> Loop
  useEffect(() => {
    const moodCycle: ('neutral' | 'yawn' | 'smile')[] = ['neutral', 'yawn', 'smile'];
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % moodCycle.length;
      setMood(moodCycle[index]);
    }, 2000); // Change mood every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Eye CSS: handles blinking (scale-y-0)
  const eyeClass = `w-1.5 h-2.5 bg-black rounded-full transition-transform duration-150 origin-bottom ${
    isBlinking ? "scale-y-0" : "scale-y-100"
  }`;

  // Mouth CSS configuration based on mood
  const getMouthStyle = () => {
    switch(mood) {
        case 'neutral': 
            // Small circle
            return 'w-1.5 h-1.5 rounded-full'; 
        case 'yawn':
            // Bigger circle
            return 'w-3 h-3 rounded-full'; 
        case 'smile':
            // Thinner Inverted D (Semi-circle pointing down)
            // Reduced height from 2.5 to 1.5 to make it look "thinner"/flatter
            return 'w-5 h-2.5 rounded-b-full rounded-t-none'; 
        default:
            return 'w-1.5 h-1.5 rounded-full';
    }
  };

  return (
    <div ref={avatarRef} className={`relative ${className} select-none`}>
      {/* Main Body: White circle with shadow */}
      <div className="w-full h-full bg-white rounded-full animate-bounce flex flex-col items-center justify-center z-10 relative shadow-sm border border-zinc-200">
        
        {/* Eyes Container: Moves based on mouse position */}
        <div 
          className="flex justify-center gap-2 mb-1.5"
          style={{ 
            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)` 
          }}
        >
          <span className={eyeClass}></span>
          <span className={eyeClass}></span>
        </div>
        
        {/* Mouth: Div based transition */}
        <div 
          className="flex justify-center items-center h-4" // Fixed height container to keep mouth centered
          style={{ 
            transform: `translate(${eyePosition.x * 0.5}px, ${eyePosition.y * 0.5}px)` 
          }}
        >
            <div className={`${getMouthStyle()} bg-black transition-all duration-700 ease-in-out`}></div>
        </div>

      </div>

      {/* Shadow on the floor */}
      <div className="absolute -bottom-[10%] left-[15%] w-[70%] h-[15%] bg-black/50 rounded-[100%] blur-sm animate-pulse"></div>
    </div>
  );
};