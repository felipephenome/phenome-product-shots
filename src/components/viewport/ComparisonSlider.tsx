import { useRef, useState, useCallback, useEffect } from "react";
import { ImageLabels } from "./ImageLabels";
import { MagnifyingLens } from "./MagnifyingLens";

interface ComparisonSliderProps {
  originalSrc: string;
  relitSrc: string;
  magnifyActive?: boolean;
  magnifyZoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export function ComparisonSlider({
  originalSrc,
  relitSrc,
  magnifyActive = false,
  magnifyZoom = 200,
  onZoomChange,
}: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    setPosition(Math.max(2, Math.min(98, (x / rect.width) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updatePosition]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!magnifyActive) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [magnifyActive]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  const currentSide = mousePos
    ? (mousePos.x / (containerRef.current?.offsetWidth ?? 1)) * 100 < position
      ? "original"
      : "relit"
    : null;

  const magnifySrc = currentSide === "original" ? originalSrc : relitSrc;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 select-none overflow-hidden"
      style={{ cursor: magnifyActive ? "none" : "col-resize" }}
      onMouseDown={(e) => {
        if (magnifyActive) return;
        setDragging(true);
        updatePosition(e.clientX);
      }}
      onTouchStart={(e) => {
        if (magnifyActive) return;
        setDragging(true);
        updatePosition(e.touches[0].clientX);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ImageLabels showComparison />

      {/* Relit image (right/full) */}
      <img
        src={relitSrc}
        alt="Relit"
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      {/* Original image (left, clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={originalSrc}
          alt="Original"
          className="absolute inset-0 h-full object-contain"
          style={{ width: `${containerRef.current?.offsetWidth || 9999}px`, maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Slider line + handle */}
      <div
        className="absolute top-0 bottom-0 z-20 pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-px h-full mx-auto" style={{ background: "rgba(255,255,255,0.7)" }} />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center pointer-events-auto"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            cursor: magnifyActive ? "none" : "col-resize",
          }}
          onMouseDown={(e) => {
            if (magnifyActive) return;
            e.stopPropagation();
            setDragging(true);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <polyline points="9 6 3 12 9 18" />
            <polyline points="15 6 21 12 15 18" />
          </svg>
        </div>
      </div>

      {/* Magnifying lens for comparison mode */}
      {magnifyActive && mousePos && onZoomChange && (
        <MagnifyingLens
          imageSrc={magnifySrc}
          containerRef={containerRef}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          zoom={magnifyZoom}
          onZoomChange={onZoomChange}
        />
      )}
    </div>
  );
}
