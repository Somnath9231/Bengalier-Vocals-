import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface ContactRecord {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  relation: string; // "Promoter / Organizer", "Artist", "Other Materials / Equipment", or custom
  artistType?: string; // "Singer" | "Band" | "Solo Performer" | "Other"
  musicGenre?: string; // e.g. Bollywood, Rock, Folk, Classical, Fusion
  budget?: string; // Last recorded budget / fee for a show
  notes?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");
const CREDENTIALS_FILE = path.join(DATA_DIR, "credentials.json");
const PASSWORD_SALT = "bengalier_vocals_secure_salt_2026";

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const INITIAL_CONTACTS: ContactRecord[] = [
  {
    id: "cnt_1",
    name: "Tanmay Kar",
    phone: "+91 98301 12345",
    whatsapp: "+91 98301 12345",
    relation: "Artist",
    artistType: "Singer",
    musicGenre: "Acoustic / Bengali Pop",
    budget: "₹25,000 / show",
    notes: "Lead Vocalist & Acoustic Band Leader",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cnt_2",
    name: "Ayan Bose",
    phone: "+91 62907 13080",
    whatsapp: "+91 62907 13080",
    relation: "Promoter / Organizer",
    notes: "Main coordinator for artist bookings & concert curation",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cnt_3",
    name: "Somnath Podder",
    phone: "+91 94328 82915",
    whatsapp: "+91 94328 82915",
    relation: "Other Materials / Equipment",
    notes: "Sound equipment, line arrays, stage framing & logistics vendor",
    createdAt: new Date().toISOString(),
  },
];

export function getContacts(): ContactRecord[] {
  ensureDir();
  if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(INITIAL_CONTACTS, null, 2));
    return INITIAL_CONTACTS;
  }

  try {
    const raw = fs.readFileSync(CONTACTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_CONTACTS;
  }
}

export function saveContacts(contacts: ContactRecord[]): void {
  ensureDir();
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

export function addContact(newContact: Omit<ContactRecord, "id" | "createdAt">): ContactRecord {
  const contacts = getContacts();
  const createdRecord: ContactRecord = {
    ...newContact,
    id: "cnt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
  };
  contacts.unshift(createdRecord);
  saveContacts(contacts);
  return createdRecord;
}

export function updateContact(id: string, updatedFields: Partial<ContactRecord>): ContactRecord | null {
  const contacts = getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...updatedFields };
  saveContacts(contacts);
  return contacts[index];
}

export function deleteContact(id: string): boolean {
  const contacts = getContacts();
  const filtered = contacts.filter((c) => c.id !== id);
  if (filtered.length === contacts.length) return false;
  saveContacts(filtered);
  return true;
}

export function bulkImportContacts(records: Partial<ContactRecord>[]): ContactRecord[] {
  const existing = getContacts();
  const newRecords: ContactRecord[] = records.map((r, i) => ({
    id: "cnt_" + Date.now() + "_" + i + "_" + Math.random().toString(36).substring(2, 5),
    name: r.name || "Unnamed Contact",
    phone: r.phone || "",
    whatsapp: r.whatsapp || r.phone || "",
    relation: r.relation || "Artist",
    artistType: r.artistType || "",
    musicGenre: r.musicGenre || "",
    budget: r.budget || "",
    notes: r.notes || "",
    createdAt: new Date().toISOString(),
  }));

  const combined = [...newRecords, ...existing];
  saveContacts(combined);
  return newRecords;
}

export interface AdminCredentials {
  adminId: string;
  passwordHash: string;
}

export function hashPassword(password: string): string {
  return crypto.scryptSync(password, PASSWORD_SALT, 32).toString("hex");
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const computed = hashPassword(password);
    // Constant-time comparison
    if (computed.length !== storedHash.length) {
      // Check if stored is plain text fallback
      return password === storedHash;
    }
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(storedHash));
  } catch {
    return false;
  }
}

export function getCredentials(): AdminCredentials {
  ensureDir();
  const defaultAdminId = "bengalierVolcas#A";
  const defaultPasswordHash = hashPassword("BENGALI#9231");

  if (!fs.existsSync(CREDENTIALS_FILE)) {
    const defaultCreds: AdminCredentials = {
      adminId: defaultAdminId,
      passwordHash: defaultPasswordHash,
    };
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(defaultCreds, null, 2));
    return defaultCreds;
  }

  try {
    const raw = fs.readFileSync(CREDENTIALS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { adminId: defaultAdminId, passwordHash: defaultPasswordHash };
  }
}

export function updateCredentials(adminId: string, plainOrHashedPassword: string): void {
  ensureDir();
  // Store hashed password
  const passwordHash =
    plainOrHashedPassword.length === 64
      ? plainOrHashedPassword
      : hashPassword(plainOrHashedPassword);
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify({ adminId, passwordHash }, null, 2));
}

// ----------------------------------------------------
// Intermediate to High Security Session Management
// ----------------------------------------------------

interface SessionData {
  adminId: string;
  createdAt: number;
  expiresAt: number;
}

// Global in-memory session store (persists across API requests in server process)
const globalSessions = (global as any).__bengalier_sessions || new Map<string, SessionData>();
(global as any).__bengalier_sessions = globalSessions;

// Global rate limiting & lockout tracker
interface AttemptInfo {
  count: number;
  lastAttempt: number;
  lockedUntil: number;
}
const globalAttempts = (global as any).__bengalier_attempts || new Map<string, AttemptInfo>();
(global as any).__bengalier_attempts = globalAttempts;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const SESSION_LIFETIME_MS = 4 * 60 * 60 * 1000; // 4 hours active session

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockedMinutes?: number;
} {
  const now = Date.now();
  const attempt = globalAttempts.get(identifier);

  if (!attempt) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    const remainingMs = attempt.lockedUntil - now;
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedMinutes: Math.ceil(remainingMs / (60 * 1000)),
    };
  }

  // If lockout expired, reset
  if (attempt.lockedUntil && now >= attempt.lockedUntil) {
    globalAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - attempt.count);
  return { allowed: true, remainingAttempts: remaining };
}

export function recordFailedAttempt(identifier: string): {
  isLocked: boolean;
  remainingAttempts: number;
  lockedMinutes?: number;
} {
  const now = Date.now();
  const current = globalAttempts.get(identifier) || { count: 0, lastAttempt: now, lockedUntil: 0 };
  current.count += 1;
  current.lastAttempt = now;

  if (current.count >= MAX_FAILED_ATTEMPTS) {
    current.lockedUntil = now + LOCKOUT_DURATION_MS;
    globalAttempts.set(identifier, current);
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockedMinutes: 15,
    };
  }

  globalAttempts.set(identifier, current);
  return {
    isLocked: false,
    remainingAttempts: MAX_FAILED_ATTEMPTS - current.count,
  };
}

export function resetRateLimit(identifier: string): void {
  globalAttempts.delete(identifier);
}

export function createSessionToken(adminId: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  globalSessions.set(token, {
    adminId,
    createdAt: now,
    expiresAt: now + SESSION_LIFETIME_MS,
  });
  return token;
}

export function verifySessionToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const session = globalSessions.get(token);
  if (!session) return false;

  const now = Date.now();
  if (now > session.expiresAt) {
    globalSessions.delete(token);
    return false;
  }

  return true;
}

export function revokeSessionToken(token: string | null | undefined): void {
  if (token) {
    globalSessions.delete(token);
  }
}

export function validateRequestAuth(req: Request): boolean {
  const authHeader = req.headers.get("authorization");
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    // Check custom header
    token = req.headers.get("x-admin-token") || "";
  }

  return verifySessionToken(token);
}
