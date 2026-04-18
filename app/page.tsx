"use client";

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight, CalendarDays, Users, Banknote, Calculator,
  Instagram, Twitter, Linkedin, Sparkles, Play,
  Award, Star, Phone, Mail, MapPin, Clock,
  Menu, X
} from 'lucide-react';
import { Playfair_Display, Montserrat } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mevertpazkjitrocmqac.supabase.co';
const LOGO_URL = `${SUPABASE_URL}/storage/v1/object/public/assets/logo.png`;
const HERO_IMAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/assets/heroimage.png`;

const stats = [
  { value: '500+', label: 'Events Executed', icon: CalendarDays, color: 'text-emerald-400' },
  { value: '12K+', label: 'Guests Served', icon: Users, color: 'text-red-400' },
  { value: '8+', label: 'Years of Excellence', icon: Award, color: 'text-amber-400' },
  { value: '98%', label: 'Client Satisfaction', icon: Star, color: 'text-purple-400' },
];

const contactCards = [
  { icon: Phone, label: 'Phone', value: '+91 97441 71606', sub: 'Mon–Sun, 9am–9pm', color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20' },
  { icon: Instagram, label: 'Instagram', value: '@l_otus.events', sub: 'Follow our journey', color: 'text-red-400', bg: 'bg-red-500/10', ring: 'ring-red-500/20', href: 'https://www.instagram.com/l_otus.events/' },
  { icon: MapPin, label: 'Location', value: 'Mulavoor, Ernakulam', sub: 'Kerala Operations HQ', color: 'text-amber-400', bg: 'bg-amber-500/10', ring: 'ring-amber-500/20' },
  { icon: Clock, label: 'Hours', value: 'Mon – Sun', sub: '9:00 AM – 9:00 PM IST', color: 'text-purple-400', bg: 'bg-purple-500/10', ring: 'ring-purple-500/20' },
];

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-hidden ${montserrat.className}`}>

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-gray-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[35vw] h-[35vw] bg-emerald-600/6 rounded-full blur-[100px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="#home" className="flex flex-shrink-0 items-center">
            <img src={LOGO_URL} alt="Lotus Event Management" className="h-14 w-auto object-contain md:hidden" />
            <span className={`hidden md:block text-2xl font-black tracking-widest uppercase ${playfair.className}`}>Lotus</span>
          </Link>
          <div className="hidden md:flex gap-8 text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">
            <Link href="#home" className="hover:text-white transition-colors">Home</Link>
            <Link href="#about" className="hover:text-white transition-colors">About</Link>
            <Link href="#gallery" className="hover:text-white transition-colors">Gallery</Link>
            <Link href="#portals" className="hover:text-white transition-colors">Portals</Link>
            <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#contact" className="hidden md:flex px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-[0.1em] rounded-full hover:bg-emerald-400 hover:text-black transition-all">
              Contact
            </Link>
            <button 
              className="md:hidden p-2 text-white focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden absolute top-20 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 py-6 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center gap-6">
            <Link href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors touch-manipulation py-2">Home</Link>
            <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors touch-manipulation py-2">About</Link>
            <Link href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors touch-manipulation py-2">Gallery</Link>
            <Link href="#portals" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors touch-manipulation py-2">Portals</Link>
            <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors touch-manipulation py-2">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full">

        {/* ─── HERO ──────────────────────────────────────────────── */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center relative px-6 w-full">
          <div className="max-w-6xl w-full text-center space-y-6 relative pt-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-[0.2em] uppercase mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              Elevating Every Moment
            </div>

            <div className="flex flex-col items-center justify-center w-full mb-4">
              <Image
                src={HERO_IMAGE_URL}
                alt="Lotus Typography"
                width={800}
                height={400}
                priority
                className="w-full max-w-2xl md:max-w-4xl h-auto object-contain drop-shadow-2xl relative z-10"
              />
              <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] -mt-6 md:-mt-12 relative z-0 ${playfair.className}`}>
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-500 italic font-light drop-shadow-md">
                  Events
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              The premier ecosystem for catering and event management. Precision, scale, and luxury—bridging extraordinary vision with flawless execution.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="#portals" className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:from-red-500 hover:to-red-400 transition-all shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]">
                Access Portals
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── ABOUT ─────────────────────────────────────────────── */}
        <section id="about" className="py-32 px-6 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto">

            {/* Section header */}
            <div className="mb-20 flex flex-col items-center text-center gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-[0.2em] uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                Our Story
              </div>
              <h2 className={`text-5xl md:text-7xl font-bold ${playfair.className}`}>About <span className="italic font-light text-red-400">Lotus</span></h2>
              <div className="w-12 h-1 bg-red-600/50 rounded-full" />
              <p className="text-gray-400 text-base font-light max-w-2xl mx-auto leading-relaxed">
                Born from a passion for precision and a relentless pursuit of luxury—we are the architects of unforgettable moments.
              </p>
            </div>

            {/* Brand story */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="space-y-7">
                <div className="w-12 h-px bg-red-600/70" />
                <h3 className={`text-3xl md:text-4xl font-bold leading-tight ${playfair.className}`}>
                  Where Vision Meets{' '}
                  <span className="italic text-red-400 font-light">Execution</span>
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Lotus Events was founded on a single belief: that every gathering—regardless of scale—deserves to be extraordinary. We started as a small team of passionate event professionals and have grown into a full-service event and catering management company trusted by high-profile clients across the region.
                </p>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Our proprietary management system powers every layer of our operations—from workforce coordination and attendance tracking to financial reporting and travel logistics—ensuring flawless delivery, every time.
                </p>
              </div>

              {/* Decorative card */}
              <div className="relative h-[380px] hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/12 via-transparent to-emerald-500/8 rounded-[3rem] border border-white/10 overflow-hidden">
                  <div className="absolute top-8 left-8 w-20 h-20 bg-red-500/15 rounded-2xl flex items-center justify-center ring-1 ring-red-500/25">
                    <CalendarDays className="w-9 h-9 text-red-400" />
                  </div>
                  <div className="absolute bottom-8 right-8 w-20 h-20 bg-emerald-500/15 rounded-2xl flex items-center justify-center ring-1 ring-emerald-500/25">
                    <Award className="w-9 h-9 text-emerald-400" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-2">
                    <p className={`text-8xl font-black text-white/8 ${playfair.className}`}>1999</p>
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-600 font-semibold">Founded</p>
                  </div>
                  <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                  <div className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 flex flex-col items-center text-center gap-4 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500">
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center">
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <p className={`text-4xl font-black tracking-tight ${s.color} ${playfair.className}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase font-semibold">{s.label}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── GALLERY / CURATED MOMENTS ──────────────────────────── */}
        <section id="gallery" className="py-32 px-6 flex flex-col items-center border-t border-white/5 relative bg-[#050505]">
          <div className="max-w-7xl w-full">
            <div className="mb-20 flex flex-col items-center text-center gap-6">
              <h2 className={`text-5xl md:text-7xl font-bold ${playfair.className}`}>Curated Moments</h2>
              <div className="w-12 h-1 bg-teal-500/50 rounded-full" />
              <p className="text-gray-400 tracking-[0.2em] font-medium uppercase text-xs">Excellence in execution</p>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 w-[100vw] relative left-1/2 -translate-x-1/2 px-6 lg:w-full lg:static lg:-translate-x-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {[
                { category: 'Events', title: 'Luxury Setup 1', poster: '/api/image?name=event_catering_1_1776057397230.png', color: 'text-emerald-400', videoSrc: `${SUPABASE_URL}/storage/v1/object/public/assets/video-1.mp4` },
                { category: 'Ambiance', title: 'Beautiful Decor', poster: '/api/image?name=event_decor_3_1776057446939.png', color: 'text-amber-400', videoSrc: `${SUPABASE_URL}/storage/v1/object/public/assets/video-2.mp4` },
                { category: 'Production', title: 'Grand Stages', poster: '/api/image?name=event_stage_2_1776057422870.png', color: 'text-purple-400', videoSrc: `${SUPABASE_URL}/storage/v1/object/public/assets/video-3.mp4` },
                { category: 'Experience', title: 'Unforgettable', poster: HERO_IMAGE_URL, color: 'text-rose-400', videoSrc: `${SUPABASE_URL}/storage/v1/object/public/assets/video-4.mp4` },
                { category: 'Moments', title: 'Lotus Specials', poster: '/api/image?name=event_decor_3_1776057446939.png', color: 'text-blue-400', videoSrc: `${SUPABASE_URL}/storage/v1/object/public/assets/video-5.mp4` },
              ].map((item, i) => (
                <div key={i} className="relative group rounded-[2.5rem] overflow-hidden flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[320px] aspect-[9/16] md:aspect-auto md:h-[580px] snap-center bg-white/5 border border-white/10 shadow-2xl">
                  <video
                    src={item.videoSrc || undefined}
                    poster={item.poster}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <span className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-3 ${item.color}`}>{item.category}</span>
                    <h3 className={`text-2xl font-bold text-white leading-snug ${playfair.className}`}>{item.title}</h3>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SYSTEM PORTALS ─────────────────────────────────────── */}
        <section id="portals" className="py-32 px-6 flex flex-col items-center border-t border-white/5 relative bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
          <div className="max-w-7xl w-full">
            <div className="mb-20 flex flex-col items-center text-center gap-6">
              <h2 className={`text-5xl md:text-7xl font-bold ${playfair.className}`}>System Portals</h2>
              <div className="w-12 h-1 bg-red-600/50 rounded-full" />
              <p className="text-gray-400 tracking-[0.2em] font-medium uppercase text-xs">Select your operational domain</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Admin */}
              <Link href="/login?role=admin" className="group bg-white/[0.02] border border-white/10 hover:border-purple-500/50 p-6 md:p-8 rounded-3xl hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md flex flex-col touch-manipulation">
                <div className="bg-purple-500/10 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8 ring-1 ring-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <h3 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white ${playfair.className}`}>Admin</h3>
                <p className="text-gray-400 text-sm mb-6 md:mb-8 flex-grow leading-relaxed">Full system access, role management, and global oversight.</p>
                <span className="flex items-center text-xs tracking-widest uppercase font-bold text-purple-400 group-hover:text-purple-300">
                  Login <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>

              {/* Accountant */}
              <Link href="/login?role=accountant" className="group bg-white/[0.02] border border-white/10 hover:border-amber-500/50 p-6 md:p-8 rounded-3xl hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md flex flex-col touch-manipulation">
                <div className="bg-amber-500/10 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8 ring-1 ring-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                  <Calculator className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                </div>
                <h3 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white ${playfair.className}`}>Accountant</h3>
                <p className="text-gray-400 text-sm mb-6 md:mb-8 flex-grow leading-relaxed">Manage expenses, income, financial reports, and inventory.</p>
                <span className="flex items-center text-xs tracking-widest uppercase font-bold text-amber-400 group-hover:text-amber-300">
                  Login <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>

              {/* Controller */}
              <Link href="/login?role=controller" className="group bg-white/[0.02] border border-white/10 hover:border-blue-500/50 p-6 md:p-8 rounded-3xl hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md flex flex-col touch-manipulation">
                <div className="bg-blue-500/10 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8 ring-1 ring-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <h3 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white ${playfair.className}`}>Controller</h3>
                <p className="text-gray-400 text-sm mb-6 md:mb-8 flex-grow leading-relaxed">Manage assigned events, mark attendance, and track work units.</p>
                <span className="flex items-center text-xs tracking-widest uppercase font-bold text-blue-400 group-hover:text-blue-300">
                  Login <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>

              {/* Member */}
              <Link href="/login?role=member" className="group bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/30 hover:border-emerald-400 p-6 md:p-8 rounded-3xl hover:from-emerald-500/20 transition-all duration-500 backdrop-blur-md relative overflow-hidden flex flex-col shadow-[0_0_30px_-15px_rgba(16,185,129,0.3)] touch-manipulation">
                <div className="bg-emerald-500/20 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8 ring-1 ring-emerald-400/50 group-hover:bg-emerald-400/30 transition-colors">
                  <Banknote className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                </div>
                <h3 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white ${playfair.className}`}>Member</h3>
                <p className="text-emerald-100/70 text-sm mb-6 md:mb-8 flex-grow leading-relaxed">View your shifts, total earnings, payments, and request advances.</p>
                <span className="flex items-center text-xs tracking-widest uppercase font-bold text-emerald-400 group-hover:text-emerald-300">
                  Login <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── CONTACT ────────────────────────────────────────────── */}
        <section id="contact" className="py-32 px-6 border-t border-white/5 relative bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-20 flex flex-col items-center text-center gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-[0.2em] uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Get In Touch
              </div>
              <h2 className={`text-5xl md:text-7xl font-bold ${playfair.className}`}>
                Contact <span className="italic font-light text-emerald-400">Us</span>
              </h2>
              <div className="w-12 h-1 bg-emerald-500/50 rounded-full" />
              <p className="text-gray-400 text-base font-light max-w-xl mx-auto leading-relaxed">
                Have an event in mind? Our team is ready to bring your vision to life. Reach out and we&apos;ll respond within 24 hours.
              </p>
            </div>

            {/* Contact info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactCards.map((c, i) => {
                const CardWrapper = c.href ? 'a' : 'div';
                const extraProps = c.href ? { href: c.href, target: "_blank", rel: "noopener noreferrer" } : {};
                
                return (
                  // @ts-ignore
                  <CardWrapper key={i} {...extraProps} className={`bg-white/[0.03] border border-white/10 rounded-3xl p-7 flex flex-col gap-4 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500 ${c.href ? 'cursor-pointer group/card' : ''}`}>
                    <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ring-1 ${c.ring} group-hover/card:scale-110 transition-transform`}>
                      <c.icon className={`w-5 h-5 ${c.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500 mb-1">{c.label}</p>
                      <p className={`text-sm font-semibold text-white ${c.href ? 'group-hover/card:text-red-400 transition-colors' : ''}`}>{c.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>

            {/* CTA row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/[0.02] border border-white/10 rounded-3xl px-10 py-10">
              <div className="space-y-3 text-center md:text-left">
                <h3 className={`text-3xl font-bold ${playfair.className}`}>
                  Ready to Create Something <span className="italic font-light text-red-400">Unforgettable?</span>
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                  Whether it&apos;s an intimate dinner or a grand cultural celebration, let&apos;s plan it together.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.instagram.com/l_otus.events/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
                >
                  <Instagram className="w-4 h-4" />
                  Message Us
                </a>
                <a
                  href="tel:+919744171606"
                  className="flex items-center gap-3 px-8 py-4 border border-white/20 text-white rounded-full font-bold uppercase tracking-[0.15em] text-xs hover:bg-white/5 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#020202] pt-24 pb-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2 space-y-6">
              <img src={LOGO_URL} alt="Lotus Event Management" className="h-20 w-auto object-contain md:hidden" />
              <h2 className={`hidden md:block text-4xl font-black tracking-widest uppercase ${playfair.className} text-white`}>Lotus</h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Redefining the standards of event operations and luxury catering around the globe.
              </p>
              <div className="flex gap-4 pt-4">
                <a href="https://www.instagram.com/l_otus.events/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-black transition-colors border border-white/10">
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

            <div className="space-y-6">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white">Navigate</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#home" className="hover:text-emerald-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#gallery" className="hover:text-emerald-400 transition-colors">Gallery</a></li>
                <li><a href="#portals" className="hover:text-emerald-400 transition-colors">Portals</a></li>
                <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 tracking-wider">
            <p>&copy; {new Date().getFullYear()} Lotus Events. All rights reserved.</p>
            <p className="flex items-center gap-2">Crafted with <span className="text-emerald-500">excellence</span></p>
          </div>
        </div>
      </footer>

    </div>
  );
}
