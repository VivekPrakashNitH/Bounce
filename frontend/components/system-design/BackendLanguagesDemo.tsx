

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Code2, Zap, Users, Package, Server, GitBranch, ChevronRight, Terminal, Cpu, Globe, Maximize2 } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

interface Language {
  id: string;
  name: string;
  type: string;
  performance: 'Fast' | 'Medium' | 'Slow';
  ecosystem: 'Rich' | 'Mature' | 'Growing';
  learning: 'Easy' | 'Medium' | 'Hard';
}

const languages: Language[] = [
  { id: 'python', name: 'Python', type: 'Interpreted', performance: 'Slow', ecosystem: 'Rich', learning: 'Easy' },
  { id: 'nodejs', name: 'Node.js', type: 'Interpreted', performance: 'Medium', ecosystem: 'Rich', learning: 'Easy' },
  { id: 'go', name: 'Go', type: 'Compiled', performance: 'Fast', ecosystem: 'Growing', learning: 'Medium' },
  { id: 'rust', name: 'Rust', type: 'Compiled', performance: 'Fast', ecosystem: 'Growing', learning: 'Hard' },
  { id: 'java', name: 'Java', type: 'Compiled', performance: 'Fast', ecosystem: 'Mature', learning: 'Medium' },
  { id: 'cpp', name: 'C++', type: 'Compiled', performance: 'Fast', ecosystem: 'Mature', learning: 'Hard' },
  { id: 'php', name: 'PHP', type: 'Interpreted', performance: 'Medium', ecosystem: 'Rich', learning: 'Easy' },
];

const sections = [
  { id: 'section-1', label: 'Overview' },
  { id: 'section-2', label: 'Performance' },
  { id: 'section-3', label: 'Interactive' },
  { id: 'section-4', label: 'Ecosystem' },
  { id: 'section-5', label: 'Code Examples' },
  { id: 'section-6', label: 'Use Cases' },
  { id: 'section-7', label: 'Summary' },
];

const codeSnippets: Record<string, string> = {
  python: `# Python (FastAPI)
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

@app.post("/items")
async def create_item(item: dict):
    return item

# Speciality: Native async/await, Decorator-based routing
# Concurrency: AsyncIO Event Loop`,

  nodejs: `// Node.js (Express)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.post('/data', (req, res) => {
  res.send('Received');
});

app.listen(3000);

// Speciality: Event-driven, Non-blocking I/O
// Concurrency: Single-threaded Event Loop`,

  go: `// Go (Standard Library)
package main
import (
    "encoding/json"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        json.NewEncoder(w).Encode(map[string]string{"msg": "Hi"})
    })
    
    http.ListenAndServe(":8080", nil)
}

// Speciality: Simplicity, Built-in Standard Lib
// Concurrency: Goroutines (Lightweight threads) & Channels`,

  rust: `// Rust (Axum)
use axum::{response::Json, routing::get, Router};
use serde_json::{Value, json};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { 
            Json(json!({ "msg": "Hello" })) 
        }));

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service()).await.unwrap();
}

// Speciality: Memory Safety without GC, Zero-cost abstractions
// Concurrency: Async/Await with Tokio Runtime`,

  java: `// Java (Spring Boot)
@RestController
public class ApiController {

    @GetMapping("/")
    public Map<String, String> index() {
        return Collections.singletonMap("msg", "Hello");
    }

    @PostMapping("/data")
    public String postData(@RequestBody String data) {
        return "Received";
    }
}

// Speciality: Dependency Injection, Enterprise Integration
// Concurrency: Multi-threaded (Platform or Virtual Threads)`,

  cpp: `// C++ (Crow - Microframework)
#include "crow.h"

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([](){
        return crow::json::wvalue({{"msg", "Hello World"}});
    });

    CROW_ROUTE(app, "/post").methods(crow::HTTPMethod::POST)
    ([](const crow::request& req){
        return "Received";
    });

    app.port(18080).multithreaded().run();
}

// Speciality: Raw Performance, Direct Memory Control
// Concurrency: Multi-threaded (std::thread, async)`,

  php: `// PHP (Laravel Syntax)
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['msg' => 'Hello World']);
});

Route::post('/data', function () {
    return 'Received';
});

// Speciality: Shared-nothing architecture, Rapid Deployment
// Concurrency: Sync per request (usually), scalable via Process Forking (PHP-FPM)`
};

