import React, { useState, useEffect } from 'react';
import { Link, Database, ArrowRight, Code2 } from 'lucide-react';
import { BounceAvatar } from './BounceAvatar';

interface Props {
  onShowCode: () => void;
}

export const UrlShortenerDemo: React.FC<Props> = ({ onShowCode }) => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [db, setDb] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.innerHeight < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const generateShortUrl = () => {
     if (!longUrl) return;
     setLoading(true);
     setShortUrl('');

     // Simulate Base62 encoding
     setTimeout(() => {
         const hash = Math.random().toString(36).substring(2, 8);
         const fullShort = `https://tiny.url/${hash}`;
         setDb(prev => ({ ...prev, [hash]: longUrl }));
         setShortUrl(fullShort);
         setLoading(false);
     }, 1000);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl ${isMobile ? 'p-4' : 'p-6'} border border-white/10 shadow-2xl relative`}>
       <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} items-center border-b border-white/10 pb-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-4">
             <BounceAvatar className={isMobile ? 'w-8 h-8' : 'w-10 h-10'} />
             <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold tracking-tight text-white flex items-center gap-2`}>
                <Link className="text-white" size={isMobile ? 16 : 24} /> {isMobile ? 'URL Shortener' : 'Case Study: URL Shortener'}
             </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowCode} className="flex items-center gap-1 text-[10px] bg-white text-black hover:bg-zinc-200 border border-transparent px-3 py-1 rounded-full transition-colors font-bold uppercase tracking-wide">
                <Code2 size={12} /> Show Code
            </button>
            <span className="text-[10px] text-zinc-400 border border-white/10 px-2 py-1 rounded-full uppercase tracking-wide">TinyURL Design</span>
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'}`}>
            <div className="flex flex-col gap-4">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Enter Long URL</label>
                <div className="flex gap-2">
                    <input 
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-white transition-colors"
                      placeholder="https://www.google.com/search?q=..."
                      value={longUrl}
                      onChange={e => setLongUrl(e.target.value)}
                    />
                    <button onClick={generateShortUrl} disabled={loading} className="bg-white hover:bg-zinc-200 text-black px-4 rounded-lg font-bold text-sm disabled:opacity-50">
                       {loading ? '...' : 'Shorten'}
                    </button>
                </div>
                
                {shortUrl && (
                    <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl animate-in fade-in slide-in-from-top-2">
                        <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Generated Short Link:</div>
                        <div className="text-lg font-mono text-green-400">{shortUrl}</div>
                    </div>
                )}
            </div>

            <div className={`${isMobile ? 'border-t pt-4' : 'border-l pl-8'} border-white/5`}>
                <div className="flex items-center gap-2 mb-4 text-white font-bold text-sm">
                    <Database size={16} /> Database (Mapping)
                </div>
                <div className={`${isMobile ? 'h-32' : 'h-40'} overflow-y-auto custom-scrollbar bg-black/20 rounded-xl p-3 border border-white/5`}>
                    {Object.entries(db).length === 0 && <div className="text-zinc-600 text-xs italic text-center mt-10">Database empty...</div>}
                    {Object.entries(db).map(([hash, url]) => (
                        <div key={hash} className="text-xs font-mono mb-2 p-2 bg-zinc-900 rounded border border-zinc-800 break-all">
                           <span className="text-green-400">{hash}</span> <ArrowRight size={10} className="inline mx-1 text-zinc-600" /> <span className="text-zinc-400">{(url as string).substring(0, 20)}...</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};