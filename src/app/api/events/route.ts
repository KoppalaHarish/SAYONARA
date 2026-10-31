import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { FestEvent } from "@/lib/types";

export async function GET() {
  try {
    // Try Neon first
    try {
      const neonEvents = await prisma.event.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          _count: { select: { registrations: true } },
        },
      });

      if (neonEvents.length > 0) {
        const events: FestEvent[] = neonEvents.map((e) => ({
          id: e.id,
          name: e.name,
          tagline: e.tagline,
          description: e.description,
          category: e.category as any,
          rules: e.rules,
          eligibility: e.eligibility,
          maxParticipants: e.maxParticipants,
          currentRegistrations: e._count.registrations,
          date: e.date,
          time: e.time,
          venue: e.venue,
          registrationStatus: e.registrationStatus as any,
          iconName: e.iconName,
          createdAt: e.createdAt.toISOString(),
        }));
        return NextResponse.json({ events });
      }
    } catch (neonErr) {
      console.warn("Neon events fetch error, falling back to JSON:", neonErr);
    }

    // Fallback to JSON DB
    const events = db.getEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      tagline,
      description,
      category,
      rules,
      eligibility,
      maxParticipants,
      date,
      time,
      venue,
      registrationStatus = "OPEN",
      iconName = "Sparkles",
    } = body;

    if (!name || !category || !description) {
      return NextResponse.json({ error: "Name, category, and description are required." }, { status: 400 });
    }

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const rulesList = Array.isArray(rules)
      ? rules
      : typeof rules === "string"
      ? rules.split("\n").filter(Boolean)
      : [];

    // Save to Neon
    try {
      const neonEvent = await prisma.event.create({
        data: {
          id: eventId,
          name,
          tagline: tagline || "",
          description,
          category,
          rules: rulesList,
          eligibility: eligibility || "3rd & 4th Year CSE Students",
          maxParticipants: Number(maxParticipants) || 100,
          date: date || "MARCH / APRIL 2026",
          time: time || "TO BE ANNOUNCED",
          venue: venue || "TO BE ANNOUNCED",
          registrationStatus,
          iconName: iconName || "Sparkles",
        },
      });
      const event: FestEvent = {
        id: neonEvent.id,
        name: neonEvent.name,
        tagline: neonEvent.tagline,
        description: neonEvent.description,
        category: neonEvent.category as any,
        rules: neonEvent.rules,
        eligibility: neonEvent.eligibility,
        maxParticipants: neonEvent.maxParticipants,
        currentRegistrations: 0,
        date: neonEvent.date,
        time: neonEvent.time,
        venue: neonEvent.venue,
        registrationStatus: neonEvent.registrationStatus as any,
        iconName: neonEvent.iconName,
        createdAt: neonEvent.createdAt.toISOString(),
      };
      // Also sync to JSON DB
      db.createEvent(event);
      return NextResponse.json({ message: "Event created successfully", event }, { status: 201 });
    } catch (neonErr) {
      console.warn("Neon event create error, falling back to JSON:", neonErr);
    }

    // JSON-only fallback
    const newEvent: FestEvent = {
      id: eventId,
      name,
      tagline: tagline || "",
      description,
      category,
      rules: rulesList,
      eligibility: eligibility || "3rd & 4th Year CSE Students",
      maxParticipants: Number(maxParticipants) || 100,
      currentRegistrations: 0,
      date: date || "MARCH / APRIL 2026",
      time: time || "TO BE ANNOUNCED",
      venue: venue || "TO BE ANNOUNCED",
      registrationStatus,
      iconName: iconName || "Sparkles",
      createdAt: new Date().toISOString(),
    };
    db.createEvent(newEvent);
    return NextResponse.json({ message: "Event created successfully", event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
