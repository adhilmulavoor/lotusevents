import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'] });

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[100] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[20%] left-[10%] w-[60vw] h-[60vw] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
      
      <div className="relative flex flex-col items-center">
        {/* Central Brand Mark */}
        <div className="relative group cursor-default mb-12">
          <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <h1 className={`${playfair.className} text-7xl md:text-9xl font-black tracking-[0.2em] uppercase relative mix-blend-difference`}>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 animate-shimmer">
              Lotus
            </span>
          </h1>
          <div className="absolute -bottom-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent scale-x-0 animate-expand-line" />
        </div>
        
        {/* Status indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.32s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.16s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[bounce_1.4s_infinite_ease-in-out_both]" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold animate-pulse">
            Establishing Connection
          </p>
        </div>
      </div>
    </div>
  );
}
