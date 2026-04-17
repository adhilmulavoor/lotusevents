import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Award, Users, CalendarDays, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Playfair_Display, Montserrat } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mevertpazkjitrocmqac.supabase.co';
const LOGO_URL = `${SUPABASE_URL}/storage/v1/object/public/assets/logo.png`;

const stats = [
  { value: '500+', label: 'Events Executed', icon: CalendarDays, color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  { value: '12K+', label: 'Guests Served', icon: Users, color: 'text-red-400', glow: 'shadow-red-500/20' },
  { value: '8+', label: 'Years of Excellence', icon: Award, color: 'text-amber-400', glow: 'shadow-amber-500/20' },
  { value: '98%', label: 'Client Satisfaction', icon: Star, color: 'text-purple-400', glow: 'shadow-purple-500/20' },
];

const values = [
  {
    title: 'Precision',
    description: 'Every detail is choreographed. From table arrangements to service timing, nothing is left to chance.',
    accent: 'border-red-600/40',
    dot: 'bg-red-500',
  },
  {
    title: 'Luxury',
    description: 'We don\'t just meet expectations—we architect experiences that linger in memory long after the event ends.',
    accent: 'border-emerald-500/40',
    dot: 'bg-emerald-400',
  },
  {
    title: 'Integrity',
    description: 'Transparent operations, honest pricing, and a team that treats your event as if it were their own.',
    accent: 'border-amber-500/40',
    dot: 'bg-amber-400',
  },
  {
    title: 'Innovation',
    description: 'We blend timeless elegance with modern systems—from digital event ops to real-time coordination.',
    accent: 'border-purple-500/40',
    dot: 'bg-purple-400',
  },
];

export default function AboutPage() {
  return (
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-hidden ${montserrat.className}`}>
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-600/8 rounded-full blur-[130px]" />
        <div className="absolute top-[50%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-500/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[35vw] h-[35vw] bg-gray-500/8 rounded-full blur-[100px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-shrink-0 items-center">
            <img src={LOGO_URL} alt="Lotus Event Management" className="h-14 w-auto object-contain md:hidden" />
            <span className={`hidden md:block text-2xl font-black tracking-widest uppercase ${playfair.className}`}>Lotus</span>
          </Link>
          <div className="hidden md:flex gap-10 text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-white">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <Link href="/#login" className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-[0.1em] rounded-full hover:bg-emerald-400 hover:text-black transition-all">
            Login
          </Link>
        </div>
      </nav>

      <main className="relative z-10 w-full">

        {/* HERO */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            Our Story
          </div>
          <h1 className={`text-6xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tight mb-8 ${playfair.className}`}>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500">
              About
            </span>
            <span className={`block italic font-light text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-300 to-red-500`}>
              Lotus Events
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Born from a passion for precision and a relentless pursuit of luxury—we are the architects of unforgettable moments.
          </p>
        </section>

        {/* BRAND STORY */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="w-12 h-px bg-red-600/70" />
              <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${playfair.className}`}>
                Where Vision Meets{' '}
                <span className="italic text-red-400 font-light">Execution</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-base">
                Lotus Events was founded on a single belief: that every gathering—regardless of scale—deserves to be extraordinary. We started as a small team of passionate event professionals and have grown into a full-service event and catering management company trusted by high-profile clients across the region.
              </p>
              <p className="text-gray-400 leading-relaxed text-base">
                Our proprietary management system powers every layer of our operations—from workforce coordination and attendance tracking to financial reporting and travel logistics—ensuring flawless delivery, every time.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:from-red-500 hover:to-red-400 transition-all shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]">
                Get In Touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Decorative visual block */}
            <div className="relative h-[500px] hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/15 via-transparent to-emerald-500/10 rounded-[3rem] border border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-8 left-8 w-24 h-24 bg-red-500/20 rounded-2xl flex items-center justify-center ring-1 ring-red-500/30">
                  <CalendarDays className="w-10 h-10 text-red-400" />
                </div>
                <div className="absolute bottom-8 right-8 w-24 h-24 bg-emerald-500/20 rounded-2xl flex items-center justify-center ring-1 ring-emerald-500/30">
                  <Award className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-3">
                  <p className={`text-7xl font-black text-white/10 ${playfair.className}`}>2016</p>
                  <p className="text-xs tracking-[0.3em] uppercase text-gray-500 font-semibold">Founded</p>
                </div>
                {/* Floating accent lines */}
                <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                <div className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-[#080808]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className={`bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-white/20 transition-all duration-500 shadow-xl ${stat.glow}`}>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className={`text-5xl font-black tracking-tight ${stat.color} ${playfair.className}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500 tracking-[0.2em] uppercase font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-32 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 flex flex-col items-center text-center gap-6">
              <h2 className={`text-5xl md:text-6xl font-bold ${playfair.className}`}>
                What We <span className="italic font-light text-gray-400">Stand For</span>
              </h2>
              <div className="w-12 h-1 bg-red-600/50 rounded-full" />
              <p className="text-gray-500 tracking-[0.2em] font-medium uppercase text-xs">Core principles that drive every event</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <div key={i} className={`group bg-white/[0.02] border ${v.accent} hover:border-opacity-80 p-10 rounded-3xl hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-2.5 h-2.5 rounded-full ${v.dot}`} />
                    <h3 className={`text-2xl font-bold ${playfair.className}`}>{v.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 border-t border-white/5 flex flex-col items-center text-center">
          <div className="max-w-3xl space-y-8">
            <h2 className={`text-5xl md:text-6xl font-bold ${playfair.className}`}>
              Ready to Create <span className="italic font-light text-red-400">Something Unforgettable?</span>
            </h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed">
              Whether it's an intimate gathering or a grand celebration, our team is ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/contact" className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:from-red-500 hover:to-red-400 transition-all shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]">
                Contact Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/" className="px-10 py-4 border border-white/20 text-white rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-white/5 transition-all">
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#020202] pt-16 pb-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Lotus" className="h-10 w-auto object-contain md:hidden" />
            <span className={`hidden md:block text-xl font-black tracking-widest uppercase ${playfair.className}`}>Lotus</span>
          </Link>
          <div className="flex gap-4">
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black transition-colors border border-white/10">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black transition-colors border border-white/10">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black transition-colors border border-white/10">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-gray-600 tracking-wider">© {new Date().getFullYear()} Lotus Events. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
