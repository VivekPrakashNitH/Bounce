/// <reference types="@react-three/fiber" />

// Augment framer-motion to allow className on motion components
declare module 'framer-motion' {
    interface MotionProps {
        className?: string;
    }
}
