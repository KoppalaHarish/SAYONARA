import { Terminal, Heart, Sparkles, Cpu, Award, Zap } from "lucide-react";

export default function AboutSection() {
  const stats = [
    { label: "Graduating Batch", val: "2021-2027", sub: "Class of CSE Seniors" },
    { label: "Host Batch", val: "2022-2028", sub: "3rd Year B.Tech Organizers" },
    { label: "Integrated Journey", val: "6 Years", sub: "2 Yrs PUC + 4 Yrs B.Tech" },
    { label: "Memories Compiled", val: "100%", sub: "Zero Memory Leaks" },
  ];

  const highlights = [
    {
      icon: Terminal,
      color: "from-cyan-500 to-blue-600",
      title: "6 Years: From PUC to B.Tech",
      desc: "Six years ago, you walked in for PUC learning the foundational sciences. Today, after 2 years of PUC and 4 years of rigorous B.Tech, you leave as accomplished engineers and innovators.",
    },
    {
      icon: Zap,
      color: "from-purple-500 to-indigo-600",
      title: "The Campus Chronicles",
      desc: "From PUC dorms to sleepless nights before final-year engineering submissions, endless git merge conflicts, and celebratory canteen chais after surviving semester vivas.",
    },
    {
      icon: Award,
      color: "from-emerald-500 to-teal-600",
      title: "The Senior Legacy",
      desc: "Our 2021-2027 seniors guided us through PUC exams, engineering labs, competitive coding, and placement roadmaps. SAYONARA is our tribute to your inspiring 6-year legacy.",
    },
    {
      icon: Heart,
      color: "from-rose-500 to-pink-600",
      title: "Sayonara, Not Goodbye",
      desc: "Sayonara translates to 'Farewell for now'. Six unforgettable years in one college build a brotherhood and bond that stays connected forever.",
    },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-cyan-500/10 bg-[#050814]">
      {/* Background cyber lines */}
      <div className="absolute inset-0 tech-dots-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            The Farewell Experience
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-tight mb-4">
            A FAREWELL BUILT BY CSE, FOR CSE
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            SAYONARA is not just a standard college event. It is an exclusive, high-energy festival celebrating the graduating seniors of the 2021-2027 batch, commemorating their complete 6-year journey (2 years PUC + 4 years B.Tech in one college) hosted with passion by the 3rd-year junior batch.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-panel glass-card-hover rounded-2xl p-6 border border-white/5 relative group overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} p-[1px] mb-5`}>
                  <div className="w-full h-full bg-[#070b19] rounded-[11px] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-mono">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Strip */}
        <div className="glass-panel rounded-2xl p-8 border border-cyan-500/20 shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center pt-4 sm:pt-0">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 font-mono tracking-tight">
                  {stat.val}
                </span>
                <span className="text-sm font-bold text-white font-mono mt-1">{stat.label}</span>
                <span className="text-xs text-slate-400 mt-0.5">{stat.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
