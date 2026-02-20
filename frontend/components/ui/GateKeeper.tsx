'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// ─── Theme Definitions ───────────────────────────────────────────────
export type GateTheme = 'space' | 'ocean' | 'nature' | 'cyber' | 'fire' | 'neon';

interface ThemeConfig {
    bg: string;
    accent: string;
    accentGlow: string;
    dotActive: string;
    dotBorder: string;
    ring1: string;
    ring2: string;
    ring3: string;
    hintColor: string;
    difficultyDot: string;
}

const THEMES: Record<GateTheme, ThemeConfig> = {
    space: {
        bg: 'from-slate-950 via-[#0a0e1a] to-slate-950',
        accent: 'text-cyan-400',
        accentGlow: 'shadow-[0_0_12px_rgba(34,211,238,0.8)]',
        dotActive: 'bg-cyan-400 border-cyan-300',
        dotBorder: 'border-slate-600',
        ring1: 'border-cyan-400/30',
        ring2: 'border-blue-500/30',
        ring3: 'border-purple-400/30',
        hintColor: 'text-slate-500',
        difficultyDot: 'bg-cyan-400',
    },
    ocean: {
        bg: 'from-[#020c1b] via-[#041428] to-[#061a30]',
        accent: 'text-blue-400',
        accentGlow: 'shadow-[0_0_12px_rgba(96,165,250,0.8)]',
        dotActive: 'bg-blue-400 border-blue-300',
        dotBorder: 'border-blue-900',
        ring1: 'border-blue-400/30',
        ring2: 'border-teal-500/30',
        ring3: 'border-cyan-400/30',
        hintColor: 'text-blue-800',
        difficultyDot: 'bg-blue-400',
    },
    nature: {
        bg: 'from-[#050d05] via-[#0a1a0a] to-[#071207]',
        accent: 'text-green-400',
        accentGlow: 'shadow-[0_0_12px_rgba(74,222,128,0.8)]',
        dotActive: 'bg-green-400 border-green-300',
        dotBorder: 'border-green-900',
        ring1: 'border-green-400/30',
        ring2: 'border-emerald-500/30',
        ring3: 'border-lime-400/30',
        hintColor: 'text-green-800',
        difficultyDot: 'bg-green-400',
    },
    cyber: {
        bg: 'from-[#0a0012] via-[#0d0518] to-[#050010]',
        accent: 'text-red-400',
        accentGlow: 'shadow-[0_0_12px_rgba(248,113,113,0.8)]',
        dotActive: 'bg-red-400 border-red-300',
        dotBorder: 'border-red-900',
        ring1: 'border-red-400/30',
        ring2: 'border-rose-500/30',
        ring3: 'border-pink-400/30',
        hintColor: 'text-red-900',
        difficultyDot: 'bg-red-400',
    },
    fire: {
        bg: 'from-[#0f0500] via-[#1a0a02] to-[#0d0400]',
        accent: 'text-orange-400',
        accentGlow: 'shadow-[0_0_12px_rgba(251,146,60,0.8)]',
        dotActive: 'bg-orange-400 border-orange-300',
        dotBorder: 'border-orange-900',
        ring1: 'border-orange-400/30',
        ring2: 'border-amber-500/30',
        ring3: 'border-yellow-400/30',
        hintColor: 'text-orange-900',
        difficultyDot: 'bg-orange-400',
    },
    neon: {
        bg: 'from-[#05001a] via-[#0a0028] to-[#080020]',
        accent: 'text-purple-400',
        accentGlow: 'shadow-[0_0_12px_rgba(192,132,252,0.8)]',
        dotActive: 'bg-purple-400 border-purple-300',
        dotBorder: 'border-purple-900',
        ring1: 'border-purple-400/30',
        ring2: 'border-violet-500/30',
        ring3: 'border-fuchsia-400/30',
        hintColor: 'text-purple-900',
        difficultyDot: 'bg-purple-400',
    },
};

// ─── Props ───────────────────────────────────────────────────────────
interface GateKeeperProps {
    title: string;
    subtitle: string;
    description: string;
    difficulty?: string;
    theme?: GateTheme;
    onUnlock: () => void;
}

