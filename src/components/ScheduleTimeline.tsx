import { Clock, MapPin, Sparkles, Terminal, Trophy, Music, Award, Flame } from "lucide-react";

export default function ScheduleTimeline() {
  const scheduleSlots = [
    {
      time: "09:30 AM - 10:30 AM",
      phase: "Phase 01: Assembly & Kickoff",
      title: "Registration Check-In & Welcome Kits",
      desc: "QR entry verification at CSE gates, distribution of personalized farewell badges, mementos, and inaugural coffee.",
      venue: "CSE BLOCK",
      icon: Terminal,
      color: "from-cyan-500 to-blue-600",
      tag: "Opening",
    },
    {
      time: "10:30 AM - 01:30 PM",
      phase: "Phase 02: Competitive Arenas",
      title: "Terminal Velocity Code-Off & LAN Esports",
      desc: "Simultaneous tracks: The 3-Hour Algorithm Clash & the Inter-Batch Esports Finals in the department labs.",
      venue: "CSE BLOCK",
      icon: Trophy,
      color: "from-blue-500 to-indigo-600",
      tag: "Gaming & Code",
    },
    {
      time: "01:30 PM - 02:30 PM",
      phase: "Intermission",
      title: "Networking Banquet & Memory Booth",
      desc: "Buffet lunch, instant polaroid farewell photo booths, and batch signature walls.",
      venue: "CSE BLOCK",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
      tag: "Lunch Break",
    },
    {
      time: "02:30 PM - 04:30 PM",
      phase: "Phase 03: Nostalgia & Humour",
      title: "Retro-Byte: Confessions, Roasts & Stories",
      desc: "Unfiltered stage time, faculty appreciations, video tributes prepared by 3rd-year juniors, and the batch bloopers reel.",
      venue: "CSE BLOCK",
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      tag: "Stage Event",
    },
    {
      time: "05:00 PM - 07:30 PM",
      phase: "Phase 04: Cultural Vibrance",
      title: "Synapse Beats: Live Band & Dance Show",
      desc: "Electrifying musical acoustic performances, group choreography, and live beatboxing honoring graduating seniors.",
      venue: "CSE BLOCK",
      icon: Music,
      color: "from-emerald-500 to-teal-600",
      tag: "Cultural",
    },
    {
      time: "07:30 PM - 10:00 PM",
      phase: "Phase 05: The Grand Finale",
      title: "Hall of Fame: Memento Gala & Farewell Beats",
      desc: "Formal conferral of batch souvenirs to every graduating 2021-2027 senior (6-year journey), senior superlatives, celebratory dinner & DJ night.",
      venue: "CSE BLOCK",
      icon: Award,
      color: "from-rose-500 to-red-600",
      tag: "Ceremony & Dinner",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Schedule notice */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Official Day Timeline • 20 MARCH 2027
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Times and sequence are scheduled placeholders and will be confirmed post college council clearance.
        </p>
      </div>

      {/* Timeline items */}
      <div className="relative border-l border-cyan-500/20 ml-4 sm:ml-32 space-y-10">
        {scheduleSlots.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="relative pl-6 sm:pl-8 group">
              {/* Left Time Badge on desktop */}
              <div className="hidden sm:block absolute -left-32 top-1 text-right w-24">
                <span className="text-xs font-mono font-bold text-cyan-400 block leading-tight">
                  {item.time.split(" - ")[0]}
                </span>
                <span className="text-[10px] font-mono text-slate-500 block">
                  to {item.time.split(" - ")[1]}
                </span>
              </div>

              {/* Timeline Node Point */}
              <div className="absolute -left-3 top-1.5 w-6 h-6 rounded-full bg-[#05070f] border-2 border-cyan-400 group-hover:scale-125 transition-transform duration-300 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              {/* Event Card */}
              <div className="glass-panel glass-card-hover rounded-2xl p-5 sm:p-6 border border-white/5 relative">
                {/* Mobile Time */}
                <div className="sm:hidden flex items-center gap-1.5 text-xs font-mono text-cyan-400 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                    {item.phase}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 uppercase">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white font-mono mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {item.desc}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Venue: {item.venue}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
