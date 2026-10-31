import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Announcement } from "@/lib/types";

export async function GET() {
  try {
    const announcements = db.getAnnouncements();
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Get announcements error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, priority = "normal" } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      content: content.trim(),
      priority,
      createdAt: new Date().toISOString(),
    };

    db.createAnnouncement(newAnnouncement);

    return NextResponse.json({
      message: "Announcement broadcasted successfully",
      announcement: newAnnouncement,
    }, { status: 201 });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ error: "Failed to post announcement" }, { status: 500 });
  }
}
