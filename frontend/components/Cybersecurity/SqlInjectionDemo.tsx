'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import { BounceAvatar, SidebarNav } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const SqlInjectionDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState("' OR '1'='1");
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isVulnerable, setIsVulnerable] = useState(false);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [usernameTyped, setUsernameTyped] = useState(true);
  const [passwordTyped, setPasswordTyped] = useState(true);

  const sections = [
    { id: 'section-1', label: 'SQL Injection' },
    { id: 'section-2', label: 'Attack Vectors' },
    { id: 'section-3', label: 'Query Demo' },
    { id: 'section-4', label: 'Prevention' },
    { id: 'section-5', label: 'Impact' },
    { id: 'section-6', label: 'Testing' },
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

  const handleVulnerableLogin = () => {
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    setQueryResult(query);
    if (password.includes("'") || password.includes('--') || password.toLowerCase().includes('or')) {
      setIsVulnerable(true);
    } else {
      setIsVulnerable(false);
    }
  };

  const handleSafeLogin = () => {
    const query = `SELECT * FROM users WHERE username=? AND password=? (Parameterized)`;
    setQueryResult(query);
    setIsVulnerable(false);
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
        accentColor="purple"
        isVisible={gateUnlocked}
      />

      {/* PAGE ARCHITECTURE MODAL */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-purple-400 text-xs font-mono mt-1">Cybersecurity — SQL Injection</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page covers SQL injection vulnerabilities with 6 sections including an interactive query injection demo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 1: Introduction</p><p className="text-slate-400 text-xs">What is SQL injection and why it's critical</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 2: Attack Vectors</p><p className="text-slate-400 text-xs">Authentication bypass, data extraction, modification</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 3: Interactive Demo</p><p className="text-slate-400 text-xs">Vulnerable vs secure code comparison</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 4: Prevention</p><p className="text-slate-400 text-xs">Parameterized queries, input validation, ORMs</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 5: Impact</p><p className="text-slate-400 text-xs">Real-world breaches and legal liability</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 6: Testing</p><p className="text-slate-400 text-xs">SQLmap, Burp Suite, OWASP tools</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-950/30 to-violet-950/30 border border-purple-900/50 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-purple-400 font-semibold">SQL injection</span> attacks work and how to prevent them using parameterized queries and input validation.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING GEAR ICON */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all animate-bounce"
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
              <div className="w-12 h-12 border-2 border-purple-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-purple-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-purple-300 mb-4">Use Arrow Keys</h3>
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
              <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-6">SQL Injection</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                SQL injection occurs when untrusted data is concatenated into SQL queries without sanitization.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Attackers can modify query logic, bypass authentication, steal data, or delete records.
              </p>
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-red-200">
                  <strong>Critical Risk:</strong> Most common web vulnerability. OWASP #1. Entirely preventable.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-purple-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <AlertTriangle className="w-24 h-24 text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Attack Vectors</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-purple-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Authentication Bypass</p>
                <p className="text-sm text-slate-300">Input: admin' -- or 1=1 --</p>
                <p className="text-xs text-red-300 mt-2">Query: SELECT * FROM users WHERE username='admin' -- ' AND password='...'</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-purple-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Data Extraction</p>
                <p className="text-sm text-slate-300">Input: ' UNION SELECT password FROM users --</p>
                <p className="text-xs text-red-300 mt-2">Extract all user passwords in one query</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-purple-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Data Modification</p>
                <p className="text-sm text-slate-300">Input: '; DROP TABLE users; --</p>
                <p className="text-xs text-red-300 mt-2">Delete entire tables or modify records</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Interactive: Query Injection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur border border-red-500/30 rounded-xl p-6">
                <h4 className="font-bold text-red-300 mb-4">Vulnerable Code</h4>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-xs text-slate-300 font-bold mb-1 block">Username</label>
                    {!usernameTyped && username === '' && (
                      <span className="absolute left-3 top-7 text-slate-400 text-sm animate-pulse pointer-events-none">Please enter username</span>
                    )}
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setUsernameTyped(true); }}
                      onFocus={() => setUsernameTyped(true)}
                      placeholder="Please enter username"
                      className={`w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300 text-sm placeholder:text-slate-500 ${!usernameTyped && username === '' ? 'border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : ''}`}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs text-slate-300 font-bold mb-1 block">Password</label>
                    {!passwordTyped && password === '' && (
                      <span className="absolute left-3 top-7 text-slate-400 text-sm animate-pulse pointer-events-none">Please enter password</span>
                    )}
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordTyped(true); }}
                      onFocus={() => setPasswordTyped(true)}
                      placeholder="Please enter password"
                      className={`w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300 text-sm placeholder:text-slate-500 ${!passwordTyped && password === '' ? 'border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : ''}`}
                    />
                  </div>
                  <button
                    onClick={handleVulnerableLogin}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg transition-colors text-sm animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  >
                    Login (Vulnerable)
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur border border-green-500/30 rounded-xl p-6">
                <h4 className="font-bold text-green-300 mb-4">Secure Code</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 font-bold mb-1 block">Username (Parameterized)</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-bold mb-1 block">Password (Parameterized)</label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleSafeLogin}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition-colors text-sm animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  >
                    Login (Secure)
                  </button>
                </div>
              </div>
            </div>

            {queryResult && (
              <div className="mt-6 p-4 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <p className="text-xs font-bold text-slate-300 mb-2">Generated Query:</p>
                <p className={`text-xs font-mono p-3 rounded bg-slate-700/50 border-l-4 ${isVulnerable ? 'border-red-500 text-red-300' : 'border-green-500 text-green-300'}`}>
                  {queryResult}
                </p>
                {isVulnerable && (
                  <p className="text-xs text-red-300 mt-2">
                    Status: VULNERABLE - Injection detected!
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Prevention Methods</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-purple-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">Parameterized Queries (Prepared Statements)</p>
                <p className="text-sm text-slate-300">Separates SQL code from data. Best defense. Used in: PHP PDO, Node.js Sequelize, Java JDBC.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-purple-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">Input Validation</p>
                <p className="text-sm text-slate-300">Whitelist allowed characters. Type check. Length limits. Never rely on this alone.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-purple-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">Least Privilege</p>
                <p className="text-sm text-slate-300">Database user has minimal permissions. Cannot DROP tables. Limits damage.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-600/20 to-purple-600/20 border border-green-500/30 rounded-xl">
                <p className="font-bold text-green-300 mb-2">ORM Frameworks</p>
                <p className="text-sm text-slate-300">Django ORM, SQLAlchemy use parameterized queries by default. Less manual risk.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Real-World Impact</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-purple-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">2013 Adobe Breach</p>
                <p className="text-sm text-slate-300">150 million user records exposed. Password hashes compromised. SQL injection likely involved.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-purple-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Financial Impact</p>
                <p className="text-sm text-slate-300">Average breach cost: 4.45 million USD. SQL injection prevention costs: few hours of coding.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-red-600/20 to-purple-600/20 border border-red-500/30 rounded-xl">
                <p className="font-bold text-purple-300 mb-2">Legal Liability</p>
                <p className="text-sm text-slate-300">GDPR fines up to 20 million EUR. Negligence in security can lead to criminal prosecution.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-8 text-center">Testing & Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">SQLmap</h4>
                <p className="text-sm text-slate-300">Automated SQL injection tester. Penetration testing tool. Open source.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Burp Suite</h4>
                <p className="text-sm text-slate-300">Web security testing platform. Professional penetration testing.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">OWASP Top 10</h4>
                <p className="text-sm text-slate-300">SQL Injection is #1 web vulnerability. Reference for developers.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-purple-300 mb-2">Code Review</h4>
                <p className="text-sm text-slate-300">Manual review catches string concatenation in queries. Essential practice.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div >
  );
};
