import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  User,
  FestEvent,
  EventRegistration,
  AttendanceRecord,
  Announcement,
  FestSettings,
  TeamMember,
  GalleryItem,
  ContactMessage,
  EligibleStudentRecord,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "sayonara-db.json");

interface DatabaseSchema {
  users: User[];
  events: FestEvent[];
  eventRegistrations: EventRegistration[];
  attendance: AttendanceRecord[];
  announcements: Announcement[];
  settings: FestSettings;
  team: TeamMember[];
  gallery: GalleryItem[];
  messages?: ContactMessage[];
  eligibleStudents?: EligibleStudentRecord[];
}

function getInitialData(): DatabaseSchema {
  // Hash for 'Admin@Sayonara2026'
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync("Admin@Sayonara2026", salt);
  const sampleStudentHash = bcrypt.hashSync("Student@123", salt);

  return {
    users: [
      {
        id: "usr_admin_001",
        name: "CSE Head Coordinator",
        collegeId: "CSE-ADMIN",
        year: "4th Year",
        department: "CSE",
        email: "admin@sayonara.cse",
        phone: "+91 98765 43210",
        passwordHash: adminPasswordHash,
        role: "admin",
        qrToken: "SAY-ADM-998811",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_std_001",
        name: "Rahul Sharma",
        collegeId: "21CS042",
        year: "4th Year",
        department: "CSE",
        email: "rahul.21cs042@college.edu",
        phone: "+91 91234 56780",
        passwordHash: sampleStudentHash,
        role: "student",
        qrToken: "SAY-21CS042-7X89Q",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "usr_std_002",
        name: "Ananya Iyer",
        collegeId: "22CS015",
        year: "3rd Year",
        department: "CSE",
        email: "ananya.22cs015@college.edu",
        phone: "+91 92345 67891",
        passwordHash: sampleStudentHash,
        role: "student",
        qrToken: "SAY-22CS015-3M41P",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: "usr_std_003",
        name: "Vikram Patel",
        collegeId: "21CS089",
        year: "4th Year",
        department: "CSE",
        email: "vikram.21cs089@college.edu",
        phone: "+91 93456 78912",
        passwordHash: sampleStudentHash,
        role: "student",
        qrToken: "SAY-21CS089-9B22Z",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
    events: [
      {
        id: "evt_001",
        name: "Terminal Velocity: Farewell Code-Off",
        tagline: "The Ultimate 3-Hour Algorithm & Speed Battle",
        description:
          "Juniors challenge seniors in a thrilling competitive programming sprint. Dynamic problem sets spanning graphs, DP, and reverse engineering with live leaderboard projection.",
        category: "Technical",
        rules: [
          "Individual participation or duo teams.",
          "Allowed languages: C++, Python, Java, Go, Rust.",
          "Live test-case evaluation on local platform.",
          "Top 3 scorers receive bespoke trophy and cash awards."
        ],
        eligibility: "3rd & 4th Year CSE Students",
        maxParticipants: 60,
        currentRegistrations: 24,
        date: "20 MARCH 2027",
        time: "10:30 AM - 01:30 PM",
        venue: "CSE BLOCK",
        registrationStatus: "OPEN",
        iconName: "Code2",
        createdAt: new Date().toISOString(),
      },
      {
        id: "evt_002",
        name: "Retro-Byte: CSE Nostalgia & Roast Stage",
        tagline: "Memories, Campus Confessions & Uncensored Humour",
        description:
          "From surviving viva disasters to late night campus canteen sessions, share heartfelt tributes, roast your favorite batchmates, and celebrate our journey.",
        category: "Ceremony",
        rules: [
          "Open mic slots limited to 5 minutes per speaker.",
          "Respectful college humor; no personal defamation.",
          "Faculty dedications welcome."
        ],
        eligibility: "3rd & 4th Year B.Tech CSE Students",
        maxParticipants: 150,
        currentRegistrations: 42,
        date: "20 MARCH 2027",
        time: "02:30 PM - 04:30 PM",
        venue: "CSE BLOCK",
        registrationStatus: "OPEN",
        iconName: "Sparkles",
        createdAt: new Date().toISOString(),
      },
      {
        id: "evt_003",
        name: "LAN Apocalypse: Valorant & BGMI Cup",
        tagline: "High-Octane Esports Showdown",
        description:
          "The annual seniors vs. juniors LAN clash. 5v5 custom lobbies with live shoutcasting on the big auditorium screen.",
        category: "Gaming",
        rules: [
          "Valorant: 5 Players + 1 Sub per squad.",
          "BGMI: 4 Players squad in custom room.",
          "Standard competitive tournament rulebook applies."
        ],
        eligibility: "CSE 3rd & 4th Year B.Tech Only",
        maxParticipants: 80,
        currentRegistrations: 40,
        date: "20 MARCH 2027",
        time: "11:00 AM - 04:00 PM",
        venue: "CSE BLOCK",
        registrationStatus: "FILLING_FAST",
        iconName: "Gamepad2",
        createdAt: new Date().toISOString(),
      },
      {
        id: "evt_004",
        name: "Synapse Beats: Cultural Band & Dance",
        tagline: "Electrifying Performances & Live Acoustics",
        description:
          "Performances curated by CSE talent: rock acoustics, hip-hop crews, fusion dance, and solo vocals lighting up the evening.",
        category: "Cultural",
        rules: [
          "Group performances: max 8 participants.",
          "Music tracks must be submitted 24h in advance.",
          "Stage time: 6-10 minutes."
        ],
        eligibility: "CSE Students",
        maxParticipants: 100,
        currentRegistrations: 18,
        date: "20 MARCH 2027",
        time: "05:00 PM - 07:30 PM",
        venue: "CSE BLOCK",
        registrationStatus: "OPEN",
        iconName: "Music",
        createdAt: new Date().toISOString(),
      },
      {
        id: "evt_005",
        name: "Hall of Fame: Senior Awards & Memento Gala",
        tagline: "Honoring the 2021-2027 Graduating CSE Batch (6-Year Integrated)",
        description:
          "Prestigious memento distribution for all graduating seniors (2021-2027 batch), celebrating their complete 6-year journey (2 years PUC + 4 years B.Tech), batch superlative announcements, and grand farewell photo sessions.",
        category: "Ceremony",
        rules: [
          "Formal / Ethnic dress code recommended.",
          "Entry strictly verified with Digital QR Entry Pass.",
          "Every graduating 2021-2027 CSE senior receives a custom 6-year farewell souvenir."
        ],
        eligibility: "Compulsory for all 4th Year B.Tech CSE (2021-2027 Batch)",
        maxParticipants: 200,
        currentRegistrations: 85,
        date: "20 MARCH 2027",
        time: "07:30 PM - 09:30 PM",
        venue: "CSE BLOCK",
        registrationStatus: "OPEN",
        iconName: "Award",
        createdAt: new Date().toISOString(),
      },
      {
        id: "evt_006",
        name: "Cipher Hunt: The CSE Mystery Trail",
        tagline: "Decode Ciphers, Follow Hashes, Unlock The Vault",
        description:
          "A campus-wide tech treasure hunt. Clues hidden behind QR codes, steganography images, and terminal challenges across the engineering block.",
        category: "Fun",
        rules: [
          "Teams of 2 to 3 students.",
          "Smartphones with internet required.",
          "First team to unlock the master key wins."
        ],
        eligibility: "3rd & 4th Year B.Tech CSE",
        maxParticipants: 60,
        currentRegistrations: 28,
        date: "20 MARCH 2027",
        time: "01:00 PM - 03:00 PM",
        venue: "CSE BLOCK",
        registrationStatus: "OPEN",
        iconName: "Compass",
        createdAt: new Date().toISOString(),
      },
    ],
    eventRegistrations: [
      {
        id: "ereg_001",
        studentId: "usr_std_001",
        eventId: "evt_001",
        registeredAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "ereg_002",
        studentId: "usr_std_001",
        eventId: "evt_005",
        registeredAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "ereg_003",
        studentId: "usr_std_002",
        eventId: "evt_003",
        registeredAt: new Date().toISOString(),
      },
    ],
    attendance: [
      {
        id: "att_001",
        studentId: "usr_std_003",
        collegeId: "21CS089",
        studentName: "Vikram Patel",
        year: "4th Year",
        department: "CSE",
        qrToken: "SAY-21CS089-9B22Z",
        checkedIn: true,
        checkedInAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        verifiedBy: "Gate Coordinator 1",
      },
    ],
    announcements: [
      {
        id: "ann_001",
        title: "Registration Portal Is Live for 3rd & 4th Year CSE!",
        content:
          "Welcome to SAYONARA 2026! Register with your College ID to generate your secure Digital QR Entry Pass. Pass is mandatory for entry and memento collection.",
        priority: "urgent",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "ann_002",
        title: "Venue & Final Date Announcement Notice",
        content:
          "The dates are being finalized by the CSE Department council between late March and early April. Stay tuned for the official countdown release!",
        priority: "normal",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "ann_003",
        title: "Calling All Artists & Performers for Synapse Beats",
        content:
          "Solo vocalists, rock bands, and dance crews can submit audition tracks through the Events page by registering under Synapse Beats.",
        priority: "event",
        createdAt: new Date().toISOString(),
      },
    ],
    settings: {
      festName: "SAYONARA",
      subtitle: "CSE FAREWELL FEST",
      tagline: "A farewell experience built by CSE, for CSE. Celebrating 6 years: 2 years PUC & 4 years B.Tech.",
      department: "Computer Science & Engineering",
      eventDate: "20 MARCH 2027",
      venue: "CSE BLOCK",
      registrationOpen: true,
      eligibleYears: ["3rd Year", "4th Year"],
      contactEmail: "rhariesh1@gmail.com",
      contactPhone: "+91 7842439105",
      heroNotice: "Official Registrations Open • 6-Year Integrated B.Tech • CSE BLOCK",
      bannerMessage: "CELEBRATING 2021-2027 BATCH (6 YEARS: 2 YRS PUC + 4 YRS B.TECH) • CSE BLOCK • 20 MARCH 2027",
    },
    team: [
      {
        id: "team_001",
        name: "Dr. K. S. Ramanathan",
        role: "Head of Department, CSE",
        category: "Faculty Coordinator",
        department: "CSE",
        contact: "hod.cse@college.edu",
      },
      {
        id: "team_002",
        name: "Prof. Meera Vasudevan",
        role: "Faculty Staff Advisor",
        category: "Faculty Coordinator",
        department: "CSE",
        contact: "meera.cse@college.edu",
      },
      {
        id: "team_003",
        name: "Aakash Nambiar",
        role: "Student Lead (4th Year B.Tech / 2021-2027)",
        category: "Student Lead",
        department: "CSE",
        contact: "+91 98111 22334",
      },
      {
        id: "team_004",
        name: "Sanya Roy",
        role: "Event Co-Lead (3rd Year B.Tech / 2022-2028)",
        category: "Student Lead",
        department: "CSE",
        contact: "+91 98222 33445",
      },
      {
        id: "team_005",
        name: "Devanshu Mehta",
        role: "Tech Lead & System Architect",
        category: "Technical Team",
        department: "CSE",
        contact: "tech.sayonara@college.edu",
      },
      {
        id: "team_006",
        name: "Pooja Hegde",
        role: "Creative & Visual Design Lead",
        category: "Creative & Media",
        department: "CSE",
        contact: "design.sayonara@college.edu",
      },
    ],
    gallery: [
      {
        id: "gal_001",
        title: "Midnight Hackathon Hustle",
        category: "Hackathons",
        year: "2025",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        description: "Late night debugging, endless caffeine, and winning software demos.",
      },
      {
        id: "gal_002",
        title: "Farewell Gala Senior Smiles",
        category: "Farewell",
        year: "2025",
        imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
        description: "Capturing tears, hugs, and memories to cherish forever.",
      },
      {
        id: "gal_003",
        title: "Auditorium Live Band & Beats",
        category: "Cultural",
        year: "2025",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        description: "Crowd screaming, stage lights ablaze, unforgettable college concert.",
      },
      {
        id: "gal_004",
        title: "Robotics & AI Symposium",
        category: "Tech",
        year: "2024",
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        description: "Showcasing student research, drones, and machine learning models.",
      },
      {
        id: "gal_005",
        title: "CSE Department Group Portrait",
        category: "Farewell",
        year: "2025",
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
        description: "Graduates celebrating the culmination of 6 years (2 years PUC + 4 years B.Tech).",
      },
      {
        id: "gal_006",
        title: "LAN Gaming Esports Champions",
        category: "Gaming",
        year: "2025",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        description: "The grand finals of inter-batch competitive gaming tournament.",
      },
    ],
  };
}

// In-memory cache for ultra-fast sub-millisecond database reads
let cachedDb: DatabaseSchema | null = null;
let lastMtime: number = 0;

// Thread-safe read/write helper with memory caching
function readDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    cachedDb = initial;
    return initial;
  }

  try {
    const stat = fs.statSync(DB_FILE);
    if (cachedDb && stat.mtimeMs === lastMtime) {
      return cachedDb;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    cachedDb = JSON.parse(content) as DatabaseSchema;
    lastMtime = stat.mtimeMs;
    return cachedDb;
  } catch (error) {
    if (cachedDb) return cachedDb;
    console.error("Error reading database file, reinitializing:", error);
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    cachedDb = initial;
    return initial;
  }
}

function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  cachedDb = data;
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  try {
    lastMtime = fs.statSync(DB_FILE).mtimeMs;
  } catch {
    // Ignore stat error
  }
}

