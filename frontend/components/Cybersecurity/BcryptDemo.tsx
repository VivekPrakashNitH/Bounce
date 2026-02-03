import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Settings, Clock, Repeat } from 'lucide-react';

const BcryptDemo: React.FC = () => {
    const [password, setPassword] = useState('password123');
    const [cost, setCost] = useState(5); // Default start slightly higher for demo
    const [isHashing, setIsHashing] = useState(false);
    const [currentAction, setCurrentAction] = useState('Idle');
    const [loopCount, setLoopCount] = useState(0);
    const [salt, setSalt] = useState('');
    const [finalHash, setFinalHash] = useState('');

    const abortController = useRef<AbortController | null>(null);
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runBcrypt = async () => {
        if (isHashing) return;
        setIsHashing(true);
        setLoopCount(0);
        setSalt('');
        setFinalHash('');

        abortController.current = new AbortController();
        const signal = abortController.current.signal;

        try {
            // Step 1: Salt Gen
            setCurrentAction('Generating 128-bit Salt...');
            await delay(1000);
            const generatedSalt = btoa(Math.random().toString()).substring(0, 22);
            setSalt(generatedSalt);
            if (signal.aborted) return;

            // Step 2: Blowfish Setup
            setCurrentAction('Setting up Blowfish state (P-array, S-boxes) with Key + Salt...');
            await delay(1500);
            if (signal.aborted) return;

            // Step 3: The Expensive Loop
            const totalLoops = Math.pow(2, cost);
            setCurrentAction(`Starting Key Expansion Loop (2^${cost} = ${totalLoops} iterations)...`);

            // We simulate the counting. If cost is high, we accelerate the counter visual.
            let current = 0;
            const startTime = performance.now();

            while (current < totalLoops) {
                if (signal.aborted) return;

                // Calculate increment to finish in roughly 3-4 seconds for visual purposes
                const increment = Math.max(1, Math.floor(totalLoops / 100));
                current += increment;
                if (current > totalLoops) current = totalLoops;

                setLoopCount(current);
                await delay(30); // Visual frame rate
            }

            // Step 4: Finalize
            setCurrentAction('Finalizing string generation...');
            await delay(500);
            const hash = `$2b$${cost.toString().padStart(2, '0')}$${generatedSalt}${btoa(password).substring(0, 31)}`;
            setFinalHash(hash);
            setCurrentAction('Complete.');
            setIsHashing(false);

        } catch (e) {
            console.log("Stopped");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
            <div className="bg-surface p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5" /> Bcrypt Internals
                </h3>
                <p className="text-sm text-slate-400">
                    Bcrypt is designed to be slow. It performs key expansion using the Blowfish algorithm repeatedly (2^cost times). This makes brute-force attacks computationally prohibitive.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Config */}
                <div className="bg-surface p-6 rounded-xl border border-slate-700 h-fit space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-500 uppercase">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-200"
                            disabled={isHashing}
                        />
                    </div>

                    <div className="space-y-4 bg-slate-900/50 p-4 rounded border border-slate-700">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-mono text-slate-500 uppercase">Cost Factor</label>
                            <span className="text-orange-400 font-bold font-mono">{cost}</span>
                        </div>
                        <input
                            type="range"
                            min="4"
                            max="12"
                            step="1"
                            value={cost}
                            onChange={(e) => setCost(parseInt(e.target.value))}
                            className="w-full accent-orange-500"
                            disabled={isHashing}
                        />
                        <div className="flex justify-between text-xs text-slate-500 font-mono">
                            <span>Iterations: 2^{cost}</span>
                            <span>= {Math.pow(2, cost).toLocaleString()} loops</span>
                        </div>
                    </div>

                    <button
                        onClick={runBcrypt}
                        disabled={isHashing}
                        className={`w-full py-3 rounded font-bold transition-all flex items-center justify-center gap-2 ${isHashing ? 'bg-slate-700 text-slate-500' : 'bg-orange-600 hover:bg-orange-500 text-white'
                            }`}
                    >
                        {isHashing ? <Clock className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                        {isHashing ? 'Hashing...' : 'Hash Password'}
                    </button>
                </div>

                {/* Visualizer */}
                <div className="bg-surface p-6 rounded-xl border border-slate-700 flex flex-col gap-6 relative overflow-hidden">

                    <div className="text-center space-y-2">
                        <div className="text-xs text-slate-500 font-mono uppercase">CURRENT ACTION</div>
                        <div className="min-h-[40px] text-orange-300 font-medium animate-pulse">
                            {currentAction}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-8">
                        {/* The Loop Visualizer */}
                        <div className="relative w-48 h-48">
                            {/* Outer Ring */}
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="96" cy="96" r="88"
                                    fill="none" stroke="#1e293b" strokeWidth="12"
                                />
                                <circle
                                    cx="96" cy="96" r="88"
                                    fill="none" stroke="#f97316" strokeWidth="12"
                                    strokeDasharray={553} // 2 * PI * 88
                                    strokeDashoffset={553 - (553 * (loopCount / Math.pow(2, cost)))}
                                    className="transition-all duration-75 ease-linear"
                                />
                            </svg>

                            {/* Center Counter */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-3xl font-bold font-mono text-white">
                                    {loopCount.toLocaleString()}
                                </div>
                                <div className="text-xs text-slate-500 font-mono mt-1">
                                    ITERATIONS
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Output Construction */}
                    <div className="bg-slate-900 p-4 rounded border border-slate-700 min-h-[120px] font-mono text-sm break-all">
                        <div className="text-xs text-slate-500 mb-2">OUTPUT STRUCTURE</div>
                        {!finalHash ? (
                            <div className="flex items-center gap-2 text-slate-600">
                                {salt ? (
                                    <>
                                        <span className="text-yellow-500">$2b${cost}$</span>
                                        <span className="text-cyan-500">{salt}</span>
                                        <span className="animate-pulse">...</span>
                                    </>
                                ) : (
                                    <span>Waiting to start...</span>
                                )}
                            </div>
                        ) : (
                            <div>
                                <span className="text-yellow-500">$2b${cost.toString().padStart(2, '0')}$</span>
                                <span className="text-cyan-500">{salt}</span>
                                <span className="text-orange-500">{finalHash.split(salt)[1]}</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BcryptDemo;