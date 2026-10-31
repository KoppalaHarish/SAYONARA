import Link from "next/link";
import { Terminal, Shield, Mail, Phone, MapPin, Heart, Sparkles, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-cyan-500/15 bg-[#03050c] overflow-hidden">
      {/* Decorative gradient glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/10 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-[#05070f] rounded-[11px] flex items-center justify-center">
                  <span className="font-mono font-black text-cyan-400 text-lg">S/</span>
                </div>
              </div>
              <div>
                <h3 className="font-mono font-black text-lg text-white tracking-wider">SAYONARA</h3>
                <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase">CSE Farewell Fest 2026</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              A farewell experience built by CSE, for CSE. Celebrating six years of code, camaraderie, 2 years PUC &amp; 4 years B.Tech, late-night hackathons, and lasting memories.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>3rd &amp; 4th Year B.Tech (6-Yr Integrated) Only</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Home / Overview
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-cyan-400 transition-colors">
                  Fest Events &amp; Competitions
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-cyan-400 transition-colors">
                  Event Timeline &amp; Schedule
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-cyan-400 transition-colors">
                  CSE Memories &amp; Moments
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-cyan-400 transition-colors">
                  Organizing Council &amp; Faculty
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Help Desk &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Student & Pass Portals */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              Student Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  → Student Registration
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pass" className="hover:text-cyan-400 transition-colors">
                  Digital QR Entry Pass
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                  Organizer &amp; Admin Portal
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Department Contact Details */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Department Desk
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                <span>Department of Computer Science &amp; Engineering, CSE BLOCK</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="mailto:rhariesh1@gmail.com" className="hover:text-cyan-400 transition-colors">
                  rhariesh1@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="tel:7842439105" className="hover:text-cyan-400 transition-colors">
                  +91 7842439105
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© 2026 SAYONARA CSE Farewell • Honoring Batch 2021-2027 (6-Yr Integrated) • Built by Batch 2022-2028.</p>
          <p className="flex items-center gap-1.5">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by CSE Tech Team
          </p>
        </div>
      </div>
    </footer>
  );
}
