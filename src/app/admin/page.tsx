import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminDashboardTabs from "@/components/AdminDashboardTabs";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== "admin") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="glass-panel max-w-md w-full rounded-3xl p-8 border border-rose-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white font-mono">
            ACCESS RESTRICTED
          </h2>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            The SAYONARA Command Center is restricted to authorized faculty and student coordinators. Please log in with admin credentials.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Sign In with Admin Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Preload initial stats and settings
  const users = db.getUsers().filter((u) => u.role === "student");
  const totalStudents = users.length;
  const thirdYearCount = users.filter((u) => u.year === "3rd Year").length;
  const fourthYearCount = users.filter((u) => u.year === "4th Year").length;
  const eventRegistrations = db.getEventRegistrations();
  const attendance = db.getAttendance().filter((a) => a.checkedIn);
  const checkedInCount = attendance.length;
  const attendanceRate = totalStudents > 0 ? Math.round((checkedInCount / totalStudents) * 100) : 0;

  const recentRegistrations = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const initialStats = {
    stats: {
      totalStudents,
      thirdYearCount,
      fourthYearCount,
      totalEventRegistrations: eventRegistrations.length,
      checkedInCount,
      attendanceRate,
    },
    recentRegistrations,
  };

  const initialSettings = db.getSettings();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AdminDashboardTabs
        initialStats={initialStats}
        initialSettings={initialSettings}
      />
    </div>
  );
}
