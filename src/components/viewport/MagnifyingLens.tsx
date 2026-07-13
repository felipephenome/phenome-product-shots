import { useRef, useEffect, useCallback } from "react";

interface MagnifyingLensProps {
  imageSrc: string;
  containerRef: React.RefObject<HTMLElement | null>;
  mouseX: number;
  mouseY: number;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  lensSize?: number;
}

export function MagnifyingLens({
  imageSrc,
  containerRef,
  mouseX,
  mouseY,
  zoom,
  onZoomChange,
  lensSize = 180,
}: MagnifyingLensProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgLoadedRef = useRef(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgLoadedRef.current = true;
      imgRef.current = img;
      draw();
    };
    img.src = imageSrc;
    imgLoadedRef.current = false;
    imgRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    const container = containerRef.current;
    if (!canvas || !img || !imgLoadedRef.current || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = lensSize * dpr;
    canvas.height = lensSize * dpr;
    ctx.scale(dpr, dpr);

    const containerRect = container.getBoundingClientRect();

    const imgEl = container.querySelector("img");
    if (!imgEl) return;

    const imgRect = imgEl.getBoundingClientRect();

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const scaleX = naturalW / imgRect.width;
    const scaleY = naturalH / imgRect.height;

    const cursorImgX = (mouseX + containerRect.left - imgRect.left) * scaleX;
    const cursorImgY = (mouseY + containerRect.top - imgRect.top) * scaleY;

    const zoomFactor = zoom / 100;
    const srcW = lensSize / zoomFactor;
    const srcH = lensSize / zoomFactor;
    const srcX = cursorImgX - srcW / 2;
    const srcY = cursorImgY - srcH / 2;

    ctx.clearRect(0, 0, lensSize, lensSize);

    ctx.save();
    ctx.beginPath();
    ctx.arc(lensSize / 2, lensSize / 2, lensSize / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, lensSize, lensSize);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(lensSize / 2, lensSize / 2, lensSize / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    const crossLen = 10;
    const cx = lensSize / 2;
    const cy = lensSize / 2;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - crossLen, cy);
    ctx.lineTo(cx + crossLen, cy);
    ctx.moveTo(cx, cy - crossLen);
    ctx.lineTo(cx, cy + crossLen);
    ctx.stroke();
    ctx.restore();
  }, [mouseX, mouseY, zoom, lensSize, containerRef]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -25 : 25;
      onZoomChange(zoom + delta);
    },
    [zoom, onZoomChange]
  );

  const half = lensSize / 2;

  return (
    <div
      className="pointer-events-auto absolute z-50"
      style={{
        left: mouseX - half,
        top: mouseY - half,
        width: lensSize,
        height: lensSize,
      }}
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: lensSize,
          height: lensSize,
          borderRadius: "50%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12)",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
        style={{
          top: lensSize + 6,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(8px)",
          borderRadius: 6,
          padding: "2px 8px",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
          {zoom}%
        </span>
      </div>
    </div>
  );
}
