import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { User, UserSession, StudentYear } from "./types";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "sayonara_cse_secret_super_secure_jwt_token_2026_key";
const COOKIE_NAME = "sayonara_session";

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(user: User): string {
  const payload: UserSession = {
    id: user.id,
    name: user.name,
    collegeId: user.collegeId,
    year: user.year,
    department: user.department,
    email: user.email,
    phone: user.phone,
    role: user.role,
    qrToken: user.qrToken,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setSessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
    60 * 60 * 24 * 7
  }`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/**
 * Validates CSE Department and Eligible Year
 */
export function validateEligibility(
  department: string,
  year: string
): { eligible: boolean; reason?: string } {
  const settings = db.getSettings();

  // Validate Department
  const deptNormalized = department.trim().toUpperCase();
  if (deptNormalized !== "CSE" && !deptNormalized.includes("COMPUTER SCIENCE")) {
    return {
      eligible: false,
      reason: "SAYONARA is strictly restricted to Computer Science & Engineering (CSE) students.",
    };
  }

  // Validate Year
  const eligibleYears = settings.eligibleYears || ["3rd Year", "4th Year"];
  if (!eligibleYears.includes(year as StudentYear)) {
    return {
      eligible: false,
      reason: `Only ${eligibleYears.join(" and ")} students are eligible to register for SAYONARA.`,
    };
  }

  return { eligible: true };
}

/**
 * Generates an unforgeable, clean QR entry token
 * E.g., SAY-21CS042-8K29P
 */
export function generateQrToken(collegeId: string): string {
  const cleanId = collegeId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SAY-${cleanId}-${randomSuffix}`;
}
