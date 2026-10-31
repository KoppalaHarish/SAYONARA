import Link from "next/link";
import { db } from "@/lib/db";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import AnnouncementsBanner from "@/components/AnnouncementsBanner";
import EventsGrid from "@/components/EventsGrid";
import ScheduleTimeline from "@/components/ScheduleTimeline";
import { getCurrentUser } from "@/lib/auth";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Calendar,
  ShieldCheck,
  Terminal,
  Heart,
  Quote,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = db.getSettings();
  const events = db.getEvents();
  const user = await getCurrentUser();
  const registeredEventIds = user ? db.getStudentEventRegistrations(user.id) : [];

  const seniorQuotes = [
    {
      name: "Tanmay Deshmukh",
      batch: "CSE 2021-2027 (Placed at Amazon)",
      quote:
        "Surviving 2 years of PUC and 4 years of engineering was an unforgettable roller coaster, but leaving this campus after 6 whole years is genuinely harder.",
    },
    {
      name: "Sneha Mukherjee",
      batch: "CSE 2021-2027 (MS Candidate)",
      quote:
        "The best memories weren’t just the GPA — it was the 6-year transition from PUC classrooms to the Turing Lab and laughing over canteen dosas with our batchmates.",
    },
    {
      name: "Arjun Reddy",
      batch: "CSE 2021-2027 (Tech Lead, Open Source)",
      quote:
        "Six full years in one college created bonds for life. The juniors organized something incredible with SAYONARA. Proud to be graduating from the CSE department!",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Live announcements ticker */}
      <AnnouncementsBanner />

      {/* Hero Section */}
      <HeroSection settings={settings} />

      {/* About Section */}
      <AboutSection />

      {/* Curated Events Preview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-cyan-500/10 bg-[#040713]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-2">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Featured Arenas
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                COMPETITIONS &amp; EXPERIENCES
              </h2>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm font-semibold transition-colors group"
            >
              <span>View All 6 Arenas &amp; Register</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <EventsGrid
            events={events.slice(0, 3)}
            user={user}
            registeredEventIds={registeredEventIds}
          />
        </div>
      </section>

      {/* Schedule Preview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-cyan-500/10 bg-[#050814]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest mb-2">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              Fest Sequence
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mb-3">
              THE SAYONARA DAY TIMELINE
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              From morning code battles to the evening senior gala and farewell beats
            </p>
          </div>

          <ScheduleTimeline />
        </div>
      </section>

      {/* Senior Farewell Nostalgia Quotes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-cyan-500/10 bg-[#03060f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 block mb-2">
              Echoes of CSE Batch 2021-2027
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
              WORDS FROM OUR SENIORS
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Reflections on a 6-year integrated journey: 2 years PUC + 4 years B.Tech
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seniorQuotes.map((q, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 border border-white/5 relative flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-6 h-6 text-cyan-500/40 mb-3" />
                  <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 font-mono">
                  <h4 className="text-sm font-bold text-white">{q.name}</h4>
                  <p className="text-[11px] text-cyan-400">{q.batch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action Strip */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-blue-950/80 via-purple-950/80 to-cyan-950/80 border-t border-cyan-500/30">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono uppercase tracking-widest border border-cyan-500/40">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Limited Access • CSE Only
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight uppercase">
            Claim Your Official Digital QR Pass
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every registered 3rd &amp; 4th Year B.Tech CSE student (6-year integrated program: 2 Yrs PUC + 4 Yrs B.Tech) receives an unforgeable entry token. Entry, souvenirs, and lunch banquet require valid pass verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all"
            >
              Register with College ID
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold font-mono text-xs uppercase tracking-wider border border-white/15 transition-all"
            >
              Existing Student Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
