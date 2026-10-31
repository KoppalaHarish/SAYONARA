# SAYONARA — CSE FAREWELL FEST PLATFORM
### *A farewell experience built by CSE, for CSE.*

Welcome to **SAYONARA**, a college farewell festival web platform engineered specifically for the **Department of Computer Science & Engineering (CSE)**.

---

## 1. Architectural Overview

```
                         ┌────────────────────────────────────────────────────────┐
                         │                    NEXT.JS APP ROUTER                  │
                         │              React 19 • TypeScript • Tailwind 4        │
                         └───────────────────────────┬────────────────────────────┘
                                                     │
         ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
         │                                           │                                           │
         ▼                                           ▼                                           ▼
┌──────────────────┐                       ┌──────────────────┐                        ┌──────────────────┐
│   PUBLIC PAGES   │                       │ STUDENT DASHBOARD│                        │  ADMIN DASHBOARD │
│ • Hero / Countdown│                      │ • Profile Card   │                        │ • KPI Analytics  │
│ • About SAYONARA │                       │ • QR Pass View   │                        │ • Student Mgmt   │
│ • Events Arenas  │                       │ • My Events      │                        │ • Event Creator  │
│ • Schedule Phase │                       │ • Gate Status    │                        │ • QR Gate Scanner│
│ • Memory Gallery │                       │ • Announcements  │                        │ • Attendance Log │
│ • Team & Contact │                       │ • Print/Download │                        │ • Fest Settings  │
└──────────────────┘                       └──────────────────┘                        └──────────────────┘
         │                                           │                                           │
         └───────────────────────────────────────────┼───────────────────────────────────────────┘
                                                     │
                                                     ▼
                                       ┌───────────────────────────┐
                                       │       REST API ROUTES     │
                                       │ • /api/auth/*             │
                                       │ • /api/events/*           │
                                       │ • /api/verify-qr          │
                                       │ • /api/admin/*            │
                                       │ • /api/settings           │
                                       │ • /api/announcements      │
                                       └─────────────┬─────────────┘
                                                     │
                                                     ▼
                                       ┌───────────────────────────┐
                                       │     PERSISTENCE LAYER     │
                                       │ • Embedded JSON DB (Local)│
                                       │ • Prisma + PostgreSQL     │
                                       └───────────────────────────┘
```

---

## 2. Directory Structure

```
sayonara/
├── data/
│   └── sayonara-db.json            # Persistent JSON database (auto-seeded)
├── prisma/
│   └── schema.prisma               # Production PostgreSQL Prisma schema
├── public/                         # Public assets & icons
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      # Student & Admin authentication
│   │   │   └── register/page.tsx   # CSE eligibility registration (3rd/4th Year)
│   │   ├── admin/page.tsx          # Protected Admin Command Center
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── attendance/     # Attendance log API
│   │   │   │   ├── export/         # CSV data exporter
│   │   │   │   ├── stats/          # KPI analytics & metrics API
│   │   │   │   └── students/       # Student directory API
│   │   │   ├── announcements/      # Announcement management & broadcast
│   │   │   ├── auth/
│   │   │   │   ├── login/          # Password verification & session cookie
│   │   │   │   ├── logout/         # Session invalidation
│   │   │   │   ├── me/             # Current user profile & pass status
│   │   │   │   └── register/       # College ID validation & QR generation
│   │   │   ├── events/             # CRUD events & student enrollment
│   │   │   ├── settings/           # Dynamic fest date, venue & status
│   │   │   └── verify-qr/          # Gate scanner verification & check-in
│   │   ├── contact/page.tsx        # Department desk & inquiry form
│   │   ├── dashboard/page.tsx      # Student Dashboard & digital pass
│   │   ├── events/page.tsx         # Fest arenas & 1-click registration
│   │   ├── gallery/page.tsx        # Memory vault with image modal
│   │   ├── pass/page.tsx           # Full-screen QR ticket with print/download
│   │   ├── schedule/page.tsx       # Chronological festival sequence
│   │   ├── team/page.tsx           # Faculty, student leads & tech team
│   │   ├── globals.css             # Cyberpunk/glassmorphism design system
│   │   ├── layout.tsx              # SEO metadata, Navbar & Footer
│   │   └── page.tsx                # High-impact landing page
│   ├── components/
│   │   ├── AboutSection.tsx        # Emotional + energetic farewell story
│   │   ├── AdminDashboardTabs.tsx  # Multi-tab admin control panel
│   │   ├── AnnouncementsBanner.tsx # Live broadcast banner & dialog
│   │   ├── CountdownTimer.tsx      # Configurable placeholder & live countdown
│   │   ├── EventsGrid.tsx          # Category filter, rules modal & enrollment
│   │   ├── Footer.tsx              # Department branding & quick links
│   │   ├── GalleryGrid.tsx         # Media showcase with zoom preview
│   │   ├── HeroSection.tsx         # Cyber-visual hero with dynamic badges
│   │   ├── Navbar.tsx              # Responsive navigation with session state
│   │   ├── QrCodeDisplay.tsx       # High-res SVG/Canvas QR pass generator
│   │   ├── QrScannerModal.tsx      # Camera scanner & duplicate check-in guard
│   │   ├── ScheduleTimeline.tsx    # Responsive timeline
│   │   └── TeamSection.tsx         # Organizers & faculty showcase
│   └── lib/
│       ├── auth.ts                 # JWT, bcrypt, eligibility checks
│       ├── db.ts                   # Thread-safe database abstraction & seed data
│       ├── types.ts                # TypeScript interfaces
│       └── utils.ts                # General utilities
├── .env.example                    # Environment variable documentation
├── .env.local                      # Local development runtime variables
└── package.json
```

