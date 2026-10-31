import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import QrCodeDisplay from "@/components/QrCodeDisplay";
import EventsGrid from "@/components/EventsGrid";
import {
  User,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  QrCode,
  Award,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Film,
  Camera,
  Play,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/login");
  }

  const user = db.getUserById(session.id);
  if (!user) {
    redirect("/login");
  }

  const settings = db.getSettings();
  const allEvents = db.getEvents();
  const registeredEventIds = db.getStudentEventRegistrations(user.id);
  const myEvents = allEvents.filter((e) => registeredEventIds.includes(e.id));
  const attendance = db.getAttendanceByStudentId(user.id);
  const announcements = db.getAnnouncements();
  const memories = db.getGallery();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Student Welcome & Profile Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider border border-cyan-500/30">
                {user.year} CSE
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider border border-purple-500/30">
                ID: {user.collegeId}
              </span>
              {attendance?.checkedIn ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Gate Verified
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider">
                  Gate Check-In Pending
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
              WELCOME, {user.name.toUpperCase()}
            </h1>

            <p className="text-sm text-slate-300 font-mono">
              Official participant in SAYONARA CSE Farewell Fest • Honoring Batch 2021-2027 (6-Year Integrated PUC + B.Tech)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pass"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Full Screen QR Pass</span>
            </Link>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main 2-Column Grid: Left QR Pass & Profile, Right Events & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Digital QR Pass Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-cyan-400" />
              Your Gate Pass
            </h2>

            <QrCodeDisplay
              user={{
                id: user.id,
                name: user.name,
                collegeId: user.collegeId,
                year: user.year,
                department: user.department,
                email: user.email,
                phone: user.phone,
                role: user.role,
                qrToken: user.qrToken,
              }}
              checkedIn={attendance?.checkedIn || false}
              checkedInAt={attendance?.checkedInAt}
            />
          </div>

          {/* Fest Schedule & Venue Card */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3 font-mono text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Event Details (Placeholders)
            </h3>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Date: {settings.eventDate}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Venue: {settings.venue}</span>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-500">
              Times and final venue will be automatically updated by Department administration.
            </div>
          </div>
        </div>

        {/* Right Column: Registered Events & Announcements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Registered Events Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  My Registered Competitions &amp; Arenas
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  You are registered for {myEvents.length} event(s)
                </p>
              </div>

              <Link
                href="/events"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold uppercase tracking-wider flex items-center gap-1"
              >
                Browse All Events →
              </Link>
            </div>

            {myEvents.length > 0 ? (
              <div className="space-y-3">
                {myEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-[#050814] p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {evt.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {evt.date} &bull; {evt.time}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white font-mono">
                        {evt.name}
                      </h4>
                      <p className="text-xs text-slate-400">{evt.venue}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold">
                        Confirmed Entry
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#050814]/60 rounded-2xl border border-white/5 space-y-3">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400 font-mono">
                  You haven&apos;t enrolled in any specific competitions yet.
                </p>
                <Link
                  href="/events"
                  className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider"
                >
                  Explore &amp; Register for Events
                </Link>
              </div>
            )}
          </div>

          {/* Live Announcements */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-400" />
              Fest Announcements &amp; Notices
            </h2>

            <div className="space-y-4">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="bg-[#050814] p-4 rounded-xl border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        a.priority === "urgent"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : a.priority === "event"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}
                    >
                      {a.priority}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono">{a.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {a.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Memories & Moments Section for Students */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-2">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              Batch 2021-2027 Memory Vault
            </div>
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
              Campus Moments, Photos &amp; Videos
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Admin-curated captures honoring our 6-year journey: 2 years PUC + 4 years B.Tech
            </p>
          </div>

          <Link
            href="/gallery"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider border border-purple-500/30 transition-all"
          >
            <span>Open Full Gallery ({memories.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {memories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.slice(0, 6).map((mem) => {
              const isVideo = mem.mediaType === "video" || Boolean(mem.videoUrl);
              return (
                <Link
                  key={mem.id}
                  href="/gallery"
                  className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 aspect-video flex flex-col justify-end"
                >
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/50 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    {isVideo ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-white" />
                        Video
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-600/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Camera className="w-2.5 h-2.5" />
                        Photo
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-black/60 text-slate-300 font-mono text-[10px]">
                      {mem.year}
                    </span>
                  </div>

                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  <div className="p-4 relative z-10">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase block mb-1">
                      {mem.category}
                    </span>
                    <h4 className="text-sm font-bold text-white font-mono truncate group-hover:text-cyan-300 transition-colors">
                      {mem.title}
                    </h4>
                    {mem.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {mem.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 glass-panel rounded-2xl border border-white/5 space-y-2">
            <Camera className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 font-mono">
              Memories vault is being curated by administrators for CSE Batch 2021-2027.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
