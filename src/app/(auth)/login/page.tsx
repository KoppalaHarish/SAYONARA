"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
      } else {
        // Fast instant redirect without double router refresh
        window.location.href = data.user?.role === "admin" ? "/admin" : "/dashboard";
      }
    } catch {
      setError("Unable to connect to login server. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 tech-grid-bg relative">
      {/* Background glow halos */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-10 border border-cyan-500/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              SAYONARA Access Portal
            </div>
            <h1 className="text-3xl font-black text-white font-mono tracking-tight">
              STUDENT LOGIN
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Enter your College ID &amp; password to view your pass
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  College ID / Email / Mobile
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">Any registered credential</span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter College ID, Email, or Mobile Number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors uppercase"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Quick Login */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-2.5 text-center">
              Admin Access
            </span>
            <div className="grid grid-cols-1 gap-2 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => handleQuickFill("CSE-ADMIN", "Admin@Sayonara2026")}
                className="p-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-500/30 text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Coordinator (CSE-ADMIN)</span>
              </button>
            </div>
          </div>

          {/* Link to Register */}
          <div className="mt-6 text-center text-xs font-mono text-slate-400">
            Don&apos;t have an entry pass yet?{" "}
            <Link
              href="/register"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2"
            >
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
