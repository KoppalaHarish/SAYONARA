import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to register for events." }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Register in JSON DB
    const result = db.registerForEvent(user.id, eventId);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Also register in Neon
    try {
      await prisma.eventRegistration.create({
        data: {
          studentId: user.id,
          eventId,
        },
      });
    } catch (neonErr: any) {
      // Ignore duplicate key errors from Neon
      if (!neonErr?.message?.includes("Unique constraint")) {
        console.warn("Neon event registration error (non-fatal):", neonErr);
      }
    }

    return NextResponse.json({ message: result.message, registered: true });
  } catch (error) {
    console.error("Event registration error:", error);
    return NextResponse.json({ error: "Failed to register for event" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to manage your registrations." }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Unregister from JSON DB
    const success = db.unregisterFromEvent(user.id, eventId);
    if (!success) {
      return NextResponse.json({ error: "You were not registered for this event." }, { status: 400 });
    }

    // Also unregister from Neon
    try {
      await prisma.eventRegistration.deleteMany({
        where: { studentId: user.id, eventId },
      });
    } catch (neonErr) {
      console.warn("Neon event unregistration error (non-fatal):", neonErr);
    }

    return NextResponse.json({ message: "Registration cancelled successfully", registered: false });
  } catch (error) {
    console.error("Event unregister error:", error);
    return NextResponse.json({ error: "Failed to cancel event registration" }, { status: 500 });
  }
}
