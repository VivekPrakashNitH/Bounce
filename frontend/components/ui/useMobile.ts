import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Consider mobile if either dimension is less than 768px
      setIsMobile(width < 768 || height < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', () => setTimeout(checkMobile, 100));
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', () => {});
    };
  }, []);

  return isMobile;
};
