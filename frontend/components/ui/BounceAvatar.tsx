import React, { useState, useEffect, useRef } from 'react';

interface BounceAvatarProps {
  className?: string; // Allow custom sizing/positioning
  onClick?: () => void; // Optional click handler
}

export const BounceAvatar: React.FC<BounceAvatarProps> = ({ className = "w-10 h-10", onClick }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [mood, setMood] = useState<'neutral' | 'yawn' | 'smile'>('neutral');
  const [size, setSize] = useState(56); // Default size in pixels (w-14 = 56px)
  const avatarRef = useRef<HTMLDivElement>(null);

  // Measure actual size of the avatar
  useEffect(() => {
    const updateSize = () => {
      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        setSize(Math.min(rect.width, rect.height));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [className]);

  // Scale factor based on a base size of 56px (w-14)
  const scale = size / 56;

  // 1. Blinking Logic
  useEffect(() => {
    const interval = setInterval(() => {
        setIsBlinking(true); 
        setTimeout(() => {
            setIsBlinking(false); 
        }, 150); 
    }, 1000);

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
      
      // Scale the max distance based on avatar size
      const maxDist = 4 * scale;
      const sensitivity = 10 / scale;
      const distance = Math.min(maxDist, Math.hypot(deltaX, deltaY) / sensitivity);
      
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      setEyePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [scale]);

  // 3. Mood Cycling Logic
  useEffect(() => {
    const moodCycle: ('neutral' | 'yawn' | 'smile')[] = ['neutral', 'yawn', 'smile'];
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % moodCycle.length;
      setMood(moodCycle[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Proportional sizes (all relative to base 56px)
  // Minimum sizes ensure visibility at small scales
  const minScale = Math.max(scale, 0.5); // Don't go below half scale for features
  const eyeWidth = Math.max(8 * scale, 4);   // Larger eyes, min 4px
  const eyeHeight = Math.max(12 * scale, 6);  // Larger eyes, min 6px
  const eyeGap = Math.max(10 * scale, 5);      // gap between eyes
  const eyeMarginBottom = Math.max(4 * scale, 2); // smaller margin to mouth

  // Mouth sizes based on mood - larger for visibility
  const getMouthSize = () => {
    switch(mood) {
      case 'neutral': 
        return { width: Math.max(10 * scale, 5), height: Math.max(10 * scale, 5), borderRadius: '50%' };
      case 'yawn':
        return { width: Math.max(14 * scale, 7), height: Math.max(14 * scale, 7), borderRadius: '50%' };
      case 'smile':
        return { 
          width: Math.max(24 * scale, 12), 
          height: Math.max(12 * scale, 6), 
          borderRadius: `0 0 ${Math.max(12 * scale, 6)}px ${Math.max(12 * scale, 6)}px`
        };
      default:
        return { width: Math.max(10 * scale, 5), height: Math.max(10 * scale, 5), borderRadius: '50%' };
    }
  };

  const mouthStyle = getMouthSize();

  // Handle click - dispatch global event to open chat
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.dispatchEvent(new CustomEvent('openBounceChat'));
    }
  };

  return (
    <div 
      ref={avatarRef} 
      className={`relative ${className} select-none cursor-pointer hover:scale-110 transition-transform`}
      onClick={handleClick}
      title="Click to chat with AI!"
    >
      {/* Main Body: White circle with shadow */}
      <div className="w-full h-full bg-white rounded-full animate-bounce flex flex-col items-center justify-center z-10 relative shadow-sm border border-zinc-200">
        
        {/* Eyes Container: Moves based on mouse position */}
        <div 
          className="flex justify-center items-center"
          style={{ 
            transform: `translate(${(eyePosition.x)/2}px, ${(eyePosition.y)/2}px)`,
            gap: `${eyeGap}px`,
            marginBottom: `${eyeMarginBottom}px`,
            height: `${eyeHeight}px`
          }}
        >
          <span 
            style={{
              width: `${eyeWidth}px`,
              height: `${eyeHeight}px`,
              backgroundColor: 'black',
              borderRadius: '50%',
              transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)',
              transition: 'transform 0.1s ease',
            }}
          />
          <span 
            style={{
              width: `${eyeWidth}px`,
              height: `${eyeHeight}px`,
              backgroundColor: 'black',
              borderRadius: '50%',
              transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)',
              transition: 'transform 0.1s ease',
            }}
          />
        </div>
        
        {/* Mouth: Scaled proportionally, stays centered */}
        <div 
          className="flex justify-center items-center"
          style={{ 
            height: `${Math.max(16 * scale, 8)}px`
          }}
        >
          <div 
            style={{
              width: `${mouthStyle.width}px`,
              height: `${mouthStyle.height}px`,
              backgroundColor: 'black',
              borderRadius: mouthStyle.borderRadius,
              transition: 'all 0.7s ease-in-out',
            }}
          />
        </div>

      </div>

      {/* Shadow on the floor */}
      <div className="absolute -bottom-[10%] left-[15%] w-[70%] h-[15%] bg-black/50 rounded-[100%] blur-sm animate-pulse"></div>
    </div>
  );
};