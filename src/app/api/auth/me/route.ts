import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Refresh user from DB to ensure up-to-date state
    let user = db.getUserById(session.id);
    if (!user) {
      try {
        const neonUser = await prisma.user.findUnique({
          where: { id: session.id },
        });
        if (neonUser) {
          user = {
            id: neonUser.id,
            name: neonUser.name,
            collegeId: neonUser.collegeId,
            year: neonUser.year as any,
            department: neonUser.department,
            email: neonUser.email,
            phone: neonUser.phone,
            passwordHash: neonUser.passwordHash,
            role: neonUser.role as any,
            qrToken: neonUser.qrToken,
            createdAt: neonUser.createdAt.toISOString(),
          };
          db.createUser(user);
        }
      } catch (err) {
        console.warn("Neon fallback check failed in auth/me:", err);
      }
    }

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const registeredEvents = db.getStudentEventRegistrations(user.id);
    const attendance = db.getAttendanceByStudentId(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        collegeId: user.collegeId,
        year: user.year,
        department: user.department,
        email: user.email,
        phone: user.phone,
        role: user.role,
        qrToken: user.qrToken,
      },
      registeredEventIds: registeredEvents,
      attendance: attendance || { checkedIn: false, checkedInAt: null },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
