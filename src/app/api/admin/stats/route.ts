import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = db.getUsers().filter((u) => u.role === "student");
    const totalStudents = users.length;
    const thirdYearCount = users.filter((u) => u.year === "3rd Year").length;
    const fourthYearCount = users.filter((u) => u.year === "4th Year").length;

    const eventRegistrations = db.getEventRegistrations();
    const totalEventRegistrations = eventRegistrations.length;

    const attendance = db.getAttendance().filter((a) => a.checkedIn);
    const checkedInCount = attendance.length;
    const pendingCheckInCount = Math.max(0, totalStudents - checkedInCount);
    const attendanceRate = totalStudents > 0 ? Math.round((checkedInCount / totalStudents) * 100) : 0;

    const recentRegistrations = [...users]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map((u) => ({
        id: u.id,
        name: u.name,
        collegeId: u.collegeId,
        year: u.year,
        email: u.email,
        phone: u.phone,
        createdAt: u.createdAt,
      }));

    const events = db.getEvents();

    return NextResponse.json({
      stats: {
        totalStudents,
        thirdYearCount,
        fourthYearCount,
        totalEventRegistrations,
        checkedInCount,
        pendingCheckInCount,
        attendanceRate,
      },
      recentRegistrations,
      eventsSummary: events.map((e) => ({
        id: e.id,
        name: e.name,
        category: e.category,
        maxParticipants: e.maxParticipants,
        currentRegistrations: e.currentRegistrations || 0,
        registrationStatus: e.registrationStatus,
      })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to load dashboard metrics" }, { status: 500 });
  }
}
