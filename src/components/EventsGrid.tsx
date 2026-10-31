"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Code2,
  Gamepad2,
  Sparkles,
  Music,
  Award,
  Compass,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Info,
  X,
  AlertCircle,
} from "lucide-react";
import { FestEvent, EventCategory, UserSession } from "@/lib/types";

interface EventsGridProps {
  events: FestEvent[];
  user: UserSession | null;
  registeredEventIds?: string[];
  onRefresh?: () => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  Technical: Code2,
  Gaming: Gamepad2,
  Ceremony: Award,
  Cultural: Music,
  Fun: Compass,
};

export default function EventsGrid({
  events,
  user,
  registeredEventIds = [],
  onRefresh,
}: EventsGridProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalEvent, setActiveModalEvent] = useState<FestEvent | null>(null);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [localRegisteredIds, setLocalRegisteredIds] = useState<string[]>(registeredEventIds);

  useEffect(() => {
    setLocalRegisteredIds(registeredEventIds);
  }, [registeredEventIds]);

  const categories = ["All", "Technical", "Gaming", "Ceremony", "Cultural", "Fun"];

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const handleRegisterEvent = async (event: FestEvent) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoadingEventId(event.id);
    setStatusMessage(null);

    const isRegistered = localRegisteredIds.includes(event.id);
    const method = isRegistered ? "DELETE" : "POST";

    try {
      const res = await fetch(`/api/events/${event.id}/register`, {
        method,
      });
      const data = await res.json();

      if (!res.ok) {
        setStatusMessage({ text: data.error || "Failed to update registration", error: true });
      } else {
        setStatusMessage({ text: data.message });
        setLocalRegisteredIds((prev) =>
          isRegistered ? prev.filter((id) => id !== event.id) : [...prev, event.id]
        );
        router.refresh();
        if (onRefresh) onRefresh();
      }
    } catch {
      setStatusMessage({ text: "Network connection error", error: true });
    } finally {
      setLoadingEventId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Status banner */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm font-medium ${
            statusMessage.error
              ? "bg-rose-500/15 border border-rose-500/30 text-rose-300"
              : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs uppercase font-bold tracking-wider hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] font-bold"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const Icon = CATEGORY_ICONS[event.category] || Sparkles;
          const isRegistered = localRegisteredIds.includes(event.id);
          const currentCount = event.currentRegistrations || 0;
          const pct = Math.min(100, Math.round((currentCount / (event.maxParticipants || 100)) * 100));

          return (
            <div
              key={event.id}
              className="glass-panel glass-card-hover rounded-2xl p-6 border border-white/10 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Top Row: Category and Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    {event.category}
                  </span>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold tracking-wider ${
                      event.registrationStatus === "CLOSED"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : event.registrationStatus === "FILLING_FAST"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {event.registrationStatus === "FILLING_FAST"
                      ? "Filling Fast"
                      : event.registrationStatus}
                  </span>
                </div>

                {/* Event Name & Tagline */}
                <h3 className="text-xl font-bold text-white mb-1.5 font-mono group-hover:text-cyan-300 transition-colors">
                  {event.name}
                </h3>
                <p className="text-xs text-cyan-400 font-mono font-semibold mb-3">
                  {event.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-5">
                  {event.description}
                </p>
              </div>

              {/* Event Metadata and Actions */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                {/* Date & Venue placeholders */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{event.time}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>

                {/* Registration Slots Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Slots:
                    </span>
                    <span className="text-slate-300">
                      {currentCount} / {event.maxParticipants} Registered
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveModalEvent(event)}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold font-mono tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    Rules &amp; Details
                  </button>

                  <button
                    disabled={
                      loadingEventId === event.id ||
                      (event.registrationStatus === "CLOSED" && !isRegistered)
                    }
                    onClick={() => handleRegisterEvent(event)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                      isRegistered
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40"
                        : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    }`}
                  >
                    {loadingEventId === event.id ? (
                      <span className="animate-spin">◌</span>
                    ) : isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <span>Register</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules Modal */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 sm:p-8 border border-cyan-500/30 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalEvent(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-cyan-950 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider border border-cyan-500/30">
                {activeModalEvent.category} Arena
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Eligibility: {activeModalEvent.eligibility}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono mb-2">
              {activeModalEvent.name}
            </h2>
            <p className="text-sm text-cyan-400 font-mono mb-6">
              {activeModalEvent.tagline}
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                  Event Overview
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-[#060a1a] p-4 rounded-xl border border-white/5">
                  {activeModalEvent.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
                  Rules &amp; Guidelines
                </h4>
                <ul className="space-y-2">
                  {activeModalEvent.rules.map((rule, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 bg-[#060a1a] p-3 rounded-lg border border-white/5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono bg-[#060a1a] p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 block">Date</span>
                  <span className="text-white font-bold">{activeModalEvent.date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Time</span>
                  <span className="text-white font-bold">{activeModalEvent.time}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Venue</span>
                  <span className="text-white font-bold">{activeModalEvent.venue}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-mono">
                {activeModalEvent.currentRegistrations || 0} / {activeModalEvent.maxParticipants} Confirmed Seats
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleRegisterEvent(activeModalEvent);
                    setActiveModalEvent(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {localRegisteredIds.includes(activeModalEvent.id) ? "Cancel Enrollment" : "Enroll Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
