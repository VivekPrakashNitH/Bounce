
import React, { useState } from 'react';
import { Code2, Terminal, Zap, Coffee, Box, Shield, Flame, Network, Book, Info } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

type Language = 'cpp' | 'java' | 'node' | 'rust' | 'go' | 'elixir';

const LANGUAGES: Record<Language, {
  name: string;
  icon: any;
  color: string;
  tagline: string;
  pros: string[];
  cons: string[];
  setup: string;
  code: string;
  concepts: { title: string; desc: string; metaphor: string }[];
}> = {
  cpp: {
    name: 'C++',
    icon: Flame,
    color: 'text-blue-500',
    tagline: 'The High-Performance Beast',
    pros: ['Unmatched performance', 'Direct hardware access', 'Zero overhead abstraction'],
    cons: ['Manual memory management', 'Segfaults & Memory leaks', 'Steep learning curve'],
    setup: 'Used in High Frequency Trading (HFT), Game Engines, Database Internals',
    concepts: [
        { title: 'Manual Memory', desc: "You allocate and free memory yourself. Forgot to free? Memory Leak. Free too early? Crash.", metaphor: "Driving a manual car. Total control, but you can stall easily." },
        { title: 'Pointers', desc: "Direct access to memory addresses.", metaphor: "Giving someone the GPS coordinates of your house instead of a photo of it." }
    ],
    code: `#include <crow.h>

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([](){
        return "Hello world from C++";
    });

    app.port(18080).run();
}`
  },
  java: {
    name: 'Java',
    icon: Coffee,
    color: 'text-orange-500',
    tagline: 'The Enterprise Standard',
    pros: ['Strong ecosystem (Spring Boot)', 'Multi-threading', 'Memory safety (GC)'],
    cons: ['Verbose syntax', 'Garbage Collection pauses', 'High memory footprint'],
    setup: 'Banking Systems, Large Scale Enterprise Backends, Android',
    concepts: [
        { title: 'Garbage Collection (GC)', desc: "An automatic process that reclaims memory occupied by objects no longer in use.", metaphor: "A janitor who stops the entire office (Stop-the-world pause) to clean up trash." },
        { title: 'JVM', desc: "Java Virtual Machine. Allows code to run on any OS.", metaphor: "A universal translator that reads your book and speaks it in the local language." }
    ],
    code: `@RestController
public class HelloController {

    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }
}`
  },
  node: {
    name: 'Node.js',
    icon: Terminal,
    color: 'text-green-500',
    tagline: 'The I/O Heavyweight',
    pros: ['JavaScript everywhere', 'Huge package ecosystem (NPM)', 'Great for I/O bound apps'],
    cons: ['Single-threaded (CPU bottleneck)', 'Callback hell (historically)', 'Dynamic typing issues'],
    setup: 'Real-time Chat, SPAs, Microservices, Serverless Functions',
    concepts: [
        { title: 'Single Threaded', desc: "Runs on a single main CPU thread. Great for waiting (I/O), bad for thinking (Calculations).", metaphor: "One super-fast waiter serving 100 tables. If he stops to cook a steak (CPU task), everyone waits." },
        { title: 'Event Loop', desc: "The mechanism that handles asynchronous callbacks.", metaphor: "A merry-go-round that picks up requests and drops off answers continuously." }
    ],
    code: `const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.end('Hello World from Node.js');
});

server.listen(3000);`
  },
  rust: {
    name: 'Rust',
    icon: Shield,
    color: 'text-orange-400',
    tagline: 'Safety meets Speed',
    pros: ['Memory safety without GC', 'Blazing fast', 'Modern tooling (Cargo)'],
    cons: ['Very steep learning curve', 'Slow compilation times', 'Borrow checker fights'],
    setup: 'Systems Programming, WASM, High-Performance Microservices',
    concepts: [
        { title: 'Borrow Checker', desc: "Compiler rule that ensures only one part of code owns data at a time.", metaphor: "You can lend a book to a friend, but you can't read it while they have it." },
        { title: 'Zero Cost Abstraction', desc: "High level code compiles down to the same assembly as hand-written low level code.", metaphor: "Paying for a economy ticket but getting a private jet." }
    ],
    code: `use actix_web::{get, App, HttpServer, Responder};

#[get("/")]
async fn index() -> impl Responder {
    "Hello from Rust!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(index))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}`
  },
  go: {
    name: 'Go',
    icon: Box,
    color: 'text-cyan-500',
    tagline: 'Simplicity & Concurrency',
    pros: ['Goroutines (Lightweight threads)', 'Fast compilation', 'Simple syntax'],
    cons: ['Lack of Generics (historically)', 'Verbose error handling', 'Simplistic type system'],
    setup: 'Kubernetes, Docker, Cloud-Native Microservices',
    concepts: [
        { title: 'Goroutines', desc: "Extremely lightweight threads managed by Go runtime, not OS.", metaphor: "Instead of hiring heavy expensive workers (OS Threads), you hire thousands of tiny minions." },
        { title: 'Generics', desc: "Writing functions that can handle any data type.", metaphor: "A box that can hold a Pizza OR a Burger, not just a 'PizzaBox'." }
    ],
    code: `package main
import ("fmt"; "net/http")

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello from Go!")
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}`
  },
  elixir: {
    name: 'Elixir',
    icon: Network,
    color: 'text-purple-500',
    tagline: 'Fault Tolerant & Real-time',
    pros: ['Actor Model (Erlang VM)', 'Massive concurrency (Millions of WS)', 'Fault tolerance (Let it crash)'],
    cons: ['Smaller ecosystem', 'Functional programming paradigm shift', 'Slower raw CPU speed'],
    setup: 'Discord, WhatsApp, Real-time messaging systems',
    concepts: [
        { title: 'Actor Model', desc: "Everything is an isolated process communicating via messages.", metaphor: "People sending letters to each other. If one person dies, the post office still works." },
        { title: 'Let It Crash', desc: "Don't catch errors defensively. Restart the process fresh.", metaphor: "Have you tried turning it off and on again? Automatically." }
    ],
    code: `defmodule Router do
  use Plug.Router

  plug :match
  plug :dispatch

  get "/" do
    send_resp(conn, 200, "Hello from Elixir")
  end
end`
  }
};

