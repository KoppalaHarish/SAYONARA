import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  generateQrToken,
  signToken,
  setSessionCookie,
} from "@/lib/auth";
import { User } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      collegeId,
      email,
      phone,
      password,
      confirmPassword,
    } = body;

    // Check if fest registration is open
    const settings = db.getSettings();
    if (!settings.registrationOpen) {
      return NextResponse.json(
        { error: "Registrations for SAYONARA are currently closed by administration." },
        { status: 403 }
      );
    }

    // Required fields check
    if (!name || !collegeId || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All registration fields are required." },
        { status: 400 }
      );
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Mobile number validation (strictly 10 digits)
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Mobile number must be exactly 10 digits (e.g. 7842439105)." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // ── CORE VALIDATION: Check against Neon EligibleStudent table ──
    const formattedCollegeId = collegeId.trim().toUpperCase();
    const formattedName = name.trim().toUpperCase();

    let eligibleRecord;
    try {
      eligibleRecord = await prisma.eligibleStudent.findUnique({
        where: { collegeId: formattedCollegeId },
      });
    } catch (dbErr) {
      console.error("Neon DB lookup error, falling back to JSON:", dbErr);
      // Fallback: check local JSON eligibleStudents roster
      const jsonData = db.getEligibleStudents();
      const match = jsonData.find(
        (s) => s.collegeId.toUpperCase() === formattedCollegeId
      );
      eligibleRecord = match || null;
    }

    if (!eligibleRecord) {
      return NextResponse.json(
        {
          error: `College ID "${formattedCollegeId}" is not on the authorized SAYONARA attendee list. Only registered CSE students from the 6-year integrated program (4th Year 2021-2027 Seniors & 3rd Year 2022-2028 Juniors) can access this platform.`,
        },
        { status: 403 }
      );
    }

    // Verify name matches (case-insensitive, trimmed)
    const dbName = eligibleRecord.name.trim().toUpperCase();
    // Allow partial match — student's submitted name must be contained in DB name or vice versa
    const nameMatches =
      dbName === formattedName ||
      dbName.includes(formattedName) ||
      formattedName.includes(dbName) ||
      // Allow first name only match
      dbName.startsWith(formattedName.split(" ")[0]) ||
      formattedName.startsWith(dbName.split(" ")[0]);

    if (!nameMatches) {
      return NextResponse.json(
        {
          error: `The name you entered does not match the name registered for College ID "${formattedCollegeId}". Please enter your exact name as per college records.`,
        },
        { status: 403 }
      );
    }

    // Determine year: prioritize submitted dropdown selection if valid, else DB record
    const year = (body.year === "4th Year" || body.year === "3rd Year")
      ? body.year
      : (eligibleRecord.year || "4th Year");

    // Duplicate College ID check
    const existingCollegeId = db.getUserByCollegeId(formattedCollegeId);
    if (existingCollegeId) {
      return NextResponse.json(
        {
          error: `College ID "${formattedCollegeId}" is already registered. Please login instead.`,
        },
        { status: 409 }
      );
    }

    // Also check Neon Users table
    try {
      const neonExisting = await prisma.user.findUnique({
        where: { collegeId: formattedCollegeId },
      });
      if (neonExisting) {
        return NextResponse.json(
          {
            error: `College ID "${formattedCollegeId}" is already registered. Please login instead.`,
          },
          { status: 409 }
        );
      }
    } catch {
      // Non-fatal: continue with JSON DB
    }

    // Duplicate Email check
    const existingEmail = db.getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "A registration with this email address already exists." },
        { status: 409 }
      );
    }

    // Create secure user — use the canonical name from the database
    const newUser: User = {
      id: `usr_std_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: eligibleRecord.name.trim(), // Use DB name (canonical)
      collegeId: formattedCollegeId,
      year: year as any,
      department: "CSE",
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      passwordHash: hashPassword(password),
      role: "student",
      qrToken: generateQrToken(formattedCollegeId),
      createdAt: new Date().toISOString(),
    };

    // Save to local JSON DB
    db.createUser(newUser);

    // Also save to Neon PostgreSQL
    try {
      await prisma.user.create({
        data: {
          id: newUser.id,
          name: newUser.name,
          collegeId: newUser.collegeId,
          year: newUser.year,
          department: newUser.department,
          email: newUser.email,
          phone: newUser.phone,
          passwordHash: newUser.passwordHash,
          role: newUser.role,
          qrToken: newUser.qrToken,
        },
      });

      // Mark student as registered in EligibleStudent
      await prisma.eligibleStudent.update({
        where: { collegeId: formattedCollegeId },
        data: { isRegistered: true },
      });
    } catch (neonErr) {
      console.warn("Neon write error (non-fatal):", neonErr);
    }

    // Sign session token
    const token = signToken(newUser);

    const response = NextResponse.json(
      {
        message: `Welcome to SAYONARA 2026, ${newUser.name}! Your QR pass has been generated.`,
        user: {
          id: newUser.id,
          name: newUser.name,
          collegeId: newUser.collegeId,
          year: newUser.year,
          department: newUser.department,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          qrToken: newUser.qrToken,
        },
      },
      { status: 201 }
    );

    response.headers.set("Set-Cookie", setSessionCookie(token));
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
