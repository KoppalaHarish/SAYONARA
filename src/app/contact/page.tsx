"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Terminal,
  Globe,
  Share2,
  Code2,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    collegeId: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSubmitted(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to transmit inquiry.");
      } else {
        setSubmitted(data.message || "Thank you! Your message has been routed to the student leads.");
        setForm({ name: "", collegeId: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(null), 6000);
      }
    } catch {
      setErrorMessage("Network error: Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          Department Helpdesk
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight mb-4">
          CONTACT &amp; INQUIRIES
        </h1>
        <p className="text-slate-400 text-base font-normal leading-relaxed">
          Have questions regarding registrations, entry passes, event rules, or auditions? Reach out to the CSE fest organizing desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Department Credentials */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Department Headquarters
            </h3>

            <div className="space-y-4 font-mono text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                <div>
                  <span className="text-white font-bold block">Department of Computer Science &amp; Engg</span>
                  <span className="text-xs text-slate-400">CSE BLOCK</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
                <div>
                  <span className="text-white font-bold block">Fest Inquiries &amp; Technical Support</span>
                  <a
                    href="mailto:rhariesh1@gmail.com"
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    rhariesh1@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <span className="text-white font-bold block">Department Coordinator Desk</span>
                  <a
                    href="tel:7842439105"
                    className="text-xs text-cyan-400 hover:underline block"
                  >
                    +91 7842439105 (7842439105)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <div>
                  <span className="text-white font-bold block">Helpdesk Hours</span>
                  <span className="text-xs text-slate-400">Monday - Friday: 09:30 AM to 05:00 PM</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
                Social Channels
              </h4>
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 cursor-pointer" title="Department Website">
                  <Globe className="w-4 h-4" />
                </span>
                <span className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 cursor-pointer" title="Community Network">
                  <Share2 className="w-4 h-4" />
                </span>
                <span className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 cursor-pointer" title="Tech Lab Repository">
                  <Code2 className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="glass-panel-glow rounded-3xl p-8 border border-cyan-500/30">
          <h3 className="text-xl font-bold text-white font-mono mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Send an Inquiry
          </h3>
          <p className="text-xs text-slate-400 font-mono mb-6">
            Directly transmitted to the CSE student coordination team
          </p>

          {submitted && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{submitted}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">College ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 21CS042"
                  value={form.collegeId}
                  onChange={(e) => setForm({ ...form, collegeId: e.target.value })}
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="student@college.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Inquiry Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Query on Code-Off rules / Pass issue"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your inquiry..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-[#050814] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Transmitting..." : "Send Message to Fest Desk"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