export const BackendLanguagesDemo: React.FC<Props> = ({ onShowCode }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedLangs, setSelectedLangs] = useState<Set<string>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCodeLang, setActiveCodeLang] = useState('python');
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  // --- Scroll & Navigation Logic ---
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
      setActiveSection(Math.min(activeSection, sections.length - 1));
    };

    const container = document.querySelector('.overflow-y-auto.custom-scrollbar');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [sections.length, sections]);

  // --- Keyboard "Gate" Logic ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (!gateUnlocked) {
          e.preventDefault();
          setGateUnlocked(true);
          setShowInstructions(true);
        } else if (showInstructions) {
          setShowInstructions(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gateUnlocked, showInstructions]);

  // --- Touch Unlock Logic ---
  const handleTouchUnlock = () => {
    if (!gateUnlocked) {
      setGateUnlocked(true);
      setShowInstructions(true);
    }
  };

  const toggleLang = (id: string) => {
    setSelectedLangs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full">

      {/* --- Locked Gate Overlay --- */}
      {!gateUnlocked && (
        <div
          className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer"
          onClick={handleTouchUnlock}
          onTouchStart={handleTouchUnlock}
        >
          <BounceAvatar className="w-24 h-24 mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-rose-300 mb-2">Level 12: Backend Languages</h2>

          {/* Desktop hint */}
          <p className="text-slate-400 mb-8 animate-pulse hidden md:block">Use Arrow Keys to Initialize System</p>

          {/* Mobile hint */}
          <p className="text-slate-400 mb-8 animate-pulse md:hidden">Tap Anywhere to Start</p>

          {/* Desktop arrow keys */}
          <div className="hidden md:flex gap-4 text-xs font-mono text-slate-500">
            <span className="border border-slate-700 p-2 rounded">↑</span>
            <span className="border border-slate-700 p-2 rounded">↓</span>
            <span className="border border-slate-700 p-2 rounded">←</span>
            <span className="border border-slate-700 p-2 rounded">→</span>
          </div>

          {/* Mobile tap indicator */}
          <div className="md:hidden flex flex-col items-center text-slate-500">
            <div className="w-12 h-12 border-2 border-slate-700 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
            <span className="text-xs mt-4">TAP</span>
          </div>
        </div>
      )}

      {gateUnlocked && (
        <GameInstructions
          visible={showInstructions}
          onDismiss={() => setShowInstructions(false)}
          onShow={() => setShowInstructions(true)}
          theme="rose"
          title="How to Play"
          subtitle="Use arrow keys to move. Bounce to enter the zone."
        />
      )}


      {/* --- Header Component --- */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={activeSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
      />

      {/* --- Floating Navigation Sidebar --- */}
      <SidebarNav
        sections={sections}
        activeIndex={activeSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="rose"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(251,113,133,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-rose-400 text-xs font-mono mt-1">L12 — Backend Languages</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-rose-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page covers Backend Languages with 7 sections including interactive comparison and code examples.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-rose-900/30 rounded-lg p-3"><p className="text-rose-300 font-mono text-xs font-bold mb-1">Section 1: Overview</p><p className="text-slate-400 text-xs">Backend language landscape and trade-offs</p></div>
                  <div className="bg-slate-800/40 border border-rose-900/30 rounded-lg p-3"><p className="text-rose-300 font-mono text-xs font-bold mb-1">Section 2: Performance</p><p className="text-slate-400 text-xs">Fast vs medium vs slower language comparison</p></div>
                  <div className="bg-slate-800/40 border border-rose-900/30 rounded-lg p-3"><p className="text-rose-300 font-mono text-xs font-bold mb-1">Section 3: Interactive</p><p className="text-slate-400 text-xs">Compare languages by attributes</p></div>
                  <div className="bg-slate-800/40 border border-rose-900/30 rounded-lg p-3"><p className="text-rose-300 font-mono text-xs font-bold mb-1">Section 4: Ecosystem</p><p className="text-slate-400 text-xs">Frameworks and tools for each language</p></div>
                  <div className="bg-slate-800/40 border border-rose-900/30 rounded-lg p-3"><p className="text-rose-300 font-mono text-xs font-bold mb-1">Section 5: Code Examples</p><p className="text-slate-400 text-xs">Side-by-side code comparison</p></div>
                  <div className="bg-slate-800/40 border border-rose-900/30 rounded-lg p-3"><p className="text-rose-300 font-mono text-xs font-bold mb-1">Section 6: Use Cases</p><p className="text-slate-400 text-xs">Match the tool to the mission</p></div>
                  <div className="bg-slate-800/40 border border-rose-900/30 rounded-lg p-3"><p className="text-rose-300 font-mono text-xs font-bold mb-1">Section 7: Summary</p><p className="text-slate-400 text-xs">Choosing the right language</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-rose-950/30 to-pink-950/30 border border-rose-900/50 rounded-lg p-4">
                <p className="text-rose-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How to choose <span className="text-rose-400 font-semibold">backend languages</span> based on performance, ecosystem, and use case requirements.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gear Icon Button */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full shadow-[0_0_20px_rgba(251,113,133,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(251,113,133,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>

      {/* --- Main Content --- */}

      {/* SECTION 1: OVERVIEW */}
      <section id="section-1" className="min-h-screen w-full flex items-center justify-center px-6 md:px-20 relative bg-slate-950 border-b border-slate-800/50">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/30 border border-rose-500/20 text-rose-300 text-xs font-mono mb-2">
              <Server size={14} />
              <span>BACKEND ARCHITECTURE</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              The Language <br />
              <span className="text-rose-400">Landscape</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-md">
              Backend languages power APIs, handle logic, and interact with databases. Your choice dictates performance, scalability, and developer velocity.
            </p>

            <div className="p-4 bg-slate-900/50 border-l-2 border-rose-500 rounded-r-lg">
              <p className="text-sm text-slate-300 italic">
                "Language choice is like choosing a vehicle—Sports Car (Rust), Sedan (Java), Scooter (Python), or a Truck (C++)."
              </p>
            </div>
          </div>

          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-rose-500/10 blur-[80px] rounded-full" />
            <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <Code2 className="w-32 h-32 text-rose-500 mb-4" />
              <div className="space-y-2">
                <div className="h-2 w-24 bg-slate-800 rounded animate-pulse" />
                <div className="h-2 w-16 bg-slate-800 rounded animate-pulse delay-75" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronRight className="rotate-90 w-4 h-4" />
        </div>
      </section>


      {/* SECTION 2: PERFORMANCE SPECTRUM */}
      <section id="section-2" className="min-h-screen w-full flex items-center justify-center px-6 md:px-20 bg-slate-950/50 border-b border-slate-800/50">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Performance Spectrum</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Fast', langs: 'C++, Rust, Go', desc: 'Compiled to machine code. Low memory. High throughput.', color: 'border-green-500/30 bg-green-950/10' },
              { title: 'Medium', langs: 'Java, Node.js, PHP 8+', desc: 'JIT compilation or efficient runtimes. Good enterprise performance.', color: 'border-yellow-500/30 bg-yellow-950/10' },
              { title: 'Slower', langs: 'Python, Ruby', desc: 'Interpreted. Dynamic typing. Slower execution but great for prototyping.', color: 'border-red-500/30 bg-red-950/10' }
            ].map((card, i) => (
              <div key={i} className={`p-6 rounded-xl border ${card.color} backdrop-blur-sm flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300`}>
                <div className="text-xl font-bold text-white">{card.title}</div>
                <div className="text-sm font-mono text-rose-300">{card.langs}</div>
                <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
                <Zap className={`w-6 h-6 ml-auto mt-auto opacity-20 ${i === 0 ? 'text-green-500' : i === 1 ? 'text-yellow-500' : 'text-red-500'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 3: INTERACTIVE COMPARE */}
      <section id="section-3" className="min-h-screen w-full flex items-center justify-center px-6 md:px-20 relative bg-slate-950 border-b border-slate-800/50">
        <div className="max-w-5xl w-full bg-slate-900/40 border border-rose-500/20 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-8 text-center">Interactive Comparison</h3>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => toggleLang(lang.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedLangs.has(lang.id)
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                  : selectedLangs.size === 0
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white firefly-glow-rose'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          <div className="min-h-[250px] overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50">
            {selectedLangs.size === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-slate-600">
                <GitBranch className="w-12 h-12 mb-4 opacity-50" />
                <p>Select languages above to compare their attributes.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-rose-900/30 text-rose-300 text-xs uppercase tracking-wider">
                    <th className="p-4">Language</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Performance</th>
                    <th className="p-4">Ecosystem</th>
                    <th className="p-4">Learning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {languages.filter(l => selectedLangs.has(l.id)).map(lang => (
                    <tr key={lang.id} className="hover:bg-rose-500/5 transition-colors">
                      <td className="p-4 font-bold text-white">{lang.name}</td>
                      <td className="p-4 text-slate-300">{lang.type}</td>
                      <td className="p-4 text-slate-300">
                        <span className={`px-2 py-1 rounded text-xs ${lang.performance === 'Fast' ? 'bg-green-500/20 text-green-300' : lang.performance === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                          {lang.performance}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{lang.ecosystem}</td>
                      <td className="p-4 text-slate-300">{lang.learning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>


      {/* SECTION 4: ECOSYSTEM */}
      <section id="section-4" className="min-h-screen w-full flex items-center justify-center px-6 md:px-20 bg-slate-950/50 border-b border-slate-800/50">
        <div className="max-w-6xl w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Ecosystem & Frameworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Python', tools: 'Django, Flask, FastAPI. ML: PyTorch, TensorFlow.', icon: Package },
              { name: 'Node.js', tools: 'Express, NestJS. NPM ecosystem. Real-time apps.', icon: Server },
              { name: 'Go', tools: 'Gin, Echo. Native Concurrency. Kubernetes tooling.', icon: Zap },
              { name: 'Rust', tools: 'Actix, Axum. Zero-cost abstractions. WASM.', icon: Code2 },
              { name: 'Java', tools: 'Spring Boot, Quarkus. Enterprise Standard.', icon: Users },
              { name: 'PHP', tools: 'Laravel, Symfony. Powers ~77% of web.', icon: Globe },
              { name: 'C++', tools: 'Drogon, Crow. High-performance gaming & trading.', icon: Cpu },
            ].map((item, i) => (
              <div key={i} className="group p-6 bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-rose-900/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <h4 className="font-bold text-white text-lg">{item.name}</h4>
                </div>
                <p className="text-sm text-slate-400">{item.tools}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CODE EXAMPLES */}
      <section id="section-5" className="min-h-screen w-full flex items-center justify-center px-6 md:px-20 bg-slate-900/30 border-b border-slate-800/50">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Language Selector */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Terminal className="text-rose-400" />
              Code Lab
            </h3>
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => setActiveCodeLang(lang.id)}
                className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${activeCodeLang === lang.id
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* Code Display */}
          <div className="lg:col-span-9 bg-[#1e1e1e] rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-slate-400 font-mono">server.{activeCodeLang === 'cpp' ? 'cpp' : activeCodeLang === 'rust' ? 'rs' : activeCodeLang === 'python' ? 'py' : activeCodeLang === 'go' ? 'go' : activeCodeLang === 'php' ? 'php' : 'js'}</span>
            </div>
            <div className="p-6 overflow-auto custom-scrollbar flex-1">
              <pre className="font-mono text-sm leading-relaxed text-blue-100">
                <code>{codeSnippets[activeCodeLang]}</code>
              </pre>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 6: WHEN TO USE */}
      <section id="section-6" className="min-h-screen w-full flex items-center justify-center px-6 md:px-20 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800/50">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-white">Match the tool to the <span className="text-rose-400">Mission</span>.</h2>
            <p className="text-slate-400 text-lg">There is no "best" language. Only the right set of trade-offs for your specific constraints.</p>
          </div>
          <div className="space-y-4">
            {[
              { role: 'Data Science / ML', lang: 'Python', reason: 'Unbeatable library ecosystem (Pandas, PyTorch).' },
              { role: 'Real-time Chat', lang: 'Node.js', reason: 'Event-driven architecture handles many connections.' },
              { role: 'Microservices', lang: 'Go', reason: 'Small binaries, fast startup, easy concurrency.' },
              { role: 'System Critical / HFT', lang: 'C++ / Rust', reason: 'Direct memory management, lowest latency.' },
              { role: 'Rapid Web Dev', lang: 'PHP (Laravel)', reason: 'Fastest time-to-market for CRUD apps.' },
            ].map((useCase, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border-l-2 border-slate-700 hover:border-rose-500 transition-colors bg-slate-900/30">
                <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <div className="font-bold text-white mb-1">{useCase.role} <span className="text-slate-500 mx-2">→</span> <span className="text-rose-300">{useCase.lang}</span></div>
                  <p className="text-sm text-slate-400">{useCase.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 7: CHOOSING */}
      <section id="section-7" className="min-h-screen w-full flex items-center justify-center px-6 md:px-20 bg-slate-950">
        <div className="max-w-3xl text-center space-y-10">
          <BounceAvatar className="w-24 h-24 mx-auto" />
          <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Build?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <div className="text-rose-400 font-bold mb-2">Team Skills</div>
              <p className="text-sm text-slate-400">Use what your team knows. Onboarding speed often beats raw performance.</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <div className="text-rose-400 font-bold mb-2">Ecosystem</div>
              <p className="text-sm text-slate-400">Don't reinvent the wheel. Does a library already exist for your problem?</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <div className="text-rose-400 font-bold mb-2">Long Term</div>
              <p className="text-sm text-slate-400">Is it maintainable? Is the talent pool large enough to hire from?</p>
            </div>
          </div>

          <button className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold shadow-lg shadow-rose-900/40 transition-all hover:scale-105">
            Complete Module
          </button>
        </div>
      </section>



      {/* CSS Animations */}
      <style>{`
        @keyframes fireflyGlowRose {
          0%, 100% { 
            background-color: rgb(30, 41, 59);
            box-shadow: 0 0 8px rgba(251, 113, 133, 0.5);
          }
          50% { 
            background-color: rgb(51, 65, 85);
            box-shadow: 0 0 20px rgba(251, 113, 133, 0.8);
          }
        }
        .firefly-glow-rose {
          animation: fireflyGlowRose 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};