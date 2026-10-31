import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "students";

    const students = db.getUsers().filter((u) => u.role === "student");
    const attendance = db.getAttendance();

    if (type === "attendance") {
      const headers = [
        "College ID",
        "Student Name",
        "Year",
        "Department",
        "Checked In",
        "Checked In At",
        "Verified By",
        "QR Token",
      ];

      const rows = students.map((s) => {
        const att = attendance.find((a) => a.studentId === s.id);
        return [
          `"${s.collegeId}"`,
          `"${s.name.replace(/"/g, '""')}"`,
          `"${s.year}"`,
          `"${s.department}"`,
          `"${att?.checkedIn ? "YES" : "NO"}"`,
          `"${att?.checkedInAt ? new Date(att.checkedInAt).toLocaleString() : "-"}"`,
          `"${att?.verifiedBy || "-"}"`,
          `"${s.qrToken}"`,
        ].join(",");
      });

      const csv = [headers.join(","), ...rows].join("\r\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="sayonara_attendance_${Date.now()}.csv"`,
        },
      });
    }

    // Default: Export registered students
    const headers = [
      "College ID",
      "Student Name",
      "Year",
      "Department",
      "Email",
      "Phone",
      "Registered At",
      "QR Token",
    ];

    const rows = students.map((s) => [
      `"${s.collegeId}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.year}"`,
      `"${s.department}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      `"${new Date(s.createdAt).toLocaleString()}"`,
      `"${s.qrToken}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="sayonara_students_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export CSV error:", error);
    return NextResponse.json({ error: "Failed to generate CSV export" }, { status: 500 });
  }
}
