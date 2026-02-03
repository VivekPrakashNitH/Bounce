'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Lock, Unlock, Key } from 'lucide-react';
import { BounceAvatar, SidebarNav } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const EncryptionDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [plaintext, setPlaintext] = useState('HELLO');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState(3);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Encryption' },
    { id: 'section-2', label: 'Types' },
    { id: 'section-3', label: 'Caesar Cipher' },
    { id: 'section-4', label: 'Algorithms' },
    { id: 'section-5', label: 'Best Practices' },
    { id: 'section-6', label: 'Why It Matters' },
  ];

  const handleTouchUnlock = () => {
    if (!gateUnlocked) {
      setGateUnlocked(true);
      setTimeout(() => setShowInstructions(false), 1500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.overflow-y-auto.custom-scrollbar');
      if (!container) return;

      const { scrollTop, clientHeight, scrollHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      let activeSection = 0;
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (rect.top < containerRect.top + containerRect.height / 2) {
            activeSection = i;
          } else {
            break;
          }
        }
      }
      setCurrentSection(Math.min(activeSection, sections.length - 1));
      setCompletionProgress(Math.max(0, Math.min(1, (progress - 90) / 10)));
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (!gateUnlocked) {
          setGateUnlocked(true);
          setShowInstructions(true);
        } else if (showInstructions) {
          setShowInstructions(false);
        }
        setKeysPressed(prev => new Set([...prev, e.key]));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };
    const container = document.querySelector('.overflow-y-auto.custom-scrollbar');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [sections.length, sections, gateUnlocked, showInstructions]);

  useEffect(() => {
    setBallVisible(currentSection !== 3);
  }, [currentSection]);

  const encryptCaesar = (text: string, shift: number) => {
    return text.toUpperCase().split('').map(char => {
      if (char.match(/[A-Z]/)) {
        const code = ((char.charCodeAt(0) - 65 + shift) % 26) + 65;
        return String.fromCharCode(code);
      }
      return char;
    }).join('');
  };

  const handleEncrypt = () => {
    setCiphertext(encryptCaesar(plaintext, key));
  };

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">
      {/* HEADER SECTION */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
      />

      <SidebarNav
        sections={sections}
        activeIndex={currentSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="cyan"
        isVisible={gateUnlocked}
      />

      {/* PAGE ARCHITECTURE MODAL */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(34,211,238,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-cyan-400 text-xs font-mono mt-1">Cybersecurity — Encryption</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-cyan-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page covers encryption fundamentals with 6 sections including an interactive Caesar cipher demo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-cyan-900/30 rounded-lg p-3"><p className="text-cyan-300 font-mono text-xs font-bold mb-1">Section 1: Introduction</p><p className="text-slate-400 text-xs">What is encryption and why it matters</p></div>
                  <div className="bg-slate-800/40 border border-cyan-900/30 rounded-lg p-3"><p className="text-cyan-300 font-mono text-xs font-bold mb-1">Section 2: Types</p><p className="text-slate-400 text-xs">Symmetric, asymmetric, and hashing</p></div>
                  <div className="bg-slate-800/40 border border-cyan-900/30 rounded-lg p-3"><p className="text-cyan-300 font-mono text-xs font-bold mb-1">Section 3: Interactive Demo</p><p className="text-slate-400 text-xs">Caesar cipher with adjustable shift key</p></div>
                  <div className="bg-slate-800/40 border border-cyan-900/30 rounded-lg p-3"><p className="text-cyan-300 font-mono text-xs font-bold mb-1">Section 4: Algorithms</p><p className="text-slate-400 text-xs">AES, RSA, SHA-256, Bcrypt</p></div>
                  <div className="bg-slate-800/40 border border-cyan-900/30 rounded-lg p-3"><p className="text-cyan-300 font-mono text-xs font-bold mb-1">Section 5: Best Practices</p><p className="text-slate-400 text-xs">Strong keys, TLS, encryption at rest</p></div>
                  <div className="bg-slate-800/40 border border-cyan-900/30 rounded-lg p-3"><p className="text-cyan-300 font-mono text-xs font-bold mb-1">Section 6: Why It Matters</p><p className="text-slate-400 text-xs">Data breaches, compliance, user trust</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-900/50 rounded-lg p-4">
                <p className="text-cyan-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-cyan-400 font-semibold">encryption</span> protects data confidentiality using symmetric, asymmetric, and hashing algorithms.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING GEAR ICON */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>

      {!gateUnlocked && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center cursor-pointer"
          onClick={handleTouchUnlock}
          onTouchStart={handleTouchUnlock}
        >
          <div className="text-center">
            <BounceAvatar className="w-32 h-32 mx-auto mb-6 opacity-80" />
            <p className="text-slate-300 text-lg mb-4 hidden md:block">Press any arrow key to unlock</p>
            <p className="text-slate-300 text-lg mb-4 md:hidden">Tap anywhere to unlock</p>
            <div className="flex gap-3 justify-center opacity-60 text-sm hidden md:flex">
              <span>UP</span>
              <span>DOWN</span>
              <span>LEFT</span>
              <span>RIGHT</span>
            </div>
            <div className="md:hidden flex flex-col items-center text-slate-500 mt-4">
              <div className="w-12 h-12 border-2 border-cyan-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-cyan-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-cyan-300 mb-4">Use Arrow Keys</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-slate-700/50 rounded text-center">
                <p className="text-xs font-bold mb-1">UP</p>
                <p className="text-xs text-slate-400">Scroll</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded text-center">
                <p className="text-xs font-bold mb-1">DOWN</p>
                <p className="text-xs text-slate-400">Scroll</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded text-center">
                <p className="text-xs font-bold mb-1">LEFT</p>
                <p className="text-xs text-slate-400">Move</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded text-center">
                <p className="text-xs font-bold mb-1">RIGHT</p>
                <p className="text-xs text-slate-400">Move</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center">Press any key to continue</p>
          </div>
        </div>
      )}

      {ballVisible && gateUnlocked && !showInstructions && (
        <div className="fixed z-30 pointer-events-none">
          <BounceAvatar className="w-4 h-4 opacity-70" />
        </div>
      )}

      <div className="pt-32 pb-20">
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-6">Encryption</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Encryption transforms plaintext into ciphertext using a key. Only those with the key can decrypt.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Protects data confidentiality. Critical for passwords, payments, messages, and sensitive information.
              </p>
              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-cyan-200">
                  <strong>Key Insight:</strong> Never store plaintext passwords. Always encrypt sensitive data.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-cyan-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <Lock className="w-24 h-24 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Encryption Types</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Symmetric Encryption</p>
                <p className="text-sm text-slate-300">Same key encrypts and decrypts. Fast. AES, DES. Problem: sharing key.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Asymmetric Encryption</p>
                <p className="text-sm text-slate-300">Public and private keys. Slow. RSA, ECC. Solve key distribution.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Hashing</p>
                <p className="text-sm text-slate-300">One-way transformation. MD5, SHA. Passwords, integrity checks.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Interactive: Caesar Cipher</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-cyan-300 font-bold mb-2 block">Plaintext</label>
                  <input
                    type="text"
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value.toUpperCase())}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300"
                    placeholder="Enter text"
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-300 font-bold mb-2 block">Shift Key: {key}</label>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={key}
                    onChange={(e) => setKey(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={handleEncrypt}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  Encrypt
                </button>

                <div>
                  <label className="text-sm text-cyan-300 font-bold mb-2 block">Ciphertext</label>
                  <div className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-cyan-300 font-mono">
                    {ciphertext || 'Click Encrypt'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Common Algorithms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-cyan-500/30 rounded-xl">
                <h4 className="font-bold text-cyan-300 mb-2">AES (Advanced Encryption Standard)</h4>
                <p className="text-sm text-slate-300">Symmetric. 256-bit keys. Military grade. Industry standard.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-cyan-500/30 rounded-xl">
                <h4 className="font-bold text-cyan-300 mb-2">RSA</h4>
                <p className="text-sm text-slate-300">Asymmetric. 2048-bit typical. Slow but enables public key crypto.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-cyan-500/30 rounded-xl">
                <h4 className="font-bold text-cyan-300 mb-2">SHA-256</h4>
                <p className="text-sm text-slate-300">Hashing. 256-bit output. Bitcoin, certificates, passwords.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-cyan-500/30 rounded-xl">
                <h4 className="font-bold text-cyan-300 mb-2">Bcrypt</h4>
                <p className="text-sm text-slate-300">Password hashing. Slow by design. Salted automatically.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Best Practices</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Use Strong Keys</p>
                <p className="text-sm text-slate-300">256-bit minimum. Random generation. Never hardcode.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Hash Passwords</p>
                <p className="text-sm text-slate-300">Never store plaintext. Use bcrypt, Argon2. Salted.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Use TLS/SSL</p>
                <p className="text-sm text-slate-300">HTTPS always. Protects in-transit data. Certificates required.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Encrypt at Rest</p>
                <p className="text-sm text-slate-300">Database encryption. Disk encryption. Defense in depth.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center">Why Encryption Matters</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Data Breaches</p>
                <p className="text-sm text-slate-300">Millions exposed yearly. Encrypted data worthless to attackers.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">Regulatory Compliance</p>
                <p className="text-sm text-slate-300">GDPR, HIPAA require encryption. Legal liability without it.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl">
                <p className="font-bold text-cyan-300 mb-2">User Trust</p>
                <p className="text-sm text-slate-300">Users expect privacy. Encryption builds confidence.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
