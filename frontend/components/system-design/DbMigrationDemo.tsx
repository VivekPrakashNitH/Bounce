'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GitBranch, ArrowRight, CheckCircle, AlertTriangle, Database, FileCode } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

export const DbMigrationDemo: React.FC<Props> = ({ onShowCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [migrations, setMigrations] = useState([
    { id: 1, name: '001_create_users', status: 'applied' },
    { id: 2, name: '002_add_email_index', status: 'applied' },
    { id: 3, name: '003_add_timestamps', status: 'pending' },
  ]);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Migrations' },
    { id: 'section-2', label: 'Why Use' },
    { id: 'section-3', label: 'Run Demo' },
    { id: 'section-4', label: 'Best Practices' },
    { id: 'section-5', label: 'Pitfalls' },
    { id: 'section-6', label: 'Tools' },
  ];

  const handleTouchUnlock = () => {
    if (!gateUnlocked) {
      setGateUnlocked(true);
      setTimeout(() => setShowInstructions(false), 1500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const totalScroll = scrollHeight - clientHeight;
      const progress = Math.min(100, (scrollTop / totalScroll) * 100);
      setScrollProgress(progress);
      const sectionCount = sections.length;
      setCurrentSection(Math.min(sectionCount - 1, Math.floor((scrollTop / (totalScroll / sectionCount)) * sectionCount) % sectionCount));
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
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gateUnlocked, showInstructions]);

  useEffect(() => {
    setBallVisible(currentSection !== 3);
  }, [currentSection]);

  const handleMigrate = () => {
    setMigrations(prev => prev.map(m => m.status === 'pending' ? { ...m, status: 'applying' as any } : m));
    setTimeout(() => {
      setMigrations(prev => prev.map(m => m.status === 'applying' ? { ...m, status: 'applied' as any } : m));
    }, 1500);
  };

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">


      {/* Header Component */}
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

      {/* Page Architecture Modal */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-purple-400 text-xs font-mono mt-1">L14 — Database Migrations</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page covers Database Migrations with 6 sections including an interactive migration runner.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 1: Introduction</p><p className="text-slate-400 text-xs">What are database migrations</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 2: Why Use</p><p className="text-slate-400 text-xs">Version control, reproducibility, coordination</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 3: Run Demo</p><p className="text-slate-400 text-xs">Interactive migration runner</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 4: Best Practices</p><p className="text-slate-400 text-xs">Sequential names, idempotent, rollback plans</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 5: Pitfalls</p><p className="text-slate-400 text-xs">Common migration mistakes to avoid</p></div>
                  <div className="bg-slate-800/40 border border-purple-900/30 rounded-lg p-3"><p className="text-purple-300 font-mono text-xs font-bold mb-1">Section 6: Tools</p><p className="text-slate-400 text-xs">Flyway, Liquibase, Alembic, Rails Migrations</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-900/50 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-purple-400 font-semibold">database migrations</span> enable version-controlled schema changes across environments.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gear Icon Button */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all animate-bounce"
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

      {gateUnlocked && (
        <GameInstructions
          visible={showInstructions}
          onDismiss={() => setShowInstructions(false)}
          onShow={() => setShowInstructions(true)}
          theme="purple"
          title="How to Play"
          subtitle="Use arrow keys to move. Bounce to enter the zone."
        />
      )}

      {ballVisible && gateUnlocked && !showInstructions && (
        <div className="fixed z-30 pointer-events-none">
          <BounceAvatar className="w-4 h-4 opacity-70" />
        </div>
      )}

      <div ref={scrollContainerRef} className="pt-32 pb-20 h-screen overflow-y-auto custom-scrollbar">
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-6">What are Migrations?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Database migrations are version-controlled schema changes. Each migration is a timestamped file that modifies the database structure.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Migrations enable teams to evolve schemas safely across dev, staging, and production environments.
              </p>
              <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-indigo-200">
                  <strong>Mental Model:</strong> Migrations are like Git commits for your database schema.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-indigo-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <GitBranch className="w-24 h-24 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">Why Use Migrations?</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Version Control</p>
                <p className="text-sm text-slate-300">Track all schema changes in Git. See who changed what and when. Rollback if needed.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Reproducibility</p>
                <p className="text-sm text-slate-300">Fresh database from scratch in one command. New developers onboard instantly.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Team Coordination</p>
                <p className="text-sm text-slate-300">No manual SQL scripts. No "Did you run this change?" Everyone stays in sync.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">Interactive: Run Migrations</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-indigo-500/30 rounded-xl p-8">
              <div className="space-y-3 mb-6">
                {migrations.map(m => (
                  <div key={m.id} className={`p-4 rounded-lg border flex items-center justify-between ${m.status === 'applied' ? 'bg-green-500/10 border-green-500/30' :
                    m.status === 'applying' ? 'bg-yellow-500/10 border-yellow-500/30 animate-pulse' :
                      'bg-slate-700/50 border-slate-600'
                    }`}>
                    <div className="flex items-center gap-3">
                      {m.status === 'applied' && <CheckCircle className="text-green-400" size={20} />}
                      {m.status === 'applying' && <ArrowRight className="text-yellow-400" size={20} />}
                      {m.status === 'pending' && <FileCode className="text-slate-400" size={20} />}
                      <span className="text-sm font-mono text-slate-300">{m.name}.sql</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${m.status === 'applied' ? 'bg-green-600 text-white' :
                      m.status === 'applying' ? 'bg-yellow-600 text-white' :
                        'bg-slate-600 text-slate-300'
                      }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleMigrate}
                disabled={!migrations.some(m => m.status === 'pending')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Run Pending Migrations
              </button>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">Best Practices</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-indigo-500/30 rounded-xl">
                <h4 className="font-bold text-indigo-300 mb-2">Sequential Names</h4>
                <p className="text-sm text-slate-300">Timestamp or number prefix. 001_create_users.sql. Ensures order.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-indigo-500/30 rounded-xl">
                <h4 className="font-bold text-indigo-300 mb-2">Idempotent</h4>
                <p className="text-sm text-slate-300">Safe to run multiple times. CREATE TABLE IF NOT EXISTS. DROP IF EXISTS.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-indigo-500/30 rounded-xl">
                <h4 className="font-bold text-indigo-300 mb-2">Rollback Plan</h4>
                <p className="text-sm text-slate-300">Write DOWN migration. Undo changes. Not always possible (data loss).</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-indigo-500/30 rounded-xl">
                <h4 className="font-bold text-indigo-300 mb-2">Test First</h4>
                <p className="text-sm text-slate-300">Run on staging. Check performance. Backup production before deploy.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-indigo-500/30 rounded-xl">
                <h4 className="font-bold text-indigo-300 mb-2">Small Changes</h4>
                <p className="text-sm text-slate-300">One migration per change. Easier to debug. Simpler rollbacks.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-indigo-500/30 rounded-xl">
                <h4 className="font-bold text-indigo-300 mb-2">Lock Table</h4>
                <p className="text-sm text-slate-300">Prevent concurrent migrations. Use lock file or DB flag. Avoid conflicts.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">Common Pitfalls</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <AlertTriangle className="text-yellow-400 mb-2" size={20} />
                <p className="font-bold text-indigo-300 mb-2">Editing Old Migrations</p>
                <p className="text-sm text-slate-300">Never edit applied migrations. Create new one instead. Production databases won't re-run.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <AlertTriangle className="text-yellow-400 mb-2" size={20} />
                <p className="font-bold text-indigo-300 mb-2">Heavy Operations</p>
                <p className="text-sm text-slate-300">Adding index on large table locks it. Do online migrations or off-peak.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <AlertTriangle className="text-yellow-400 mb-2" size={20} />
                <p className="font-bold text-indigo-300 mb-2">Data Loss Risk</p>
                <p className="text-sm text-slate-300">Dropping columns deletes data. Rename or deprecate first. Migrate data before drop.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-8 text-center">Popular Tools</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Flyway (Java)</p>
                <p className="text-sm text-slate-300">SQL-based. Version control. Checksum validation. Enterprise features.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Liquibase (Java)</p>
                <p className="text-sm text-slate-300">XML/YAML/JSON format. Database-agnostic. Rollback support.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Alembic (Python)</p>
                <p className="text-sm text-slate-300">SQLAlchemy integration. Auto-generate from models. Popular with Flask/FastAPI.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl">
                <p className="font-bold text-indigo-300 mb-2">Rails Migrations (Ruby)</p>
                <p className="text-sm text-slate-300">Ruby DSL. Schema dumping. Integrated with ActiveRecord ORM.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
