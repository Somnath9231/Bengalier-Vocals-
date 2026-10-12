"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, ShieldAlert, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Session-only persistence: check if an active session exists in current browser session
    const token = sessionStorage.getItem("bengalier_admin_session_token");
    if (token) {
      // Verify session with server before redirecting
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verifySession", token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            router.push("/admin");
          } else {
            sessionStorage.removeItem("bengalier_admin_session_token");
            sessionStorage.removeItem("bengalier_admin_id");
          }
        })
        .catch(() => {
          sessionStorage.removeItem("bengalier_admin_session_token");
        });
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          adminId: adminId.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store in sessionStorage so reopening the link in a fresh session requires logging in again
        sessionStorage.setItem("bengalier_admin_session_token", data.token);
        sessionStorage.setItem("bengalier_admin_id", data.user?.adminId || adminId);
        // Clean any old local storage
        localStorage.removeItem("bengalier_admin_token");
        localStorage.removeItem("bengalier_admin_id");
        router.push("/admin");
      } else {
        setError(data.message || "Invalid Admin ID or Password");
      }
    } catch (err) {
      setError("Secure network error during authentication. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-stone-100 via-stone-50 to-stone-100 text-[#161616] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-3xl shadow-xl shadow-stone-200/60 p-8 sm:p-10 space-y-7 transition-all">
        
        {/* Top Header Logo & Badges */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative h-16 w-64 sm:w-72 transition-transform hover:scale-102">
            <Image
              src="/logo.jpg"
              alt="Bengalier Vocals Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#C1121F] text-xs font-semibold tracking-wide shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C1121F]" />
            <span>Secure Enterprise Portal</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-stone-900">
              Admin Authentication
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Authorized personnel only. Sessions require re-authentication.
            </p>
          </div>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="rounded-2xl bg-red-50/90 border border-red-200/90 text-[#C1121F] text-xs p-4 flex items-start gap-3 shadow-xs animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle className="w-4 h-4 text-[#C1121F] shrink-0 mt-0.5" />
            <div className="font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block ml-1">
              Admin Identification
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type="text"
                required
                autoComplete="username"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Admin ID"
                className="w-full bg-stone-50/70 border border-stone-200 rounded-2xl text-stone-900 text-sm py-3 pl-11 pr-4 focus:outline-none focus:border-[#C1121F] focus:ring-4 focus:ring-red-500/10 focus:bg-white transition-all placeholder:text-stone-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block ml-1">
              Secret Passkey
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full bg-stone-50/70 border border-stone-200 rounded-2xl text-stone-900 text-sm py-3 pl-11 pr-11 focus:outline-none focus:border-[#C1121F] focus:ring-4 focus:ring-red-500/10 focus:bg-white transition-all placeholder:text-stone-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C1121F] hover:bg-[#A30F1A] active:scale-[0.99] text-white text-sm font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-600/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Trust Indicators */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium px-1">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-stone-400" />
            <span>Encrypted Token Session</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-stone-600">Brute-Force Protected</span>
          </div>
        </div>

      </div>
    </div>
  );
}
