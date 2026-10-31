import ScheduleTimeline from "@/components/ScheduleTimeline";
import { Calendar, Clock, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SchedulePage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest mb-3">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          Sequence of Celebrations
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight mb-4">
          FEST DAY SCHEDULE
        </h1>
        <p className="text-slate-400 text-base font-normal leading-relaxed">
          The planned timeline for SAYONARA. Fest sequence is scheduled for March / April 2027 at CSE BLOCK.
        </p>
      </div>

      <ScheduleTimeline />
    </div>
  );
}
