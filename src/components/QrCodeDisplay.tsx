"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { Download, Printer, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { UserSession } from "@/lib/types";

interface QrCodeDisplayProps {
  user: UserSession;
  checkedIn?: boolean;
  checkedInAt?: string | null;
}

export default function QrCodeDisplay({
  user,
  checkedIn = false,
  checkedInAt,
}: QrCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const passRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.qrToken) {
      QRCode.toDataURL(user.qrToken, {
        width: 320,
        margin: 2,
        color: {
          dark: "#05070f",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Generation error:", err));
    }
  }, [user]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `SAYONARA_PASS_${user.collegeId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Pass Card Container */}
      <div
        ref={passRef}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0a1128] via-[#060a1d] to-[#040612] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden"
      >
        {/* Holographic glowing borders & decorative lines */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400" />
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Fest Header */}
        <div className="text-center pb-5 border-b border-white/10 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono uppercase tracking-widest mb-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Official Digital Entry Pass
          </div>
          <h2 className="text-3xl font-black text-white font-mono tracking-wider">
            SAYONARA
          </h2>
          <p className="text-xs uppercase font-mono tracking-widest text-slate-400">
            CSE FAREWELL FEST &bull; BATCH 2021-2027
          </p>
        </div>

        {/* QR Code Presentation */}
        <div className="my-6 flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl shadow-2xl relative group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Entry Pass for ${user.name}`}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
              />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-100 text-xs font-mono text-slate-500">
                Generating Token...
              </div>
            )}
          </div>

          <div className="mt-3 px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-cyan-300 font-mono text-xs tracking-wider">
            TOKEN: {user.qrToken}
          </div>
        </div>

        {/* Student Credential Details */}
        <div className="space-y-3 pt-3 border-t border-white/10 text-sm font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase">Student Name</span>
            <span className="text-white font-bold">{user.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase">College ID</span>
            <span className="text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30">
              {user.collegeId}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase">Academic Standing</span>
            <span className="text-purple-300 font-semibold">{user.year} (CSE)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase">Entry Status</span>
            {checkedIn ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CHECKED IN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-cyan-400 font-bold text-xs bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED PASS
              </span>
            )}
          </div>

          {checkedIn && checkedInAt && (
            <div className="text-[11px] text-right text-slate-400">
              Verified at {new Date(checkedInAt).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Security instructions footer */}
        <div className="mt-6 pt-3 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 font-mono leading-tight">
            Present this QR pass at the entrance gate. Valid for 3rd &amp; 4th Year B.Tech CSE Students (6-Year Integrated: 2 Yrs PUC + 4 Yrs B.Tech). Non-transferable.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Pass
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-mono text-xs font-bold uppercase tracking-wider border border-white/15 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print Ticket
        </button>
      </div>
    </div>
  );
}
