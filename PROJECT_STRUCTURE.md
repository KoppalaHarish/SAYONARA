# 📂 SAYONARA ARCHITECTURE: FRONTEND & BACKEND GROUPING GUIDE

To eliminate clumsiness and make locating any error instantaneous, the project files are cleanly segregated into two unified master modules: **`frontend`** and **`backend`**.

---

## 🎨 1. Frontend Grouping (`src/frontend/index.ts` / `frontend/index.ts`)
Everything related to the user interface, buttons, inputs, modals, animations, styles, and page layouts is indexed here.

### Where to Find Frontend Code & Debug UI Errors:
| UI Component / View | File Path | Description |
| :--- | :--- | :--- |
| **Unified Frontend Index** | `src/frontend/index.ts` | Single master file exporting all UI pieces |
| **Command Center & Tabs** | `src/components/AdminDashboardTabs.tsx` | Admin panel (Memories, Council, Students, etc.) |
| **Memories & Video Vault** | `src/components/GalleryGrid.tsx` | Video player, YouTube embed & photos grid |
| **Student Dashboard** | `src/app/dashboard/page.tsx` | Student portal home & memories view |
| **Authentication UI** | `src/app/(auth)/login/page.tsx`<br>`src/app/(auth)/register/page.tsx` | Fast login, 10-digit phone enforcement |
| **Hero & Countdown** | `src/components/HeroSection.tsx`<br>`src/components/CountdownTimer.tsx` | 2021-2027 batch tribute & CSE BLOCK venue |
| **Events & Schedule** | `src/components/EventsGrid.tsx`<br>`src/components/ScheduleTimeline.tsx` | Competitions and timelines |
| **Digital QR Pass** | `src/components/DigitalPassCard.tsx`<br>`src/components/QrCodeDisplay.tsx` | Real-time QR gate pass |
| **Camera Scanner Modal** | `src/components/QrScannerModal.tsx` | Gate camera verification |
| **Global Styles** | `src/app/globals.css` | Cyberpunk theme & custom glass panels |

---

## ⚙️ 2. Backend Grouping (`src/backend/index.ts` / `backend/index.ts`)
Everything related to server APIs, database queries, authentication sessions, passwords, and data sync is indexed here.

### Where to Find Backend Code & Debug API/DB Errors:
| Backend Service / Route | File Path | Description |
| :--- | :--- | :--- |
| **Unified Backend Index** | `src/backend/index.ts` | Single master file exporting all backend tools |
| **Database Engine & Cache** | `src/lib/db.ts` | Sub-millisecond in-memory cache & CRUD |
| **Auth & Cryptography** | `src/lib/auth.ts` | Password hashing, JWT session, roles |
| **Memories API** | `src/app/api/memories/route.ts`<br>`src/app/api/memories/[id]/route.ts` | Add/delete photos & videos |
| **Admin Council API** | `src/app/api/admin/coordinators/route.ts`<br>`src/app/api/admin/coordinators/[id]/route.ts` | Head Admin exclusive coordinator CRUD |
| **Auth Login / Register** | `src/app/api/auth/login/route.ts`<br>`src/app/api/auth/register/route.ts` | Ultra-fast login (<100ms) with 10-digit phone |
| **Fest Settings API** | `src/app/api/settings/route.ts` | Change date, venue, banner without rebuild |
| **Events & Registrations** | `src/app/api/events/route.ts`<br>`src/app/api/events/[id]/register/route.ts` | Registration slots & limits |
| **Admin Operations** | `src/app/api/admin/stats/route.ts`<br>`src/app/api/admin/verify/route.ts`<br>`src/app/api/admin/import/route.ts` | Gate scanner, stats, CSV exports |
| **Data Store (JSON + Neon)**| `data/sayonara-db.json`<br>`prisma/schema.prisma` | Dual local JSON cache & Neon PostgreSQL |
| **Sync Scripts** | `scripts/sync_data.js` | Bidirectional synchronization script |

---

## 🚀 How to Import:
Instead of remembering dozens of paths, you can import directly:
```typescript
// Any frontend component:
import { AdminDashboardTabs, GalleryGrid, Navbar } from "@/frontend";

// Any backend service:
import { db, getCurrentUser, hashPassword } from "@/backend";
```
