"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit,
  Save,
  Megaphone,
  Sliders,
  Camera,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  X,
  UserPlus,
  Film,
  Video,
  Play,
  Lock,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { FestEvent, Announcement, FestSettings, GalleryItem, TeamMember } from "@/lib/types";
import QrScannerModal from "./QrScannerModal";

interface AdminDashboardProps {
  initialStats: any;
  initialSettings: FestSettings;
}

export default function AdminDashboardTabs({
  initialStats,
  initialSettings,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "students" | "events" | "attendance" | "announcements" | "memories" | "council" | "settings"
  >("overview");

  const [stats, setStats] = useState<any>(initialStats?.stats || {});
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>(
    initialStats?.recentRegistrations || []
  );
  const [settings, setSettings] = useState<FestSettings>(initialSettings);
  const [settingsForm, setSettingsForm] = useState<FestSettings>(initialSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Students Tab State
  const [students, setStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentYearFilter, setStudentYearFilter] = useState("ALL");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importRawText, setImportRawText] = useState("");
  const [importYear, setImportYear] = useState<"3rd Year" | "4th Year">("4th Year");
  const [importLoading, setImportLoading] = useState(false);
  const [importMessage, setImportMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Events Tab State
  const [events, setEvents] = useState<FestEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FestEvent | null>(null);
  const [eventForm, setEventForm] = useState<Partial<FestEvent>>({
    name: "",
    tagline: "",
    description: "",
    category: "Technical",
    rules: [],
    eligibility: "3rd & 4th Year B.Tech CSE Students",
    maxParticipants: 60,
    date: "MARCH / APRIL 2026",
    time: "10:30 AM",
    venue: "CSE Turing Lab",
    registrationStatus: "OPEN",
    iconName: "Code2",
  });

  // Attendance Tab State
  const [attendance, setAttendance] = useState<any[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Announcements Tab State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementPriority, setAnnouncementPriority] = useState<"normal" | "urgent" | "event">("normal");

  // Memories (Photos & Videos) Tab State
  const [memories, setMemories] = useState<GalleryItem[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [memoryForm, setMemoryForm] = useState<Partial<GalleryItem>>({
    title: "",
    category: "Farewell Memories",
    year: "2021-2027",
    imageUrl: "",
    mediaType: "photo",
    videoUrl: "",
    description: "",
  });

  // Organizing Council & Coordinators Tab State (Head Admin Authority)
  const [coordinators, setCoordinators] = useState<TeamMember[]>([]);
  const [loadingCoordinators, setLoadingCoordinators] = useState(false);
  const [showCoordinatorModal, setShowCoordinatorModal] = useState(false);
  const [coordinatorForm, setCoordinatorForm] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    category: "Student Lead",
    department: "CSE",
    contact: "",
  });

  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchStudents();
    fetchEvents();
    fetchAttendance();
    fetchAnnouncements();
    fetchMemories();
    fetchCoordinators();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentRegistrations(data.recentRegistrations);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await fetch(
        `/api/admin/students?search=${encodeURIComponent(
          studentSearch
        )}&year=${studentYearFilter}`
      );
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/admin/attendance");
      if (res.ok) {
        const data = await res.json();
        setAttendance(data.attendance);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove registration for ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/students?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchStudents();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importRawText.trim()) return;
    setImportLoading(true);
    setImportMessage(null);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: importRawText,
          defaultYear: importYear,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportMessage({ text: data.error || "Failed to import roster", error: true });
      } else {
        setImportMessage({ text: data.message });
        setImportRawText("");
        fetchStudents();
        fetchStats();
      }
    } catch {
      setImportMessage({ text: "Network connection error", error: true });
    } finally {
      setImportLoading(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventForm),
        });
        if (res.ok) {
          setShowEventModal(false);
          setEditingEvent(null);
          fetchEvents();
        }
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventForm),
        });
        if (res.ok) {
          setShowEventModal(false);
          fetchEvents();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string, name: string) => {
    if (!confirm(`Delete event "${name}"?`)) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementContent) return;
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: announcementTitle,
          content: announcementContent,
          priority: announcementPriority,
        }),
      });
      if (res.ok) {
        setAnnouncementTitle("");
        setAnnouncementContent("");
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMemories = async () => {
    setLoadingMemories(true);
    try {
      const res = await fetch("/api/memories");
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMemories(false);
    }
  };

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memoryForm),
      });
      if (res.ok) {
        setShowMemoryModal(false);
        setMemoryForm({
          title: "",
          category: "Farewell Memories",
          year: "2021-2027",
          imageUrl: "",
          mediaType: "photo",
          videoUrl: "",
          description: "",
        });
        fetchMemories();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to add memory");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMemory = async (id: string, title: string) => {
    if (!confirm(`Delete memory "${title}" from the vault?`)) return;
    try {
      const res = await fetch(`/api/memories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMemories();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete memory");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCoordinators = async () => {
    setLoadingCoordinators(true);
    try {
      const res = await fetch("/api/admin/coordinators");
      if (res.ok) {
        const data = await res.json();
        setCoordinators(data.team || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoordinators(false);
    }
  };

  const handleSaveCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/coordinators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coordinatorForm),
      });
      if (res.ok) {
        setShowCoordinatorModal(false);
        setCoordinatorForm({
          name: "",
          role: "",
          category: "Student Lead",
          department: "CSE",
          contact: "",
        });
        fetchCoordinators();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to add coordinator");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoordinator = async (id: string, name: string) => {
    if (!confirm(`Remove coordinator "${name}" from the council? (Head Admin action only)`)) return;
    try {
      const res = await fetch(`/api/admin/coordinators/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCoordinators();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to remove coordinator");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      {/* Quick Launch Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
            COMMAND CENTER
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Manage SAYONARA fest operations, registrations, passes, and schedule for the 6-year integrated CSE batches
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Entry Scanner</span>
          </button>

          <a
            href="/api/admin/export?type=students"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono text-xs font-medium border border-white/10 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#060a1c] border border-cyan-500/20 mb-8">
        {[
          { id: "overview", label: "Overview", icon: Sliders },
          { id: "students", label: `Students (${stats?.totalStudents || 0})`, icon: Users },
          { id: "events", label: `Events (${events.length})`, icon: Calendar },
          { id: "memories", label: `Memories & Vault (${memories.length})`, icon: Film },
          { id: "council", label: `Council & Leads (${coordinators.length})`, icon: ShieldCheck },
          { id: "attendance", label: `Gate Attendance`, icon: CheckCircle2 },
          { id: "announcements", label: "Announcements", icon: Megaphone },
          { id: "settings", label: "Fest Settings", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === "students") fetchStudents();
                if (tab.id === "attendance") fetchAttendance();
                if (tab.id === "memories") fetchMemories();
                if (tab.id === "council") fetchCoordinators();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer ${
                active
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-panel rounded-2xl p-5 border border-cyan-500/25">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Total Registrations
              </span>
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">
                {stats?.totalStudents || 0}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                CSE 3rd &amp; 4th Yr (6-Yr Integrated)
              </span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-purple-500/25">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Batch Distribution
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                  {stats?.fourthYearCount || 0}
                </span>
                <span className="text-xs text-purple-300 font-mono">4th Yr (21-27)</span>
                <span className="text-slate-600">/</span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                  {stats?.thirdYearCount || 0}
                </span>
                <span className="text-xs text-cyan-300 font-mono">3rd Yr (22-28)</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Graduating Seniors (2021-2027) vs Host Juniors (2022-2028)
              </span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-emerald-500/25">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Gate Checked In
              </span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                {stats?.checkedInCount || 0}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {stats?.attendanceRate || 0}% Total Turnout
              </span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-amber-500/25">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Event Enrollments
              </span>
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                {stats?.totalEventRegistrations || 0}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Across 6 Fest Arenas
              </span>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Latest Registered Students
              </h3>
              <button
                onClick={() => setActiveTab("students")}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                View All →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead className="bg-[#050814] text-slate-400 uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-3">College ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentRegistrations.map((s: any) => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-cyan-400">{s.collegeId}</td>
                      <td className="p-3 text-white">{s.name}</td>
                      <td className="p-3 text-purple-300">{s.year}</td>
                      <td className="p-3 text-slate-400">{s.email}</td>
                      <td className="p-3 text-slate-400">{s.phone}</td>
                      <td className="p-3 text-slate-500">
                        {new Date(s.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: STUDENTS */}
      {activeTab === "students" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search & Filter Bar */}
          <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search name, ID, phone..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchStudents();
                }}
                className="w-full bg-[#050918] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={studentYearFilter}
                onChange={(e) => {
                  setStudentYearFilter(e.target.value);
                  setTimeout(fetchStudents, 50);
                }}
                className="bg-[#050918] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Batches</option>
                <option value="4th Year">4th Year B.Tech (2021-2027 Seniors)</option>
                <option value="3rd Year">3rd Year B.Tech (2022-2028 Juniors)</option>
              </select>

              <button
                onClick={fetchStudents}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setShowImportModal(true);
                  setImportMessage(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Import Roster
              </button>

              <a
                href="/api/admin/export?type=students"
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </a>
            </div>
          </div>

          {/* Students Table */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead className="bg-[#050814] text-slate-400 uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-3">College ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">QR Token</th>
                    <th className="p-3">Gate Status</th>
                    <th className="p-3">Events</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-cyan-400">{s.collegeId}</td>
                      <td className="p-3 text-white font-medium">{s.name}</td>
                      <td className="p-3 text-purple-300">{s.year}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{s.qrToken}</td>
                      <td className="p-3">
                        {s.checkedIn ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                            Checked In
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-amber-300 font-bold">
                        {s.registeredEventCount}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && !loadingStudents && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No registrations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: EVENTS */}
      {activeTab === "events" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-mono">
              Fest Arenas &amp; Competitions
            </h3>
            <button
              onClick={() => {
                setEditingEvent(null);
                setEventForm({
                  name: "",
                  tagline: "",
                  description: "",
                  category: "Technical",
                  rules: ["Individual participation"],
                  eligibility: "3rd & 4th Year B.Tech CSE Students",
                  maxParticipants: 60,
                  date: "MARCH / APRIL 2026",
                  time: "10:30 AM",
                  venue: "CSE Turing Lab",
                  registrationStatus: "OPEN",
                  iconName: "Code2",
                });
                setShowEventModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                      {event.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        event.registrationStatus === "OPEN"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {event.registrationStatus}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white font-mono mb-1">
                    {event.name}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="text-xs font-mono text-slate-400 space-y-1 mb-4">
                    <p>Venue: {event.venue}</p>
                    <p>Date: {event.date}</p>
                    <p>
                      Enrollment: {event.currentRegistrations || 0} / {event.maxParticipants}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setEventForm({
                        ...event,
                        rules: event.rules,
                      });
                      setShowEventModal(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.name)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: ATTENDANCE */}
      {activeTab === "attendance" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white font-mono">
                Gate Entry &amp; Attendance Logs
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Real-time check-in records for SAYONARA attendees
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setScannerOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider"
              >
                <Camera className="w-4 h-4" />
                Scan Pass Now
              </button>

              <a
                href="/api/admin/export?type=attendance"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/10"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Download Attendance CSV
              </a>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead className="bg-[#050814] text-slate-400 uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-3">College ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Check-in Time</th>
                    <th className="p-3">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attendance.map((a) => (
                    <tr key={a.studentId} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-cyan-400">{a.collegeId}</td>
                      <td className="p-3 text-white font-medium">{a.studentName}</td>
                      <td className="p-3 text-purple-300">{a.year}</td>
                      <td className="p-3">
                        {a.checkedIn ? (
                          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            ✓ VERIFIED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px]">
                            NOT CHECKED IN
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-300">
                        {a.checkedInAt ? new Date(a.checkedInAt).toLocaleTimeString() : "-"}
                      </td>
                      <td className="p-3 text-slate-500">{a.verifiedBy || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
          {/* Left Form */}
          <div className="lg:col-span-1 glass-panel rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-400" />
              Post Announcement
            </h3>

            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Update or Auditions"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed announcement text..."
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Priority Badge
                </label>
                <select
                  value={announcementPriority}
                  onChange={(e) => setAnnouncementPriority(e.target.value as any)}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent Notice</option>
                  <option value="event">Event Alert</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Broadcast Notice
              </button>
            </form>
          </div>

          {/* Right List */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-mono mb-4">
              Active Broadcasts ({announcements.length})
            </h3>

            {announcements.map((a) => (
              <div
                key={a.id}
                className="bg-[#050814] p-4 rounded-xl border border-white/5 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
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

                <button
                  onClick={() => handleDeleteAnnouncement(a.id)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: MEMORIES (Photos & Videos) */}
      {activeTab === "memories" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  Campus Vault
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Batch 2021-2027 Journey
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
                Campus Memories &amp; Moments
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
                Curate official photos, throwback captures, farewell clips, and event videos. All approved memories are immediately visible to students in their dashboard and gallery.
              </p>
            </div>

            <button
              onClick={() => {
                setMemoryForm({
                  title: "",
                  category: "Farewell Memories",
                  year: "2021-2027",
                  imageUrl: "",
                  mediaType: "photo",
                  videoUrl: "",
                  description: "",
                });
                setShowMemoryModal(true);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Memory (Photo / Video)</span>
            </button>
          </div>

          {loadingMemories ? (
            <div className="text-center py-12 text-slate-400 font-mono text-sm">
              Loading memories vault...
            </div>
          ) : memories.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 space-y-3">
              <Camera className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-mono">
                No memories or media uploaded yet.
              </p>
              <button
                onClick={() => setShowMemoryModal(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono text-xs font-bold uppercase tracking-wider"
              >
                Upload First Memory
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((mem) => {
                const isVideo = mem.mediaType === "video" || Boolean(mem.videoUrl);
                return (
                  <div
                    key={mem.id}
                    className="glass-panel rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between hover:border-cyan-500/40 transition-all"
                  >
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      <img
                        src={mem.imageUrl}
                        alt={mem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        {isVideo ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Video className="w-3 h-3" />
                            Video
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-600/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Camera className="w-3 h-3" />
                            Photo
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-300 font-mono text-[10px]">
                          {mem.year}
                        </span>
                      </div>

                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {mem.category}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white font-mono line-clamp-1">
                          {mem.title}
                        </h4>
                        {mem.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                            {mem.description}
                          </p>
                        )}
                        {mem.videoUrl && (
                          <p className="text-[11px] text-cyan-400 font-mono truncate mt-1">
                            Video: {mem.videoUrl}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500">
                          {mem.createdAt ? new Date(mem.createdAt).toLocaleDateString() : "Saved"}
                        </span>
                        <button
                          onClick={() => handleDeleteMemory(mem.id, mem.title)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-mono transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: ORGANIZING COUNCIL & COORDINATORS */}
      {activeTab === "council" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Security Alert Banner */}
          <div className="rounded-2xl p-5 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 border border-amber-500/40 flex items-start gap-3.5">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-300 font-mono uppercase tracking-wider">
                Head Admin Sole Authority Mode
              </h4>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                Adding, modifying, and deleting organizing council coordinators and leads is restricted strictly to the <strong>Head Admin (CSE-ADMIN)</strong>. Coordinating faculty and student leads have read-only visibility to preserve protocol integrity.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Official Council
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  SAYONARA CSE Department Leads
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
                Organizing Council &amp; Leads
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Official team orchestrating the 6-year batch celebration at CSE BLOCK
              </p>
            </div>

            <button
              onClick={() => {
                setCoordinatorForm({
                  name: "",
                  role: "",
                  category: "Student Lead",
                  department: "CSE",
                  contact: "",
                });
                setShowCoordinatorModal(true);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Coordinator (Admin Only)</span>
            </button>
          </div>

          {loadingCoordinators ? (
            <div className="text-center py-12 text-slate-400 font-mono text-sm">
              Loading council members...
            </div>
          ) : coordinators.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-mono">
                No council members listed yet.
              </p>
              <button
                onClick={() => setShowCoordinatorModal(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono text-xs font-bold uppercase tracking-wider"
              >
                Add First Coordinator
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coordinators.map((member) => (
                <div
                  key={member.id}
                  className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                          member.category === "Faculty Coordinator"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : member.category === "Student Lead"
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {member.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {member.department || "CSE"} BLOCK
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white font-mono">
                        {member.name}
                      </h4>
                      <p className="text-xs text-cyan-300 font-mono mt-0.5">
                        {member.role}
                      </p>
                    </div>

                    {member.contact && (
                      <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{member.contact}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Admin Verified
                    </span>
                    <button
                      onClick={() => handleDeleteCoordinator(member.id, member.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-mono transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-3xl glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white font-mono">
                Fest Configuration &amp; Placeholders
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Update fest date, venue, contact desk, tagline, or toggle registrations without code changes
              </p>
            </div>

            {settingsSaved && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Fest Name</label>
                <input
                  type="text"
                  value={settingsForm.festName}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, festName: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Subtitle</label>
                <input
                  type="text"
                  value={settingsForm.subtitle}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, subtitle: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold">Tagline</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, tagline: e.target.value })
                }
                className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">
                  Event Date Scheduled / Placeholder
                </label>
                <input
                  type="text"
                  placeholder="e.g. COMING SOON (MARCH / APRIL 2027)"
                  value={settingsForm.eventDate}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, eventDate: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">
                  Venue / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSE BLOCK"
                  value={settingsForm.venue}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, venue: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Department Desk Email</label>
                <input
                  type="email"
                  placeholder="rhariesh1@gmail.com"
                  value={settingsForm.contactEmail || "rhariesh1@gmail.com"}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Department Desk Phone</label>
                <input
                  type="text"
                  maxLength={14}
                  placeholder="7842439105"
                  value={settingsForm.contactPhone || "7842439105"}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold">Top Header Notice Banner</label>
              <input
                type="text"
                value={settingsForm.bannerMessage}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, bannerMessage: e.target.value })
                }
                className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 border-t border-white/10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.registrationOpen}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      registrationOpen: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-slate-300 font-bold">
                  Registration Portal Active (Check to allow new student signups)
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </form>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onCheckInSuccess={() => {
          fetchStats();
          fetchAttendance();
        }}
      />

      {/* Event Add/Edit Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-6 sm:p-8 border border-white/10 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-mono mb-4">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={eventForm.tagline}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, tagline: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={eventForm.category}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, category: e.target.value as any })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-slate-300"
                >
                  <option value="Technical">Technical</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Ceremony">Ceremony</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Fun">Fun</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Max Participants</label>
                  <input
                    type="number"
                    value={eventForm.maxParticipants}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        maxParticipants: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <select
                    value={eventForm.registrationStatus}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        registrationStatus: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-slate-300"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="FILLING_FAST">FILLING_FAST</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Date</label>
                  <input
                    type="text"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, date: e.target.value })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Time</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, time: e.target.value })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Venue</label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, venue: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Memory Add Modal */}
      {showMemoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-6 sm:p-8 border border-white/10 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowMemoryModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-mono mb-1 flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              Add Memory (Photo / Video)
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Upload photos and videos of the 6-year CSE journey to the student vault
            </p>

            <form onSubmit={handleSaveMemory} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Memory Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE Batch 2021-2027 Farewell Group Photo"
                  value={memoryForm.title}
                  onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Media Type</label>
                  <select
                    value={memoryForm.mediaType}
                    onChange={(e) =>
                      setMemoryForm({ ...memoryForm, mediaType: e.target.value as any })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-slate-300"
                  >
                    <option value="photo">Photo / Picture</option>
                    <option value="video">Video (YouTube / MP4)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={memoryForm.category}
                    onChange={(e) =>
                      setMemoryForm({ ...memoryForm, category: e.target.value })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-slate-300"
                  >
                    <option value="Farewell Memories">Farewell Memories</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Department Labs">Department Labs</option>
                    <option value="Sports & Culturals">Sports & Culturals</option>
                    <option value="Hackathons">Hackathons</option>
                    <option value="PUC Flashback">PUC Flashback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Image / Thumbnail URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or image link"
                  value={memoryForm.imageUrl}
                  onChange={(e) => setMemoryForm({ ...memoryForm, imageUrl: e.target.value })}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              {memoryForm.mediaType === "video" && (
                <div>
                  <label className="text-slate-400 block mb-1">Video URL (YouTube or Direct Video Link)</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... or .mp4 link"
                    value={memoryForm.videoUrl}
                    onChange={(e) => setMemoryForm({ ...memoryForm, videoUrl: e.target.value })}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-400 block mb-1">Batch / Academic Year</label>
                <input
                  type="text"
                  placeholder="2021-2027"
                  value={memoryForm.year}
                  onChange={(e) => setMemoryForm({ ...memoryForm, year: e.target.value })}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description / Caption</label>
                <textarea
                  rows={3}
                  placeholder="Moments shared across 2 years PUC + 4 years B.Tech..."
                  value={memoryForm.description}
                  onChange={(e) =>
                    setMemoryForm({ ...memoryForm, description: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMemoryModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider"
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coordinator Add Modal */}
      {showCoordinatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-6 sm:p-8 border border-white/10 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCoordinatorModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider font-bold">
                Head Admin Exclusive Action
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-mono mb-1">
              Add New Coordinator
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Register an official coordinator or lead for the SAYONARA organizing council
            </p>

            <form onSubmit={handleSaveCoordinator} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hariesh R or Faculty Name"
                  value={coordinatorForm.name}
                  onChange={(e) =>
                    setCoordinatorForm({ ...coordinatorForm, name: e.target.value })
                  }
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Student Lead or Stage Coordinator"
                    value={coordinatorForm.role}
                    onChange={(e) =>
                      setCoordinatorForm({ ...coordinatorForm, role: e.target.value })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={coordinatorForm.category}
                    onChange={(e) =>
                      setCoordinatorForm({
                        ...coordinatorForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-slate-300"
                  >
                    <option value="Student Lead">Student Lead</option>
                    <option value="Faculty Coordinator">Faculty Coordinator</option>
                    <option value="Technical Team">Technical Team</option>
                    <option value="Creative & Media">Creative & Media</option>
                    <option value="Event Coordinator">Event Coordinator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    value={coordinatorForm.department || "CSE"}
                    onChange={(e) =>
                      setCoordinatorForm({
                        ...coordinatorForm,
                        department: e.target.value,
                      })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Contact (Phone / Email)</label>
                  <input
                    type="text"
                    placeholder="e.g. 7842439105 or rhariesh1@gmail.com"
                    value={coordinatorForm.contact}
                    onChange={(e) =>
                      setCoordinatorForm({
                        ...coordinatorForm,
                        contact: e.target.value,
                      })
                    }
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCoordinatorModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider"
                >
                  Add Coordinator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
