export type StudentYear = "3rd Year" | "4th Year";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  collegeId: string;
  year: StudentYear;
  department: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  qrToken: string;
  createdAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  collegeId: string;
  year: StudentYear;
  department: string;
  email: string;
  phone: string;
  role: UserRole;
  qrToken: string;
}

export type EventCategory = "Technical" | "Cultural" | "Gaming" | "Ceremony" | "Fun";

export interface FestEvent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: EventCategory;
  rules: string[];
  eligibility: string;
  maxParticipants: number;
  currentRegistrations?: number;
  date: string;
  time: string;
  venue: string;
  registrationStatus: "OPEN" | "CLOSED" | "FILLING_FAST";
  iconName: string;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  studentId: string;
  eventId: string;
  registeredAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  collegeId: string;
  studentName: string;
  year: string;
  department: string;
  qrToken: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  verifiedBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "normal" | "urgent" | "event";
  createdAt: string;
  updatedAt?: string;
}

export interface FestSettings {
  festName: string;
  subtitle: string;
  tagline: string;
  department: string;
  eventDate: string;
  venue: string;
  registrationOpen: boolean;
  eligibleYears: string[];
  contactEmail: string;
  contactPhone: string;
  heroNotice: string;
  bannerMessage: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "Faculty Coordinator" | "Student Lead" | "Technical Team" | "Creative & Media" | "Event Coordinator";
  department: string;
  avatarUrl?: string;
  contact?: string;
  addedBy?: string;
  createdAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  year: string;
  imageUrl: string;
  mediaType?: "photo" | "video";
  videoUrl?: string;
  description: string;
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  collegeId?: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface EligibleStudentRecord {
  collegeId: string;
  name: string;
  year: string;
  department: string;
  batch: string;
}
