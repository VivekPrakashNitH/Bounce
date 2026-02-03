import React from 'react';

interface AnimatedBackgroundProps {
    /** Theme variant for different page types */
    variant?: 'rockets' | 'gears' | 'code' | 'crypto' | 'gaming';
    /** Opacity of the background (0-100) */
    opacity?: number;
}

/**
 * Animated background component with floating doodle elements.
 * Renders as a fixed layer behind content.
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
    variant = 'code',
    opacity = 8,
}) => {
    // SVG doodle elements for each variant
    const elements = {
        rockets: [
            { icon: '🚀', x: 10, y: 20, size: 24, duration: 25, delay: 0 },
            { icon: '🚀', x: 80, y: 60, size: 20, duration: 30, delay: 5 },
            { icon: '⭐', x: 30, y: 80, size: 16, duration: 20, delay: 2 },
            { icon: '⭐', x: 70, y: 30, size: 14, duration: 22, delay: 8 },
            { icon: '🌙', x: 50, y: 10, size: 22, duration: 35, delay: 3 },
            { icon: '💫', x: 90, y: 90, size: 18, duration: 28, delay: 6 },
        ],
        gears: [
            { icon: '⚙️', x: 15, y: 25, size: 28, duration: 15, delay: 0 },
            { icon: '⚙️', x: 75, y: 55, size: 24, duration: 20, delay: 3 },
            { icon: '🔧', x: 45, y: 75, size: 20, duration: 18, delay: 5 },
            { icon: '⚙️', x: 85, y: 15, size: 22, duration: 25, delay: 2 },
            { icon: '🔩', x: 25, y: 85, size: 16, duration: 22, delay: 7 },
        ],
        code: [
            { icon: '<>', x: 10, y: 30, size: 20, duration: 30, delay: 0 },
            { icon: '{}', x: 70, y: 20, size: 18, duration: 25, delay: 3 },
            { icon: '()', x: 40, y: 70, size: 16, duration: 28, delay: 5 },
            { icon: '//', x: 85, y: 60, size: 14, duration: 22, delay: 2 },
            { icon: '=>', x: 20, y: 85, size: 18, duration: 35, delay: 6 },
            { icon: '[]', x: 55, y: 40, size: 16, duration: 20, delay: 8 },
        ],
        crypto: [
            { icon: '🔐', x: 15, y: 20, size: 22, duration: 28, delay: 0 },
            { icon: '🔑', x: 75, y: 50, size: 20, duration: 25, delay: 4 },
            { icon: '#', x: 40, y: 80, size: 18, duration: 30, delay: 2 },
            { icon: '🛡️', x: 85, y: 25, size: 24, duration: 22, delay: 6 },
            { icon: '⚡', x: 25, y: 60, size: 16, duration: 26, delay: 3 },
        ],
        gaming: [
            { icon: '🎮', x: 10, y: 30, size: 24, duration: 25, delay: 0 },
            { icon: '👾', x: 80, y: 20, size: 22, duration: 28, delay: 3 },
            { icon: '🕹️', x: 45, y: 75, size: 20, duration: 30, delay: 5 },
            { icon: '⭐', x: 70, y: 65, size: 16, duration: 22, delay: 2 },
            { icon: '💥', x: 25, y: 50, size: 18, duration: 26, delay: 7 },
        ],
    };

    const items = elements[variant] || elements.code;

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden z-0"
            style={{ opacity: opacity / 100 }}
        >
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="absolute font-mono text-slate-500"
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        fontSize: `${item.size}px`,
                        animation: `float-${idx % 3} ${item.duration}s ease-in-out infinite`,
                        animationDelay: `${item.delay}s`,
                    }}
                >
                    {item.icon}
                </div>
            ))}

            {/* CSS Animations */}
            <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(5deg); }
          50% { transform: translate(-5px, -25px) rotate(-3deg); }
          75% { transform: translate(-15px, -10px) rotate(2deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-12px, 18px) rotate(-4deg); }
          66% { transform: translate(8px, -12px) rotate(6deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, 20px) rotate(-8deg); }
        }
      `}</style>
        </div>
    );
};

export default AnimatedBackground;
