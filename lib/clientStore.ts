import fs from "fs";
import path from "path";

export interface ContactRecord {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  relation: string; // e.g., "Artist", "Promoter", "Client", "Sound Vendor", "Stage Tech", etc.
  notes?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");
const CREDENTIALS_FILE = path.join(DATA_DIR, "credentials.json");

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
    notes: "Lead Vocalist & Acoustic Band Leader",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cnt_2",
    name: "Ayan Bose",
    phone: "+91 62907 13080",
    whatsapp: "+91 62907 13080",
    relation: "Founder & Key Coordinator",
    notes: "Main point of contact for artist bookings",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cnt_3",
    name: "Somnath Podder",
    phone: "+91 94328 82915",
    whatsapp: "+91 94328 82915",
    relation: "Promoter & Technical Support",
    notes: "Handles sound equipment, stage framing & logistics",
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
    relation: r.relation || "Contact",
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

export function getCredentials(): AdminCredentials {
  ensureDir();
  if (!fs.existsSync(CREDENTIALS_FILE)) {
    const defaultCreds: AdminCredentials = {
      adminId: "admin",
      passwordHash: "admin123",
    };
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(defaultCreds, null, 2));
    return defaultCreds;
  }

  try {
    const raw = fs.readFileSync(CREDENTIALS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { adminId: "admin", passwordHash: "admin123" };
  }
}

export function updateCredentials(adminId: string, passwordHash: string): void {
  ensureDir();
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify({ adminId, passwordHash }, null, 2));
}