// ═══════════════════════════════════════════════════════════════════════
// 🚀 SPACE — Twinkling stars, nebula clouds, orbiting particles
// ═══════════════════════════════════════════════════════════════════════
const SpaceBackground: React.FC = () => {
    const stars = useMemo(
        () =>
            Array.from({ length: 60 }, (_, i) => ({
                id: i,
                w: Math.random() * 2 + 1,
                top: Math.random() * 100,
                left: Math.random() * 100,
                opacity: Math.random() * 0.7 + 0.1,
                dur: Math.random() * 3 + 2,
                delay: Math.random() * 5,
            })),
        []
    );

    return (
        <>
            <div className="absolute inset-0 pointer-events-none">
                {stars.map((s) => (
                    <div
                        key={`star-${s.id}`}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: `${s.w}px`, height: `${s.w}px`,
                            top: `${s.top}%`, left: `${s.left}%`,
                            opacity: s.opacity,
                            animation: `gkTwinkle ${s.dur}s ease-in-out infinite`,
                            animationDelay: `${s.delay}s`,
                        }}
                    />
                ))}
            </div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none">
                {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
                    <div
                        key={`orbit-${idx}`}
                        className={`absolute rounded-full ${idx % 2 === 0 ? 'w-2 h-2 bg-cyan-400/40' : 'w-1.5 h-1.5 bg-purple-400/30'}`}
                        style={{
                            top: '50%', left: '50%',
                            animation: `gkOrbit ${idx % 2 === 0 ? '10s' : '14s'} linear infinite`,
                            animationDelay: `${idx * 1.67}s`,
                            transformOrigin: `${idx % 2 === 0 ? '140px' : '100px'} 0`,
                            transform: `rotate(${angle}deg)`,
                        }}
                    />
                ))}
            </div>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// 🌊 OCEAN — Swimming fish, dolphins, bubbles, waves
