import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required to scan entry passes." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { token, verifierName } = body;

    if (!token) {
      return NextResponse.json({ error: "QR token or College ID is required" }, { status: 400 });
    }

    const result = db.verifyAndCheckIn(token, verifierName || user.name || "Admin Scanner");

    return NextResponse.json(result);
  } catch (error) {
    console.error("QR verification error:", error);
    return NextResponse.json({ error: "Failed to verify QR pass" }, { status: 500 });
  }
}
