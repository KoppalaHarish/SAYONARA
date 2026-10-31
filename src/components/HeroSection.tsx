"use client";

import Link from "next/link";
import {
  Sparkles,
  Terminal,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Code2,
  Cpu,
  Layers,
} from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { FestSettings } from "@/lib/types";

interface HeroSectionProps {
  settings: FestSettings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden tech-grid-bg">
      {/* Background radial gradient halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Floating decorative tech icons */}
      <div className="absolute left-[10%] top-[20%] hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-cyan-500/20 backdrop-blur-md text-xs font-mono text-cyan-300 animate-bounce duration-1000">
        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
        <span>git commit -m &quot;Farewell Seniors&quot;</span>
      </div>

      <div className="absolute right-[12%] top-[25%] hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-purple-500/20 backdrop-blur-md text-xs font-mono text-purple-300">
        <Cpu className="w-3.5 h-3.5 text-purple-400" />
        <span>CSE BATCH 2021-2027</span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Eligibility & Department Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono tracking-wide mb-8 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-cyan-200">DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING</span>
          <span className="text-cyan-500/60 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">6-Yr Integrated • 3rd &amp; 4th Yr Exclusive</span>
        </div>

        {/* Hero Title */}
        <div className="relative mb-4">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white font-mono uppercase select-none">
            <span className="relative inline-block">
              <span className="absolute -inset-1 blur-2xl opacity-40 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
                {settings.festName || "SAYONARA"}
              </span>
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-cyan-500" />
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 font-mono">
              {settings.subtitle || "CSE FAREWELL FEST"}
            </h2>
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-purple-500" />
          </div>
        </div>

        {/* Fest Tagline */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-8">
          {settings.tagline || "A farewell experience built by CSE, for CSE. Celebrating 6 years — 2 years PUC & 4 years B.Tech of algorithms, late-night code sprints, and memories that will never dereference."}
        </p>

        {/* Event Meta Badges (Editable placeholders) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#090e24] border border-cyan-500/30 text-cyan-300 shadow-md">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">DATE:</span>
            <span className="font-bold text-white">{settings.eventDate && !settings.eventDate.includes("COMING SOON") ? settings.eventDate : "20 MARCH 2027"}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#090e24] border border-purple-500/30 text-purple-300 shadow-md">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400">VENUE:</span>
            <span className="font-bold text-white">{settings.venue || "CSE BLOCK"}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <Link
            href="/register"
            className="w-full sm:w-auto group relative px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 group-hover:scale-105 transition-transform duration-300" />
            <div className="relative flex items-center justify-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Claim Your Entry Pass</span>
              <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/events"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm uppercase tracking-wider border border-white/15 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Explore Events</span>
          </Link>
        </div>

        {/* Countdown / Schedule Status Component */}
        <div className="w-full">
          <CountdownTimer
            festDateLabel={settings.eventDate}
            venueLabel={settings.venue}
          />
        </div>
      </div>
    </section>
  );
}
