import React, { useState, useEffect } from 'react';
import { Box, Code2, Layers, Play, Settings } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
    onShowCode: () => void;
}

export const DockerDemo: React.FC<Props> = ({ onShowCode }) => {
  const [step, setStep] = useState(0); // 0: Code, 1: Build, 2: Run
  const [logs, setLogs] = useState<string[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleBuild = () => {
      setStep(1);
      setLogs([]);
      addLog("> docker build -t my-app:v1 .");
      
      setTimeout(() => addLog("[1/4] FROM node:18-alpine"), 500);
      setTimeout(() => addLog("[2/4] WORKDIR /app"), 1000);
      setTimeout(() => addLog("[3/4] COPY . ."), 1500);
      setTimeout(() => addLog("[4/4] RUN npm install"), 2000);
      setTimeout(() => {
          addLog("Successfully built image: my-app:v1");
          setStep(2);
      }, 2500);
  };

  const handleRun = () => {
      setStep(3);
      addLog("> docker run -p 3000:3000 my-app:v1");
      setTimeout(() => {
          addLog("Container ID: 8f3a2c1b9d");
          addLog("App running on http://localhost:3000");
      }, 800);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-slate-900 rounded-xl ${isMobile ? 'p-4' : 'p-8'} border border-slate-700 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} items-center border-b border-slate-700 pb-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-mono text-blue-400 flex items-center gap-2`}>
                <Box size={isMobile ? 16 : 24} /> {isMobile ? 'Docker' : 'Level 5: Docker & Containers'}
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Code
            </button>
            {!isMobile && <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Containerization</span>}
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'} ${isMobile ? 'h-auto' : 'h-64'}`}>
            
            {/* Visualizer */}
            <div className={`${isMobile ? '' : 'col-span-1'} flex flex-col items-center justify-center ${isMobile ? 'pb-4 border-b' : 'border-r'} border-slate-700 ${isMobile ? '' : 'pr-8'}`}>
                {step === 0 && (
                    <div className="flex flex-col items-center text-slate-500">
                        <Settings size={isMobile ? 32 : 48} className="mb-4" />
                        <p className={isMobile ? 'text-sm' : ''}>Write Dockerfile</p>
                    </div>
                )}
                
                {step === 1 && (
                    <div className={`relative ${isMobile ? 'w-24 h-32' : 'w-32 h-40'} bg-slate-800 border-2 border-dashed border-blue-500/50 rounded flex flex-col items-center justify-center animate-pulse`}>
                        <Layers size={isMobile ? 24 : 32} className="text-blue-400" />
                        <span className="text-xs mt-2 text-blue-300">Building Image...</span>
                    </div>
                )}

                {step >= 2 && (
                    <div className="flex flex-col items-center gap-4">
                        <div className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} bg-blue-900/20 border-2 border-blue-500 rounded-xl flex items-col justify-center items-center relative shadow-[0_0_20px_rgba(59,130,246,0.3)]`}>
                            <Box size={isMobile ? 32 : 48} className="text-blue-400" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {step === 3 && <div className="absolute -bottom-6 text-xs text-green-400 font-mono">Running</div>}
                        </div>
                    </div>
                )}
            </div>

            {/* Controls & Logs */}
            <div className={`${isMobile ? '' : 'col-span-1'} flex flex-col`}>
                 <div className={`${isMobile ? 'h-32' : 'flex-1'} bg-black/50 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-y-auto mb-4 custom-scrollbar`}>
                     <div className="text-slate-500 mb-2"># Terminal</div>
                     {logs.map((l, i) => <div key={i} className="mb-1">{l}</div>)}
                 </div>

                 <div className="flex gap-4">
                     {step === 0 && (
                         <button onClick={handleBuild} className={`flex-1 bg-blue-600 hover:bg-blue-500 text-white ${isMobile ? 'py-1.5 text-sm' : 'py-2'} rounded font-bold flex items-center justify-center gap-2`}>
                             <Settings size={16} /> Build Image
                         </button>
                     )}
                     {step === 2 && (
                         <button onClick={handleRun} className={`flex-1 bg-green-600 hover:bg-green-500 text-white ${isMobile ? 'py-1.5 text-sm' : 'py-2'} rounded font-bold flex items-center justify-center gap-2`}>
                             <Play size={16} /> Run Container
                         </button>
                     )}
                 </div>
            </div>

        </div>

        <p className={`${isMobile ? 'mt-4 text-xs' : 'mt-6 text-sm'} text-slate-400 text-center bg-slate-950/50 p-2 rounded`}>
           Docker packages your app and its environment into an <b>Image</b>. This image runs as an isolated <b>Container</b> anywhere.
        </p>
    </div>
  );
};