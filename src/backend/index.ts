/**
 * ============================================================================
 * SAYONARA FEST - UNIFIED BACKEND MODULE
 * ============================================================================
 * This file groups, indexes, and re-exports all backend operations, database
 * methods, authentication helpers, schemas, and API definitions in one clean,
 * uncluttered location.
 *
 * If you encounter any database, API route, authentication, server-side, or
 * data synchronization error, locate the responsible handler here.
 * ============================================================================
 */

// 1. High-Performance Database Service & In-Memory Cache
export { db } from "@/lib/db";

// 2. Authentication, Password Cryptography, and Session Handlers
export {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
  getCurrentUser,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";

// 3. Shared TypeScript Models & Data Contracts
export * from "@/lib/types";

/**
 * Backend API Routes Directory Map
 * Quickly trace any backend server / API bug to the exact file:
 */
export const BACKEND_ROUTES_MAP = {
  auth: {
    login: "src/app/api/auth/login/route.ts",
    register: "src/app/api/auth/register/route.ts",
    logout: "src/app/api/auth/logout/route.ts",
    checkId: "src/app/api/auth/check-id/route.ts",
  },
  events: {
    listAndCreate: "src/app/api/events/route.ts",
    detailsAndUpdate: "src/app/api/events/[id]/route.ts",
    studentRegister: "src/app/api/events/[id]/register/route.ts",
  },
  memoriesVault: {
    listAndCreate: "src/app/api/memories/route.ts",
    deleteMemory: "src/app/api/memories/[id]/route.ts",
  },
  adminCouncil: {
    listAndCreate: "src/app/api/admin/coordinators/route.ts",
    removeCoordinator: "src/app/api/admin/coordinators/[id]/route.ts",
  },
  adminOps: {
    stats: "src/app/api/admin/stats/route.ts",
    students: "src/app/api/admin/students/route.ts",
    attendance: "src/app/api/admin/attendance/route.ts",
    qrVerify: "src/app/api/admin/verify/route.ts",
    bulkImport: "src/app/api/admin/import/route.ts",
    exportCsv: "src/app/api/admin/export/route.ts",
  },
  festSettings: "src/app/api/settings/route.ts",
  announcements: {
    listAndPost: "src/app/api/announcements/route.ts",
    deleteNotice: "src/app/api/announcements/[id]/route.ts",
  },
  contactDesk: "src/app/api/contact/route.ts",
  database: {
    localJsonDb: "data/sayonara-db.json",
    neonPrismaSchema: "prisma/schema.prisma",
    dbEngine: "src/lib/db.ts",
    seedScript: "scripts/seed_database.js",
    syncScript: "scripts/sync_data.js",
  },
} as const;

/**
 * Diagnostic helper to identify Backend server/database errors.
 */
export function isBackendError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const msg = (error as { message?: string }).message || "";
  return (
    msg.includes("prisma") ||
    msg.includes("database") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("500") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("JSON") ||
    msg.includes("bcrypt") ||
    msg.includes("JWT") ||
    msg.includes("NextResponse")
  );
}
