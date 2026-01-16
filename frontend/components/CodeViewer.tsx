import React from 'react';
import { X, Code, Copy } from 'lucide-react';
import { CodeSnippet } from '../types';

interface CodeViewerProps {
  snippet: CodeSnippet;
  onClose: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ snippet, onClose }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-3xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-[#252526] border-b border-[#3e3e42]">
          <div className="flex items-center gap-3">
             <Code className="text-blue-400" size={18} />
             <span className="text-sm font-bold text-slate-200">{snippet.title}</span>
             <span className="text-xs text-slate-500 bg-[#3e3e42] px-2 py-0.5 rounded uppercase">{snippet.language}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <div className="px-4 py-2 bg-[#2d2d30] border-b border-[#3e3e42]">
           <p className="text-sm text-slate-400">{snippet.description}</p>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed">
          <pre className="text-slate-300">
            <code>
              {snippet.code.split('\n').map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-8 text-slate-600 select-none text-right mr-4">{i + 1}</span>
                  <span className="whitespace-pre-wrap">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#252526] border-t border-[#3e3e42] flex justify-end">
            <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <Copy size={14} /> Copy to Clipboard
            </button>
        </div>

      </div>
    </div>
  );
};