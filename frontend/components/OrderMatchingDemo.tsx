
import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowDown, ArrowUp, Code2, Play } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Order {
  id: number;
  price: number;
  qty: number;
  type: 'buy' | 'sell';
}

interface Props {
  onShowCode: () => void;
}

export const OrderMatchingDemo: React.FC<Props> = ({ onShowCode }) => {
  const [bids, setBids] = useState<Order[]>([
      { id: 1, price: 100.50, qty: 10, type: 'buy' },
      { id: 2, price: 100.40, qty: 5, type: 'buy' },
      { id: 3, price: 100.30, qty: 20, type: 'buy' },
  ]);
  const [asks, setAsks] = useState<Order[]>([
      { id: 4, price: 101.00, qty: 8, type: 'sell' },
      { id: 5, price: 101.20, qty: 12, type: 'sell' },
      { id: 6, price: 101.50, qty: 10, type: 'sell' },
  ]);
  const [lastTrade, setLastTrade] = useState<{price: number, qty: number} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate High Frequency Trading
  const runSimulation = () => {
      setIsProcessing(true);
      
      const interval = setInterval(() => {
          // Randomly generate an order
          const isBuy = Math.random() > 0.5;
          const priceBase = 100.80;
          const price = parseFloat((priceBase + (Math.random() - 0.5)).toFixed(2));
          const qty = Math.ceil(Math.random() * 5);
          
          const incoming: Order = { id: Date.now(), price, qty, type: isBuy ? 'buy' : 'sell' };

          // Matching Logic (Simplistic)
          let tradeExecuted = false;

          if (isBuy) {
              // Try to match with lowest sell (ask)
              setAsks(prevAsks => {
                  const sortedAsks = [...prevAsks].sort((a,b) => a.price - b.price);
                  if (sortedAsks.length > 0 && incoming.price >= sortedAsks[0].price) {
                      // MATCH!
                      setLastTrade({ price: sortedAsks[0].price, qty: Math.min(incoming.qty, sortedAsks[0].qty) });
                      tradeExecuted = true;
                      
                      // Remove matched part (Simplified: remove full order for demo viz)
                      return prevAsks.filter(a => a.id !== sortedAsks[0].id);
                  }
                  return prevAsks;
              });
              if (!tradeExecuted) {
                  setBids(prev => [...prev, incoming].sort((a,b) => b.price - a.price).slice(0, 5));
              }
          } else {
              // Sell Order
              setBids(prevBids => {
                  const sortedBids = [...prevBids].sort((a,b) => b.price - a.price);
                  if (sortedBids.length > 0 && incoming.price <= sortedBids[0].price) {
                      // MATCH!
                      setLastTrade({ price: sortedBids[0].price, qty: Math.min(incoming.qty, sortedBids[0].qty) });
                      tradeExecuted = true;
                      return prevBids.filter(b => b.id !== sortedBids[0].id);
                  }
                  return prevBids;
              });
              if (!tradeExecuted) {
                  setAsks(prev => [...prev, incoming].sort((a,b) => a.price - b.price).slice(0, 5));
              }
          }

      }, 1000);

      return () => clearInterval(interval);
  };

  useEffect(() => {
      if (isProcessing) {
          const cleanup = runSimulation();
          return cleanup;
      }
  }, [isProcessing]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl relative">
       <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
          <div className="flex items-center gap-4">
             <BounceAvatar className="w-10 h-10" />
             <h3 className="text-xl font-mono text-emerald-400 flex items-center gap-2">
                <TrendingUp /> C++ Project: Order Matching
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1 rounded text-cyan-400 transition-colors">
                <Code2 size={14} /> Show C++
            </button>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Limit Order Book</span>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-8 h-80">
           
           {/* Order Book Visualizer */}
           <div className="col-span-1 bg-black border border-slate-700 rounded-lg p-4 font-mono text-xs flex flex-col relative overflow-hidden">
               
               <div className="flex justify-between text-slate-500 border-b border-slate-800 pb-2 mb-2">
                   <span>Qty</span>
                   <span>Price</span>
                   <span>Qty</span>
               </div>

               {/* Asks (Sells) - Red */}
               <div className="flex-1 flex flex-col-reverse justify-end gap-1 overflow-hidden">
                   {asks.map(order => (
                       <div key={order.id} className="flex justify-between items-center bg-red-900/20 text-red-400 px-2 py-1 rounded animate-in slide-in-from-right-4">
                           <span>-</span>
                           <span>{order.price.toFixed(2)}</span>
                           <span>{order.qty}</span>
                       </div>
                   ))}
               </div>

               {/* Spread Indicator */}
               <div className="py-2 flex justify-center items-center gap-2 bg-slate-900 my-2 rounded border border-slate-800">
                   {lastTrade ? (
                       <span className="text-white font-bold animate-pulse">
                           Last Trade: ${lastTrade.price.toFixed(2)} ({lastTrade.qty})
                       </span>
                   ) : (
                       <span className="text-slate-500">Spread</span>
                   )}
               </div>

               {/* Bids (Buys) - Green */}
               <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                   {bids.map(order => (
                       <div key={order.id} className="flex justify-between items-center bg-green-900/20 text-green-400 px-2 py-1 rounded animate-in slide-in-from-left-4">
                           <span>{order.qty}</span>
                           <span>{order.price.toFixed(2)}</span>
                           <span>-</span>
                       </div>
                   ))}
               </div>

           </div>

           {/* Explanation & Controls */}
           <div className="col-span-1 flex flex-col justify-center">
               <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
                   <h4 className="text-sm font-bold text-white mb-2">Your Next Project Idea</h4>
                   <p className="text-xs text-slate-400 leading-relaxed mb-2">
                       Build this <b>Order Matching Engine</b> in C++.
                   </p>
                   <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                       <li>Use <code>std::map</code> or <code>std::priority_queue</code> for the order book.</li>
                       <li>Handle Buy/Sell matching logic (shown left).</li>
                       <li>Optimize for microsecond latency (no heap allocations in the hot path).</li>
                   </ul>
               </div>

               <button 
                  onClick={() => setIsProcessing(!isProcessing)} 
                  className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${isProcessing ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
               >
                   {isProcessing ? 'Stop Simulation' : <><Play size={16}/> Start HFT Simulation</>}
               </button>
               
               <div className="mt-4 text-center text-[10px] text-slate-500">
                   This simulates a NASDAQ-style limit order book.
               </div>
           </div>

       </div>
    </div>
  );
};
