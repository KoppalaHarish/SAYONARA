import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import EventsGrid from "@/components/EventsGrid";
import { Code2, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = db.getEvents();
  const user = await getCurrentUser();
  const registeredEventIds = user ? db.getStudentEventRegistrations(user.id) : [];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Fest Arenas &amp; Activities
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight mb-4">
          EXPLORE SAYONARA EVENTS
        </h1>
        <p className="text-slate-400 text-base font-normal leading-relaxed">
          From high-stakes competitive coding and LAN tournaments to nostalgia roasts and musical performances. Register directly with your verified student pass.
        </p>
      </div>

      <EventsGrid
        events={events}
        user={user}
        registeredEventIds={registeredEventIds}
      />
    </div>
  );
}
