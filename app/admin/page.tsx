"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as XLSX from "xlsx";
import {
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Phone,
  MessageSquare,
  Trash2,
  Edit,
  Lock,
  LogOut,
  Users,
  Mic2,
  Briefcase,
  X,
  RefreshCw,
  ShieldCheck,
  Check,
  UserCheck,
  Music,
  IndianRupee,
  Layers,
  Sparkles,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { ContactRecord } from "@/lib/clientStore";

const STANDARD_RELATIONS = [
  "Artist",
  "Promoter / Organizer",
  "Other Materials / Equipment",
  "Custom / Other Relation",
];

const ARTIST_TYPE_OPTIONS = ["Singer", "Band", "Solo Performer", "Other"];

export default function AdminDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"All" | "Artist" | "Promoter" | "Other">("All");

  // Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newAdminId, setNewAdminId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState("");

  // Form State for Add/Edit Contact
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    relation: "Artist",
    customRelation: "",
    artistType: "Singer",
    musicGenre: "",
    budget: "",
    notes: "",
  });

  // Get current session token helper
  const getAuthToken = () => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("bengalier_admin_session_token") || "";
  };

  useEffect(() => {
    // Check session token in sessionStorage (expires on browser close)
    const token = sessionStorage.getItem("bengalier_admin_session_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchContacts();
  }, [router]);

  const fetchContacts = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        sessionStorage.removeItem("bengalier_admin_session_token");
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error("Failed to load contacts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = getAuthToken();
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout", token }),
      });
    } catch (err) {
      // Ignore
    } finally {
      sessionStorage.removeItem("bengalier_admin_session_token");
      sessionStorage.removeItem("bengalier_admin_id");
      localStorage.removeItem("bengalier_admin_token");
      localStorage.removeItem("bengalier_admin_id");
      router.push("/admin/login");
    }
  };

  // Open modal for new contact
  const openNewContactModal = () => {
    setEditingContact(null);
    setFormData({
      name: "",
      phone: "",
      whatsapp: "",
      relation: "Artist",
      customRelation: "",
      artistType: "Singer",
      musicGenre: "",
      budget: "",
      notes: "",
    });
    setIsContactModalOpen(true);
  };

  // Open modal for editing existing contact
  const openEditContactModal = (contact: ContactRecord) => {
    setEditingContact(contact);
    const isKnown = STANDARD_RELATIONS.slice(0, 3).includes(contact.relation);
    setFormData({
      name: contact.name || "",
      phone: contact.phone || "",
      whatsapp: contact.whatsapp || contact.phone || "",
      relation: isKnown ? contact.relation : "Custom / Other Relation",
      customRelation: isKnown ? "" : contact.relation,
      artistType: contact.artistType || "Singer",
      musicGenre: contact.musicGenre || "",
      budget: contact.budget || "",
      notes: contact.notes || "",
    });
    setIsContactModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      let finalRelation = formData.relation;
      if (formData.relation === "Custom / Other Relation") {
        finalRelation = formData.customRelation.trim() || "Other Relation";
      }

      const isArtist = finalRelation.toLowerCase().includes("artist");

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp: (formData.whatsapp || formData.phone).trim(),
        relation: finalRelation,
        artistType: isArtist ? formData.artistType : "",
        musicGenre: isArtist ? formData.musicGenre.trim() : "",
        budget: isArtist ? formData.budget.trim() : "",
        notes: formData.notes.trim(),
      };

      const method = editingContact ? "PUT" : "POST";
      const finalPayload = editingContact
        ? { id: editingContact.id, ...payload }
        : payload;

      const res = await fetch("/api/admin/clients", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalPayload),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setIsContactModalOpen(false);
        fetchContacts();
      } else {
        alert(data.message || "Failed to save contact record.");
      }
    } catch (err) {
      alert("Error saving contact details.");
    }
  };

  const handleDeleteContact = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from contact directory?`)) {
      return;
    }

    const token = getAuthToken();
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        fetchContacts();
      }
    } catch (err) {
      alert("Failed to delete contact record.");
    }
  };

  // Single Excel / CSV File Import Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = getAuthToken();
    setImporting(true);
    setImportMsg("");

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const result = await res.json();
      if (res.ok && result.success) {
        setImportMsg(result.message);
        fetchContacts();
        setTimeout(() => setImportMsg(""), 5000);
      } else {
        alert(result.message || "Failed to import Excel file");
      }
    } catch (err) {
      alert("Error uploading file.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Export current contacts to Excel
  const exportToExcel = () => {
    if (contacts.length === 0) {
      alert("No contact records to export.");
      return;
    }

    const exportData = contacts.map((c, i) => ({
      "SL No": i + 1,
      "Name": c.name,
      "Phone Number": c.phone,
      "WhatsApp Number": c.whatsapp || c.phone,
      "Relation / Category": c.relation,
      "Artist Type (Band/Singer)": c.artistType || "N/A",
      "Music Genre": c.musicGenre || "N/A",
      "Show Budget / Fee": c.budget || "N/A",
      "Notes & Details": c.notes || "",
      "Date Added": new Date(c.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bengalier_Contacts");
    XLSX.writeFile(workbook, `Bengalier_Vocals_Contacts_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");
    const token = getAuthToken();

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "changePassword",
          token,
          adminId: newAdminId.trim() || undefined,
          password: currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMsg("Credentials updated successfully!");
        if (newAdminId) sessionStorage.setItem("bengalier_admin_id", newAdminId.trim());
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordMsg("");
        }, 1500);
      } else {
        setPasswordError(data.message || "Failed to update password");
      }
    } catch (err) {
      setPasswordError("Server error updating credentials.");
    }
  };

  // Calculate statistics
  const totalContacts = contacts.length;
  const artistContacts = useMemo(
    () => contacts.filter((c) => c.relation?.toLowerCase().includes("artist")),
    [contacts]
  );
  const promoterContacts = useMemo(
    () =>
      contacts.filter(
        (c) =>
          c.relation?.toLowerCase().includes("promoter") ||
          c.relation?.toLowerCase().includes("organizer")
      ),
    [contacts]
  );
  const otherContacts = useMemo(
    () =>
      contacts.filter(
        (c) =>
          !c.relation?.toLowerCase().includes("artist") &&
          !c.relation?.toLowerCase().includes("promoter") &&
          !c.relation?.toLowerCase().includes("organizer")
      ),
    [contacts]
  );

  // Filter contacts by search query & category
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // Category filter from top cards or dropdown
      if (activeCategoryFilter === "Artist" && !c.relation?.toLowerCase().includes("artist")) {
        return false;
      }
      if (
        activeCategoryFilter === "Promoter" &&
        !(c.relation?.toLowerCase().includes("promoter") || c.relation?.toLowerCase().includes("organizer"))
      ) {
        return false;
      }
      if (
        activeCategoryFilter === "Other" &&
        (c.relation?.toLowerCase().includes("artist") ||
          c.relation?.toLowerCase().includes("promoter") ||
          c.relation?.toLowerCase().includes("organizer"))
      ) {
        return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.whatsapp && c.whatsapp.toLowerCase().includes(q)) ||
        c.relation.toLowerCase().includes(q) ||
        (c.artistType && c.artistType.toLowerCase().includes(q)) ||
        (c.musicGenre && c.musicGenre.toLowerCase().includes(q)) ||
        (c.budget && c.budget.toLowerCase().includes(q)) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    });
  }, [contacts, activeCategoryFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50/70 text-[#161616] font-sans flex flex-col selection:bg-red-500/20 selection:text-[#C1121F]">
      
      {/* Modern Curved Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* Expanded prominent logo */}
            <div className="relative h-14 sm:h-16 w-60 sm:w-80">
              <Image
                src="/logo.jpg"
                alt="Bengalier Vocals Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C1121F]" />
              <span>Admin Database Portal</span>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold border border-stone-200 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              title="Change Password & Admin ID"
            >
              <Lock className="w-3.5 h-3.5 text-[#C1121F]" />
              <span className="hidden sm:inline">Credentials</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-[#C1121F] hover:bg-[#A30F1A] active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-red-600/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        
        {/* Top Interactive Stats Cards Grid (Click to filter!) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Directory Overview (Click to Quick-Filter)
            </span>
            {activeCategoryFilter !== "All" && (
              <button
                onClick={() => setActiveCategoryFilter("All")}
                className="text-xs font-bold text-[#C1121F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset filter</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Contacts */}
            <button
              onClick={() => setActiveCategoryFilter("All")}
              className={`text-left p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                activeCategoryFilter === "All"
                  ? "bg-white border-[#C1121F] shadow-md ring-2 ring-red-500/10"
                  : "bg-white hover:bg-stone-50/80 border-stone-200/90 shadow-2xs hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
                <span>Total Contacts</span>
                <div className={`p-2 rounded-xl ${activeCategoryFilter === "All" ? "bg-red-50 text-[#C1121F]" : "bg-stone-100 text-stone-600"}`}>
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-stone-900 mt-2">
                {totalContacts}
              </div>
              <div className="text-[11px] text-stone-400 mt-1 font-medium">
                {activeCategoryFilter === "All" ? "● Currently viewing all" : "Click to view all records"}
              </div>
            </button>

            {/* Card 2: Artists (Click to filter only Artists) */}
            <button
              onClick={() => setActiveCategoryFilter("Artist")}
              className={`text-left p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                activeCategoryFilter === "Artist"
                  ? "bg-white border-[#C1121F] shadow-md ring-2 ring-red-500/15"
                  : "bg-white hover:bg-stone-50/80 border-stone-200/90 shadow-2xs hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
                <span>Artists</span>
                <div className={`p-2 rounded-xl ${activeCategoryFilter === "Artist" ? "bg-red-50 text-[#C1121F]" : "bg-stone-100 text-stone-600"}`}>
                  <Mic2 className="w-4 h-4 text-[#C1121F]" />
                </div>
              </div>
              <div className="text-3xl font-black text-stone-900 mt-2">
                {artistContacts.length}
              </div>
              <div className="text-[11px] text-[#C1121F] mt-1 font-medium flex items-center gap-1">
                {activeCategoryFilter === "Artist" ? "● Showing artist numbers & details" : "Click to show only artists"}
              </div>
            </button>

            {/* Card 3: Promoters & Organizers */}
            <button
              onClick={() => setActiveCategoryFilter("Promoter")}
              className={`text-left p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                activeCategoryFilter === "Promoter"
                  ? "bg-white border-[#C1121F] shadow-md ring-2 ring-red-500/15"
                  : "bg-white hover:bg-stone-50/80 border-stone-200/90 shadow-2xs hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
                <span>Promoters & Organizers</span>
                <div className={`p-2 rounded-xl ${activeCategoryFilter === "Promoter" ? "bg-red-50 text-[#C1121F]" : "bg-stone-100 text-stone-600"}`}>
                  <Briefcase className="w-4 h-4 text-[#C1121F]" />
                </div>
              </div>
              <div className="text-3xl font-black text-stone-900 mt-2">
                {promoterContacts.length}
              </div>
              <div className="text-[11px] text-stone-500 mt-1 font-medium">
                {activeCategoryFilter === "Promoter" ? "● Showing promoters & organizers" : "Click to show only promoters"}
              </div>
            </button>

            {/* Card 4: Other Relations */}
            <button
              onClick={() => setActiveCategoryFilter("Other")}
              className={`text-left p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                activeCategoryFilter === "Other"
                  ? "bg-white border-[#C1121F] shadow-md ring-2 ring-red-500/15"
                  : "bg-white hover:bg-stone-50/80 border-stone-200/90 shadow-2xs hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
                <span>Other Materials / Network</span>
                <div className={`p-2 rounded-xl ${activeCategoryFilter === "Other" ? "bg-red-50 text-[#C1121F]" : "bg-stone-100 text-stone-600"}`}>
                  <UserCheck className="w-4 h-4 text-[#C1121F]" />
                </div>
              </div>
              <div className="text-3xl font-black text-stone-900 mt-2">
                {otherContacts.length}
              </div>
              <div className="text-[11px] text-stone-500 mt-1 font-medium">
                {activeCategoryFilter === "Other" ? "● Showing vendors & materials" : "Click to show other contacts"}
              </div>
            </button>
          </div>
        </div>

        {/* Success import message banner */}
        {importMsg && (
          <div className="rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs p-4 flex items-center justify-between font-semibold shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importMsg}</span>
            </div>
            <button onClick={() => setImportMsg("")} className="text-emerald-700 hover:text-emerald-950 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Bar & Controls */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
          {/* Search bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, music genre, budget, relation..."
              className="w-full bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm py-2.5 pl-11 pr-4 focus:outline-none focus:border-[#C1121F] focus:ring-4 focus:ring-red-500/10 focus:bg-white transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Action Buttons: EXACTLY ONE Import Excel button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Hidden File Input for Excel Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />

            {/* Exactly 1 Single Import Excel Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-xs shadow-emerald-600/20 disabled:opacity-50"
              title="Import Names, Phone Numbers, Genres & Budgets from Excel (.xlsx)"
            >
              {importing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5" />
              )}
              <span>Import Excel</span>
            </button>

            <button
              onClick={exportToExcel}
              className="rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200 text-stone-800 text-xs font-bold px-4 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              title="Export Current Contact Directory to Excel File"
            >
              <Download className="w-3.5 h-3.5 text-[#C1121F]" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={openNewContactModal}
              className="rounded-xl bg-[#C1121F] hover:bg-[#A30F1A] active:scale-95 text-white text-xs font-bold px-4.5 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-red-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Modern Rounded Contact Table Directory */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold text-stone-900">
                Contact Directory
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-200/70 text-stone-700 text-xs font-bold">
                {filteredContacts.length} {filteredContacts.length === 1 ? "entry" : "entries"}
              </span>
              {activeCategoryFilter !== "All" && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#C1121F] text-xs font-semibold">
                  Filter: {activeCategoryFilter}
                </span>
              )}
            </div>

            <button
              onClick={fetchContacts}
              className="text-xs text-stone-600 hover:text-[#C1121F] flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="p-16 text-center text-stone-500 text-sm font-medium flex flex-col items-center justify-center gap-3">
              <div className="w-7 h-7 border-3 border-stone-300 border-t-[#C1121F] rounded-full animate-spin" />
              <span>Loading secure contact directory...</span>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Users className="w-7 h-7" />
              </div>
              <div className="text-base font-bold text-stone-800">No contact records found</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                {searchQuery || activeCategoryFilter !== "All"
                  ? "Try adjusting your search terms or clearing the category filter."
                  : "Upload an Excel sheet or click 'Add Contact' above to record artists, promoters, and event vendors."}
              </p>
              {(searchQuery || activeCategoryFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategoryFilter("All");
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/70 text-stone-500 text-[11px] uppercase tracking-wider font-semibold border-b border-stone-200/70">
                  <tr>
                    <th className="py-3.5 px-5">Contact Details</th>
                    <th className="py-3.5 px-5">Phone & Quick Actions</th>
                    <th className="py-3.5 px-5">Relation & Category</th>
                    <th className="py-3.5 px-5">Artist / Show Info</th>
                    <th className="py-3.5 px-5">Notes & Details</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredContacts.map((contact) => {
                    const phoneClean = contact.phone.replace(/[^0-9+]/g, "");
                    const waClean = (contact.whatsapp || contact.phone).replace(/[^0-9]/g, "");
                    const isArtist = contact.relation?.toLowerCase().includes("artist");

                    return (
                      <tr key={contact.id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Name */}
                        <td className="py-4 px-5 align-top">
                          <div className="font-bold text-sm text-stone-900">
                            {contact.name}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                            Added {new Date(contact.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Phone & Call/WhatsApp quick buttons */}
                        <td className="py-4 px-5 align-top">
                          <div className="font-mono text-xs text-stone-900 font-bold tracking-tight">
                            {contact.phone}
                          </div>
                          <div className="flex items-center gap-1.5 pt-2">
                            <a
                              href={`tel:${phoneClean}`}
                              className="text-[10px] font-bold rounded-lg bg-stone-900 hover:bg-black text-white px-2.5 py-1.5 flex items-center gap-1 transition-all shadow-2xs hover:scale-102"
                              title="Direct Phone Call"
                            >
                              <Phone className="w-3 h-3 text-[#C1121F]" />
                              <span>Call</span>
                            </a>
                            <a
                              href={`https://wa.me/${waClean}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold rounded-lg bg-[#25D366] hover:bg-[#1ebd59] text-white px-2.5 py-1.5 flex items-center gap-1 transition-all shadow-2xs hover:scale-102"
                              title="Direct WhatsApp Chat"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </td>

                        {/* Relation Badge */}
                        <td className="py-4 px-5 align-top">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${
                              isArtist
                                ? "bg-red-50 text-[#C1121F] border-red-200"
                                : contact.relation?.toLowerCase().includes("promoter")
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-stone-100 text-stone-700 border-stone-200"
                            }`}
                          >
                            {contact.relation}
                          </span>
                        </td>

                        {/* Artist / Show Info (Artist Type, Genre, Budget) */}
                        <td className="py-4 px-5 align-top">
                          {isArtist ? (
                            <div className="space-y-1.5">
                              {contact.artistType && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[11px] font-bold">
                                  <Mic2 className="w-3 h-3 text-[#C1121F]" />
                                  <span>{contact.artistType}</span>
                                </div>
                              )}
                              {contact.musicGenre && (
                                <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium">
                                  <Music className="w-3 h-3 text-stone-400 shrink-0" />
                                  <span className="truncate max-w-[140px]">{contact.musicGenre}</span>
                                </div>
                              )}
                              {contact.budget && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                                  <IndianRupee className="w-3 h-3 text-emerald-600" />
                                  <span>{contact.budget}</span>
                                </div>
                              )}
                              {!contact.artistType && !contact.musicGenre && !contact.budget && (
                                <span className="text-stone-400 text-xs italic">No artist details</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-stone-400 text-xs italic">—</span>
                          )}
                        </td>

                        {/* Notes */}
                        <td className="py-4 px-5 align-top text-stone-600 text-xs max-w-xs">
                          {contact.notes ? (
                            <p className="line-clamp-2 leading-relaxed">{contact.notes}</p>
                          ) : (
                            <span className="text-stone-400 italic">No notes</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditContactModal(contact)}
                              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                              title="Edit Contact"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact.id, contact.name)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#C1121F] transition-colors cursor-pointer"
                              title="Delete Contact"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal 1: Add/Edit Contact Form (Modern Curved Glass Theme) */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-50 text-[#C1121F]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  {editingContact ? "Edit Contact Record" : "Add New Contact"}
                </h3>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block ml-0.5">
                  Full Name / Stage Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tanmay Kar or The Acoustic Ensemble"
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm p-3 focus:outline-none focus:border-[#C1121F] focus:ring-3 focus:ring-red-500/10 focus:bg-white transition-all"
                />
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block ml-0.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98301 12345"
                    className="w-full bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm p-3 focus:outline-none focus:border-[#C1121F] focus:ring-3 focus:ring-red-500/10 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block ml-0.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="Same as phone or separate"
                    className="w-full bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm p-3 focus:outline-none focus:border-[#C1121F] focus:ring-3 focus:ring-red-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Relation Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block ml-0.5">
                  Relation / Category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STANDARD_RELATIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, relation: opt })}
                      className={`text-xs font-semibold py-2.5 px-3 rounded-xl border text-left transition-all ${
                        formData.relation === opt
                          ? "bg-red-50 border-[#C1121F] text-[#C1121F] font-bold shadow-2xs"
                          : "bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {formData.relation === "Custom / Other Relation" && (
                  <input
                    type="text"
                    required
                    value={formData.customRelation}
                    onChange={(e) => setFormData({ ...formData, customRelation: e.target.value })}
                    placeholder="Type custom relation (e.g. Sound Contractor, Stage Lighting)"
                    className="w-full bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm p-3 mt-2 focus:outline-none focus:border-[#C1121F] focus:ring-3 focus:ring-red-500/10 focus:bg-white transition-all"
                  />
                )}
              </div>

              {/* DYNAMIC ARTIST DETAILS: Shown when relation is Artist */}
              {formData.relation === "Artist" && (
                <div className="p-4 rounded-2xl bg-red-50/40 border border-red-100 space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#C1121F]">
                    <Mic2 className="w-3.5 h-3.5" />
                    <span>Artist Classification & Performance Details</span>
                  </div>

                  {/* Artist Type: Band or Singer */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">
                      Artist Type (Band or Singer?) *
                    </label>
                    <div className="flex gap-2">
                      {ARTIST_TYPE_OPTIONS.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, artistType: type })}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                            formData.artistType === type
                              ? "bg-white border-[#C1121F] text-[#C1121F] shadow-2xs ring-1 ring-red-400"
                              : "bg-white/70 border-stone-200 text-stone-600 hover:bg-white"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Music Genre & Budget Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block">
                        Kind of Music / Genre
                      </label>
                      <input
                        type="text"
                        value={formData.musicGenre}
                        onChange={(e) => setFormData({ ...formData, musicGenre: e.target.value })}
                        placeholder="e.g. Bollywood, Bengali Folk, Rock"
                        className="w-full bg-white border border-stone-200 rounded-xl text-stone-900 text-xs p-2.5 focus:outline-none focus:border-[#C1121F]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block">
                        Last Recorded Show Budget / Fee
                      </label>
                      <input
                        type="text"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="e.g. ₹35,000 / event"
                        className="w-full bg-white border border-stone-200 rounded-xl text-stone-900 text-xs p-2.5 focus:outline-none focus:border-[#C1121F]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes & Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block ml-0.5">
                  Notes & Performance Details
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Special sound requirements, rider, manager reference..."
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm p-3 focus:outline-none focus:border-[#C1121F] focus:ring-3 focus:ring-red-500/10 focus:bg-white transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C1121F] hover:bg-[#A30F1A] text-white text-xs font-bold shadow-sm shadow-red-600/20 transition-all cursor-pointer"
                >
                  {editingContact ? "Update Contact" : "Save Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Change Password Modal (Curved & Secure) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C1121F]" />
                <span>Update Admin Credentials</span>
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordMsg && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-xs p-3.5 text-emerald-900 font-bold">
                {passwordMsg}
              </div>
            )}

            {passwordError && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-xs p-3.5 text-[#C1121F] font-bold">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  New Admin ID (Optional)
                </label>
                <input
                  type="text"
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                  placeholder="Leave blank to keep current ID"
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm p-3 focus:outline-none focus:border-[#C1121F] focus:ring-3 focus:ring-red-500/10 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm p-3 focus:outline-none focus:border-[#C1121F] focus:ring-3 focus:ring-red-500/10 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm p-3 focus:outline-none focus:border-[#C1121F] focus:ring-3 focus:ring-red-500/10 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C1121F] hover:bg-[#A30F1A] text-white text-xs font-bold shadow-sm shadow-red-600/20 transition-all cursor-pointer"
                >
                  Update Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
