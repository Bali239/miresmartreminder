import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, CheckCircle2, Clock, Mail,
  ShieldCheck, Globe2, BarChart3, Check, Zap,
} from 'lucide-react';

const GlassCard = ({ children, className = '', style = {} }) => (
  <div
    className={`rounded-2xl ${className}`}
    style={{
      background: 'rgba(139, 92, 246, 0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const LandingPage = () => {
  return (
    <div className="min-h-screen text-[#F1F0FA] flex flex-col overflow-hidden" style={{ background: '#08061A' }}>

      {/* Ambient orbs */}
      <div className="orb orb-purple" style={{ top: '-100px', left: '5%', opacity: 0.35 }} />
      <div className="orb orb-indigo" style={{ top: '200px', right: '-100px', opacity: 0.25 }} />
      <div className="orb orb-purple" style={{ bottom: '10%', left: '40%', opacity: 0.18, width: '400px', height: '400px' }} />

      {/* ── HEADER ── */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', boxShadow: '0 4px 20px rgba(139,92,246,0.5)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">Mira</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-white/50 hover:text-white transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white gradient-btn"
          >
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-12 pb-20 lg:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
        {/* Left */}
        <div className="lg:col-span-6 space-y-8 text-left">
          {/* Pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            Smart Reminders
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.05] tracking-tight">
              Never forget
            </h1>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-[1.05] tracking-tight gradient-text animate-gradient">
              what matters.
            </h1>
          </div>

          <p className="text-lg text-white/45 max-w-lg leading-relaxed">
            Mira is a calm, private reminder system. She emails you at exactly the right moment — even when your screen is dark and your tabs are closed.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-base font-bold text-white gradient-btn animate-pulse-glow"
            >
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <span className="text-sm text-white/30 font-medium">No credit card · No spam · Ever.</span>
          </div>

          {/* Avatars */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
            <div className="flex -space-x-2.5">
              {[
                { initials: 'AK', bg: 'linear-gradient(135deg, #8B5CF6, #6366F1)' },
                { initials: 'SR', bg: 'linear-gradient(135deg, #6366F1, #818CF8)' },
                { initials: 'ML', bg: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
                { initials: '+9', bg: 'rgba(255,255,255,0.08)' },
              ].map((a, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 border-[#08061A]"
                  style={{ background: a.bg }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/35 font-medium">
              Joined by students, freelancers & busy professionals
            </p>
          </div>
        </div>

        {/* Right: Floating Glassmorphism Card Mockup */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
          <div className="animate-float-card relative w-full max-w-sm">
            {/* Main card */}
            <div
              className="w-full rounded-3xl p-6"
              style={{
                background: 'rgba(17, 14, 46, 0.8)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(139,92,246,0.15)',
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-display font-bold text-base text-white">Today</span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-400"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live
                </div>
              </div>

              {/* Reminder rows */}
              <div className="space-y-3">
                {/* Overdue row */}
                <div
                  className="p-3.5 rounded-2xl flex items-start justify-between gap-3"
                  style={{
                    background: 'rgba(245,158,11,0.07)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderLeft: '3px solid rgba(245,158,11,0.7)',
                  }}
                >
                  <div>
                    <p className="font-semibold text-sm text-white">Submit assignment</p>
                    <p className="text-xs text-white/35 mt-0.5">Due 5:00 PM</p>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.3)' }}
                  >
                    in 2h
                  </span>
                </div>

                {/* Normal row */}
                <div
                  className="p-3.5 rounded-2xl flex items-start justify-between gap-3"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
                >
                  <div>
                    <p className="font-semibold text-sm text-white">Team meeting</p>
                    <p className="text-xs text-white/35 mt-0.5">10:30 AM</p>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)' }}
                  >
                    upcoming
                  </span>
                </div>

                {/* Completed row */}
                <div
                  className="p-3.5 rounded-2xl flex items-start justify-between gap-3 opacity-40"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)' }}
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white line-through">Pay internet bill</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-emerald-400" style={{ background: 'rgba(16,185,129,0.1)' }}>done</span>
                </div>
              </div>

              {/* Email notification floating sub-card */}
              <div
                className="mt-4 p-3.5 rounded-2xl flex items-center gap-3"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                >
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Email Sent</p>
                  <p className="text-xs text-white/70 font-semibold">Reminder: Submit assignment</p>
                  <p className="text-[10px] text-white/30">Due in 1 hour · delivered</p>
                </div>
              </div>

              {/* Card footer */}
              <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-around text-[11px] font-semibold text-white/30">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" />Email alerts</span>
                <span className="w-px h-4 bg-white/10" />
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" />Smart timing</span>
              </div>
            </div>

            {/* Decorative glow underneath card */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full"
              style={{ background: 'rgba(139,92,246,0.25)', filter: 'blur(24px)' }}
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="relative z-10 py-24 px-6"
        style={{ background: 'rgba(139,92,246,0.03)', borderTop: '1px solid rgba(139,92,246,0.08)', borderBottom: '1px solid rgba(139,92,246,0.08)' }}
      >
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Three steps to <span className="gradient-text">peace of mind</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { n: '01', icon: <Sparkles className="w-6 h-6" />, title: 'Create a reminder', desc: 'Add your task with a title, notes, and a due date — all in seconds.' },
              { n: '02', icon: <Clock className="w-6 h-6" />, title: 'Choose advance notice', desc: 'Pick whether to be notified at due time, 10 minutes, 1 hour, or 1 day before.' },
              { n: '03', icon: <Mail className="w-6 h-6" />, title: 'Get a calm email', desc: 'Mira\'s server-side cron delivers a beautiful, responsive email right on schedule.' },
            ].map((s, i) => (
              <GlassCard key={i} className="p-7 relative overflow-hidden group glass-hover">
                <span className="absolute top-5 right-6 text-5xl font-display font-extrabold text-white/[0.04] select-none">
                  {s.n}
                </span>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-purple-400"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}
                >
                  {s.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400">Built different</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Everything you need, <span className="gradient-text">nothing you don't</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <Mail className="w-5 h-5" />, title: 'Automated Email Delivery', desc: 'Emails arrive reliably even with the app closed, powered by server-side cron.' },
            { icon: <Clock className="w-5 h-5" />, title: 'Custom Advance Notice', desc: 'Lead times from instant to 24 hours — your schedule, your preference.' },
            { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Smart Status Filters', desc: 'Upcoming, Overdue, and Completed views give you instant situational awareness.' },
            { icon: <BarChart3 className="w-5 h-5" />, title: 'Live Dashboard', desc: 'Completion rings, stat cards, and the next 5 upcoming tasks — always in focus.' },
            { icon: <Globe2 className="w-5 h-5" />, title: 'Timezone Intelligence', desc: 'Auto-detects your browser timezone. Emails show your exact local time.' },
            { icon: <ShieldCheck className="w-5 h-5" />, title: 'Private & Secure', desc: 'Bcrypt-hashed passwords and signed JWT tokens. Your data stays yours.' },
          ].map((f, i) => (
            <GlassCard key={i} className="p-6 group glass-hover">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-purple-400"
                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                {f.icon}
              </div>
              <h4 className="font-display font-bold text-base text-white mb-1.5">{f.title}</h4>
              <p className="text-sm text-white/35 leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 mt-auto py-10 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-white">Mira</span>
          </div>
          <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} Mira. Smart reminder system.</p>
          <div className="flex gap-5 text-xs text-white/25">
            <Link to="/login" className="hover:text-white/60 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white/60 transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