---

## 3. Key Features

### 🎓 1. Restricted Eligibility (CSE 3rd & 4th Year Only)
* **Department Filter**: Only students from **Computer Science & Engineering (CSE)** can register. Other departments are automatically rejected.
* **Batch Filter**: Strictly restricted to **3rd Year (Juniors)** and **4th Year (Graduating Seniors)**.
* **Duplicate College ID Prevention**: Prevents multiple accounts under the same student roll number.

### 🎫 2. Cryptographic Digital QR Entry Pass
* Every registered student is provisioned a unique unforgeable QR Token (e.g. `SAY-21CS042-7X89Q`).
* **Zero Security Leakage**: Passwords, hashes, and sensitive personal information are **never** encoded in the QR code.
* Features **Download Pass** (PNG) and **Print Ticket** buttons.

### 📷 3. Gate Entry QR Scanner & Anti-Duplicate Check-in
* **Camera Scanning**: Uses `html5-qrcode` to scan phone screens and printed tickets live at event gates.
* **Manual Input Fallback**: Organizers can type College ID or token directly for fast check-in.
* **Instant Verification States**:
  - `✓ ENTRY VERIFIED`: Confirms first-time entry, records check-in timestamp and gate officer, triggers celebratory confetti.
  - `⚠ ALREADY CHECKED IN`: Displays previous check-in time to stop unauthorized re-entry.
  - `✖ PASS INVALID`: Warns if an unregistered token is scanned.

### ⚙️ 4. Dynamic Fest Placeholders & Admin Settings
* Since the exact date and venue are not yet finalized, they are editable on the fly from the Admin Panel:
  - Default Date: `COMING SOON (MARCH / APRIL 2026)`
  - Default Venue: `TO BE ANNOUNCED (COLLEGE AUDITORIUM & TECH CAMPUS)`
  - Registration Status: `OPEN` or `CLOSED` toggle
* Any update immediately synchronizes across the Hero Section, Pass, and Event badges without code changes.

### 📊 5. Comprehensive Admin Command Center
* **Live KPI Metrics**: Total students, 3rd vs 4th-year ratio, event enrollments, total checked-in turnout.
* **Student Directory**: Search by name or College ID, filter by year, delete registrations, export to CSV.
* **Event Manager**: Add new arenas, set max participant caps, update rules, and toggle registration status.
* **Attendance Log**: Full audit trail of verified entries with timestamps.
* **Announcements System**: Broadcast priority alerts directly to student dashboards.

---

## 4. Default Seed Credentials

### 🛡️ Admin Account (Organizer Portal)
* **College ID**: `CSE-ADMIN`
* **Email**: `admin@sayonara.cse`
* **Password**: `Admin@Sayonara2026`
* **Access Route**: `/login` or `/admin`

### 👨‍🎓 Pre-registered Sample Students
1. **Rahul Sharma** (4th Year Senior):
   - **College ID**: `21CS042`
   - **Password**: `Student@123`
2. **Ananya Iyer** (3rd Year Junior):
   - **College ID**: `22CS015`
   - **Password**: `Student@123`
3. **Vikram Patel** (4th Year Senior - Checked In):
   - **College ID**: `21CS089`
   - **Password**: `Student@123`

---

## 5. Local Setup & Running Instructions

### Prerequisites
* Node.js v18+ (tested on Node v24.19)
* npm v9+

### Step-by-Step

1. **Clone or navigate to the directory**:
   ```bash
   cd c:\Users\knave\Downloads\sayonara
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify environment variables**:
   Ensure `.env.local` exists (created automatically from `.env.example`):
   ```env
   JWT_SECRET=sayonara_cse_secret_super_secure_jwt_token_2026_key
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser to: **`http://localhost:3000`**

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 6. Automated Testing & Verification

A dedicated end-to-end verification script is included in `test_sayonara.js`. Run:
```bash
node test_sayonara.js
```
This script tests 25 critical paths including:
- 3rd & 4th-year CSE registration
- Rejection of non-CSE departments and unauthorized years
- Duplicate College ID rejection
- Event enrollment & unenrollment
- QR token verification & gate check-in
- Duplicate scan prevention
- Dynamic settings updates

---

## 7. Production PostgreSQL Deployment (Optional)

While SAYONARA includes a zero-config, persistent storage engine out of the box, it is also fully equipped with a production Prisma schema for PostgreSQL:

1. In `.env.local`, set your database connection:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sayonara_db?schema=public"
   ```
2. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Deploy to Vercel, AWS, or Railway using `npm run build`.

---

© 2026 Department of Computer Science & Engineering. All rights reserved.
