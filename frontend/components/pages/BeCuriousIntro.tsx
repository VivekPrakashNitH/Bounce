import React, { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Edges } from '@react-three/drei';
import { ArrowDown, MousePointer2 } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';
import * as THREE from 'three';

// --- 3D Components ---

const gap = 1.02; // Tight gap for sleek look

const materialProps = {
   color: "#3f3f46", // Zinc-700 (Much lighter than black for visibility)
   roughness: 0.1,   // Smoother for more reflection
   metalness: 0.8,   // Slightly less metal to reflect more ambient light
};

// Typed Props for Cubelet
interface CubeletProps {
   position: [number, number, number];
}

const Cubelet: React.FC<CubeletProps> = ({ position }) => (
   <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial {...materialProps} />
      {/* Bright White Edges to make it pop against black background */}
      <Edges color="#e4e4e7" threshold={15} scale={0.98} />
   </mesh>
);

// Typed Props for Slice
interface SliceProps {
   y: number;
   refProp: React.MutableRefObject<any>;
}

const Slice: React.FC<SliceProps> = ({ y, refProp }) => (
   <group ref={refProp} position={[0, y * gap, 0]}>
      {[-1, 0, 1].map(x =>
         [-1, 0, 1].map(z => (
            <Cubelet key={`${x}-${z}`} position={[x * gap, 0, z * gap]} />
         ))
      )}
   </group>
);

const RubiksCube = () => {
   const groupRef = useRef<any>(null);

   // Refs for horizontal slices (Y-axis layers)
   // We simulate "all sides moving" by tumbling the cube and rotating these slices
   const topSlice = useRef<any>(null);
   const midSlice = useRef<any>(null);
   const botSlice = useRef<any>(null);

   useFrame((state) => {
      const t = state.clock.getElapsedTime();

      // 1. Rotate the whole cube on its TIP (Diagonal Axis)
      // We achieve this by rotating the container group constantly
      if (groupRef.current) {
         // A slow tumble to show off all sides
         groupRef.current.rotation.x = Math.PI / 4 + Math.cos(t * 0.2) * 0.1;
         groupRef.current.rotation.y = Math.PI / 4 + t * 0.3;
         groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
      }

      // 2. Animate Slices to simulate Rubik's mechanics
      // We use a stepped sine wave to make it look like "moves" rather than continuous spinning
      const moveTime = t * 1.5;

      // Top Slice
      if (topSlice.current) {
         // Smooth interpolation could be done, but snapping looks more like a cube mechanism
         // Let's do smooth but snappy
         topSlice.current.rotation.y = (Math.PI / 2) * Math.sin(t);
      }

      // Bottom Slice (Opposite direction)
      if (botSlice.current) {
         botSlice.current.rotation.y = (Math.PI / 2) * Math.sin(t + 2);
      }

      // Middle Slice (Slight offset)
      if (midSlice.current) {
         midSlice.current.rotation.y = (Math.PI / 2) * Math.sin(t + 1) * 0.5;
      }
   });

   return (
      <group ref={groupRef} scale={0.9} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
         <Slice refProp={topSlice} y={1} />
         <Slice refProp={midSlice} y={0} />
         <Slice refProp={botSlice} y={-1} />
      </group>
   );
};

const Scene = () => {
   return (
      <>
         <ambientLight intensity={1.5} />
         {/* Stronger Main Light */}
         <spotLight position={[20, 20, 10]} angle={0.3} penumbra={1} intensity={5} color="#ffffff" />
         {/* Blue Rim Light */}
         <spotLight position={[-20, 0, -10]} angle={0.3} penumbra={1} intensity={3} color="#60a5fa" />
         {/* Fill Light */}
         <pointLight position={[0, 10, 5]} intensity={2} color="#e4e4e7" />
         <RubiksCube />
      </>
   );
};

// --- Page Sections ---

interface Props {
   onComplete: () => void;
}

