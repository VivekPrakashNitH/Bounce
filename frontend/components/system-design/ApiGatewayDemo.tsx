
import React, { useState } from 'react';
import { Route, Box, User, ShoppingCart, ArrowRight, Code2, MousePointerClick } from 'lucide-react';
import { BounceAvatar } from '../ui/BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const ApiGatewayDemo: React.FC<Props> = ({ onShowCode }) => {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleRequest = (route: '/users' | '/orders') => {
    if (processing) return;
    if (!hasInteracted) setHasInteracted(true);
    setProcessing(true);
    setActiveRoute(route);

    setTimeout(() => {
      setProcessing(false);
      setActiveRoute(null);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
      <div className="bg-slate-900 rounded-xl p-3 sm:p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-slate-700 pb-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
             <BounceAvatar className="w-8 h-8 sm:w-10 sm:h-10" />
             <h3 className="text-sm sm:text-xl font-mono text-purple-400 flex items-center gap-2">
                <Route className="w-4 h-4 sm:w-5 sm:h-5" /> Level 3: API Gateway
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show Code
            </button>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Microservices Pattern</span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 items-center h-auto sm:h-64 overflow-x-auto">
            
            {/* 1. Client Side */}
            <div className="col-span-1 flex flex-col gap-4 relative">
                
                {/* NUDGE */}
                {!hasInteracted && (
                    <div className="absolute -top-12 left-0 w-full flex flex-col items-center animate-bounce z-50 pointer-events-none">
                        <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full mb-1 whitespace-nowrap font-bold shadow-lg">Click Me</span>
                        <MousePointerClick className="text-blue-500 fill-blue-500" size={20} />
                    </div>
                )}

                <button 
                  onClick={() => handleRequest('/users')}
                  disabled={processing}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg text-xs font-mono flex items-center justify-between shadow-lg disabled:opacity-50"
                >
                   <span>GET /users</span> <User size={14} />
                </button>
                <button 
                   onClick={() => handleRequest('/orders')}
                   disabled={processing}
                   className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg text-xs font-mono flex items-center justify-between shadow-lg disabled:opacity-50"
                >
                   <span>GET /orders</span> <ShoppingCart size={14} />
                </button>
            </div>

            {/* 2. Animation Space (Request) */}
            <div className="col-span-1 relative h-full flex items-center justify-center">
                {processing && (
                   <div className="absolute animate-[slideRight_0.7s_linear_forwards] z-20">
                      <div className={`w-3 h-3 rounded-full ${activeRoute === '/users' ? 'bg-blue-400' : 'bg-orange-400'}`}></div>
                   </div>
                )}
                <div className="w-full h-0.5 bg-slate-700"></div>
            </div>

            {/* 3. API Gateway */}
            <div className={`col-span-1 h-32 border-2 border-purple-500 rounded-xl bg-slate-800 flex flex-col items-center justify-center relative transition-all ${processing ? 'shadow-[0_0_20px_rgba(168,85,247,0.4)]' : ''}`}>
                 <Route className="text-purple-400 mb-2" />
                 <span className="text-xs font-bold text-slate-300">API Gateway</span>
                 <span className="text-[10px] text-slate-500">Router</span>
            </div>

            {/* 4. Animation Space (Routing) */}
            <div className="col-span-1 relative h-full">
                {/* Top Path (Users) */}
                <div className="absolute top-[30%] left-0 w-full h-[50%] border-t-2 border-r-2 border-slate-700 rounded-tr-3xl"></div>
                {/* Bottom Path (Orders) */}
                <div className="absolute bottom-[30%] left-0 w-full h-[50%] border-b-2 border-r-2 border-slate-700 rounded-br-3xl"></div>

                {processing && activeRoute === '/users' && (
                    <div className="absolute top-[30%] left-0 w-full h-full animate-[routeUp_0.7s_0.7s_linear_forwards]">
                        <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_blue]"></div>
                    </div>
                )}
                
                {processing && activeRoute === '/orders' && (
                    <div className="absolute bottom-[30%] left-0 w-full h-full animate-[routeDown_0.7s_0.7s_linear_forwards]">
                        <div className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_10px_orange]"></div>
                    </div>
                )}
            </div>

            {/* 5. Microservices */}
            <div className="col-span-1 flex flex-col justify-between h-48 py-2">
                 <div className={`p-4 border border-blue-500/30 rounded-lg bg-slate-800 flex items-center gap-2 transition-transform ${activeRoute === '/users' && processing ? 'scale-110 bg-blue-500/20 border-blue-500' : ''}`}>
                    <User className="text-blue-400" />
                    <div className="text-[10px]">User Service</div>
                 </div>
                 
                 <div className={`p-4 border border-orange-500/30 rounded-lg bg-slate-800 flex items-center gap-2 transition-transform ${activeRoute === '/orders' && processing ? 'scale-110 bg-orange-500/20 border-orange-500' : ''}`}>
                    <ShoppingCart className="text-orange-400" />
                    <div className="text-[10px]">Order Service</div>
                 </div>
            </div>
        </div>
        
        <style>{`
           @keyframes slideRight { 0% { left: 0; } 100% { left: 100%; } }
           @keyframes routeUp { 
             0% { left: 0; top: 30%; } 
             50% { left: 100%; top: 30%; } 
             100% { left: 100%; top: -20%; opacity: 0; } 
           }
           @keyframes routeDown { 
             0% { left: 0; bottom: 30%; } 
             50% { left: 100%; bottom: 30%; } 
             100% { left: 100%; bottom: -20%; opacity: 0; } 
           }
        `}</style>
      </div>
    </div>
  );
};
