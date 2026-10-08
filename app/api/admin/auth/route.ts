import { NextResponse } from "next/server";
import { getCredentials, updateCredentials } from "@/lib/clientStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, adminId, password, newPassword } = body;

    const stored = getCredentials();

    if (action === "login") {
      if (
        adminId?.trim().toLowerCase() === stored.adminId.toLowerCase() &&
        password === stored.passwordHash
      ) {
        // Return success session token
        return NextResponse.json({
          success: true,
          message: "Authentication successful",
          token: "bengalier_admin_authenticated_session",
          user: { adminId: stored.adminId },
        });
      }

      return NextResponse.json(
        { success: false, message: "Invalid Admin ID or Password" },
        { status: 401 }
      );
    }

    if (action === "changePassword") {
      if (password !== stored.passwordHash) {
        return NextResponse.json(
          { success: false, message: "Current password incorrect" },
          { status: 400 }
        );
      }

      const updatedId = adminId || stored.adminId;
      updateCredentials(updatedId, newPassword);

      return NextResponse.json({
        success: true,
        message: "Credentials updated successfully",
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