export const BeCuriousIntro: React.FC<Props> = ({ onComplete }) => {
   const containerRef = useRef<HTMLDivElement>(null);

   // SECTION 1: HERO
   const SectionHero = () => (
      <div className="h-screen w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-24 relative snap-start">
         {/* Text */}
         <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="z-10 max-w-xl"
         >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
               Welcome to <br />
               <span className="text-zinc-500">BeCurious.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 font-light tracking-wide max-w-md">
               Where systems thinking meets playful exploration. A cinematic journey into backend engineering.
            </p>
         </motion.div>

         {/* 3D Cube */}
         <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute inset-0 md:relative md:w-1/2 h-[60vh] md:h-full z-0 pointer-events-none"
         >
            <Canvas camera={{ position: [0, 0, 7.5], fov: 35 }} dpr={[1, 2]}>
               <Scene />
            </Canvas>
         </motion.div>

         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-600 flex flex-col items-center gap-2"
         >
            <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
            <ArrowDown size={16} className="text-zinc-600" />
         </motion.div>
      </div>
   );

   // SECTION 2: HOW IT WORKS (Fake UI)
   const SectionDemo = () => (
      <div className="min-h-screen w-full bg-black flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 md:px-24 py-16 md:py-0 gap-8 md:gap-12 snap-start relative overflow-hidden">
         {/* Background Gradient */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

         <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 z-10 text-center md:text-left"
         >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
               See the invisible.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
               We visualize complex distributed systems—Load Balancers, Sharding, Caching—so you can touch, play, and understand them intuitively.
            </p>
         </motion.div>

         {/* Fake UI Animation */}
         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 h-48 sm:h-64 md:h-80 bg-zinc-900 border border-zinc-800 rounded-xl relative shadow-2xl overflow-hidden group"
         >
            {/* Fake Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* Fake Cursor Animation */}
            <motion.div
               animate={{
                  x: [20, 150, 150, 20],
                  y: [20, 80, 80, 20]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute z-20"
            >
               <MousePointer2 className="text-white fill-black" />
            </motion.div>

            {/* Fake Card Interaction */}
            <motion.div
               animate={{
                  scale: [1, 1, 1.05, 1],
                  borderColor: ["#27272a", "#27272a", "#3b82f6", "#27272a"]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center"
            >
               <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
               <div className="ml-3 space-y-2">
                  <div className="w-20 h-2 bg-zinc-800 rounded" />
                  <div className="w-12 h-2 bg-zinc-800 rounded" />
               </div>
            </motion.div>
         </motion.div>
      </div>
   );

   // SECTION 3: GAMEPLAY LOOP
   const SectionGameplay = () => (
      <div className="min-h-screen w-full bg-zinc-950 flex flex-col md:flex-row-reverse items-center justify-center px-4 sm:px-8 md:px-24 py-16 md:py-0 gap-8 md:gap-12 snap-start border-t border-zinc-900">
         <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 z-10 text-center md:text-left"
         >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
               Learn by playing.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
               No boring lectures. Navigate a character through code obstacles, unlock architectural patterns, and build your knowledge graph dynamically.
            </p>
         </motion.div>

         <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 h-48 sm:h-64 flex items-end justify-center relative border-b md:border-b-0 border-zinc-800 pb-8 md:pb-12"
         >
            {/* Looping Game Animation */}
            <div className="relative w-full max-w-md h-32 overflow-hidden">
               {/* Floor */}
               <div className="absolute bottom-0 w-full h-1 bg-zinc-700" />

               {/* Obstacle moving left */}
               <motion.div
                  animate={{ x: [400, -50] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-1 w-8 h-12 bg-zinc-800 border border-zinc-600 rounded-sm"
               />

               {/* Character Jumping - This is "Bounce", so it stays bouncing! */}
               <motion.div
                  animate={{ y: [0, -60, 0] }}
                  transition={{ duration: 2, times: [0.3, 0.5, 0.7], repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-1 left-20"
               >
                  <BounceAvatar className="w-12 h-12" />
               </motion.div>
            </div>
         </motion.div>
      </div>
   );

   // SECTION 4: PHILOSOPHY
   const SectionPhilosophy = () => (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center px-8 text-center snap-start relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black" />

         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="max-w-3xl z-10"
         >
            <h3 className="text-2xl md:text-4xl font-serif italic text-zinc-500 mb-8">
               "BeCurious is not about rushing. <br /> It’s about understanding."
            </h3>
            <div className="w-16 h-1 bg-white/10 mx-auto mb-8 rounded-full" />
            <p className="text-zinc-400 font-light">
               We believe deep technical intuition comes from observation and experimentation, not memorization.
            </p>
         </motion.div>
      </div>
   );

   // SECTION 5: CTA
   const SectionCTA = () => (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center px-8 relative snap-start">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center z-10"
         >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
               Ready to dive in?
            </h2>

            <button
               onClick={onComplete}
               className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-lg font-bold tracking-wide hover:bg-zinc-200 transition-all active:scale-95 overflow-hidden"
            >
               <span className="relative z-10">Start Your Journey</span>
               <ArrowDown size={20} className="relative z-10 group-hover:translate-y-1 transition-transform" />
               <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
         </motion.div>
      </div>
   );

   return (
      <div ref={containerRef} className="h-screen w-full overflow-y-scroll overflow-x-hidden bg-black snap-y snap-mandatory scroll-smooth custom-scrollbar">
         <SectionHero />
         <SectionDemo />
         <SectionGameplay />
         <SectionPhilosophy />
         <SectionCTA />
      </div>
   );
};