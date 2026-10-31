"use client";

import { useState, useEffect } from "react";
import { Megaphone, AlertCircle, ChevronRight, X, Bell } from "lucide-react";
import { Announcement } from "@/lib/types";

export default function AnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => (res.ok ? res.json() : { announcements: [] }))
      .then((data) => setAnnouncements(data.announcements || []))
      .catch(() => {});
  }, []);

  if (!announcements.length) return null;

  const top = announcements[0];

  return (
    <>
      <div className="relative border-y border-cyan-500/20 bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-purple-950/40 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase tracking-wider shrink-0 border border-cyan-500/30">
              <Megaphone className="w-3.5 h-3.5 text-cyan-400" />
              Latest Notice
            </span>

            <p className="text-slate-300 truncate">
              <span className="font-semibold text-white mr-2">{top.title}:</span>
              <span className="text-slate-400">{top.content}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedAnnouncement(top)}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-0.5 cursor-pointer"
            >
              Read Full Notice
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for viewing announcement */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-cyan-500/30 relative">
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-bold tracking-wider ${
                  selectedAnnouncement.priority === "urgent"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : selectedAnnouncement.priority === "event"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                }`}
              >
                {selectedAnnouncement.priority} Priority
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(selectedAnnouncement.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              {selectedAnnouncement.title}
            </h3>

            <div className="text-sm text-slate-300 leading-relaxed bg-[#050814] p-4 rounded-xl border border-white/5 whitespace-pre-line mb-6">
              {selectedAnnouncement.content}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs uppercase tracking-wider transition-colors"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