export const BackendLanguagesDemo: React.FC<Props> = ({ onShowCode }) => {
  const [selected, setSelected] = useState<Language>('node');
  const lang = LANGUAGES[selected];

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-white flex items-center gap-2">
                <Terminal className="text-green-400" /> Level 0: Backend Languages
             </h3>
          </div>
          <div className="flex gap-2">
             <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
               {lang.tagline}
             </span>
          </div>
       </div>

       <div className="grid grid-cols-12 gap-6 h-[500px]">
          
          {/* Sidebar Selector */}
          <div className="col-span-3 flex flex-col gap-2 border-r border-slate-800 pr-4">
             <span className="text-xs font-bold text-slate-500 uppercase mb-2">Select Language</span>
             {(Object.keys(LANGUAGES) as Language[]).map((key) => {
                 const l = LANGUAGES[key];
                 const Icon = l.icon;
                 return (
                    <button
                      key={key}
                      onClick={() => setSelected(key)}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition-all ${selected === key ? 'bg-slate-800 text-white border-l-4 border-blue-500' : 'text-slate-400 hover:bg-slate-800/50'}`}
                    >
                        <Icon size={16} className={selected === key ? l.color : 'text-slate-600'} />
                        {l.name}
                    </button>
                 );
             })}
          </div>

          {/* Main Content Area */}
          <div className="col-span-9 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
              
              {/* Header Info */}
              <div className="flex items-start justify-between">
                 <div>
                    <h2 className={`text-3xl font-black ${lang.color} mb-2`}>{lang.name}</h2>
                    <p className="text-slate-300 text-sm">{lang.setup}</p>
                 </div>
                 <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 w-1/3">
                    <span className="text-xs font-bold text-slate-500 uppercase">Best Used For</span>
                    <div className="text-xs text-white mt-1 leading-relaxed">
                       {lang.setup}
                    </div>
                 </div>
              </div>

              {/* Deep Dive Concepts Panel */}
              <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-4">
                 <h4 className="text-sm font-bold text-blue-400 uppercase mb-3 flex items-center gap-2">
                    <Book size={16} /> Core Concepts Explained
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                    {lang.concepts.map((concept, idx) => (
                        <div key={idx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                            <div className="text-xs font-bold text-white mb-1">{concept.title}</div>
                            <div className="text-[11px] text-slate-400 mb-2 leading-tight">{concept.desc}</div>
                            <div className="text-[10px] text-blue-300 italic flex gap-1">
                                <Info size={12} className="flex-shrink-0" /> "{concept.metaphor}"
                            </div>
                        </div>
                    ))}
                 </div>
              </div>

              {/* Code Snippet */}
              <div className="flex-1 bg-black rounded-xl border border-slate-800 p-4 relative overflow-hidden group min-h-[150px]">
                  <div className="absolute top-2 right-2 text-xs text-slate-600 font-mono">server.{selected}</div>
                  <pre className="text-sm font-mono text-slate-300 overflow-auto custom-scrollbar h-full">
                      <code>{lang.code}</code>
                  </pre>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-3">
                    <span className="text-xs font-bold text-green-400 uppercase mb-2 block">Pros</span>
                    <ul className="space-y-1">
                        {lang.pros.map((p, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                                <span className="w-1 h-1 bg-green-500 rounded-full"></span> {p}
                            </li>
                        ))}
                    </ul>
                 </div>
                 <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-3">
                    <span className="text-xs font-bold text-red-400 uppercase mb-2 block">Cons</span>
                    <ul className="space-y-1">
                        {lang.cons.map((c, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span> {c}
                            </li>
                        ))}
                    </ul>
                 </div>
              </div>
          </div>
       </div>
    </div>
  );
};
