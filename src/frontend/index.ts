/**
 * ============================================================================
 * SAYONARA FEST - UNIFIED FRONTEND MODULE
 * ============================================================================
 * This file groups, indexes, and re-exports all frontend components, views,
 * UI layouts, and client-side modules in one clean, uncluttered location.
 *
 * If you encounter any frontend UI, styling, layout, or client error, locate
 * the responsible component in this index.
 * ============================================================================
 */

// 1. Core Navigation & Layouts
export { default as Navbar } from "@/components/Navbar";
export { default as Footer } from "@/components/Footer";
export { default as AnnouncementsBanner } from "@/components/AnnouncementsBanner";

// 2. Landing & Presentation Sections
export { default as HeroSection } from "@/components/HeroSection";
export { default as AboutSection } from "@/components/AboutSection";
export { default as CountdownTimer } from "@/components/CountdownTimer";
export { default as TeamSection } from "@/components/TeamSection";

// 3. Events & Timeline Components
export { default as EventsGrid } from "@/components/EventsGrid";
export { default as ScheduleTimeline } from "@/components/ScheduleTimeline";

// 4. Student & Administrative Portals
export { default as AdminDashboardTabs } from "@/components/AdminDashboardTabs";
export { default as QrCodeDisplay } from "@/components/QrCodeDisplay";
export { default as QrScannerModal } from "@/components/QrScannerModal";

// 5. Memory Vault & Visual Galleries (Photos & Videos)
export { default as GalleryGrid } from "@/components/GalleryGrid";

/**
 * Frontend Architecture Directory Map
 * Quickly trace any frontend bug to the exact file:
 */
export const FRONTEND_MAP = {
  landingPage: "src/app/page.tsx",
  auth: {
    loginView: "src/app/(auth)/login/page.tsx",
    registerView: "src/app/(auth)/register/page.tsx",
  },
  studentPortal: {
    dashboard: "src/app/dashboard/page.tsx",
    digitalPass: "src/app/pass/page.tsx",
  },
  adminPortal: {
    commandCenter: "src/app/admin/page.tsx",
    tabsManager: "src/components/AdminDashboardTabs.tsx",
    qrScanner: "src/components/QrScannerModal.tsx",
  },
  eventsAndSchedule: {
    eventsCatalog: "src/app/events/page.tsx",
    timeline: "src/app/schedule/page.tsx",
  },
  memoriesVault: {
    galleryPage: "src/app/gallery/page.tsx",
    mediaGrid: "src/components/GalleryGrid.tsx",
  },
  helpDesk: {
    contactPage: "src/app/contact/page.tsx",
  },
  styles: "src/app/globals.css",
} as const;

/**
 * Diagnostic helper to distinguish Frontend vs Backend errors.
 */
export function isFrontendError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const msg = (error as { message?: string }).message || "";
  return (
    msg.includes("React") ||
    msg.includes("Hydration") ||
    msg.includes("CSS") ||
    msg.includes("DOM") ||
    msg.includes("window is not defined") ||
    msg.includes("document is not defined")
  );
}
