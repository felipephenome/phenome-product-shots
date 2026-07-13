import { useRef, useState, useCallback } from "react";
import type { Workspace } from "@/types";
import { ComparisonSlider } from "./ComparisonSlider";
import { MagnifyingLens } from "./MagnifyingLens";
import { useWorkspaceStore } from "@/stores/workspaceStore";

interface ImageViewportProps {
  workspace: Workspace;
}

export function ImageViewport({ workspace }: ImageViewportProps) {
  const [compareMode, setCompareMode] = useState(true);
  const isGenerating = useWorkspaceStore((s) => s.isGenerating);
  const progress = useWorkspaceStore((s) => s.generationProgress);
  const magnifyActive = useWorkspaceStore((s) => s.magnifyActive);
  const magnifyZoom = useWorkspaceStore((s) => s.magnifyZoom);
  const setMagnifyZoom = useWorkspaceStore((s) => s.setMagnifyZoom);
  const hasRelit = !!workspace.relitImage;

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!magnifyActive) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [magnifyActive]);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  const displayedSrc = hasRelit ? workspace.relitImage! : workspace.originalImage!;

  return (
    <div className="absolute inset-0" style={{ background: "var(--bg-primary)" }}>
      {/* Image display */}
      <div
        ref={imageContainerRef}
        className="absolute inset-0 flex items-center justify-center p-6"
        style={{ cursor: magnifyActive ? "none" : undefined }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {hasRelit && compareMode ? (
          <ComparisonSlider
            originalSrc={workspace.originalImage!}
            relitSrc={workspace.relitImage!}
            magnifyActive={magnifyActive}
            magnifyZoom={magnifyZoom}
            onZoomChange={setMagnifyZoom}
          />
        ) : (
          <>
            <img
              src={displayedSrc}
              alt="Workspace"
              className="max-w-full max-h-full object-contain select-none"
              style={{ borderRadius: "var(--radius-sm)" }}
              draggable={false}
            />
            <div className="absolute top-5 left-5 z-10">
              <span
                className="badge"
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  border: "1px solid rgba(32, 58, 133, 0.2)",
                }}
              >
                {hasRelit ? "Relight" : "Original"}
              </span>
            </div>
          </>
        )}

        {/* Magnifying lens for single-image mode */}
        {magnifyActive && mousePos && !(hasRelit && compareMode) && (
          <MagnifyingLens
            imageSrc={displayedSrc}
            containerRef={imageContainerRef}
            mouseX={mousePos.x}
            mouseY={mousePos.y}
            zoom={magnifyZoom}
            onZoomChange={setMagnifyZoom}
          />
        )}
      </div>

      {/* Generation overlay */}
      {isGenerating && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        >
          <div className="glass-panel px-10 py-7 flex flex-col items-center gap-4 min-w-[220px]">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
            />
            <p className="text-[14px] font-medium text-center" style={{ color: "var(--text-primary)" }}>
              {progress || "Generating..."}
            </p>
          </div>
        </div>
      )}

      {/* Compare toggle -- top right of viewport */}
      {hasRelit && (
        <button
          className="absolute top-5 right-5 z-10 pill-btn text-[11px]"
          onClick={() => setCompareMode((p) => !p)}
          style={{ backdropFilter: "blur(12px)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
          {compareMode ? "Compare" : "Compare"}
        </button>
      )}
    </div>
  );
}
