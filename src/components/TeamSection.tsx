import { Users, Mail, Phone, ShieldCheck, Terminal, Palette, Sparkles } from "lucide-react";
import { TeamMember } from "@/lib/types";

interface TeamSectionProps {
  team: TeamMember[];
}

const CATEGORY_COLORS: Record<string, string> = {
  "Faculty Coordinator": "from-cyan-500 to-blue-600",
  "Student Lead": "from-purple-500 to-indigo-600",
  "Technical Team": "from-emerald-500 to-teal-600",
  "Creative & Media": "from-rose-500 to-pink-600",
  "Event Coordinator": "from-amber-500 to-orange-600",
};

export default function TeamSection({ team }: TeamSectionProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => {
          const color = CATEGORY_COLORS[member.category] || "from-cyan-500 to-blue-600";

          return (
            <div
              key={member.id}
              className="glass-panel glass-card-hover rounded-2xl p-6 border border-white/10 relative overflow-hidden group"
            >
              {/* Category pill */}
              <div className="flex items-center justify-between gap-2 mb-5">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-300">
                  {member.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  {member.department}
                </span>
              </div>

              {/* Avatar circle placeholder with cyber initials */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} p-[1px] shrink-0`}>
                  <div className="w-full h-full bg-[#05070f] rounded-[15px] flex items-center justify-center">
                    <span className="font-mono font-black text-white text-base">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-mono leading-tight group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-purple-400 font-mono mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Contact info placeholder */}
              <div className="pt-4 border-t border-white/5 text-xs font-mono text-slate-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{member.contact || "cse.fest@college.edu"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
