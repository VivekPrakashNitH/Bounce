import React, { useState, useEffect, useRef } from 'react';

interface BounceAvatarProps {
  className?: string;
  onClick?: () => void;
}

export const BounceAvatar: React.FC<BounceAvatarProps> = ({
  className = "w-10 h-10",
  onClick
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [mood, setMood] = useState<'neutral' | 'yawn' | 'smile'>('neutral');
  const [size, setSize] = useState(56);
  const [isSpinning, setIsSpinning] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);

  // Parse initial size from className (e.g., "w-14" = 56px, "w-20" = 80px)
  const parseInitialSize = (cn: string): number => {
    const match = cn.match(/w-(\d+)/);
    if (match) {
      const twUnit = parseInt(match[1], 10);
      return twUnit * 4; // Tailwind units are 0.25rem = 4px at default
    }
    return 56; // Default fallback
  };

  // Set initial size from className to prevent flash
  useEffect(() => {
    const initialSize = parseInitialSize(className);
    setSize(initialSize);
  }, []);

  // Measure actual size with ResizeObserver for accuracy
  useEffect(() => {
    const updateSize = () => {
      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setSize(Math.min(rect.width, rect.height));
        }
      }
    };

    // Use requestAnimationFrame to ensure DOM is painted
    const rafId = requestAnimationFrame(() => {
      updateSize();
    });

    // Use ResizeObserver for dynamic size changes
    let resizeObserver: ResizeObserver | null = null;
    if (avatarRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(avatarRef.current);
    }

    window.addEventListener('resize', updateSize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateSize);
      resizeObserver?.disconnect();
    };
  }, [className]);

  const scale = size / 56;

  // Blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Eye tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current) return;
      const rect = avatarRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dy, dx);

      const maxDist = 4 * scale;
      const sensitivity = 10 / scale;
      const distance = Math.min(maxDist, Math.hypot(dx, dy) / sensitivity);

      setEyePosition({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [scale]);

  // Mood cycle
  useEffect(() => {
    const moods: typeof mood[] = ['neutral', 'yawn', 'smile'];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % moods.length;
      setMood(moods[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const eyeWidth = Math.max(8 * scale, 4);
  const eyeHeight = Math.max(12 * scale, 6);
  const eyeGap = Math.max(10 * scale, 5);
  const eyeMarginBottom = Math.max(4 * scale, 2);

  const getMouthSize = () => {
    switch (mood) {
      case 'neutral':
        return { width: 10 * scale, height: 10 * scale, borderRadius: '50%' };
      case 'yawn':
        return { width: 14 * scale, height: 14 * scale, borderRadius: '50%' };
      case 'smile':
        return {
          width: 24 * scale,
          height: 12 * scale,
          borderRadius: `0 0 ${12 * scale}px ${12 * scale}px`
        };
      default:
        return { width: 10 * scale, height: 10 * scale, borderRadius: '50%' };
    }
  };

  const mouthStyle = getMouthSize();

  // CLICK HANDLER WITH SPIN
  const handleClick = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 600);

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={avatarRef}
      onClick={handleClick}

      className={`relative ${className} select-none cursor-pointer hover:scale-110`}
      style={{
        transform: isSpinning ? 'rotate(360deg)' : 'rotate(0deg)',
        transition: 'transform 0.6s ease-in-out'
      }}
    >
      {/* Main Body */}
      <div className="w-full h-full bg-white rounded-full animate-bounce flex flex-col items-center justify-center relative shadow-sm border border-zinc-200">

        {/* Eyes */}
        <div
          className="flex justify-center items-center"
          style={{
            transform: `translate(${eyePosition.x / 2}px, ${eyePosition.y / 2}px)`,
            gap: eyeGap,
            marginBottom: eyeMarginBottom,
            height: eyeHeight
          }}
        >
          {[0, 1].map(i => (
            <span
              key={i}
              style={{
                width: eyeWidth,
                height: eyeHeight,
                backgroundColor: 'black',
                borderRadius: '50%',
                transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)',
                transition: 'transform 0.1s ease'
              }}
            />
          ))}
        </div>

        {/* Mouth */}
        <div
          className="flex justify-center items-center"
          style={{ height: Math.max(16 * scale, 8) }}
        >
          <div
            style={{
              width: mouthStyle.width,
              height: mouthStyle.height,
              backgroundColor: 'black',
              borderRadius: mouthStyle.borderRadius,
              transition: 'all 0.7s ease-in-out'
            }}
          />
        </div>
      </div>

      {/* Shadow */}
      <div className="absolute -bottom-[10%] left-[15%] w-[70%] h-[15%] bg-black/50 rounded-full blur-sm animate-pulse"></div>
    </div>
  );
};
