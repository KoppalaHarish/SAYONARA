"use client";

import { useState, useMemo } from "react";
import {
  Image as ImageIcon,
  ZoomIn,
  X,
  Play,
  Film,
  Camera,
  ExternalLink,
} from "lucide-react";
import { GalleryItem } from "@/lib/types";

interface GalleryGridProps {
  items: GalleryItem[];
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Dynamic category tabs + Media Type tabs
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);
    return ["All", "Photos Only", "Videos Only", ...categories];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const isVideo = item.mediaType === "video" || Boolean(item.videoUrl);
      if (selectedFilter === "All") return true;
      if (selectedFilter === "Photos Only") return !isVideo;
      if (selectedFilter === "Videos Only") return isVideo;
      return item.category.toLowerCase() === selectedFilter.toLowerCase();
    });
  }, [items, selectedFilter]);

  return (
    <div className="w-full">
      {/* Category & Media Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => setSelectedFilter(option)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all duration-200 cursor-pointer ${
              selectedFilter === option
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] font-bold"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 space-y-3">
          <Film className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400 font-mono">
            No memories match the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isVideo = item.mediaType === "video" || Boolean(item.videoUrl);
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 cursor-pointer aspect-4/3 flex flex-col justify-end"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Media Type Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 z-10">
                  {isVideo ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Play className="w-2.5 h-2.5 fill-white" />
                      Video
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-600/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Camera className="w-2.5 h-2.5" />
                      Photo
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-300 font-mono text-[10px]">
                    {item.year}
                  </span>
                </div>

                {/* Play button overlay for video */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Hover zoom icon for photo */}
                {!isVideo && (
                  <div className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-cyan-400" />
                  </div>
                )}

                {/* Caption & Tag */}
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white font-mono leading-tight group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Video Player */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-3xl rounded-2xl overflow-hidden border border-purple-500/30 relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/70 text-slate-300 hover:text-white backdrop-blur-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Screen */}
            <div className="relative aspect-16/9 w-full bg-black shrink-0">
              {activeItem.mediaType === "video" || activeItem.videoUrl ? (
                getYouTubeEmbedUrl(activeItem.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeItem.videoUrl)!}
                    title={activeItem.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : activeItem.videoUrl?.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video
                    src={activeItem.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-900">
                    <img
                      src={activeItem.imageUrl}
                      alt={activeItem.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <div className="relative z-10 space-y-3">
                      <Play className="w-12 h-12 text-rose-500 mx-auto" />
                      <p className="text-sm font-mono text-white">Video Stream Link Available</p>
                      {activeItem.videoUrl && (
                        <a
                          href={activeItem.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider"
                        >
                          <span>Open Video Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div
                  className="w-full h-full bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: `url(${activeItem.imageUrl})` }}
                />
              )}
            </div>

            {/* Caption Info */}
            <div className="p-6 bg-[#070b19] overflow-y-auto">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono">
                  {activeItem.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Batch {activeItem.year} (6-Yr Integrated)
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white font-mono mb-2">
                {activeItem.title}
              </h3>
              {activeItem.description && (
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