// ═══════════════════════════════════════════════════════════════════════
const OceanBackground: React.FC = () => {
    const fish = useMemo(() => [
        { emoji: '🐠', top: 22, dur: 12, delay: 0, size: 28, direction: 1 },
        { emoji: '🐡', top: 55, dur: 16, delay: 3, size: 24, direction: -1 },
        { emoji: '🐟', top: 38, dur: 10, delay: 6, size: 22, direction: 1 },
        { emoji: '🐠', top: 72, dur: 14, delay: 1, size: 20, direction: -1 },
        { emoji: '🐟', top: 85, dur: 18, delay: 8, size: 26, direction: 1 },
    ], []);

    const dolphins = useMemo(() => [
        { top: 15, dur: 10, delay: 2, size: 36 },
        { top: 30, dur: 14, delay: 7, size: 30 },
    ], []);

    const bubbles = useMemo(
        () => Array.from({ length: 12 }, (_, i) => ({
            id: i,
            left: Math.random() * 90 + 5,
            size: Math.random() * 10 + 4,
            dur: Math.random() * 6 + 4,
            delay: Math.random() * 8,
            opacity: Math.random() * 0.3 + 0.1,
        })),
        []
    );

    return (
        <>
            {/* Deep-sea caustics */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(96,165,250,0.3) 0%, transparent 50%),
                                      radial-gradient(ellipse at 80% 30%, rgba(34,211,238,0.2) 0%, transparent 50%),
                                      radial-gradient(ellipse at 50% 80%, rgba(56,189,248,0.2) 0%, transparent 40%)`,
                }}
            />
            {/* Swimming fish */}
            {fish.map((f, idx) => (
                <div key={`fish-${idx}`} className="absolute pointer-events-none"
                    style={{
                        top: `${f.top}%`, fontSize: `${f.size}px`,
                        animation: `gkSwim ${f.dur}s linear infinite`,
                        animationDelay: `${f.delay}s`,
                        transform: f.direction < 0 ? 'scaleX(-1)' : 'none',
                    }}
                >{f.emoji}</div>
            ))}
            {/* Dolphins arcing */}
            {dolphins.map((d, idx) => (
                <div key={`dolphin-${idx}`} className="absolute pointer-events-none"
                    style={{
                        top: `${d.top}%`, fontSize: `${d.size}px`,
                        animation: `gkDolphinArc ${d.dur}s ease-in-out infinite`,
                        animationDelay: `${d.delay}s`,
                    }}
                >🐬</div>
            ))}
            {/* Rising bubbles */}
            {bubbles.map((b) => (
                <div key={`bubble-${b.id}`}
                    className="absolute rounded-full border border-blue-300/20 bg-blue-200/5 pointer-events-none"
                    style={{
                        width: `${b.size}px`, height: `${b.size}px`,
                        left: `${b.left}%`, bottom: '-10px',
                        opacity: b.opacity,
                        animation: `gkBubbleRise ${b.dur}s ease-out infinite`,
                        animationDelay: `${b.delay}s`,
                    }}
                />
            ))}
            {/* Waves at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-[-50%] w-[200%] h-16"
                    style={{ background: 'linear-gradient(180deg, transparent, rgba(30,64,175,0.15))', borderRadius: '50% 50% 0 0', animation: 'gkWave 6s ease-in-out infinite' }} />
                <div className="absolute bottom-0 left-[-50%] w-[200%] h-12"
                    style={{ background: 'linear-gradient(180deg, transparent, rgba(56,189,248,0.1))', borderRadius: '50% 50% 0 0', animation: 'gkWave 8s ease-in-out infinite reverse' }} />
            </div>
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// 🌿 NATURE — Birds, squirrels, worms, falling leaves, fireflies
// ═══════════════════════════════════════════════════════════════════════
const NatureBackground: React.FC = () => {
    const birds = useMemo(() => [
        { emoji: '🐦', top: 12, dur: 11, delay: 0, size: 22 },
        { emoji: '🕊️', top: 25, dur: 15, delay: 4, size: 26 },
        { emoji: '🦅', top: 8, dur: 18, delay: 9, size: 30 },
        { emoji: '🐦', top: 18, dur: 13, delay: 6, size: 20 },
    ], []);

    const squirrels = useMemo(() => [
        { left: 10, dur: 8, delay: 2, size: 24 },
        { left: 60, dur: 10, delay: 5, size: 22 },
    ], []);

    const worms = useMemo(() => [
        { emoji: '🐛', left: 25, dur: 14, delay: 1, size: 18 },
        { emoji: '🪱', left: 70, dur: 18, delay: 6, size: 16 },
    ], []);

    const leaves = useMemo(
        () => Array.from({ length: 8 }, (_, i) => ({
            id: i, emoji: i % 3 === 0 ? '🍂' : '🍃',
            left: Math.random() * 90 + 5,
            dur: Math.random() * 8 + 6,
            delay: Math.random() * 10,
            size: Math.random() * 8 + 14,
        })),
        []
    );

    const fireflies = useMemo(
        () => Array.from({ length: 15 }, (_, i) => ({
            id: i,
            top: Math.random() * 80 + 10,
            left: Math.random() * 90 + 5,
            size: Math.random() * 3 + 2,
            dur: Math.random() * 3 + 2,
            delay: Math.random() * 6,
        })),
        []
    );

    return (
        <>
            {/* Faint tree silhouettes */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse 30% 80% at 10% 100%, rgba(34,197,94,0.6) 0%, transparent 70%),
                        radial-gradient(ellipse 25% 70% at 30% 100%, rgba(22,163,74,0.5) 0%, transparent 65%),
                        radial-gradient(ellipse 35% 85% at 55% 100%, rgba(34,197,94,0.4) 0%, transparent 70%),
                        radial-gradient(ellipse 20% 60% at 80% 100%, rgba(22,163,74,0.5) 0%, transparent 60%),
                        radial-gradient(ellipse 30% 75% at 95% 100%, rgba(34,197,94,0.3) 0%, transparent 65%)`,
                }}
            />
            {/* Flying birds */}
            {birds.map((b, idx) => (
                <div key={`bird-${idx}`} className="absolute pointer-events-none"
                    style={{ top: `${b.top}%`, fontSize: `${b.size}px`, animation: `gkFly ${b.dur}s linear infinite`, animationDelay: `${b.delay}s` }}
                >{b.emoji}</div>
            ))}
            {/* Bouncing squirrels */}
            {squirrels.map((s, idx) => (
                <div key={`squirrel-${idx}`} className="absolute bottom-8 pointer-events-none"
                    style={{ left: `${s.left}%`, fontSize: `${s.size}px`, animation: `gkSquirrelBounce ${s.dur}s ease-in-out infinite`, animationDelay: `${s.delay}s` }}
                >🐿️</div>
            ))}
            {/* Inching worms */}
            {worms.map((w, idx) => (
                <div key={`worm-${idx}`} className="absolute bottom-4 pointer-events-none"
                    style={{ left: `${w.left}%`, fontSize: `${w.size}px`, animation: `gkInch ${w.dur}s linear infinite`, animationDelay: `${w.delay}s` }}
                >{w.emoji}</div>
            ))}
            {/* Falling leaves */}
            {leaves.map((l) => (
                <div key={`leaf-${l.id}`} className="absolute pointer-events-none"
                    style={{ left: `${l.left}%`, top: '-30px', fontSize: `${l.size}px`, animation: `gkLeafFall ${l.dur}s ease-in-out infinite`, animationDelay: `${l.delay}s` }}
                >{l.emoji}</div>
            ))}
            {/* Fireflies */}
            {fireflies.map((f) => (
                <div key={`ff-${f.id}`} className="absolute rounded-full pointer-events-none"
                    style={{
                        top: `${f.top}%`, left: `${f.left}%`,
                        width: `${f.size}px`, height: `${f.size}px`,
                        backgroundColor: '#fbbf24',
                        boxShadow: '0 0 8px 2px rgba(251,191,36,0.6)',
                        animation: `gkFirefly ${f.dur}s ease-in-out infinite`,
                        animationDelay: `${f.delay}s`,
                    }}
                />
            ))}
            <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// 🔴 CYBER — Matrix rain, glitching scanlines, circuit flickers
