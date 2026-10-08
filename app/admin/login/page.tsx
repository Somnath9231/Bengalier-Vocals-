"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to /admin dashboard
    const token = localStorage.getItem("bengalier_admin_token");
    if (token) {
      router.push("/admin");
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
          adminId,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("bengalier_admin_token", data.token);
        localStorage.setItem("bengalier_admin_id", adminId);
        router.push("/admin");
      } else {
        setError(data.message || "Invalid Admin ID or Password");
      }
    } catch (err) {
      setError("Server error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#161616] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white border-2 border-stone-900 shadow-xl p-8 space-y-6">
        
        {/* Top Header Logo */}
        <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-stone-200">
          <div className="relative h-14 w-56">
            <Image
              src="/logo.jpg"
              alt="Bengalier Vocals Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#C1121F]">
              <ShieldCheck className="w-4 h-4" />
              <span>Contact Database Terminal</span>
            </div>
            <h1 className="text-xl font-extrabold text-[#161616]">
              Admin Access Login
            </h1>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-[#C1121F] text-xs p-3.5 flex items-start gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 text-[#C1121F] shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Admin ID / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Admin ID"
                className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm py-3 pl-10 pr-4 focus:outline-none focus:border-[#C1121F] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full bg-[#FAFAFA] border border-stone-300 text-stone-900 text-sm py-3 pl-10 pr-4 focus:outline-none focus:border-[#C1121F] focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs font-bold uppercase tracking-wider py-3.5 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Credentials Info Helper */}
        <div className="pt-4 border-t border-stone-200 text-center space-y-1">
          <div className="text-[11px] text-stone-600 font-mono">
            Default Credentials: ID <span className="text-[#161616] font-bold">admin</span> | Password <span className="text-[#161616] font-bold">admin123</span>
          </div>
          <div className="text-[10px] text-stone-500">
            You can change ID & Password anytime inside the terminal settings.
          </div>
        </div>

      </div>
    </div>
  );
}
