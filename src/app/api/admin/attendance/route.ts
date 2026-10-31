import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const attendance = db.getAttendance();
    const students = db.getUsers().filter((u) => u.role === "student");

    // Combine attendance status for all students
    const fullLog = students.map((s) => {
      const record = attendance.find((a) => a.studentId === s.id);
      return {
        studentId: s.id,
        collegeId: s.collegeId,
        studentName: s.name,
        year: s.year,
        department: s.department,
        email: s.email,
        phone: s.phone,
        qrToken: s.qrToken,
        checkedIn: record?.checkedIn || false,
        checkedInAt: record?.checkedInAt || null,
        verifiedBy: record?.verifiedBy || null,
      };
    });

    return NextResponse.json({ attendance: fullLog });
  } catch (error) {
    console.error("Get attendance error:", error);
    return NextResponse.json({ error: "Failed to fetch attendance data" }, { status: 500 });
  }
}