// Database Service Interface
export const db = {
  // Users
  getUsers: (): User[] => readDb().users,
  getUserById: (id: string): User | undefined => readDb().users.find((u) => u.id === id),
  getUserByCollegeId: (collegeId: string): User | undefined => {
    const cid = collegeId.trim().toUpperCase();
    return readDb().users.find((u) => u.collegeId.toUpperCase() === cid);
  },
  getUserByEmail: (email: string): User | undefined => {
    const em = email.trim().toLowerCase();
    return readDb().users.find((u) => u.email.toLowerCase() === em);
  },
  getUserByPhone: (phone: string): User | undefined => {
    const clean = phone.replace(/\D/g, "");
    if (!clean) return undefined;
    return readDb().users.find((u) => u.phone.replace(/\D/g, "").endsWith(clean) || clean.endsWith(u.phone.replace(/\D/g, "")));
  },
  getUsersByPhone: (phone: string): User[] => {
    const clean = phone.replace(/\D/g, "");
    if (!clean) return [];
    return readDb().users.filter((u) => u.phone.replace(/\D/g, "").endsWith(clean) || clean.endsWith(u.phone.replace(/\D/g, "")));
  },
  getUserByQrToken: (qrToken: string): User | undefined => {
    const tok = qrToken.trim();
    return readDb().users.find((u) => u.qrToken === tok);
  },
  createUser: (user: User): User => {
    const data = readDb();
    data.users.push(user);
    writeDb(data);
    return user;
  },
  bulkImportStudents: (
    students: Array<{
      name: string;
      collegeId: string;
      year?: "3rd Year" | "4th Year";
      department?: string;
      email?: string;
      phone?: string;
      password?: string;
    }>
  ): { imported: number; skipped: number; total: number } => {
    const data = readDb();
    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync("Student@123", salt);
    let imported = 0;
    let skipped = 0;

    for (const item of students) {
      const cid = item.collegeId?.trim().toUpperCase();
      if (!cid || !item.name?.trim()) {
        skipped++;
        continue;
      }

      // Check if already exists
      const exists = data.users.some((u) => u.collegeId.toUpperCase() === cid);
      if (exists) {
        skipped++;
        continue;
      }

      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const qrToken = `SAY-${cid.replace(/[^a-zA-Z0-9]/g, "")}-${randomSuffix}`;
      const passwordHash = item.password
        ? bcrypt.hashSync(item.password, salt)
        : defaultPasswordHash;

      const newUser: User = {
        id: `usr_std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: item.name.trim(),
        collegeId: cid,
        year: item.year || "4th Year",
        department: item.department?.trim() || "CSE",
        email: item.email?.trim().toLowerCase() || `${cid.toLowerCase()}@college.edu`,
        phone: item.phone?.trim() || "+91 00000 00000",
        passwordHash,
        role: "student",
        qrToken,
        createdAt: new Date().toISOString(),
      };

      data.users.push(newUser);
      imported++;
    }

    writeDb(data);
    return {
      imported,
      skipped,
      total: data.users.filter((u) => u.role === "student").length,
    };
  },

  deleteUser: (id: string): boolean => {
    const data = readDb();
    const prevLen = data.users.length;
    data.users = data.users.filter((u) => u.id !== id);
    data.eventRegistrations = data.eventRegistrations.filter((r) => r.studentId !== id);
    data.attendance = data.attendance.filter((a) => a.studentId !== id);
    writeDb(data);
    return data.users.length < prevLen;
  },

  // Events
  getEvents: (): FestEvent[] => {
    const data = readDb();
    // compute dynamic registration count
    return data.events.map((e) => {
      const count = data.eventRegistrations.filter((r) => r.eventId === e.id).length;
      return {
        ...e,
        currentRegistrations: count,
      };
    });
  },
  getEventById: (id: string): FestEvent | undefined => {
    const data = readDb();
    const event = data.events.find((e) => e.id === id);
    if (!event) return undefined;
    const count = data.eventRegistrations.filter((r) => r.eventId === id).length;
    return { ...event, currentRegistrations: count };
  },
  createEvent: (event: FestEvent): FestEvent => {
    const data = readDb();
    data.events.push(event);
    writeDb(data);
    return event;
  },
  updateEvent: (id: string, updates: Partial<FestEvent>): FestEvent | null => {
    const data = readDb();
    const idx = data.events.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    data.events[idx] = { ...data.events[idx], ...updates };
    writeDb(data);
    return data.events[idx];
  },
  deleteEvent: (id: string): boolean => {
    const data = readDb();
    const prevLen = data.events.length;
    data.events = data.events.filter((e) => e.id !== id);
    data.eventRegistrations = data.eventRegistrations.filter((r) => r.eventId !== id);
    writeDb(data);
    return data.events.length < prevLen;
  },

  // Event Registrations
  getEventRegistrations: (): EventRegistration[] => readDb().eventRegistrations,
  getStudentEventRegistrations: (studentId: string): string[] => {
    return readDb()
      .eventRegistrations.filter((r) => r.studentId === studentId)
      .map((r) => r.eventId);
  },
  registerForEvent: (studentId: string, eventId: string): { success: boolean; message: string } => {
    const data = readDb();
    const event = data.events.find((e) => e.id === eventId);
    if (!event) return { success: false, message: "Event not found" };

    if (event.registrationStatus === "CLOSED") {
      return { success: false, message: "Registration for this event is closed" };
    }

    const currentCount = data.eventRegistrations.filter((r) => r.eventId === eventId).length;
    if (currentCount >= event.maxParticipants) {
      return { success: false, message: "Event is already full" };
    }

    const alreadyRegistered = data.eventRegistrations.some(
      (r) => r.studentId === studentId && r.eventId === eventId
    );
    if (alreadyRegistered) {
      return { success: false, message: "You are already registered for this event" };
    }

    data.eventRegistrations.push({
      id: `ereg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId,
      eventId,
      registeredAt: new Date().toISOString(),
    });
    writeDb(data);
    return { success: true, message: "Successfully registered for event!" };
  },
  unregisterFromEvent: (studentId: string, eventId: string): boolean => {
    const data = readDb();
    const prevLen = data.eventRegistrations.length;
    data.eventRegistrations = data.eventRegistrations.filter(
      (r) => !(r.studentId === studentId && r.eventId === eventId)
    );
    writeDb(data);
    return data.eventRegistrations.length < prevLen;
  },

  // Attendance & QR Check-in
  getAttendance: (): AttendanceRecord[] => readDb().attendance,
  getAttendanceByStudentId: (studentId: string): AttendanceRecord | undefined => {
    return readDb().attendance.find((a) => a.studentId === studentId);
  },
  verifyAndCheckIn: (
    tokenOrCollegeId: string,
    verifierName: string = "Admin Desk"
  ): {
    success: boolean;
    status: "VERIFIED" | "ALREADY_CHECKED_IN" | "NOT_FOUND";
    student?: User;
    attendance?: AttendanceRecord;
    message: string;
  } => {
    const data = readDb();
    const query = tokenOrCollegeId.trim().toUpperCase();

    // Find student by qrToken or collegeId
    const student = data.users.find(
      (u) =>
        u.qrToken.toUpperCase() === query ||
        u.collegeId.toUpperCase() === query
    );

    if (!student) {
      return {
        success: false,
        status: "NOT_FOUND",
        message: "No registered student found matching this QR code or College ID.",
      };
    }

    // Check existing attendance record
    const existing = data.attendance.find((a) => a.studentId === student.id);
    if (existing && existing.checkedIn) {
      return {
        success: false,
        status: "ALREADY_CHECKED_IN",
        student,
        attendance: existing,
        message: `Student was already checked in at ${new Date(
          existing.checkedInAt || ""
        ).toLocaleTimeString()} on ${new Date(
          existing.checkedInAt || ""
        ).toLocaleDateString()}.`,
      };
    }

    // New check-in
    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId: student.id,
      collegeId: student.collegeId,
      studentName: student.name,
      year: student.year,
      department: student.department,
      qrToken: student.qrToken,
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
      verifiedBy: verifierName,
    };

    if (existing) {
      existing.checkedIn = true;
      existing.checkedInAt = newRecord.checkedInAt;
      existing.verifiedBy = verifierName;
    } else {
      data.attendance.push(newRecord);
    }

    writeDb(data);

    return {
      success: true,
      status: "VERIFIED",
      student,
      attendance: newRecord,
      message: `Entry verified for ${student.name} (${student.collegeId})!`,
    };
  },

  // Announcements
  getAnnouncements: (): Announcement[] => {
    return readDb().announcements.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  createAnnouncement: (announcement: Announcement): Announcement => {
    const data = readDb();
    data.announcements.unshift(announcement);
    writeDb(data);
    return announcement;
  },
  deleteAnnouncement: (id: string): boolean => {
    const data = readDb();
    const prev = data.announcements.length;
    data.announcements = data.announcements.filter((a) => a.id !== id);
    writeDb(data);
    return data.announcements.length < prev;
  },

  // Settings
  getSettings: (): FestSettings => readDb().settings,
  updateSettings: (updates: Partial<FestSettings>): FestSettings => {
    const data = readDb();
    data.settings = { ...data.settings, ...updates };
    writeDb(data);
    return data.settings;
  },

  // Team & Coordinators
  getTeam: (): TeamMember[] => readDb().team || [],
  addTeamMember: (member: TeamMember): TeamMember => {
    const data = readDb();
    if (!data.team) data.team = [];
    data.team.push(member);
    writeDb(data);
    return member;
  },
  deleteTeamMember: (id: string): boolean => {
    const data = readDb();
    if (!data.team) return false;
    const prev = data.team.length;
    data.team = data.team.filter((m) => m.id !== id);
    writeDb(data);
    return data.team.length < prev;
  },

  // Gallery & Memories (Photos & Videos)
  getGallery: (): GalleryItem[] => readDb().gallery || [],
  addGalleryItem: (item: GalleryItem): GalleryItem => {
    const data = readDb();
    if (!data.gallery) data.gallery = [];
    data.gallery.unshift(item);
    writeDb(data);
    return item;
  },
  deleteGalleryItem: (id: string): boolean => {
    const data = readDb();
    if (!data.gallery) return false;
    const prev = data.gallery.length;
    data.gallery = data.gallery.filter((g) => g.id !== id);
    writeDb(data);
    return data.gallery.length < prev;
  },

  // Contact Messages & Inquiries
  getMessages: (): ContactMessage[] => {
    return (readDb().messages || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  saveMessage: (msg: Omit<ContactMessage, "id" | "createdAt">): ContactMessage => {
    const data = readDb();
    if (!data.messages) {
      data.messages = [];
    }
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    data.messages.unshift(newMsg);
    writeDb(data);
    return newMsg;
  },

  // Eligible Students roster (local JSON fallback)
  getEligibleStudents: (): EligibleStudentRecord[] => {
    return readDb().eligibleStudents || [];
  },
};
