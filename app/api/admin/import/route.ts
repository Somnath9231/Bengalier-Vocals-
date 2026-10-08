import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { bulkImportContacts, ContactRecord } from "@/lib/clientStore";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Read excel/csv workbook using XLSX
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON array
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    if (!rawData || rawData.length === 0) {
      return NextResponse.json(
        { success: false, message: "Uploaded sheet contains no rows." },
        { status: 400 }
      );
    }

    // Map columns flexibly for Name, Phone, Relation, Notes
    const importedRecords: Partial<ContactRecord>[] = rawData.map((row) => {
      const keys = Object.keys(row);
      const findVal = (possibleNames: string[]) => {
        const matchedKey = keys.find((k) =>
          possibleNames.some((p) => k.toLowerCase().trim().includes(p))
        );
        return matchedKey ? String(row[matchedKey]).trim() : "";
      };

      const name = findVal(["name", "client", "contact", "person", "artist"]);
      const phone = findVal(["phone", "mobile", "number", "tel", "contact no"]);
      const whatsapp = findVal(["whatsapp", "wa", "mobile", "phone"]);
      const relation = findVal(["relation", "role", "category", "type", "designation"]);
      const notes = findVal(["notes", "remark", "details", "comments", "description"]);

      return {
        name: name || "Unnamed Contact",
        phone: phone || "No Phone",
        whatsapp: whatsapp || phone,
        relation: relation || "Contact",
        notes,
      };
    });

    const saved = bulkImportContacts(importedRecords);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${saved.length} contacts!`,
      importedCount: saved.length,
    });
  } catch (err: any) {
    console.error("Excel import error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to parse Excel file" },
      { status: 500 }
    );
  }
}
