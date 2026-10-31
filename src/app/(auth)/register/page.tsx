"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Sparkles,
  User,
  Hash,
  GraduationCap,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    collegeId: "",
    year: "4th Year",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Frontend validation
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Mobile number must be exactly 10 digits (e.g. 7842439105).");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, phone: cleanPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please check your details.");
      } else {
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#06b6d4", "#a855f7", "#3b82f6", "#10b981"],
        });

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 600);
      }
    } catch {
      setError("Unable to complete registration. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 tech-grid-bg relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-10 border border-cyan-500/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Official Entry Pass Registration
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
              JOIN SAYONARA 2026
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Restricted exclusively to Computer Science &amp; Engineering students (6-Year Integrated PUC + B.Tech)
            </p>
          </div>

          {/* Department Eligibility Banner */}
          <div className="mb-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Eligibility: CSE Department &bull; 6-Year Integrated &bull; 4th Year Seniors (2021-2027) &amp; 3rd Year Juniors (2022-2028)</span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* Full Name */}
            <div>
              <label className="text-slate-300 font-bold uppercase tracking-wider block mb-1.5">
                Full Name <span className="text-slate-500 normal-case font-normal">(as per college records)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* College ID & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-slate-300 font-bold uppercase tracking-wider">
                    College ID / Roll No.
                  </label>
                </div>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter College ID"
                    value={formData.collegeId}
                    onChange={(e) => {
                      const id = e.target.value.toUpperCase();
                      let nextYear = formData.year;
                      if (id.startsWith("O21") || id.startsWith("S21") || id.startsWith("O20")) {
                        nextYear = "4th Year";
                      } else if (id.startsWith("O22") || id.startsWith("S22")) {
                        nextYear = "3rd Year";
                      }
                      setFormData({ ...formData, collegeId: id, year: nextYear });
                    }}
                    className="w-full h-11 bg-[#050814] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white uppercase focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-slate-300 font-bold uppercase tracking-wider">
                    Department
                  </label>
                  <span className="text-[10px] text-slate-500 font-normal uppercase">Enforced</span>
                </div>
                <div className="h-11 px-3.5 rounded-xl bg-[#040612] border border-cyan-500/25 text-cyan-300 font-bold flex items-center justify-between">
                  <span>CSE</span>
                  <span className="text-[10px] text-cyan-400/80 font-normal">Dept of Computer Science</span>
                </div>
              </div>
            </div>

            {/* Academic Year Dropdown Menu */}
            <div>
              <div className="flex items-center justify-between mb-1.5 h-5">
                <label className="text-slate-300 font-bold uppercase tracking-wider">
                  Academic Year
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">Select 4th Year or 3rd Year</span>
              </div>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full h-11 bg-[#050814] border border-cyan-500/30 hover:border-cyan-500/60 text-white rounded-xl pl-10 pr-10 py-2.5 text-sm appearance-none cursor-pointer focus:outline-none focus:border-cyan-400 font-mono transition-colors"
                >
                  <option value="4th Year" className="bg-[#050814] text-white">
                    4th Year B.Tech (2021-2027 Graduating Seniors)
                  </option>
                  <option value="3rd Year" className="bg-[#050814] text-white">
                    3rd Year B.Tech (2022-2028 Host Juniors)
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Email & Phone - Strictly Aligned on the Same Line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-slate-300 font-bold uppercase tracking-wider truncate">
                    Email Address
                  </label>
                  <span className="text-[10px] text-slate-500 font-normal">Personal / College</span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 bg-[#050814] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-slate-300 font-bold uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <span className="text-[10px] text-slate-400 font-normal">{formData.phone.length}/10 digits</span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData({ ...formData, phone: digits });
                    }}
                    className="w-full h-11 bg-[#050814] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-slate-300 font-bold uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-11 bg-[#050814] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 h-5">
                  <label className="text-slate-300 font-bold uppercase tracking-wider">
                    Confirm Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full h-11 bg-[#050814] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Generating Digital QR Pass...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Register &amp; Claim QR Entry Pass</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs font-mono text-slate-400">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2"
            >
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
