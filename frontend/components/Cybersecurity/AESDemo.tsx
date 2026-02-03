import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, Unlock, ArrowRight, Layers, Play, FastForward, RotateCcw } from 'lucide-react';

const generateRandomHex = () => Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase();
const generateGrid = () => Array(4).fill(0).map(() => Array(4).fill(0).map(() => generateRandomHex()));

const AESDemo: React.FC = () => {
    const [inputText, setInputText] = useState('Secret Data');
    const [keyText, setKeyText] = useState('MyKey123');
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentRound, setCurrentRound] = useState(0);
    const [currentStep, setCurrentStep] = useState<string>('Idle');
    const [explanation, setExplanation] = useState<string>('Ready to encrypt.');
    const [grid, setGrid] = useState<string[][]>(generateGrid());
    const [keyGrid, setKeyGrid] = useState<string[][]>(generateGrid());

    // Ref to stop animation on unmount or reset
    const abortController = useRef<AbortController | null>(null);

    // Cast motion.div to any to avoid TS errors with specific framer-motion versions
    const MotionDiv = motion.div as any;

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runStep = async (stepName: string, text: string, action: () => void) => {
        setCurrentStep(stepName);
        setExplanation(text);
        action();
        await delay(1200);
    };

    const handleEncrypt = async () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentRound(0);
        abortController.current = new AbortController();
        const signal = abortController.current.signal;

        try {
            // Step 1: Key Expansion
            await runStep('Key Expansion', 'The provided key is expanded into 11 separate Round Keys (for 128-bit AES).', () => {
                setKeyGrid(generateGrid());
            });
            if (signal.aborted) return;

            // Step 2: Initial Round Key Addition
            await runStep('AddRoundKey (Initial)', 'The plaintext is XORed with the initial Round Key.', () => {
                setGrid(prev => prev.map((row, r) => row.map((cell, c) => {
                    const val = parseInt(cell, 16) ^ parseInt(keyGrid[r][c], 16);
                    return val.toString(16).padStart(2, '0').toUpperCase();
                })));
            });
            if (signal.aborted) return;

            // Rounds 1 to 9
            for (let i = 1; i <= 9; i++) {
                if (signal.aborted) return;
                setCurrentRound(i);

                // SubBytes
                await runStep('SubBytes', `Round ${i}: Each byte is replaced with another according to a lookup table (S-Box) for non-linearity.`, () => {
                    setGrid(prev => prev.map(row => row.map(() => generateRandomHex())));
                });
                if (signal.aborted) return;

                // ShiftRows
                await runStep('ShiftRows', `Round ${i}: Rows are cyclically shifted to the left. Row 0: 0, Row 1: 1, Row 2: 2, Row 3: 3 positions.`, () => {
                    setGrid(prev => [
                        prev[0],
                        [...prev[1].slice(1), ...prev[1].slice(0, 1)],
                        [...prev[2].slice(2), ...prev[2].slice(0, 2)],
                        [...prev[3].slice(3), ...prev[3].slice(0, 3)]
                    ]);
                });
                if (signal.aborted) return;

                // MixColumns
                await runStep('MixColumns', `Round ${i}: Columns are mixed linearly to diffuse bits across the block.`, () => {
                    setGrid(prev => prev.map(row => row.map(() => generateRandomHex())));
                });
                if (signal.aborted) return;

                // AddRoundKey
                await runStep('AddRoundKey', `Round ${i}: The state is XORed with the Round Key for this specific round.`, () => {
                    // Visual change only
                    setKeyGrid(generateGrid());
                });
                if (signal.aborted) return;
            }

            // Final Round (No MixColumns)
            setCurrentRound(10);
            await runStep('SubBytes', 'Final Round 10: S-Box substitution.', () => {
                setGrid(prev => prev.map(row => row.map(() => generateRandomHex())));
            });
            if (signal.aborted) return;

            await runStep('ShiftRows', 'Final Round 10: Row shifting.', () => {
                setGrid(prev => [
                    prev[0],
                    [...prev[1].slice(1), ...prev[1].slice(0, 1)],
                    [...prev[2].slice(2), ...prev[2].slice(0, 2)],
                    [...prev[3].slice(3), ...prev[3].slice(0, 3)]
                ]);
            });
            if (signal.aborted) return;

            await runStep('AddRoundKey', 'Final Round 10: Final key mixing. Encrypted block complete.', () => { });

            setCurrentStep('Complete');
            setExplanation('Encryption finished. The 4x4 grid is now the Ciphertext.');
            setIsAnimating(false);

        } catch (e) {
            console.log('Animation stopped');
        }
    };

    const reset = () => {
        if (abortController.current) abortController.current.abort();
        setIsAnimating(false);
        setCurrentRound(0);
        setCurrentStep('Idle');
        setExplanation('Ready to encrypt.');
        setGrid(generateGrid());
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Controls Panel */}
                <div className="lg:col-span-1 bg-surface p-6 rounded-xl border border-slate-700 h-fit space-y-6">
                    <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <Layers className="w-5 h-5" /> AES-128 Internals
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500 font-mono uppercase">Input Block (16 bytes)</label>
                            <input
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                disabled={isAnimating}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 font-mono uppercase">Key (16 bytes)</label>
                            <input
                                value={keyText}
                                onChange={e => setKeyText(e.target.value)}
                                disabled={isAnimating}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-yellow-500"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                        <div className="text-xs text-slate-500 font-mono mb-2">CURRENT OPERATION</div>
                        <div className="text-lg font-bold text-blue-400 mb-1">{currentStep}</div>
                        <div className="text-sm text-slate-300 leading-relaxed min-h-[80px]">
                            {explanation}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleEncrypt}
                            disabled={isAnimating}
                            className={`flex-1 py-3 rounded font-bold flex items-center justify-center gap-2 ${isAnimating ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                        >
                            <Play className="w-4 h-4" /> Start
                        </button>
                        <button
                            onClick={reset}
                            className="p-3 rounded bg-slate-700 hover:bg-slate-600 text-white"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Visualization Panel */}
                <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">

                    <div className="flex justify-between w-full px-12 mb-8">
                        <div className="text-center">
                            <div className="text-xs text-slate-500 font-mono mb-1">ROUND</div>
                            <div className="text-3xl font-bold text-white">{currentRound} <span className="text-slate-600 text-lg">/ 10</span></div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-500 font-mono mb-1">BLOCK SIZE</div>
                            <div className="text-3xl font-bold text-white">128 <span className="text-slate-600 text-lg">bits</span></div>
                        </div>
                    </div>

                    {/* 4x4 State Grid */}
                    <div className="relative">
                        <div className="text-xs text-center text-slate-500 font-mono mb-2">STATE ARRAY (4x4 BYTES)</div>
                        <div className="grid grid-cols-4 gap-2 p-4 bg-slate-900 rounded-xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                            {grid.map((row, rIndex) => (
                                <React.Fragment key={rIndex}>
                                    {row.map((cell, cIndex) => (
                                        <MotionDiv
                                            key={`${rIndex}-${cIndex}`}
                                            layout // Enables automatic layout animations for ShiftRows
                                            className={`
                         w-12 h-12 flex items-center justify-center font-mono text-sm font-bold rounded border
                         ${currentStep === 'SubBytes' ? 'bg-purple-900/50 border-purple-500 text-purple-200' :
                                                    currentStep === 'MixColumns' ? 'bg-emerald-900/50 border-emerald-500 text-emerald-200' :
                                                        currentStep === 'AddRoundKey' ? 'bg-amber-900/50 border-amber-500 text-amber-200' :
                                                            'bg-slate-800 border-slate-600 text-slate-300'
                                                }
                       `}
                                            initial={false}
                                            animate={{
                                                scale: currentStep === 'AddRoundKey' ? [1, 1.1, 1] : 1,
                                                backgroundColor: currentStep === 'AddRoundKey' ? '#451a03' : undefined
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {cell}
                                        </MotionDiv>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Key Overlay for AddRoundKey step */}
                        <AnimatePresence>
                            {currentStep === 'AddRoundKey' && (
                                <MotionDiv
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 top-6 flex items-center justify-center pointer-events-none"
                                >
                                    <div className="grid grid-cols-4 gap-2 p-4">
                                        {keyGrid.flat().map((k, i) => (
                                            <div key={i} className="w-12 h-12 flex items-center justify-center text-xs text-yellow-500 font-mono opacity-50">
                                                {k}
                                            </div>
                                        ))}
                                    </div>
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Arrows indicating data flow or transformation */}
                    <div className="mt-8 flex gap-4 text-xs font-mono text-slate-500">
                        <div className={`flex items-center gap-1 ${currentStep === 'SubBytes' ? 'text-purple-400 font-bold' : 'opacity-30'}`}>
                            SUB <ArrowRight className="w-3 h-3" />
                        </div>
                        <div className={`flex items-center gap-1 ${currentStep === 'ShiftRows' ? 'text-blue-400 font-bold' : 'opacity-30'}`}>
                            SHIFT <ArrowRight className="w-3 h-3" />
                        </div>
                        <div className={`flex items-center gap-1 ${currentStep === 'MixColumns' ? 'text-emerald-400 font-bold' : 'opacity-30'}`}>
                            MIX <ArrowRight className="w-3 h-3" />
                        </div>
                        <div className={`flex items-center gap-1 ${currentStep === 'AddRoundKey' ? 'text-amber-400 font-bold' : 'opacity-30'}`}>
                            KEY
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AESDemo;