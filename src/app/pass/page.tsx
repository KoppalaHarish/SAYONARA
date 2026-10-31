import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import QrCodeDisplay from "@/components/QrCodeDisplay";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PassPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/login");
  }

  const user = db.getUserById(session.id);
  if (!user) {
    redirect("/login");
  }

  const attendance = db.getAttendanceByStudentId(user.id);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center tech-grid-bg relative">
      <div className="w-full mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <span className="text-xs font-mono text-slate-400">
          Official Entry Identifier
        </span>
      </div>

      <div className="w-full flex justify-center">
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
    </div>
  );
}
