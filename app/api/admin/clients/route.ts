import { NextResponse } from "next/server";
import {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
  validateRequestAuth,
} from "@/lib/clientStore";

export async function GET(req: Request) {
  try {
    if (!validateRequestAuth(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      );
    }

    const contacts = getContacts();
    return NextResponse.json({ success: true, contacts });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!validateRequestAuth(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, whatsapp, relation, artistType, musicGenre, budget, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    const created = addContact({
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).trim(),
      relation: relation || "Artist",
      artistType: artistType || "",
      musicGenre: musicGenre || "",
      budget: budget || "",
      notes: notes || "",
    });

    return NextResponse.json({ success: true, contact: created });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    if (!validateRequestAuth(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Contact ID required" },
        { status: 400 }
      );
    }

    const updated = updateContact(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, contact: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    if (!validateRequestAuth(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Contact ID required" },
        { status: 400 }
      );
    }

    const success = deleteContact(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
