'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Phone, MapPin, Clock, Send, Instagram, Twitter, Linkedin, CheckCircle } from 'lucide-react';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { useState } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mevertpazkjitrocmqac.supabase.co';
const LOGO_URL = `${SUPABASE_URL}/storage/v1/object/public/assets/logo.png`;

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    sub: 'Mon–Sat, 9am–7pm',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/20',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@l_otus.events',
    sub: 'Follow for updates',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    ring: 'ring-pink-500/20',
    link: 'https://www.instagram.com/l_otus.events/',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Kochi, Kerala',
    sub: 'South India Operations HQ',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon – Sat',
    sub: '9:00 AM – 7:00 PM IST',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    ring: 'ring-purple-500/20',
  },
];

const eventTypes = ['Corporate Event', 'Wedding & Reception', 'Cultural Programme', 'Birthday Celebration', 'Seminar / Conference', 'Other'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', eventType: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async submit
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-hidden ${montserrat.className}`}>
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] bg-emerald-500/8 rounded-full blur-[130px]" />
        <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] bg-red-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[30vw] h-[30vw] bg-gray-500/6 rounded-full blur-[100px]" />
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
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-white">Contact</Link>
          </div>
          <Link href="/#login" className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-[0.1em] rounded-full hover:bg-emerald-400 hover:text-black transition-all">
            Login
          </Link>
        </div>
      </nav>

      <main className="relative z-10 w-full">

        {/* HERO */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 pt-32 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Let&apos;s Talk
          </div>
          <h1 className={`text-6xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tight mb-8 ${playfair.className}`}>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500">
              Get in
            </span>
            <span className="block italic font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-500">
              Touch
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Have an event in mind? We&apos;d love to hear about it. Reach out and our team will get back to you within 24 hours.
          </p>
        </section>

        {/* CONTACT INFO CARDS */}
        <section className="py-16 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <a 
                key={i} 
                href={info.link || '#'} 
                target={info.link ? '_blank' : undefined}
                rel={info.link ? 'noopener noreferrer' : undefined}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 flex flex-col gap-4 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${info.bg} flex items-center justify-center ring-1 ${info.ring}`}>
                  <info.icon className={`w-5 h-5 ${info.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500 mb-1">{info.label}</p>
                  <p className="text-sm font-semibold text-white">{info.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{info.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FORM + SIDE */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-10 lg:sticky lg:top-28">
              <div className="space-y-6">
                <div className="w-12 h-px bg-emerald-500/70" />
                <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${playfair.className}`}>
                  Tell Us About{' '}
                  <span className="italic font-light text-emerald-400">Your Event</span>
                </h2>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Fill out the form and one of our event specialists will reach out with a tailored proposal. No generic packages—every event we plan is unique.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/30 flex-shrink-0">
                    <span className="text-emerald-400 text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-300">Submit the form with your event details</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/30 flex-shrink-0">
                    <span className="text-emerald-400 text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-300">We&apos;ll contact you within 24 hours</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/30 flex-shrink-0">
                    <span className="text-emerald-400 text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-300">Receive a customized quote and plan</p>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">Social Media</p>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black transition-colors border border-white/10">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black transition-colors border border-white/10">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black transition-colors border border-white/10">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="min-h-[500px] flex flex-col items-center justify-center text-center gap-6 bg-white/[0.02] border border-white/10 rounded-3xl p-12">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/40">
                    <CheckCircle className="w-9 h-9 text-emerald-400" />
                  </div>
                  <h3 className={`text-3xl font-bold ${playfair.className}`}>Message Received!</h3>
                  <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                    Thank you for reaching out. Our team will get back to you within 24 hours with a personalized response.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', eventType: '', message: '' }); }}
                    className="px-8 py-3 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/5 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">Full Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">Email Address *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="eventType" className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">Event Type *</label>
                      <select
                        id="eventType"
                        name="eventType"
                        required
                        value={form.eventType}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all appearance-none cursor-pointer"
                        style={{ color: form.eventType ? 'white' : '#4B5563' }}
                      >
                        <option value="" disabled className="bg-[#111] text-gray-400">Select event type</option>
                        {eventTypes.map(t => (
                          <option key={t} value={t} className="bg-[#111] text-white">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">Tell Us More *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your event—venue, expected guests, date, special requirements..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold uppercase tracking-[0.15em] text-xs hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-600 text-center">
                    By submitting, you agree to our Privacy Policy. We never share your data.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#020202] pt-16 pb-10 px-6 relative z-10 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Lotus" className="h-10 w-auto object-contain md:hidden" />
            <span className={`hidden md:block text-xl font-black tracking-widest uppercase ${playfair.className}`}>Lotus</span>
          </Link>
          <div className="flex gap-3 text-xs font-semibold tracking-[0.15em] uppercase text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gray-700">·</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span className="text-gray-700">·</span>
            <Link href="/contact" className="text-white">Contact</Link>
          </div>
          <p className="text-xs text-gray-600 tracking-wider">© {new Date().getFullYear()} Lotus Events.</p>
        </div>
      </footer>
    </div>
  );
}
