import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, collegeId, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please provide your name, email, subject, and message." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const saved = db.saveMessage({
      name: name.trim(),
      collegeId: collegeId ? collegeId.trim() : undefined,
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        message: "Your message has been received! The organizing desk will follow up shortly.",
        id: saved.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const messages = db.getMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Fetch contact messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact inquiries." },
      { status: 500 }
    );
  }
}
