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
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const year = searchParams.get("year") || "ALL";

    let students = db.getUsers().filter((u) => u.role === "student");

    if (year !== "ALL") {
      students = students.filter((s) => s.year === year);
    }

    if (search) {
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.collegeId.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search) ||
          s.phone.includes(search)
      );
    }

    const attendanceRecords = db.getAttendance();

    const result = students.map((s) => {
      const att = attendanceRecords.find((a) => a.studentId === s.id);
      const registeredEvents = db.getStudentEventRegistrations(s.id);
      return {
        id: s.id,
        name: s.name,
        collegeId: s.collegeId,
        year: s.year,
        department: s.department,
        email: s.email,
        phone: s.phone,
        qrToken: s.qrToken,
        createdAt: s.createdAt,
        registeredEventCount: registeredEvents.length,
        checkedIn: att?.checkedIn || false,
        checkedInAt: att?.checkedInAt || null,
      };
    });

    return NextResponse.json({ students: result });
  } catch (error) {
    console.error("Get students error:", error);
    return NextResponse.json({ error: "Failed to fetch student registrations" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const success = db.deleteUser(id);
    if (!success) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Registration removed successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json({ error: "Failed to delete student registration" }, { status: 500 });
  }
}
