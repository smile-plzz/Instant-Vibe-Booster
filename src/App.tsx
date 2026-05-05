import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Dog, Quote, Laugh, Loader2, RefreshCcw, 
  Cat, Info, HelpCircle, Gamepad2, Zap, ShoppingBag, Fingerprint, Image as ImageIcon, Bitcoin as BtcIcon
} from 'lucide-react';

const P = ({t}: {t:string}) => (
  <div className="mt-4 self-start inline-block px-3 py-1 rounded-full border-2 border-[#2d3436] text-[11px] font-bold bg-white text-[#2d3436] uppercase">{t}</div>
);

const C = ({ children, bg, className="", text="" }: any) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100 }}
    className={`bg-[${bg}] ${text} ${className} border-[3px] border-[#2d3436] rounded-3xl overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300`}
    style={{ boxShadow: '8px 8px 0 0 #2d3436', backgroundColor: bg }}
  >
    {children}
  </motion.div>
);

const H = ({ t, I, bg, color='#2d3436' }: any) => (
  <div className="px-5 py-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest border-b-[3px] border-[#2d3436] flex items-center justify-between" style={{ background: bg, color }}>
    <span className="truncate mr-2">{t}</span><I className="w-4 h-4 shrink-0" />
  </div>
);

export default function App() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchers = {
    advice: async () => { const r = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`); return (await r.json()).slip.advice; },
    dog: async () => { const r = await fetch('https://dog.ceo/api/breeds/image/random'); return (await r.json()).message; },
    joke: async () => { const r = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode'); const d = await r.json(); return d.type === 'single' ? { s: d.joke } : { s: d.setup, d: d.delivery }; },
    cat: async () => { const r = await fetch('https://catfact.ninja/fact'); return (await r.json()).fact; },
    useless: async () => { const r = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random'); return (await r.json()).text; },
    fox: async () => { const r = await fetch('https://randomfox.ca/floof/'); return (await r.json()).image; },
    yesno: async () => { const r = await fetch('https://yesno.wtf/api'); return await r.json(); },
    kanye: async () => { const r = await fetch('https://api.kanye.rest/'); return (await r.json()).quote; },
    btc: async () => { const r = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json'); return (await r.json()).bpi.USD.rate; },
    poke: async () => { const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 898) + 1}`); const d = await r.json(); return { n: d.name, i: d.sprites.front_default }; },
    chuck: async () => { const r = await fetch('https://api.chucknorris.io/jokes/random'); return (await r.json()).value; },
    shop: async () => { const r = await fetch(`https://fakestoreapi.com/products/${Math.floor(Math.random() * 20) + 1}`); const d = await r.json(); return { t: d.title, i: d.image, p: d.price }; },
    agify: async () => { const n = ["james", "mary", "john", "patricia", "robert"][Math.floor(Math.random()*5)]; const r = await fetch(`https://api.agify.io?name=${n}`); const d = await r.json(); return { n: d.name, a: d.age }; }
  };

  const fetchAll = useCallback(async (isInitial = false) => {
    setIsRefreshing(true);
    if (isInitial) setLoading(true);
    
    const results: any = {};
    await Promise.all(Object.entries(fetchers).map(async ([k, fn]) => {
      try { results[k] = await fn(); } catch(e) { }
    }));
    
    setData(results);
    setLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => { fetchAll(true); }, [fetchAll]);

  if (loading) return (
    <div className="min-h-screen bg-[#fdf6ff] flex flex-col items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}><Sparkles className="w-12 h-12 text-[#6c5ce7]" /></motion.div>
      <p className="mt-4 font-bold uppercase tracking-widest text-[#2d3436]">Gathering 13 APIs...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf6ff] text-[#2d3436] font-sans selection:bg-[#6c5ce7] selection:text-white flex flex-col overflow-x-hidden">
      <header className="px-6 md:px-10 py-6 border-b-[3px] border-[#2d3436] bg-white flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 z-50 shadow-sm">
        <div className="text-[28px] font-black tracking-tighter uppercase text-[#6c5ce7] border-[3px] border-[#2d3436] px-4 py-1.5 rounded-xl shadow-[4px_4px_0_0_#2d3436]">
          Vibe Booster
        </div>
        <motion.button onClick={() => fetchAll(false)} disabled={isRefreshing} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95, y: 0 }}
          className="group relative inline-flex items-center gap-2 bg-[#6c5ce7] text-white px-6 py-2.5 rounded-full font-bold uppercase cursor-pointer transition-all border-[3px] border-[#2d3436] focus:outline-none shadow-[4px_4px_0_0_#2d3436]">
          {isRefreshing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />}
          Mix New Data
        </motion.button>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-[280px]">
          
          <C bg="#ff7eb3" className="sm:col-span-2">
            <H t="Advice Slip" I={Quote} bg="#ff4d94" color="white" />
            <div className="flex-grow p-6 flex flex-col justify-between text-white">
              <p className="text-2xl md:text-3xl font-extrabold leading-tight italic">"{data.advice || 'Keep going.'}"</p>
              <P t="LIFE_HACK_API" />
            </div>
          </C>

          <C bg="#fff740">
            <H t="Random Dog" I={Dog} bg="#eee" />
            <div className="relative flex-grow bg-white">
              {data.dog && <img src={data.dog} className="absolute inset-0 w-full h-full object-cover" alt="Dog"/>}
              <div className="absolute bottom-3 left-3 z-10"><P t="CANINE_DB" /></div>
            </div>
          </C>

          <C bg="#000" text="text-white">
            <H t="Bitcoin Price" I={BtcIcon} bg="#2d3436" color="white" />
            <div className="flex-grow p-6 flex flex-col justify-center items-center text-center">
              <p className="text-3xl lg:text-4xl font-black text-[#7afcff] mb-2">${data.btc || '?'}</p>
              <p className="text-sm font-bold opacity-70 uppercase tracking-widest">USD</p>
              <div className="mt-auto"><P t="COINDESK_BPI" /></div>
            </div>
          </C>

          <C bg="#7afcff" className="sm:col-span-2 row-span-2">
            <H t="Chuckle Generator" I={Laugh} bg="#eee" />
            <div className="flex-grow p-8 flex flex-col justify-center">
               <p className="text-3xl md:text-5xl font-black leading-tight text-[#2d3436] mb-6">{data.joke?.s || 'No jokes today'}</p>
               {data.joke?.d && <p className="text-2xl md:text-3xl font-bold text-[#6c5ce7]">— {data.joke.d}</p>}
               <div className="mt-auto pt-6"><P t="COMEDY_BOT_V2" /></div>
            </div>
          </C>

          <C bg="#feff9c" className="sm:col-span-2">
            <H t="Feline Facts" I={Cat} bg="#eee" />
            <div className="flex-grow p-6 flex flex-col justify-between">
              <p className="text-xl md:text-2xl font-bold leading-snug">"{data.cat || 'Meow.'}"</p>
              <P t="CATFACT_NINJA" />
            </div>
          </C>

          <C bg="#6c5ce7">
            <H t="Floof Finder" I={ImageIcon} bg="#5046e5" color="white" />
            <div className="relative flex-grow bg-white">
              {data.fox && <img src={data.fox} className="absolute inset-0 w-full h-full object-cover" alt="Fox"/>}
              <div className="absolute bottom-3 left-3 z-10"><P t="RANDOM_FOX" /></div>
            </div>
          </C>

          <C bg="#000" text="text-white">
            <H t="Magic 8 Ball" I={HelpCircle} bg="#2d3436" color="white" />
            <div className="relative flex-grow flex items-center justify-center overflow-hidden">
              {data.yesno && <img src={data.yesno.image} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="gif"/>}
              <p className="relative z-10 text-6xl font-black uppercase tracking-widest text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">{data.yesno?.answer}</p>
              <div className="absolute bottom-3 left-3 z-10"><P t="YESNO_WTF" /></div>
            </div>
          </C>

          <C bg="#ff7eb3" className="sm:col-span-2">
            <H t="Kanye Quotes" I={Quote} bg="#eee" />
            <div className="flex-grow p-6 flex flex-col justify-between bg-white text-[#2d3436]">
              <p className="text-2xl md:text-3xl font-extrabold leading-tight">"{data.kanye || 'Genius.'}"</p>
              <P t="KANYE_REST" />
            </div>
          </C>

          <C bg="#fff740">
             <H t="Who's that Poke?" I={Gamepad2} bg="#eee" />
             <div className="flex-grow flex flex-col items-center justify-center p-4 bg-white">
                {data.poke?.i && <img src={data.poke.i} alt={data.poke.n} className="w-32 h-32" style={{imageRendering: 'pixelated'}} />}
                <p className="text-xl font-black uppercase mt-2">{data.poke?.n}</p>
                <div className="mt-auto"><P t="POKEAPI" /></div>
             </div>
          </C>

          <C bg="#6c5ce7" className="sm:col-span-2" text="text-white">
            <H t="Tough Guy Facts" I={Zap} bg="#5046e5" color="white" />
            <div className="flex-grow p-6 flex flex-col justify-between">
              <p className="text-xl md:text-2xl font-bold leading-snug">"{data.chuck || 'Punch.'}"</p>
              <P t="CHUCK_NORRIS" />
            </div>
          </C>

          <C bg="#feff9c" className="sm:col-span-2">
            <H t="Useless Info" I={Info} bg="#eee" />
            <div className="flex-grow p-6 flex flex-col justify-between">
              <p className="text-xl font-bold leading-snug">{data.useless || 'Nothing.'}</p>
              <P t="USELESS_FACTS" />
            </div>
          </C>

          <C bg="#ffffff">
            <H t="Random Product" I={ShoppingBag} bg="#eee" />
            <div className="flex-grow flex flex-col justify-between p-4 bg-white items-center">
               <div className="flex items-center justify-center h-24 mb-4 mt-2">
                  {data.shop?.i && <img src={data.shop.i} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="prod"/>}
               </div>
               <p className="text-sm font-bold line-clamp-2 leading-tight text-center">{data.shop?.t}</p>
               <p className="text-2xl font-black text-[#6c5ce7] mt-1">${data.shop?.p}</p>
               <div className="mt-auto self-start"><P t="FAKE_STORE" /></div>
            </div>
          </C>

          <C bg="#7afcff">
            <H t="Age Guesser" I={Fingerprint} bg="#eee" />
            <div className="flex-grow p-6 flex flex-col justify-center text-center">
              <p className="text-xl font-bold uppercase mb-2 text-[#2d3436]">Name: {data.agify?.n}</p>
              <p className="text-6xl font-black text-[#ff4d94]">{data.agify?.a}</p>
              <p className="text-xs font-bold mt-2 opacity-60 uppercase">Estimated Age</p>
              <div className="mt-auto flex justify-center"><P t="AGIFY_IO" /></div>
            </div>
          </C>

        </div>
      </main>

      <footer className="bg-[#2d3436] text-white px-6 md:px-10 py-4 text-xs font-bold flex flex-col md:flex-row justify-between items-center gap-2 mt-auto">
        <div>CONNECTED TO 13 LIVE DATA SOURCES</div>
        <div>VIBRANT ENGINE v2.05</div>
      </footer>
    </div>
  );
}
