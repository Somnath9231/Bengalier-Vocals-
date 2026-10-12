import { NextResponse } from "next/server";
import {
  getCredentials,
  updateCredentials,
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  createSessionToken,
  revokeSessionToken,
  verifySessionToken,
} from "@/lib/clientStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, adminId, password, newPassword, token } = body;

    // Get client IP or fallback identifier for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "admin_portal_client";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many failed login attempts. Access temporarily locked for ${rateLimit.lockedMinutes} minute(s) to protect against unauthorized access.`,
        },
        { status: 429 }
      );
    }

    const stored = getCredentials();

    if (action === "login") {
      // Clean inputs
      const submittedId = adminId?.trim();
      const submittedPass = password;

      // Check match
      const isIdMatch =
        submittedId &&
        submittedId.toLowerCase() === stored.adminId.toLowerCase();

      const isPassMatch =
        submittedPass && verifyPassword(submittedPass, stored.passwordHash);

      if (isIdMatch && isPassMatch) {
        // Reset rate limit on success
        resetRateLimit(ip);

        // Generate cryptographically secure random session token
        const sessionToken = createSessionToken(stored.adminId);

        return NextResponse.json({
          success: true,
          message: "Authentication successful",
          token: sessionToken,
          user: { adminId: stored.adminId },
        });
      }

      // Record failed attempt
      const attemptResult = recordFailedAttempt(ip);
      if (attemptResult.isLocked) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Account locked due to 5 consecutive failed attempts. Please try again after 15 minutes.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Invalid Admin ID or Password. (${attemptResult.remainingAttempts} attempts remaining before lockout)`,
        },
        { status: 401 }
      );
    }

    if (action === "verifySession") {
      const isValid = verifySessionToken(token);
      return NextResponse.json({ success: isValid });
    }

    if (action === "logout") {
      if (token) {
        revokeSessionToken(token);
      }
      return NextResponse.json({ success: true, message: "Logged out successfully" });
    }

    if (action === "changePassword") {
      // Must verify active session or current password
      const isSessionValid = verifySessionToken(token);
      const isPassMatch = password && verifyPassword(password, stored.passwordHash);

      if (!isSessionValid && !isPassMatch) {
        return NextResponse.json(
          { success: false, message: "Current password incorrect or unauthorized" },
          { status: 401 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const updatedId = adminId?.trim() || stored.adminId;
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
