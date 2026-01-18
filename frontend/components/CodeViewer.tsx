import React, { useState, useEffect } from 'react';
import { X, Code, Copy } from 'lucide-react';
import { CodeSnippet } from '../types';

interface CodeViewerProps {
  snippet: CodeSnippet;
  onClose: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ snippet, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center ${isMobile ? 'p-2' : 'p-4'} animate-in fade-in zoom-in-95 duration-200`}>
      <div className={`w-full max-w-3xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col ${isMobile ? 'max-h-[90vh]' : 'max-h-[80vh]'}`}>
        
        {/* Header */}
        <div className={`flex justify-between items-center ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} bg-[#252526] border-b border-[#3e3e42]`}>
          <div className="flex items-center gap-2 flex-wrap">
             <Code className="text-blue-400" size={isMobile ? 14 : 18} />
             <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-slate-200`}>{snippet.title}</span>
             <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-500 bg-[#3e3e42] px-2 py-0.5 rounded uppercase`}>{snippet.language}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={isMobile ? 18 : 20} />
          </button>
        </div>

        {/* Description */}
        <div className={`${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} bg-[#2d2d30] border-b border-[#3e3e42]`}>
           <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-400`}>{snippet.description}</p>
        </div>

        {/* Code Content */}
        <div className={`${isMobile ? 'p-2' : 'p-4'} overflow-y-auto overflow-x-auto custom-scrollbar font-mono ${isMobile ? 'text-[10px]' : 'text-sm'} leading-relaxed`}>
          <pre className="text-slate-300">
            <code>
              {snippet.code.split('\n').map((line, i) => (
                <div key={i} className="flex">
                  <span className={`${isMobile ? 'w-6' : 'w-8'} text-slate-600 select-none text-right ${isMobile ? 'mr-2' : 'mr-4'}`}>{i + 1}</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>

        {/* Footer */}
        <div className={`${isMobile ? 'p-2' : 'p-3'} bg-[#252526] border-t border-[#3e3e42] flex justify-end`}>
            <button className={`flex items-center gap-2 ${isMobile ? 'text-[10px]' : 'text-xs'} text-slate-400 hover:text-white transition-colors`}>
                <Copy size={isMobile ? 12 : 14} /> Copy
            </button>
        </div>

      </div>
    </div>
  );
};