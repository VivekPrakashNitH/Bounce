'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, ArrowUpDown, Zap } from 'lucide-react';
import { BounceAvatar, SidebarNav, PageMadeModal, GearButton } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
}

interface Order {
  id: number;
  price: number;
  quantity: number;
  type: 'buy' | 'sell';
}

export const OrderMatchingDemo: React.FC<Props> = ({ onShowCode }) => {

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [ballVisible, setBallVisible] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);
  const [matched, setMatched] = useState<Array<{ buy: Order; sell: Order }>>([]);
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);

  const sections = [
    { id: 'section-1', label: 'Order Matching' },
    { id: 'section-2', label: 'Order Types' },
    { id: 'section-3', label: 'Match Demo' },
    { id: 'section-4', label: 'Algorithms' },
    { id: 'section-5', label: 'Performance' },
    { id: 'section-6', label: 'Applications' },
  ];

  const sectionDetails = [
    { label: 'Order Matching', description: 'Engine fundamentals' },
    { label: 'Order Types', description: 'Market, limit, stop orders' },
    { label: 'Match Demo', description: 'Interactive order book' },
    { label: 'Algorithms', description: 'Price-time, pro-rata, FIFO' },
    { label: 'Performance', description: 'Latency, throughput' },
    { label: 'Applications', description: 'Exchanges, esports' },
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
      const { scrollTop, scrollHeight, clientHeight } = container;
      const totalScroll = scrollHeight - clientHeight;
      const progress = totalScroll > 0 ? Math.min(100, (scrollTop / totalScroll) * 100) : 0;
      setScrollProgress(progress);

      const sections = ['section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6'];
      let activeSection = 0;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < containerCenter) {
            activeSection = i;
          } else {
            break;
          }
        }
      }
      setCurrentSection(activeSection);
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
      handleScroll(); // Initial check
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
  }, [gateUnlocked, showInstructions]);

  useEffect(() => {
    setBallVisible(currentSection !== 3);
  }, [currentSection]);

  const matchOrders = () => {
    const newMatched: Array<{ buy: Order; sell: Order }> = [];
    const tempBuy = [...buyOrders].sort((a, b) => b.price - a.price);
    const tempSell = [...sellOrders].sort((a, b) => a.price - b.price);

    for (const buy of tempBuy) {
      for (const sell of tempSell) {
        if (buy.price >= sell.price) {
          newMatched.push({ buy, sell });
          break;
        }
      }
    }
    setMatched(newMatched);
  };

  const addOrder = (type: 'buy' | 'sell') => {
    const price = Math.floor(Math.random() * 100) + 50;
    const quantity = Math.floor(Math.random() * 100) + 10;
    const id = Date.now();

    if (type === 'buy') {
      setBuyOrders(prev => [...prev, { id, price, quantity, type }]);
    } else {
      setSellOrders(prev => [...prev, { id, price, quantity, type }]);
    }
    setMatched([]);
  };

  return (
    <div className="w-full bg-slate-950">


      {/* Header Component */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
        title="Order Matching"
        levelCode="G06"
        accentColor="yellow"
      />

      <SidebarNav
        sections={sections}
        activeIndex={currentSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="yellow"
        isVisible={gateUnlocked}
      />

      {/* Page Architecture Modal */}
      <PageMadeModal
        isOpen={showPageMadeModal}
        onClose={() => setShowPageMadeModal(false)}
        title="Order Matching"
        levelCode="G06"
        icon="📈"
        description="This page covers order matching engines with 6 sections including an interactive order book demo."
        sections={sectionDetails}
        accentColor="yellow"
        learningSummary="How order matching engines match buy/sell orders in trading platforms."
      />

      {/* Gear Icon Button */}
      <GearButton
        onClick={() => setShowPageMadeModal(true)}
        accentColor="yellow"
      />

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
              <div className="w-12 h-12 border-2 border-yellow-400/50 rounded-full flex items-center justify-center animate-ping opacity-50"></div>
              <span className="text-xs mt-2 text-yellow-400">TAP</span>
            </div>
          </div>
        </div>
      )}

      {gateUnlocked && showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-slate-800 border border-yellow-500/30 rounded-xl p-8 max-w-sm mx-2">
            <h3 className="text-lg font-bold text-yellow-300 mb-4">Use Arrow Keys</h3>
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

      {/* Main Content */}
      <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-6">Order Matching Engine</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
              Matching engines are critical systems for trading platforms, auctions, and competitive gaming. Match buy/sell orders efficiently.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
              Must handle thousands of orders per second. Low latency critical. Correctness essential.
            </p>
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-xs sm:text-sm text-yellow-200">
                <strong>Key Insight:</strong> Price-time priority. Best prices first. FIFO within same price level.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full aspect-square max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full blur-2xl" />
              <div className="relative w-full h-full flex items-center justify-center border-2 border-yellow-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                <TrendingUp className="w-24 h-24 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-4xl w-full">
          <h3 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-8 text-center">Order Types</h3>
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl">
              <p className="font-bold text-yellow-300 mb-2">Market Orders</p>
              <p className="text-sm text-slate-300">Buy/sell immediately at best available price. Instant execution. Slippage possible.</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl">
              <p className="font-bold text-yellow-300 mb-2">Limit Orders</p>
              <p className="text-sm text-slate-300">Buy/sell at specific price or better. Waits in order book. Price guaranteed, execution not.</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl">
              <p className="font-bold text-yellow-300 mb-2">Stop Orders</p>
              <p className="text-sm text-slate-300">Trigger when price reaches level. Risk management. Convert to market when triggered.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-4xl w-full">
          <h3 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-8 text-center">Interactive: Match Orders</h3>
          <div className="bg-slate-800/50 backdrop-blur border border-yellow-500/30 rounded-xl p-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => addOrder('buy')}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Add Buy Order
              </button>
              <button
                onClick={() => addOrder('sell')}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Add Sell Order
              </button>
              <button
                onClick={matchOrders}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Match
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Buy Orders ({buyOrders.length})</p>
                <div className="space-y-1">
                  {buyOrders.map(order => (
                    <div key={order.id} className="text-xs text-green-300 bg-green-900/20 p-2 rounded">
                      {order.price}: {order.quantity}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Sell Orders ({sellOrders.length})</p>
                <div className="space-y-1">
                  {sellOrders.map(order => (
                    <div key={order.id} className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                      {order.price}: {order.quantity}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Matched ({matched.length})</p>
                <div className="space-y-1">
                  {matched.map((m, i) => (
                    <div key={i} className="text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
                      {m.buy.price} x {m.sell.price}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-4xl w-full">
          <h3 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-8 text-center">Matching Algorithms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-800/50 border border-yellow-500/30 rounded-xl">
              <h4 className="font-bold text-yellow-300 mb-2">Price-Time Priority</h4>
              <p className="text-sm text-slate-300">Best price first. Within price, earliest order. Standard in markets.</p>
            </div>
            <div className="p-6 bg-slate-800/50 border border-yellow-500/30 rounded-xl">
              <h4 className="font-bold text-yellow-300 mb-2">Pro-Rata</h4>
              <p className="text-sm text-slate-300">Share equally among same price. Prevents queue jumping. Commodities use this.</p>
            </div>
            <div className="p-6 bg-slate-800/50 border border-yellow-500/30 rounded-xl">
              <h4 className="font-bold text-yellow-300 mb-2">Time-Price Priority</h4>
              <p className="text-sm text-slate-300">Time first, then price. Encourages market making. Rare.</p>
            </div>
            <div className="p-6 bg-slate-800/50 border border-yellow-500/30 rounded-xl">
              <h4 className="font-bold text-yellow-300 mb-2">FIFO</h4>
              <p className="text-sm text-slate-300">First in, first out. Pure time priority. Fairest perceived. Gaming fairness.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-4xl w-full">
          <h3 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-8 text-center">Performance Requirements</h3>
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl">
              <p className="font-bold text-yellow-300 mb-2">Latency</p>
              <p className="text-sm text-slate-300">Microseconds matter. Faster matching = better prices. Arms race in trading.</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl">
              <p className="font-bold text-yellow-300 mb-2">Throughput</p>
              <p className="text-sm text-slate-300">Thousands of orders/sec. Order book updates constantly. Must keep up.</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl">
              <p className="font-bold text-yellow-300 mb-2">Correctness</p>
              <p className="text-sm text-slate-300">Zero tolerance for bugs. Regulatory compliance. Audit trails required.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-4xl w-full">
          <h3 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-8 text-center">Real-World Applications</h3>
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl">
              <p className="font-bold text-yellow-300 mb-2">Stock Exchanges</p>
              <p className="text-sm text-slate-300">NYSE, NASDAQ. Billions traded daily. High frequency trading. Critical infrastructure.</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl">
              <p className="font-bold text-yellow-300 mb-2">Crypto Exchanges</p>
              <p className="text-sm text-slate-300">Binance, Coinbase. 24/7 operation. Orderbook model standard.</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl">
              <p className="font-bold text-yellow-300 mb-2">Esports Tournaments</p>
              <p className="text-sm text-slate-300">Team picking. Draft systems. Fairness matters for competition.</p>
            </div>
          </div>
        </div>
      </section>




      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
