"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  Menu,
  X,
  QrCode,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  Calendar,
  Layers,
  Image as ImageIcon,
  Users,
  Mail,
  ChevronRight,
} from "lucide-react";
import { UserSession, FestSettings } from "@/lib/types";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [settings, setSettings] = useState<FestSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
    fetchSettings();
  }, [pathname]);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      // Ignore network errors on mount
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch {
      // Fallback
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Events", href: "/events" },
    { label: "Schedule", href: "/schedule" },
    { label: "Gallery", href: "/gallery" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/15 bg-[#05070f]/85 backdrop-blur-xl">
      {/* Top micro-announcement banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-purple-900/60 to-cyan-900/60 px-4 py-1.5 text-center text-xs font-mono tracking-wider text-cyan-200/90 border-b border-white/5 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>
          {settings?.bannerMessage ||
            "CSE FAREWELL FEST • CELEBRATING 2021-2027 BATCH (6 YEARS PUC + B.TECH) • 3RD & 4TH YEAR CSE"}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Department Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#070b19] rounded-[11px] flex items-center justify-center">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-lg tracking-tighter">
                  S/
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider text-white flex items-center gap-1.5 font-mono">
                SAYONARA
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  CSE &apos;26
                </span>
              </span>
              <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                Dept of Computer Science &amp; Engg
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-24 h-9 bg-white/5 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2.5">
                {user.role === "admin" ? (
                  <>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-purple-500/20 border border-purple-400/30 transition-all"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition-all"
                    >
                      <UserIcon className="w-4 h-4 text-cyan-400" />
                      <span>{user.name.split(" ")[0]}</span>
                      <span className="text-[10px] bg-cyan-400/20 px-1 rounded text-cyan-200">
                        {user.year?.includes("4th") ? "4th Yr B.Tech" : "3rd Yr B.Tech"}
                      </span>
                    </Link>
                    <Link
                      href="/pass"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      My QR Pass
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Student Login
                </Link>
                <Link
                  href="/register"
                  className="relative group px-4 py-2 rounded-lg overflow-hidden font-semibold text-xs uppercase tracking-wider text-white shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 group-hover:scale-105 transition-transform duration-300" />
                  <div className="relative flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Register Now</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <Link
                href="/pass"
                className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              >
                <QrCode className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#070b19]/95 backdrop-blur-2xl px-5 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5 mb-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {user ? (
              <>
                <div className="px-3.5 py-2 rounded-lg bg-white/5 text-xs text-slate-300 flex items-center justify-between">
                  <span>Logged in as:</span>
                  <span className="font-semibold text-cyan-400">{user.name}</span>
                </div>
                {user.role === "admin" ? (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-600 text-white text-sm font-semibold"
                    >
                      <UserIcon className="w-4 h-4" />
                      Student Dashboard
                    </Link>
                    <Link
                      href="/pass"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
                    >
                      <QrCode className="w-4 h-4" />
                      My Digital QR Entry Pass
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium border border-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-white/5 text-slate-200 text-sm font-medium hover:bg-white/10"
                >
                  Student Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Register Now (3rd &amp; 4th Year B.Tech)
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
