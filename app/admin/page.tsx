"use client";

import { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import { ContactRecord } from "@/lib/clientStore";

const RELATION_OPTIONS = [
  "Artist",
  "Promoter",
  "Event Organizer",
  "Sound Contractor",
  "Stage & Lighting Tech",
  "Client / Host",
  "Other Relation",
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [relationFilter, setRelationFilter] = useState("All");

  // Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newAdminId, setNewAdminId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState("");

  // Form State for Add/Edit Contact
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    relation: "Artist",
    customRelation: "",
    notes: "",
  });

  useEffect(() => {
    // Check authentication token
    const token = localStorage.getItem("bengalier_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchContacts();
  }, [router]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients");
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

  const handleLogout = () => {
    localStorage.removeItem("bengalier_admin_token");
    localStorage.removeItem("bengalier_admin_id");
    router.push("/admin/login");
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
      notes: "",
    });
    setIsContactModalOpen(true);
  };

  // Open modal for editing existing contact
  const openEditContactModal = (contact: ContactRecord) => {
    setEditingContact(contact);
    const isStandard = RELATION_OPTIONS.includes(contact.relation);
    setFormData({
      name: contact.name || "",
      phone: contact.phone || "",
      whatsapp: contact.whatsapp || contact.phone || "",
      relation: isStandard ? contact.relation : "Other Relation",
      customRelation: isStandard ? "" : contact.relation,
      notes: contact.notes || "",
    });
    setIsContactModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalRelation =
        formData.relation === "Other Relation" && formData.customRelation.trim()
          ? formData.customRelation.trim()
          : formData.relation;

      const payload = {
        name: formData.name,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        relation: finalRelation,
        notes: formData.notes,
      };

      const method = editingContact ? "PUT" : "POST";
      const finalPayload = editingContact
        ? { id: editingContact.id, ...payload }
        : payload;

      const res = await fetch("/api/admin/clients", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

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

    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchContacts();
      }
    } catch (err) {
      alert("Failed to delete contact record.");
    }
  };

  // Excel / CSV File Import Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportMsg("");

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: data,
      });

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
      "Relation / Role": c.relation,
      "Notes & Details": c.notes || "",
      "Date Added": new Date(c.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    XLSX.writeFile(workbook, `Bengalier_Vocals_Contacts_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "changePassword",
          adminId: newAdminId || localStorage.getItem("bengalier_admin_id") || "admin",
          password: currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMsg("Credentials updated successfully!");
        if (newAdminId) localStorage.setItem("bengalier_admin_id", newAdminId);
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordMsg("");
        }, 1500);
      } else {
        setPasswordMsg(data.message || "Failed to update password");
      }
    } catch (err) {
      setPasswordMsg("Server error updating credentials.");
    }
  };

  // Filter contacts by search query & relation
  const filteredContacts = contacts.filter((c) => {
    const matchesRelation =
      relationFilter === "All" ||
      c.relation.toLowerCase().includes(relationFilter.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.relation.toLowerCase().includes(q) ||
      (c.notes && c.notes.toLowerCase().includes(q));

    return matchesRelation && matchesSearch;
  });

  // Calculate statistics
  const totalContacts = contacts.length;
  const artistCount = contacts.filter((c) => c.relation.toLowerCase().includes("artist")).length;
  const promoterCount = contacts.filter(
    (c) =>
      c.relation.toLowerCase().includes("promoter") ||
      c.relation.toLowerCase().includes("organizer")
  ).length;
  const otherCount = totalContacts - (artistCount + promoterCount);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#161616] font-sans flex flex-col">
      
      {/* White Clean Header Banner */}
      <header className="bg-white border-b-2 border-stone-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-11 w-44 sm:w-52">
              <Image
                src="/logo.jpg"
                alt="Bengalier Vocals Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-300 text-xs font-mono text-[#C1121F] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PRIVATE CONTACT TERMINAL</span>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold border border-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Change Password"
            >
              <Lock className="w-3.5 h-3.5 text-[#C1121F]" />
              <span className="hidden sm:inline">Credentials</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* White Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-stone-200 p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
              <span>Total Contacts</span>
              <Users className="w-4 h-4 text-[#C1121F]" />
            </div>
            <div className="text-3xl font-extrabold text-[#161616] font-mono">
              {totalContacts}
            </div>
          </div>

          <div className="bg-white border-2 border-stone-200 p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
              <span>Artists</span>
              <Mic2 className="w-4 h-4 text-[#C1121F]" />
            </div>
            <div className="text-3xl font-extrabold text-[#161616] font-mono">
              {artistCount}
            </div>
          </div>

          <div className="bg-white border-2 border-stone-200 p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
              <span>Promoters & Organizers</span>
              <Briefcase className="w-4 h-4 text-[#C1121F]" />
            </div>
            <div className="text-3xl font-extrabold text-[#161616] font-mono">
              {promoterCount}
            </div>
          </div>

          <div className="bg-white border-2 border-stone-200 p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
              <span>Other Network Relations</span>
              <UserCheck className="w-4 h-4 text-[#C1121F]" />
            </div>
            <div className="text-3xl font-extrabold text-[#161616] font-mono">
              {otherCount}
            </div>
          </div>
        </div>

        {/* Success import message banner */}
        {importMsg && (
          <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 text-xs p-4 flex items-center justify-between font-medium">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{importMsg}</span>
            </div>
            <button onClick={() => setImportMsg("")} className="text-stone-500 hover:text-black">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Bar & Controls */}
        <div className="bg-white border-2 border-stone-200 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Phone, Relation, Notes..."
                className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-xs sm:text-sm py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#C1121F] focus:bg-white"
              />
            </div>

            <select
              value={relationFilter}
              onChange={(e) => setRelationFilter(e.target.value)}
              className="bg-[#FAFAFA] border border-stone-300 text-stone-900 text-xs sm:text-sm py-2.5 px-3 focus:outline-none focus:border-[#C1121F] focus:bg-white"
            >
              <option value="All">All Relations</option>
              <option value="Artist">Artist</option>
              <option value="Promoter">Promoter</option>
              <option value="Organizer">Organizer</option>
              <option value="Sound">Sound Contractor</option>
              <option value="Client">Client / Host</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Hidden File Input for Excel Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Import Names & Phone Numbers from Excel (.xlsx)"
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
              className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export Contact Directory to Excel File"
            >
              <Download className="w-3.5 h-3.5 text-[#C1121F]" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={openNewContactModal}
              className="bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Clean White Contact Table Directory */}
        <div className="bg-white border-2 border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-[#FAFAFA] flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#161616]">
              Contact Directory ({filteredContacts.length})
            </h3>
            <button
              onClick={fetchContacts}
              className="text-xs text-stone-600 hover:text-[#C1121F] flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-stone-500 text-sm font-medium">
              Loading contact directory...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-8 h-8 text-stone-400 mx-auto" />
              <div className="text-sm font-bold text-stone-800">No contact records found</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Click "Import Excel" to upload your contact list or "Add Contact" to add one manually.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAFA] text-stone-600 font-mono text-[11px] uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Name</th>
                    <th className="py-3.5 px-4 font-bold">Phone / WhatsApp</th>
                    <th className="py-3.5 px-4 font-bold">Relation / Category</th>
                    <th className="py-3.5 px-4 font-bold">Notes & Details</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredContacts.map((contact) => {
                    const phoneClean = contact.phone.replace(/[^0-9+]/g, "");
                    const waClean = (contact.whatsapp || contact.phone).replace(/[^0-9]/g, "");

                    return (
                      <tr key={contact.id} className="hover:bg-stone-50 transition-colors">
                        {/* Name */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-extrabold text-sm text-[#161616]">
                            {contact.name}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                            Added {new Date(contact.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Phone & WhatsApp Actions */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-mono text-sm text-[#161616] font-bold">
                            {contact.phone}
                          </div>
                          <div className="flex items-center gap-2 pt-1.5">
                            <a
                              href={`tel:${phoneClean}`}
                              className="text-[10px] font-bold uppercase bg-stone-900 hover:bg-black text-white px-2.5 py-1 flex items-center gap-1 transition-colors"
                              title="Direct Phone Call"
                            >
                              <Phone className="w-3 h-3 text-[#C1121F]" />
                              <span>Call</span>
                            </a>
                            <a
                              href={`https://wa.me/${waClean}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold uppercase bg-[#25D366] hover:bg-[#1ebd59] text-white px-2.5 py-1 flex items-center gap-1 transition-colors shadow-xs"
                              title="Direct WhatsApp Chat"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </td>

                        {/* Relation Badge */}
                        <td className="py-4 px-4 align-top">
                          <span className="text-xs font-bold px-2.5 py-1 bg-stone-100 border border-stone-300 text-stone-800 uppercase tracking-wider inline-block">
                            {contact.relation}
                          </span>
                        </td>

                        {/* Notes */}
                        <td className="py-4 px-4 align-top text-stone-600 text-xs">
                          {contact.notes ? (
                            <p className="max-w-xs leading-relaxed">{contact.notes}</p>
                          ) : (
                            <span className="text-stone-400 italic">No notes</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 align-top text-right space-x-1.5">
                          <button
                            onClick={() => openEditContactModal(contact)}
                            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer"
                            title="Edit Contact"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id, contact.name)}
                            className="p-2 bg-red-50 hover:bg-[#C1121F] text-[#C1121F] hover:text-white border border-red-200 transition-colors cursor-pointer"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Modal 1: Add/Edit Contact Form (White Theme) */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border-2 border-stone-900 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-lg font-extrabold text-[#161616]">
                {editingContact ? "Edit Contact" : "Add New Contact"}
              </h3>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-1 text-stone-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tanmay Kar or Ayan Bose"
                  className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm p-2.5 focus:outline-none focus:border-[#C1121F] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 62907 13080"
                    className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm p-2.5 focus:outline-none focus:border-[#C1121F] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+91 62907 13080"
                    className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm p-2.5 focus:outline-none focus:border-[#C1121F] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Relation / Category *
                </label>
                <select
                  value={formData.relation}
                  onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm p-2.5 focus:outline-none focus:border-[#C1121F] focus:bg-white"
                >
                  {RELATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {formData.relation === "Other Relation" && (
                  <input
                    type="text"
                    required
                    value={formData.customRelation}
                    onChange={(e) => setFormData({ ...formData, customRelation: e.target.value })}
                    placeholder="Enter custom relation (e.g. Sound Engineer, Sponsor)"
                    className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm p-2.5 mt-2 focus:outline-none focus:border-[#C1121F] focus:bg-white"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Notes & Remarks
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Band type, instrument details, availability notes..."
                  className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm p-2.5 focus:outline-none focus:border-[#C1121F] focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Change Password Modal (White Theme) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border-2 border-stone-900 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-lg font-extrabold text-[#161616] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C1121F]" />
                <span>Change Credentials</span>
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 text-stone-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-xs p-3 text-emerald-900 font-bold">
                {passwordMsg}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  New Admin ID (Optional)
                </label>
                <input
                  type="text"
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                  placeholder="Leave blank to keep current ID"
                  className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm p-2.5 focus:outline-none focus:border-[#C1121F] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm p-2.5 focus:outline-none focus:border-[#C1121F] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm p-2.5 focus:outline-none focus:border-[#C1121F] focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
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
