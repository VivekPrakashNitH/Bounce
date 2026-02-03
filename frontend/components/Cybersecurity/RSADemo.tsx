import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Calculator, ArrowRight, Lock, Unlock, RefreshCw } from 'lucide-react';

const RSADemo: React.FC = () => {
    const [phase, setPhase] = useState<'setup' | 'encrypt' | 'decrypt'>('setup');
    const [stepInfo, setStepInfo] = useState('');

    // Cast motion.div to any to avoid TS errors
    const MotionDiv = motion.div as any;

    // Hardcoded example primes for demo purposes (small enough to understand)
    // p=61, q=53 -> n=3233, phi=3120, e=17, d=2753
    const [keys, setKeys] = useState<{
        p: number; q: number; n: number; phi: number; e: number; d: number;
    } | null>(null);

    const [message, setMessage] = useState<number>(65); // 'A'
    const [cipher, setCipher] = useState<number | null>(null);
    const [decrypted, setDecrypted] = useState<number | null>(null);

    const generateKeys = async () => {
        setPhase('setup');
        setStepInfo("Step 1: Choose two distinct prime numbers p and q.");
        await new Promise(r => setTimeout(r, 1500));

        setStepInfo("Step 2: Compute n = p * q. This is the modulus for both keys.");
        await new Promise(r => setTimeout(r, 1500));

        setStepInfo("Step 3: Compute Euler's Totient function φ(n) = (p-1)*(q-1).");
        await new Promise(r => setTimeout(r, 1500));

        setStepInfo("Step 4: Choose an integer e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1. (Public Exponent)");
        await new Promise(r => setTimeout(r, 1500));

        setStepInfo("Step 5: Determine d such that d * e ≡ 1 (mod φ(n)). (Private Exponent)");
        await new Promise(r => setTimeout(r, 1500));

        setKeys({ p: 61, q: 53, n: 3233, phi: 3120, e: 17, d: 2753 });
        setStepInfo("Key Generation Complete! We now have a Public Key (e, n) and Private Key (d, n).");
    };

    const encrypt = async () => {
        if (!keys) return;
        setPhase('encrypt');
        setCipher(null);
        setDecrypted(null);
        setStepInfo(`Encrypting message m=${message} using Public Key (e=${keys.e}, n=${keys.n})`);

        await new Promise(r => setTimeout(r, 1000));
        setStepInfo("Formula: c = m^e mod n");

        await new Promise(r => setTimeout(r, 1500));
        setStepInfo(`Calculating: ${message}^${keys.e} mod ${keys.n}...`);

        await new Promise(r => setTimeout(r, 1500));
        // JavaScript precision issues with large powers, we hardcode the result for this specific tuple
        // 65^17 mod 3233 = 2790
        const result = 2790;
        setCipher(result);
        setStepInfo(`Result: Ciphertext c = ${result}`);
    };

    const decrypt = async () => {
        if (!keys || !cipher) return;
        setPhase('decrypt');
        setStepInfo(`Decrypting cipher c=${cipher} using Private Key (d=${keys.d}, n=${keys.n})`);

        await new Promise(r => setTimeout(r, 1000));
        setStepInfo("Formula: m = c^d mod n");

        await new Promise(r => setTimeout(r, 1500));
        setStepInfo(`Calculating: ${cipher}^${keys.d} mod ${keys.n}...`);

        await new Promise(r => setTimeout(r, 1500));
        // 2790^2753 mod 3233 = 65
        setDecrypted(65);
        setStepInfo(`Result: Original Message m = 65 ('A')`);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">

            {/* Header Info */}
            <div className="bg-surface p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-green-400 flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5" /> RSA Mathematics
                </h3>
                <p className="text-sm text-slate-400">
                    RSA security relies on the practical difficulty of factoring the product of two large prime numbers.
                    Below is a mathematical walkthrough using small numbers.
                </p>
            </div>

            {/* Main Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Controls */}
                <div className="bg-surface p-6 rounded-xl border border-slate-700 space-y-6">
                    <div>
                        <button
                            onClick={generateKeys}
                            className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded text-white font-bold flex items-center justify-center gap-2 mb-4"
                        >
                            <RefreshCw className="w-4 h-4" /> 1. Generate Key Pairs
                        </button>

                        {keys && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="p-3 bg-slate-900 rounded border border-green-500/30">
                                    <div className="text-xs text-green-500 font-bold mb-1">PUBLIC KEY (Encrypt)</div>
                                    <div className="font-mono text-sm text-slate-300">
                                        e: {keys.e}<br />n: {keys.n}
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-900 rounded border border-red-500/30">
                                    <div className="text-xs text-red-500 font-bold mb-1">PRIVATE KEY (Decrypt)</div>
                                    <div className="font-mono text-sm text-slate-300">
                                        d: {keys.d}<br />n: {keys.n}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`transition-opacity ${keys ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <div className="mb-2">
                            <label className="text-xs text-slate-500 font-mono uppercase">Message (Integer)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={message}
                                    readOnly
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                                />
                                <span className="p-2 text-slate-500 text-sm flex items-center">('A')</span>
                            </div>
                        </div>
                        <button
                            onClick={encrypt}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold flex items-center justify-center gap-2 mb-4"
                        >
                            <Lock className="w-4 h-4" /> 2. Encrypt
                        </button>
                    </div>

                    <div className={`transition-opacity ${cipher ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <button
                            onClick={decrypt}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded text-white font-bold flex items-center justify-center gap-2"
                        >
                            <Unlock className="w-4 h-4" /> 3. Decrypt
                        </button>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="bg-surface p-6 rounded-xl border border-slate-700 relative min-h-[400px] flex flex-col">
                    <div className="absolute top-4 right-4 text-xs font-mono text-slate-500">
                        MODE: {phase.toUpperCase()}
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                        <AnimatePresence mode='wait'>
                            {/* Key Gen Visuals */}
                            {!keys && phase === 'setup' && (
                                <MotionDiv
                                    key="setup-anim"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-slate-400 font-mono text-sm"
                                >
                                    Waiting to generate primes...
                                </MotionDiv>
                            )}

                            {keys && phase === 'setup' && (
                                <MotionDiv
                                    key="keys-anim"
                                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="flex gap-4 justify-center">
                                        <div className="w-16 h-16 rounded-full border-2 border-slate-600 flex flex-col items-center justify-center">
                                            <span className="text-xs text-slate-500">p</span>
                                            <span className="font-bold">{keys.p}</span>
                                        </div>
                                        <div className="w-16 h-16 rounded-full border-2 border-slate-600 flex flex-col items-center justify-center">
                                            <span className="text-xs text-slate-500">q</span>
                                            <span className="font-bold">{keys.q}</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="mx-auto text-slate-600 rotate-90" />
                                    <div className="p-4 bg-slate-800 rounded border border-slate-600">
                                        n = {keys.p} * {keys.q} = <span className="text-yellow-400 font-bold">{keys.n}</span>
                                    </div>
                                </MotionDiv>
                            )}

                            {/* Encryption Visuals */}
                            {phase === 'encrypt' && (
                                <MotionDiv
                                    key="encrypt-anim"
                                    initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="text-4xl font-mono text-blue-400 font-bold mb-4">
                                        {message}<sup className="text-lg text-green-400">{keys?.e}</sup>
                                    </div>
                                    <div className="text-xl text-slate-500 font-mono">
                                        mod {keys?.n}
                                    </div>
                                    <ArrowRight className="mx-auto text-slate-600 rotate-90" />
                                    {cipher && (
                                        <MotionDiv
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            className="text-5xl font-mono text-red-500 font-bold"
                                        >
                                            {cipher}
                                        </MotionDiv>
                                    )}
                                </MotionDiv>
                            )}

                            {/* Decryption Visuals */}
                            {phase === 'decrypt' && (
                                <MotionDiv
                                    key="decrypt-anim"
                                    initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="text-4xl font-mono text-red-500 font-bold mb-4">
                                        {cipher}<sup className="text-lg text-red-400">{keys?.d}</sup>
                                    </div>
                                    <div className="text-xl text-slate-500 font-mono">
                                        mod {keys?.n}
                                    </div>
                                    <ArrowRight className="mx-auto text-slate-600 rotate-90" />
                                    {decrypted && (
                                        <MotionDiv
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            className="text-5xl font-mono text-blue-400 font-bold"
                                        >
                                            {decrypted}
                                        </MotionDiv>
                                    )}
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 bg-black/40 p-4 rounded border-l-4 border-blue-500">
                        <p className="font-mono text-sm text-blue-200">
                            {stepInfo || "Select an action to begin."}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RSADemo;