import { db } from "@/lib/db";
import GalleryGrid from "@/components/GalleryGrid";
import { Image as ImageIcon, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  const galleryItems = db.getGallery();

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          Memories &amp; Moments
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight mb-4">
          CSE MEMORY VAULT
        </h1>
        <p className="text-slate-400 text-base font-normal leading-relaxed">
          Snapshots of six unforgettable years: 2 years PUC, 4 years B.Tech, hackathons, campus concerts, farewell tears, and competitive gaming arenas.
        </p>
      </div>

      <GalleryGrid items={galleryItems} />
    </div>
  );
}
