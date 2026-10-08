import { NextResponse } from "next/server";
import {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} from "@/lib/clientStore";

export async function GET() {
  try {
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
    const body = await req.json();
    const { name, phone, whatsapp, relation, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    const created = addContact({
      name,
      phone,
      whatsapp: whatsapp || phone,
      relation: relation || "Client",
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
