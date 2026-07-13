import type { Generation } from "@/types";
import { AVAILABLE_MODELS } from "@/types";
import { downloadImage } from "@/utils/imageUtils";

interface GenerationCardProps {
  generation: Generation;
  onLoad: (gen: Generation) => void;
  onDelete: (id: string) => void;
}

export function GenerationCard({ generation, onLoad, onDelete }: GenerationCardProps) {
  const model = AVAILABLE_MODELS.find((m) => m.id === generation.model);
  const date = new Date(generation.timestamp);
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <div
      className="rounded-xl overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]"
      style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
      onClick={() => onLoad(generation)}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={generation.relitImage}
          alt=""
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Load
          </span>
        </div>
      </div>

      <div className="p-2">
        <p className="text-[10px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {model?.name || "Unknown"}
        </p>
        <p className="text-[9px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {dateStr} {timeStr}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <button
            className="flex items-center gap-1 text-[9px] font-medium"
            style={{ color: "var(--accent)" }}
            onClick={(e) => {
              e.stopPropagation();
              const safeDate = dateStr.replace(/\s/g, "-").replace(/,/g, "");
              const safeTime = timeStr.replace(":", ".");
              const name = `phenome-stash-${safeDate}-${safeTime}`;
              downloadImage(generation.relitImage, name, "png");
            }}
            title="Download relit image (full resolution)"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
          <button
            className="text-[9px] font-medium"
            style={{ color: "var(--text-tertiary)" }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(generation.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