// ═══════════════════════════════════════════════════════════════════════
const CyberBackground: React.FC = () => {
    const matrixColumns = useMemo(
        () => Array.from({ length: 18 }, (_, i) => ({
            id: i,
            left: (i / 18) * 100 + Math.random() * 3,
            chars: Array.from({ length: 8 }, () =>
                String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
            ).join('\n'),
            dur: Math.random() * 4 + 3,
            delay: Math.random() * 6,
            opacity: Math.random() * 0.15 + 0.05,
        })),
        []
    );

    const scanlines = useMemo(
        () => Array.from({ length: 3 }, (_, i) => ({
            id: i,
            dur: Math.random() * 3 + 4,
            delay: Math.random() * 5,
        })),
        []
    );

    const glitchBlocks = useMemo(
        () => Array.from({ length: 6 }, (_, i) => ({
            id: i,
            top: Math.random() * 90 + 5,
            left: Math.random() * 80 + 5,
            width: Math.random() * 60 + 20,
            height: Math.random() * 3 + 1,
            dur: Math.random() * 2 + 1,
            delay: Math.random() * 8,
        })),
        []
    );

    const skulls = useMemo(() => [
        { emoji: '💀', top: 20, dur: 14, delay: 0, size: 22 },
        { emoji: '🕷️', top: 65, dur: 18, delay: 5, size: 20 },
        { emoji: '🦠', top: 40, dur: 12, delay: 3, size: 24 },
        { emoji: '⚡', top: 80, dur: 10, delay: 8, size: 20 },
    ], []);

    return (
        <>
            {/* Matrix rain columns */}
            {matrixColumns.map((col) => (
                <div key={`matrix-${col.id}`}
                    className="absolute pointer-events-none font-mono text-red-400/30 whitespace-pre text-[10px] leading-[14px]"
                    style={{
                        left: `${col.left}%`, top: '-150px',
                        opacity: col.opacity,
                        animation: `gkMatrixFall ${col.dur}s linear infinite`,
                        animationDelay: `${col.delay}s`,
                    }}
                >{col.chars}</div>
            ))}
            {/* Horizontal scanlines */}
            {scanlines.map((s) => (
                <div key={`scan-${s.id}`}
                    className="absolute left-0 right-0 h-[1px] bg-red-400/10 pointer-events-none"
                    style={{
                        animation: `gkScanline ${s.dur}s linear infinite`,
                        animationDelay: `${s.delay}s`,
                    }}
                />
            ))}
            {/* Glitch blocks */}
            {glitchBlocks.map((g) => (
                <div key={`glitch-${g.id}`}
                    className="absolute pointer-events-none bg-red-500/10"
                    style={{
                        top: `${g.top}%`, left: `${g.left}%`,
                        width: `${g.width}px`, height: `${g.height}px`,
                        animation: `gkGlitch ${g.dur}s steps(3) infinite`,
                        animationDelay: `${g.delay}s`,
                    }}
                />
            ))}
            {/* Floating threat emojis */}
            {skulls.map((s, idx) => (
                <div key={`skull-${idx}`} className="absolute pointer-events-none"
                    style={{ top: `${s.top}%`, fontSize: `${s.size}px`, animation: `gkSwim ${s.dur}s linear infinite`, animationDelay: `${s.delay}s` }}
                >{s.emoji}</div>
            ))}
            {/* CRT vignette */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)`,
                }}
            />
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// 🔥 FIRE — Rising embers, flickering flames, lava cracks, sparks
// ═══════════════════════════════════════════════════════════════════════
const FireBackground: React.FC = () => {
    const embers = useMemo(
        () => Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 90 + 5,
            size: Math.random() * 4 + 2,
            dur: Math.random() * 5 + 3,
            delay: Math.random() * 6,
            sway: Math.random() * 40 - 20,
        })),
        []
    );

    const flames = useMemo(() => [
        { emoji: '🔥', left: 8, size: 30, dur: 2.5, delay: 0 },
        { emoji: '🔥', left: 25, size: 36, dur: 3, delay: 0.5 },
        { emoji: '🔥', left: 42, size: 28, dur: 2, delay: 1 },
        { emoji: '🔥', left: 58, size: 34, dur: 2.8, delay: 0.3 },
        { emoji: '🔥', left: 75, size: 32, dur: 2.2, delay: 0.8 },
        { emoji: '🔥', left: 90, size: 26, dur: 2.6, delay: 0.6 },
    ], []);

    const sparks = useMemo(
        () => Array.from({ length: 8 }, (_, i) => ({
            id: i,
            left: Math.random() * 80 + 10,
            dur: Math.random() * 2 + 1.5,
            delay: Math.random() * 5,
            size: Math.random() * 3 + 1,
        })),
        []
    );

    const hotEmojis = useMemo(() => [
        { emoji: '☄️', top: 15, dur: 8, delay: 2, size: 26 },
        { emoji: '🌋', top: 75, left: 85, size: 32, isStatic: true },
        { emoji: '🐉', top: 35, dur: 16, delay: 0, size: 28 },
    ], []);

    return (
        <>
            {/* Lava glow at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                style={{
                    background: 'linear-gradient(0deg, rgba(220,38,38,0.15) 0%, rgba(251,146,60,0.05) 50%, transparent 100%)',
                    animation: 'gkLavaGlow 3s ease-in-out infinite',
                }}
            />
            {/* Rising embers */}
            {embers.map((e) => (
                <div key={`ember-${e.id}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `${e.left}%`, bottom: '0',
                        width: `${e.size}px`, height: `${e.size}px`,
                        backgroundColor: e.id % 3 === 0 ? '#f97316' : e.id % 3 === 1 ? '#fbbf24' : '#ef4444',
                        boxShadow: `0 0 ${e.size * 2}px ${e.id % 2 === 0 ? 'rgba(249,115,22,0.8)' : 'rgba(251,191,36,0.6)'}`,
                        animation: `gkEmberRise ${e.dur}s ease-out infinite`,
                        animationDelay: `${e.delay}s`,
                    }}
                />
            ))}
            {/* Flickering flames at bottom */}
            {flames.map((f, idx) => (
                <div key={`flame-${idx}`} className="absolute bottom-0 pointer-events-none"
                    style={{
                        left: `${f.left}%`, fontSize: `${f.size}px`,
                        animation: `gkFlameFlicker ${f.dur}s ease-in-out infinite`,
                        animationDelay: `${f.delay}s`,
                    }}
                >{f.emoji}</div>
            ))}
            {/* Sparks shooting up */}
            {sparks.map((s) => (
                <div key={`spark-${s.id}`}
                    className="absolute rounded-full bg-yellow-300 pointer-events-none"
                    style={{
                        left: `${s.left}%`, bottom: '40px',
                        width: `${s.size}px`, height: `${s.size}px`,
                        boxShadow: '0 0 6px rgba(253,224,71,0.9)',
                        animation: `gkSparkShoot ${s.dur}s ease-out infinite`,
                        animationDelay: `${s.delay}s`,
                    }}
                />
            ))}
            {/* Themed emojis */}
            {hotEmojis.map((h, idx) => (
                <div key={`hot-${idx}`} className="absolute pointer-events-none"
                    style={{
                        top: h.isStatic ? `${h.top}%` : `${h.top}%`,
                        left: h.isStatic ? `${h.left}%` : undefined,
                        fontSize: `${h.size}px`,
                        animation: h.isStatic ? 'gkFlameFlicker 2s ease-in-out infinite' : `gkSwim ${h.dur}s linear infinite`,
                        animationDelay: `${h.delay || 0}s`,
                    }}
                >{h.emoji}</div>
            ))}
            <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-red-500/8 rounded-full blur-[100px] pointer-events-none" />
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// 💜 NEON — Pulsing neon tubes, geometric shapes, light rings
// ═══════════════════════════════════════════════════════════════════════
const NeonBackground: React.FC = () => {
    const neonLines = useMemo(
        () => Array.from({ length: 6 }, (_, i) => ({
            id: i,
            top: Math.random() * 80 + 10,
            width: Math.random() * 200 + 100,
            dur: Math.random() * 3 + 2,
            delay: Math.random() * 5,
            color: i % 3 === 0 ? 'rgba(192,132,252,' : i % 3 === 1 ? 'rgba(232,121,249,' : 'rgba(139,92,246,',
            rotation: Math.random() * 30 - 15,
        })),
        []
    );

    const neonShapes = useMemo(() => [
        { type: 'diamond', top: 20, left: 15, size: 40, dur: 4, delay: 0 },
        { type: 'triangle', top: 60, left: 78, size: 35, dur: 5, delay: 2 },
        { type: 'diamond', top: 75, left: 25, size: 30, dur: 3.5, delay: 1 },
        { type: 'triangle', top: 15, left: 85, size: 25, dur: 4.5, delay: 3 },
    ], []);

    const lightRings = useMemo(
        () => Array.from({ length: 4 }, (_, i) => ({
            id: i,
            top: Math.random() * 70 + 15,
            left: Math.random() * 70 + 15,
            size: Math.random() * 60 + 40,
            dur: Math.random() * 4 + 3,
            delay: Math.random() * 5,
        })),
        []
    );

    const neonEmojis = useMemo(() => [
        { emoji: '⚡', top: 25, dur: 12, delay: 0, size: 22 },
        { emoji: '💎', top: 55, dur: 16, delay: 4, size: 20 },
        { emoji: '✨', top: 70, dur: 10, delay: 7, size: 24 },
        { emoji: '🔮', top: 40, dur: 14, delay: 2, size: 26 },
    ], []);

    return (
        <>
            {/* Neon tube lines */}
            {neonLines.map((l) => (
                <div key={`nline-${l.id}`}
                    className="absolute pointer-events-none"
                    style={{
                        top: `${l.top}%`, left: '50%',
                        width: `${l.width}px`, height: '2px',
                        transform: `translateX(-50%) rotate(${l.rotation}deg)`,
                        background: `linear-gradient(90deg, transparent, ${l.color}0.6), ${l.color}0.8), ${l.color}0.6), transparent)`,
                        boxShadow: `0 0 10px ${l.color}0.4), 0 0 20px ${l.color}0.2)`,
                        animation: `gkNeonPulse ${l.dur}s ease-in-out infinite`,
                        animationDelay: `${l.delay}s`,
                    }}
                />
            ))}
            {/* Geometric shapes (diamonds & triangles) */}
            {neonShapes.map((s, idx) => (
                <div key={`shape-${idx}`}
                    className="absolute pointer-events-none"
                    style={{
                        top: `${s.top}%`, left: `${s.left}%`,
                        width: `${s.size}px`, height: `${s.size}px`,
                        border: '1px solid rgba(192,132,252,0.3)',
                        transform: s.type === 'diamond' ? 'rotate(45deg)' : 'none',
                        clipPath: s.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                        boxShadow: '0 0 8px rgba(192,132,252,0.2)',
                        animation: `gkNeonShape ${s.dur}s ease-in-out infinite`,
                        animationDelay: `${s.delay}s`,
                    }}
                />
            ))}
            {/* Light rings expanding */}
            {lightRings.map((r) => (
                <div key={`lring-${r.id}`}
                    className="absolute rounded-full border border-purple-400/20 pointer-events-none"
                    style={{
                        top: `${r.top}%`, left: `${r.left}%`,
                        width: `${r.size}px`, height: `${r.size}px`,
                        animation: `gkLightRing ${r.dur}s ease-out infinite`,
                        animationDelay: `${r.delay}s`,
                    }}
                />
            ))}
            {/* Floating neon emojis */}
            {neonEmojis.map((n, idx) => (
                <div key={`nemoji-${idx}`} className="absolute pointer-events-none"
                    style={{ top: `${n.top}%`, fontSize: `${n.size}px`, animation: `gkSwim ${n.dur}s linear infinite`, animationDelay: `${n.delay}s` }}
                >{n.emoji}</div>
            ))}
            {/* Neon ambient glow */}
            <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none" />
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN GATEKEEPER COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export const GateKeeper: React.FC<GateKeeperProps> = ({
    title,
    subtitle,
    description,
    difficulty = 'Beginner',
    theme = 'space',
    onUnlock,
}) => {
    const [tapCount, setTapCount] = useState(0);
    const [unlocked, setUnlocked] = useState(false);
    const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const REQUIRED_TAPS = 3;
    const TAP_TIMEOUT_MS = 1200;

    const t = THEMES[theme];

    const handleTap = () => {
        if (unlocked) return;
        if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

        setTapCount((prev) => {
            const next = prev + 1;
            if (next >= REQUIRED_TAPS) {
                setUnlocked(true);
                setTimeout(() => onUnlock(), 400);
                return 0;
            }
            return next;
        });

        tapTimerRef.current = setTimeout(() => setTapCount(0), TAP_TIMEOUT_MS);
    };

    useEffect(() => {
        if (unlocked) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter') handleTap();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [unlocked, tapCount]);

    useEffect(() => {
        return () => {
            if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
        };
    }, []);

    if (unlocked) {
        return (
            <div
                className={`fixed inset-0 z-50 bg-gradient-to-br ${t.bg} flex items-center justify-center pointer-events-none`}
                style={{ animation: 'gkFadeOut 0.5s ease-out forwards' }}
            >
                <style>{`@keyframes gkFadeOut { 0% { opacity:1; } 100% { opacity:0; } }`}</style>
            </div>
        );
    }

    return (
        <div
            className={`fixed inset-0 z-50 bg-gradient-to-br ${t.bg} flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none`}
            onClick={handleTap}
            onTouchStart={(e) => { e.preventDefault(); handleTap(); }}
        >
            {/* Theme-specific background */}
            {theme === 'space' && <SpaceBackground />}
            {theme === 'ocean' && <OceanBackground />}
            {theme === 'nature' && <NatureBackground />}
            {theme === 'cyber' && <CyberBackground />}
            {theme === 'fire' && <FireBackground />}
            {theme === 'neon' && <NeonBackground />}

            {/* Gate Content */}
            <div className="relative z-10 text-center flex flex-col items-center gap-6 sm:gap-8">
                <div>
                    <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 tracking-tight">{title}</h1>
                    <p className="text-base sm:text-lg text-slate-400 font-mono">{subtitle}</p>
                </div>

                {/* Triple-Tap Ring Counter */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-4 ${t.ring1} animate-spin`} style={{ animationDuration: '8s' }} />
                    <div className={`absolute inset-3 sm:inset-4 rounded-full border-4 ${t.ring2} animate-spin`} style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
                    <div className={`absolute inset-6 sm:inset-8 rounded-full border-4 ${t.ring3} animate-spin`} style={{ animationDuration: '6s' }} />
                    <div className="absolute inset-10 sm:inset-12 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-sm pointer-events-none" />
                    <div className={`absolute inset-12 sm:inset-14 rounded-full ${t.dotActive.split(' ')[0]}/20 animate-pulse`} style={{ filter: 'blur(8px)' }} />
                    <div className="relative flex gap-2.5 sm:gap-3.5 z-10">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-all duration-300 ${tapCount > i ? `${t.dotActive} ${t.accentGlow} scale-125` : `bg-transparent ${t.dotBorder}`}`} />
                        ))}
                    </div>
                </div>

                <div className="max-w-xs">
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">{description}</p>
                    <p className={`${t.hintColor} text-xs sm:text-sm font-mono hidden md:block`}>Triple click or press Enter ×3 to begin</p>
                    <p className={`${t.hintColor} text-xs sm:text-sm font-mono md:hidden`}>Triple tap to enter</p>
                </div>

                <div className="flex gap-2 items-center">
                    <div className={`w-2 h-2 rounded-full ${t.difficultyDot} animate-pulse`} />
                    <span className="text-slate-400 text-xs sm:text-sm font-mono">{difficulty}</span>
                </div>

                {tapCount > 0 && (
                    <p className={`${t.accent} text-sm font-mono animate-pulse`}>{tapCount} / {REQUIRED_TAPS}</p>
                )}
            </div>

            {/* All Keyframes */}
            <style>{`
                /* ─── SPACE ─── */
                @keyframes gkOrbit {
                    from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
                    to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
                }
                @keyframes gkTwinkle {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50%      { opacity: 0.8;  transform: scale(1.3); }
                }

                /* ─── OCEAN ─── */
                @keyframes gkSwim {
                    0%   { left: -8%;  opacity: 0; }
                    5%   { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { left: 105%; opacity: 0; }
                }
                @keyframes gkDolphinArc {
                    0%   { left: -10%; transform: translateY(0) rotate(0deg); opacity: 0; }
                    10%  { opacity: 1; }
                    25%  { transform: translateY(-60px) rotate(-15deg); }
                    50%  { transform: translateY(0) rotate(0deg); }
                    75%  { transform: translateY(-40px) rotate(-10deg); }
                    90%  { opacity: 1; }
                    100% { left: 110%; transform: translateY(0) rotate(0deg); opacity: 0; }
                }
                @keyframes gkBubbleRise {
                    0%   { transform: translateY(0) scale(0.6); opacity: 0; }
                    10%  { opacity: 1; }
                    80%  { opacity: 0.5; }
                    100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
                }
                @keyframes gkWave {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50%      { transform: translateX(3%) translateY(-8px); }
                }

                /* ─── NATURE ─── */
                @keyframes gkFly {
                    0%   { left: -8%;  transform: translateY(0); opacity: 0; }
                    5%   { opacity: 1; }
                    25%  { transform: translateY(-20px); }
                    50%  { transform: translateY(10px); }
                    75%  { transform: translateY(-15px); }
                    90%  { opacity: 1; }
                    100% { left: 105%; transform: translateY(0); opacity: 0; }
                }
                @keyframes gkSquirrelBounce {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    10%      { transform: translateX(20px) translateY(-15px); }
                    20%      { transform: translateX(40px) translateY(0); }
                    30%      { transform: translateX(60px) translateY(-12px); }
                    40%      { transform: translateX(80px) translateY(0); }
                    50%      { transform: translateX(80px) translateY(0) scaleX(-1); }
                    60%      { transform: translateX(60px) translateY(-15px) scaleX(-1); }
                    70%      { transform: translateX(40px) translateY(0) scaleX(-1); }
                    80%      { transform: translateX(20px) translateY(-12px) scaleX(-1); }
                    90%      { transform: translateX(0) translateY(0) scaleX(-1); }
                }
                @keyframes gkInch {
                    0%   { transform: translateX(0) scaleX(1); }
                    15%  { transform: translateX(0) scaleX(0.8); }
                    30%  { transform: translateX(15px) scaleX(1.1); }
                    45%  { transform: translateX(15px) scaleX(0.8); }
                    60%  { transform: translateX(30px) scaleX(1.1); }
                    75%  { transform: translateX(30px) scaleX(0.8); }
                    90%  { transform: translateX(45px) scaleX(1); }
                    100% { transform: translateX(45px) scaleX(1); }
                }
                @keyframes gkLeafFall {
                    0%   { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0; }
                    5%   { opacity: 0.8; }
                    25%  { transform: translateY(25vh) rotate(90deg) translateX(30px); }
                    50%  { transform: translateY(50vh) rotate(180deg) translateX(-20px); opacity: 0.6; }
                    75%  { transform: translateY(75vh) rotate(270deg) translateX(25px); }
                    95%  { opacity: 0.3; }
                    100% { transform: translateY(110vh) rotate(360deg) translateX(0); opacity: 0; }
                }
                @keyframes gkFirefly {
                    0%, 100% { opacity: 0.1; transform: scale(0.8); }
                    30%      { opacity: 0.9; transform: scale(1.2); }
                    60%      { opacity: 0.3; transform: scale(1); }
                    80%      { opacity: 0.7; transform: scale(1.1); }
                }

                /* ─── CYBER ─── */
                @keyframes gkMatrixFall {
                    0%   { transform: translateY(0); opacity: 0; }
                    5%   { opacity: 1; }
                    90%  { opacity: 0.5; }
                    100% { transform: translateY(110vh); opacity: 0; }
                }
                @keyframes gkScanline {
                    0%   { top: -2px; }
                    100% { top: 100%; }
                }
                @keyframes gkGlitch {
                    0%, 100% { opacity: 0; transform: translateX(0); }
                    20%      { opacity: 1; transform: translateX(5px); }
                    40%      { opacity: 0; transform: translateX(-3px); }
                    60%      { opacity: 0.7; transform: translateX(2px); }
                    80%      { opacity: 0; }
                }

                /* ─── FIRE ─── */
                @keyframes gkEmberRise {
                    0%   { transform: translateY(0) scale(1); opacity: 0; }
                    10%  { opacity: 1; }
                    50%  { opacity: 0.8; }
                    100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
                }
                @keyframes gkFlameFlicker {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
                    25%      { transform: translateY(-8px) scale(1.1); opacity: 1; }
                    50%      { transform: translateY(-3px) scale(0.95); opacity: 0.8; }
                    75%      { transform: translateY(-10px) scale(1.05); opacity: 0.9; }
                }
                @keyframes gkSparkShoot {
                    0%   { transform: translateY(0) scale(1); opacity: 0; }
                    10%  { opacity: 1; }
                    50%  { transform: translateY(-40vh) scale(0.5); opacity: 0.6; }
                    100% { transform: translateY(-80vh) scale(0); opacity: 0; }
                }
                @keyframes gkLavaGlow {
                    0%, 100% { opacity: 0.6; }
                    50%      { opacity: 1; }
                }

                /* ─── NEON ─── */
                @keyframes gkNeonPulse {
                    0%, 100% { opacity: 0.2; }
                    50%      { opacity: 0.9; }
                }
                @keyframes gkNeonShape {
                    0%, 100% { opacity: 0.15; transform: rotate(45deg) scale(1); }
                    50%      { opacity: 0.5; transform: rotate(45deg) scale(1.1); }
                }
                @keyframes gkLightRing {
                    0%   { transform: scale(0.5); opacity: 0.5; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
