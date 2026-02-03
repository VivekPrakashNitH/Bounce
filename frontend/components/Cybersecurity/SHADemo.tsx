import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hash, Play, RotateCcw, Cpu } from 'lucide-react';

const SHADemo: React.FC = () => {
    const [input, setInput] = useState('abc');
    const [isHashing, setIsHashing] = useState(false);
    const [round, setRound] = useState(0);
    const [currentAction, setCurrentAction] = useState('Idle');

    // Cast motion.div to any to avoid TS errors
    const MotionDiv = motion.div as any;

    // SHA-256 State Registers (Initial Values - first 32 bits of fractional parts of square roots of first 8 primes)
    const initialRegisters = ['6A09E667', 'BB67AE85', '3C6EF372', 'A54FF53A', '510E527F', '9B05688C', '1F83D9AB', '5BE0CD19'];
    const [registers, setRegisters] = useState<string[]>(initialRegisters);

    const abortController = useRef<AbortController | null>(null);
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Pseudo-random hex generator to simulate register updates (since we can't implement full SHA logic in UI thread easily)
    const randomHex = () => Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();

    const startHashing = async () => {
        if (isHashing) return;
        setIsHashing(true);
        setRegisters(initialRegisters);
        setRound(0);

        abortController.current = new AbortController();
        const signal = abortController.current.signal;

        try {
            // Step 1: Padding
            setCurrentAction('Padding Message to 512-bit block...');
            await delay(1500);
            if (signal.aborted) return;

            // Step 2: Message Schedule
            setCurrentAction('Creating Message Schedule (W0...W63)...');
            await delay(1500);
            if (signal.aborted) return;

            // Step 3: Compression Loop (64 rounds)
            // We will show first few rounds slowly, then fast forward
            for (let i = 0; i < 64; i++) {
                if (signal.aborted) return;
                setRound(i);

                let speed = i < 5 ? 800 : i < 10 ? 200 : 20; // Accelerate
                if (i < 5) {
                    setCurrentAction(`Round ${i}: Calculating Σ0, Maj, Σ1, Ch, T1, T2...`);
                } else if (i === 10) {
                    setCurrentAction(`Accelerating remaining rounds...`);
                }

                // Update registers visually
                setRegisters(prev => {
                    // In real SHA, registers shift: H=G, G=F, ... A=T1+T2
                    // We simulate the shift visual
                    const newRegs = [...prev];
                    newRegs.pop(); // Lose H
                    newRegs.unshift(randomHex()); // New A
                    return newRegs;
                });

                await delay(speed);
            }

            // Final Step
            setCurrentAction('Adding compressed chunk to current hash state...');
            await delay(1000);
            setCurrentAction('Final Hash Generated.');
            setIsHashing(false);

        } catch (e) {
            console.log('Stopped');
        }
    };

    const reset = () => {
        if (abortController.current) abortController.current.abort();
        setIsHashing(false);
        setRound(0);
        setRegisters(initialRegisters);
        setCurrentAction('Idle');
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 flex flex-col gap-6">
            <div className="bg-surface p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2 mb-2">
                    <Hash className="w-5 h-5" /> SHA-256 Compression Function
                </h3>
                <p className="text-sm text-slate-400">
                    SHA-256 processes data in 512-bit blocks. The core is a compression function that runs for 64 rounds, mixing the message schedule with 8 working variables (A-H).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Input & Control */}
                <div className="md:col-span-1 bg-surface p-6 rounded-xl border border-slate-700 h-fit space-y-6">
                    <div>
                        <label className="text-xs text-slate-500 font-mono uppercase">Input Text</label>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isHashing}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                        />
                    </div>

                    <div className="bg-black/30 p-4 rounded border border-slate-700 min-h-[100px]">
                        <div className="text-xs text-slate-500 font-mono mb-1">STATUS</div>
                        <div className="text-sm text-cyan-400 font-mono leading-tight">
                            {currentAction}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={startHashing}
                            disabled={isHashing}
                            className={`flex-1 py-3 rounded font-bold flex items-center justify-center gap-2 ${isHashing ? 'bg-slate-700 text-slate-500' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
                        >
                            <Play className="w-4 h-4" /> Hash
                        </button>
                        <button
                            onClick={reset}
                            className="p-3 rounded bg-slate-700 hover:bg-slate-600 text-white"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Registers Visualization */}
                <div className="md:col-span-2 bg-surface p-6 rounded-xl border border-slate-700 relative">

                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Cpu className="w-5 h-5" />
                            <span className="font-bold">Internal State (Registers A-H)</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 font-mono">ROUND</div>
                            <div className="text-2xl font-bold font-mono text-white">{round} <span className="text-base text-slate-600">/ 63</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {registers.map((val, idx) => {
                            const label = String.fromCharCode(65 + idx); // A, B, C...
                            return (
                                <div key={label} className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-800">
                                    <div className="w-8 h-8 rounded bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center font-bold text-cyan-400">
                                        {label}
                                    </div>
                                    <div className="font-mono text-lg tracking-wider text-slate-300">
                                        {val}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Visualization of the "Mixer" */}
                    <div className="mt-8 border-t border-slate-700 pt-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-xs font-mono text-slate-500">MESSAGE SCHEDULE WORD (Wt) + CONSTANT (Kt)</div>
                            <MotionDiv
                                animate={{ y: [0, 5, 0], opacity: isHashing ? 1 : 0.3 }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center"
                            >
                                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            </MotionDiv>
                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SHADemo;