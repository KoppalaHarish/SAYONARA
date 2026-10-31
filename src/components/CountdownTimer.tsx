"use client";

import { useState, useEffect } from "react";
import { Clock, AlertCircle, Calendar, MapPin } from "lucide-react";

interface CountdownTimerProps {
  targetDateString?: string;
  festDateLabel?: string;
  venueLabel?: string;
}

export default function CountdownTimer({
  targetDateString = "2027-03-20T09:00:00",
  festDateLabel = "20 MARCH 2027",
  venueLabel = "CSE BLOCK",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      // Default to 20 March 2027 09:00:00 AM IST
      const targetTime = new Date("2027-03-20T09:00:00").getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDateString]);

  const displayDate = festDateLabel && !festDateLabel.includes("COMING SOON")
    ? festDateLabel
    : "20 MARCH 2027";

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        {/* Ambient glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left Info: Fest Date & Venue */}
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Fest Schedule &amp; Live Countdown</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              DATE:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
                {displayDate}
              </span>
            </h3>

            <p className="text-sm text-slate-300 flex items-center justify-center md:justify-start gap-2 font-mono">
              <span className="text-slate-400">VENUE:</span>
              <span className="text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                {venueLabel}
              </span>
            </p>
          </div>

          {/* Right: Live Countdown Boxes (DAYS, HOURS, MINUTES, SECONDS) */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full sm:w-auto">
            {[
              { label: "DAYS", val: mounted ? timeLeft.days : 166 },
              { label: "HOURS", val: mounted ? timeLeft.hours : 9 },
              { label: "MINUTES", val: mounted ? timeLeft.minutes : 45 },
              { label: "SECONDS", val: mounted ? timeLeft.seconds : 30 },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center bg-[#070c1d] border border-cyan-500/30 rounded-2xl p-3 sm:px-5 sm:py-4 shadow-lg shadow-cyan-500/5 group hover:border-cyan-400 transition-colors"
              >
                <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 tracking-tight">
                  {String(unit.val).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-1 font-semibold group-hover:text-cyan-300 transition-colors">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer strip */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Official SAYONARA CSE Farewell Fest commences on Saturday, 20 March 2027
          </span>
          <span className="text-purple-300/90 font-semibold">Venue: CSE BLOCK</span>
        </div>
      </div>
    </div>
  );
}
