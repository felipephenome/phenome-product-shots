import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useLightingStore } from "@/stores/lightingStore";
import { downloadImage, convertFormat } from "@/utils/imageUtils";
import { useState } from "react";

export function Toolbar() {
  const activeId = useWorkspaceStore((s) => s.activeId);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const restoreDefaults = useWorkspaceStore((s) => s.restoreDefaults);
  const resetLighting = useLightingStore((s) => s.reset);
  const magnifyActive = useWorkspaceStore((s) => s.magnifyActive);
  const setMagnifyActive = useWorkspaceStore((s) => s.setMagnifyActive);
  const active = workspaces.find((w) => w.id === activeId);
  const [convertMenuOpen, setConvertMenuOpen] = useState(false);

  if (!active) return null;

  const hasRelit = !!active.relitImage;
  const imageSrc = active.relitImage || active.originalImage;

  const iconBtn = "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors";

  return (
    <div className="flex items-center gap-1">
      {/* Magnifying glass toggle */}
      <button
        className={iconBtn}
        style={{
          color: magnifyActive ? "var(--accent)" : "var(--text-secondary)",
          background: magnifyActive ? "rgba(0, 190, 255, 0.12)" : undefined,
        }}
        onClick={() => setMagnifyActive(!magnifyActive)}
        title={magnifyActive ? "Disable magnifier" : "Enable magnifier"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {hasRelit && (
        <button
          className={iconBtn}
          style={{ color: "var(--text-secondary)" }}
          onClick={() => { if (imageSrc) downloadImage(imageSrc, `phenome-stash-${active.name}`); }}
          title="Download"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      )}

      {hasRelit && (
        <div className="relative">
          <button
            className={iconBtn}
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setConvertMenuOpen((p) => !p)}
            title="Convert"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>
          {convertMenuOpen && (
            <div
              className="absolute bottom-full right-0 mb-2 p-1.5 rounded-xl z-50"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
            >
              {(["png", "jpeg", "webp"] as const).map((fmt) => (
                <button
                  key={fmt}
                  className="block w-full text-left px-3 py-1.5 text-[11px] rounded-lg transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={async () => {
                    if (!imageSrc) return;
                    const converted = await convertFormat(imageSrc, fmt);
                    downloadImage(converted, `phenome-stash-${active.name}`, fmt);
                    setConvertMenuOpen(false);
                  }}
                >
                  .{fmt.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        className={iconBtn}
        style={{ color: "var(--text-secondary)" }}
        onClick={() => { if (activeId) { restoreDefaults(activeId); resetLighting(); } }}
        title="Restore defaults"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>
    </div>
  );
}
