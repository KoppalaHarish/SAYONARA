"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Camera,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  RefreshCw,
  User,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckInSuccess?: () => void;
}

interface VerificationResult {
  status: "VERIFIED" | "ALREADY_CHECKED_IN" | "NOT_FOUND";
  student?: {
    id: string;
    name: string;
    collegeId: string;
    year: string;
    department: string;
    qrToken: string;
  };
  attendance?: {
    checkedIn: boolean;
    checkedInAt: string;
    verifiedBy?: string;
  };
  message: string;
}

export default function QrScannerModal({
  isOpen,
  onClose,
  onCheckInSuccess,
}: QrScannerModalProps) {
  const [manualToken, setManualToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setResult(null);
      setManualToken("");
    }
  }, [isOpen]);

  const triggerVerification = async (tokenOrId: string) => {
    if (!tokenOrId.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/verify-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenOrId.trim() }),
      });

      const data: VerificationResult = await res.json();
      setResult(data);

      if (data.status === "VERIFIED") {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#06b6d4", "#3b82f6", "#10b981", "#a855f7"],
        });
        if (onCheckInSuccess) onCheckInSuccess();
      }
    } catch {
      setResult({
        status: "NOT_FOUND",
        message: "Failed to connect to verification server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("qr-reader-container");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopCamera();
          triggerVerification(decodedText);
        },
        () => {
          // Ignored per-frame qr search failure
        }
      );

      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera start error:", err);
      setCameraError(
        err?.message || "Could not access camera. Please allow camera permissions or use manual input."
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (html5QrCodeRef.current && cameraActive) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          html5QrCodeRef.current?.clear();
          setCameraActive(false);
        })
        .catch((err: any) => console.error("Camera stop error:", err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-mono">
                GATE ENTRY SCANNER
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Verify student QR pass &amp; register attendance
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Result Card */}
        {result && (
          <div
            className={`mb-6 p-6 rounded-2xl border-2 transition-all duration-300 ${
              result.status === "VERIFIED"
                ? "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                : result.status === "ALREADY_CHECKED_IN"
                ? "bg-amber-950/40 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                : "bg-rose-950/40 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)]"
            }`}
          >
            {result.status === "VERIFIED" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-2xl font-black text-emerald-300 font-mono">
                      ✓ ENTRY VERIFIED
                    </h4>
                    <p className="text-xs text-emerald-200/80 font-mono">
                      Attendance recorded successfully. Welcome to SAYONARA!
                    </p>
                  </div>
                </div>

                <div className="bg-[#050918]/80 p-4 rounded-xl border border-emerald-500/30 font-mono text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student:</span>
                    <span className="text-white font-bold">{result.student?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">College ID:</span>
                    <span className="text-cyan-400 font-bold">{result.student?.collegeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Year / Dept:</span>
                    <span className="text-purple-300">{result.student?.year} ({result.student?.department})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registration ID:</span>
                    <span className="text-slate-300 text-xs">{result.student?.qrToken}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-bold">Checked In Just Now</span>
                  </div>
                </div>
              </div>
            )}

            {result.status === "ALREADY_CHECKED_IN" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-2xl font-black text-amber-300 font-mono">
                      ⚠ ALREADY CHECKED IN
                    </h4>
                    <p className="text-xs text-amber-200/80 font-mono">
                      This pass has already been used for entry.
                    </p>
                  </div>
                </div>

                <div className="bg-[#050918]/80 p-4 rounded-xl border border-amber-500/30 font-mono text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student:</span>
                    <span className="text-white font-bold">{result.student?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">College ID:</span>
                    <span className="text-cyan-400 font-bold">{result.student?.collegeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Previous Check-in:</span>
                    <span className="text-amber-300 font-bold">
                      {result.attendance?.checkedInAt
                        ? new Date(result.attendance.checkedInAt).toLocaleTimeString()
                        : "Earlier"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {result.status === "NOT_FOUND" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                  <div>
                    <h4 className="text-2xl font-black text-rose-300 font-mono">
                      ✖ PASS INVALID
                    </h4>
                    <p className="text-xs text-rose-200/80 font-mono">
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setResult(null);
                setManualToken("");
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Ready For Next Pass
            </button>
          </div>
        )}

        {/* Camera Scanner View */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              Camera Feed
            </span>

            {cameraActive ? (
              <button
                onClick={stopCamera}
                className="text-xs font-mono text-rose-400 hover:underline cursor-pointer"
              >
                Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Activate Camera
              </button>
            )}
          </div>

          <div
            id="qr-reader-container"
            className={`w-full rounded-2xl overflow-hidden border border-cyan-500/20 bg-[#040714] min-h-[160px] flex items-center justify-center ${
              !cameraActive ? "p-6" : ""
            }`}
          >
            {!cameraActive && (
              <div className="text-center space-y-2">
                <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-mono">
                  Click &apos;Activate Camera&apos; to scan student physical/phone screen QR code.
                </p>
                {cameraError && (
                  <p className="text-xs text-rose-400 font-mono">{cameraError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Manual Input Fallback */}
        <div className="pt-4 border-t border-white/10">
          <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Manual Verification (Token or College ID)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 21CS042 or SAY-21CS042-7X89Q"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") triggerVerification(manualToken);
              }}
              className="flex-1 bg-[#060a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              disabled={loading || !manualToken.trim()}
              onClick={() => triggerVerification(manualToken)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Checking..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
