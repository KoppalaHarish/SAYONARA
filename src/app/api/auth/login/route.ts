import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "College ID / Email and Password are required." },
        { status: 400 }
      );
    }

    const trimmed = identifier.trim();
    const cleanDigits = trimmed.replace(/\D/g, "");

    // 1. Fast In-Memory DB lookup (sub-millisecond)
    let user = db.getUserByCollegeId(trimmed);
    if (!user) {
      user = db.getUserByEmail(trimmed);
    }
    if (!user && cleanDigits.length === 10) {
      const candidates = db.getUsersByPhone(cleanDigits);
      for (const cand of candidates) {
        if (comparePassword(password, cand.passwordHash)) {
          user = cand;
          break;
        }
      }
      if (!user && candidates.length > 0) {
        user = candidates[0];
      }
    }

    // 2. Fallback: check Neon PostgreSQL if not found in local DB (with fast timeout)
    if (!user) {
      try {
        const neonPromise = prisma.user.findFirst({
          where: {
            OR: [
              { collegeId: { equals: trimmed, mode: "insensitive" } },
              { email: { equals: trimmed, mode: "insensitive" } },
              ...(cleanDigits.length === 10 ? [{ phone: { contains: cleanDigits } }] : []),
            ],
          },
        });
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 1200)
        );
        const neonUser = await Promise.race([neonPromise, timeoutPromise]);

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
          // Persist to local JSON DB
          db.createUser(user);
        }
      } catch (err) {
        console.warn("Neon fallback check failed during login:", err);
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "No account found matching this College ID, Email, or Mobile Number." },
        { status: 401 }
      );
    }

    const isValid = comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password credentials. Please try again." },
        { status: 401 }
      );
    }

    const token = signToken(user);

    const response = NextResponse.json({
      message: "Login successful!",
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
    });

    response.headers.set("Set-Cookie", setSessionCookie(token));
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
