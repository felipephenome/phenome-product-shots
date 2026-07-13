import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import p5 from "p5";
import { useLightingStore } from "@/stores/lightingStore";
import { sphereToCartesian, cartesianToSphere } from "@/utils/lightMath";
import type { LightShape } from "@/types";

const SHAPES: { value: LightShape; label: string }[] = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "plane", label: "Plane" },
];

export function LightPicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const settingsRef = useRef(useLightingStore.getState().settings);
  const shapeRef = useRef<LightShape>("sphere");
  const selectedLightIdRef = useRef<"primary" | string>("primary");
  const orbitRef = useRef({ x: -0.3, y: 0.15 });
  const orbitModeRef = useRef(false);
  const setPrimaryLight = useLightingStore((s) => s.setPrimaryLight);
  const updateLight = useLightingStore((s) => s.updateLight);
  const lightShape = useLightingStore((s) => s.lightShape);
  const setLightShape = useLightingStore((s) => s.setLightShape);
  const selectedLightId = useLightingStore((s) => s.selectedLightId);
  const setSelectedLight = useLightingStore((s) => s.setSelectedLight);
  const primaryColor = useLightingStore((s) => s.settings.color);
  const additionalLightsRaw = useLightingStore(
    (s) => s.settings.additionalLights
  );
  const additionalLights = useMemo(
    () => additionalLightsRaw.filter((l) => l.enabled),
    [additionalLightsRaw]
  );
  const settings = useLightingStore((s) => s.settings);
  const [orbitMode, setOrbitMode] = useState(false);

  const angleDisplay = useMemo(() => {
    if (selectedLightId === "primary") {
      return `${Math.round(settings.primaryLight.azimuth)}\u00B0 / ${Math.round(settings.primaryLight.elevation)}\u00B0`;
    }
    const sel = additionalLights.find((l) => l.id === selectedLightId);
    const az = sel?.position.azimuth ?? settings.primaryLight.azimuth;
    const el = sel?.position.elevation ?? settings.primaryLight.elevation;
    return `${Math.round(az)}\u00B0 / ${Math.round(el)}\u00B0`;
  }, [selectedLightId, settings.primaryLight, additionalLights]);

  useEffect(() => {
    shapeRef.current = lightShape;
  }, [lightShape]);

  useEffect(() => {
    selectedLightIdRef.current = selectedLightId;
  }, [selectedLightId]);

  useEffect(() => {
    orbitModeRef.current = orbitMode;
  }, [orbitMode]);

  useEffect(() => {
    return useLightingStore.subscribe((state) => {
      settingsRef.current = state.settings;
    });
  }, []);

  const sketch = useCallback(
    (p: p5) => {
      const SIZE = 280;
      const SHAPE_R = 90;

      p.setup = () => {
        const canvas = p.createCanvas(SIZE, SIZE, p.WEBGL);
        canvas.style("display", "block");
        p.frameRate(30);

        const canvasEl = canvas.elt as HTMLCanvasElement;
        let dragging = false;
        let lastMx = 0;
        let lastMy = 0;

        canvasEl.addEventListener("pointerdown", (e: PointerEvent) => {
          e.preventDefault();
          canvasEl.setPointerCapture(e.pointerId);
          dragging = true;
          const rect = canvasEl.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          lastMx = mx;
          lastMy = my;

          if (!orbitModeRef.current) {
            const pos = screenToSphere(mx, my);
            if (pos) applyPosition(pos);
          }
        });

        canvasEl.addEventListener("pointermove", (e: PointerEvent) => {
          if (!dragging) return;
          const rect = canvasEl.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;

          if (orbitModeRef.current) {
            const dx = mx - lastMx;
            const dy = my - lastMy;
            orbitRef.current = {
              x: orbitRef.current.x - dy * 0.008,
              y: orbitRef.current.y + dx * 0.008,
            };
          } else {
            const pos = screenToSphere(mx, my);
            if (pos) applyPosition(pos);
          }
          lastMx = mx;
          lastMy = my;
        });

        canvasEl.addEventListener("pointerup", (e: PointerEvent) => {
          dragging = false;
          canvasEl.releasePointerCapture(e.pointerId);
        });

        canvasEl.addEventListener("contextmenu", (e) => e.preventDefault());
      };

      function drawArrow(
        p: p5,
        az: number,
        el: number,
        r: number,
        g: number,
        b: number,
        radius: number,
        pulse: number,
        isPrimary: boolean,
        isSelected: boolean,
        brightness: number,
        intensity: number
      ) {
        const [lx, ly, lz] = sphereToCartesian(az, el, radius);

        const bNorm = brightness / 100;
        const iNorm = intensity / 100;

        const brightMul = 0.2 + bNorm * 0.8;
        const spreadMul = 1.3 - iNorm * 0.7;
        const rank = isPrimary ? 1.0 : isSelected ? 0.85 : 0.6;

        p.push();
        p.stroke(r, g, b, Math.min(255, 140 * rank * brightMul));
        p.strokeWeight((1.2 + bNorm * 1.0) * rank);
        p.line(0, 0, 0, lx, -ly, lz);
        p.pop();

        const dotCount = 2 + Math.floor(bNorm * 4);
        for (let i = 1; i <= dotCount; i++) {
          const t = i / (dotCount + 1);
          p.push();
          p.translate(lx * t, -ly * t, lz * t);
          p.noStroke();
          p.fill(r, g, b, (25 + 40 * t) * brightMul * rank);
          p.sphere(0.8 + bNorm * 1.8 * rank, 6, 6);
          p.pop();
        }

        p.push();
        p.translate(lx, -ly, lz);
        p.noStroke();

        const glowLayers = Math.floor((4 + spreadMul * 4) * rank);
        for (let i = glowLayers; i >= 0; i--) {
          const coreBase = (5 + bNorm * 5) * rank;
          const layerStep = (3 + spreadMul * 4) * rank;
          const sz = (coreBase + i * layerStep) * pulse;
          const peakAlpha = (22 + bNorm * 18) * rank;
          const alpha = peakAlpha - i * (1.2 + iNorm * 1.2);
          p.fill(r, g, b, Math.max(alpha, 0.3));
          p.sphere(sz, 8, 8);
        }

        const coreAlpha = Math.min(255, (160 + bNorm * 80) * rank);
        p.fill(255, 255, 255, coreAlpha);
        const coreSz = (2.5 + bNorm * 5) * rank;
        p.sphere(coreSz * pulse, 10, 10);

        const shellAlpha = Math.min(255, (130 + bNorm * 70) * rank);
        p.fill(r, g, b, shellAlpha);
        const shellSz = coreSz + 1.5 + bNorm * 3 * rank;
        p.sphere(shellSz * pulse, 10, 10);
        p.pop();

        if (isSelected) {
          p.push();
          p.translate(lx, -ly, lz);
          p.noFill();
          p.stroke(255, 255, 255, Math.min(255, 180 * brightMul));
          p.strokeWeight(1.5);
          p.sphere((10 + bNorm * 5) * pulse, 12, 12);
          p.pop();
        }

        const aoeRadius = radius * (0.15 + spreadMul * 0.3) * rank;
        const aoeAlpha = (6 + bNorm * 16) * spreadMul * rank;
        p.push();
        p.translate(lx * 0.96, -ly * 0.96, lz * 0.96);
        p.noStroke();
        p.fill(r, g, b, aoeAlpha);
        p.sphere(aoeRadius, 14, 14);
        p.pop();

        if (bNorm > 0.3) {
          const spillStrength = (bNorm - 0.3) / 0.7;
          const spillAlpha = spillStrength * 14 * spreadMul * rank;
          p.push();
          p.translate(lx * 0.9, -ly * 0.9, lz * 0.9);
          p.noStroke();
          p.fill(r, g, b, spillAlpha);
          p.sphere(aoeRadius * 1.5, 12, 12);
          p.pop();
        }
      }

      p.draw = () => {
        p.clear();
        const settings = settingsRef.current;
        const lightColor = p.color(settings.color);
        const r = p.red(lightColor);
        const g = p.green(lightColor);
        const b = p.blue(lightColor);
        const shape = shapeRef.current;
        const pulse =
          1 + 0.12 * Math.sin(p.millis() * 0.004) + 0.06 * Math.sin(p.millis() * 0.011);

        const orbit = orbitRef.current;
        p.rotateX(orbit.x);
        p.rotateY(orbit.y);

        // Orientation grid
        p.push();
        p.noFill();
        p.stroke(255, 255, 255, 14);
        p.strokeWeight(0.4);
        for (let a = 0; a < 360; a += 45) {
          p.push();
          p.rotateY(p.radians(a));
          p.arc(0, 0, SHAPE_R * 2, SHAPE_R * 2, 0, p.PI);
          p.pop();
        }
        p.pop();

        // Shape wireframe
        p.push();
        p.noFill();
        if (shape === "sphere") {
          p.stroke(r, g, b, 40);
          p.strokeWeight(0.5);
          p.sphere(SHAPE_R, 20, 16);
        } else if (shape === "cube") {
          p.stroke(r, g, b, 90);
          p.strokeWeight(1.2);
          p.box(SHAPE_R * 1.6);
          p.stroke(255, 255, 255, 30);
          p.strokeWeight(0.4);
          p.box(SHAPE_R * 1.6);
        } else {
          p.stroke(r, g, b, 80);
          p.strokeWeight(1.0);
          p.rotateX(p.HALF_PI);
          const step = 16;
          for (let i = -SHAPE_R; i <= SHAPE_R; i += step) {
            p.line(i, -SHAPE_R, 0, i, SHAPE_R, 0);
            p.line(-SHAPE_R, i, 0, SHAPE_R, i, 0);
          }
          p.stroke(255, 255, 255, 40);
          p.strokeWeight(1.5);
          p.line(-SHAPE_R, -SHAPE_R, 0, SHAPE_R, -SHAPE_R, 0);
          p.line(SHAPE_R, -SHAPE_R, 0, SHAPE_R, SHAPE_R, 0);
          p.line(SHAPE_R, SHAPE_R, 0, -SHAPE_R, SHAPE_R, 0);
          p.line(-SHAPE_R, SHAPE_R, 0, -SHAPE_R, -SHAPE_R, 0);
          p.rotateX(-p.HALF_PI);
        }
        p.pop();

        // Equator + meridian
        p.push();
        p.noFill();
        p.stroke(255, 255, 255, 20);
        p.strokeWeight(0.6);
        p.ellipse(0, 0, SHAPE_R * 2, SHAPE_R * 2);
        p.rotateY(p.HALF_PI);
        p.ellipse(0, 0, SHAPE_R * 2, SHAPE_R * 2);
        p.pop();

        const selId = selectedLightIdRef.current;

        const enabledLights = settings.additionalLights.filter(
          (l) => l.enabled
        );
        for (const light of enabledLights) {
          const lc = p.color(light.color);
          drawArrow(
            p,
            light.position.azimuth,
            light.position.elevation,
            p.red(lc),
            p.green(lc),
            p.blue(lc),
            SHAPE_R,
            pulse,
            false,
            selId === light.id,
            light.brightness,
            light.intensity
          );
        }

        drawArrow(
          p,
          settings.primaryLight.azimuth,
          settings.primaryLight.elevation,
          r,
          g,
          b,
          SHAPE_R,
          pulse,
          true,
          selId === "primary",
          settings.brightness,
          settings.intensity
        );
      };

      function screenToSphere(mx: number, my: number) {
        const cx = mx - SIZE / 2;
        const cy = my - SIZE / 2;
        if (Math.sqrt(cx * cx + cy * cy) > SHAPE_R * 1.4) return null;
        const nx = cx / SHAPE_R;
        const ny = -cy / SHAPE_R;
        const nzSq = 1 - nx * nx - ny * ny;
        return cartesianToSphere(nx, ny, nzSq > 0 ? Math.sqrt(nzSq) : 0);
      }

      function applyPosition(pos: { azimuth: number; elevation: number }) {
        const sel = selectedLightIdRef.current;
        if (sel === "primary") {
          setPrimaryLight(pos);
        } else {
          updateLight(sel, { position: pos });
        }
      }
    },
    [setPrimaryLight, updateLight]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    p5Ref.current = new p5(sketch, containerRef.current);
    return () => {
      p5Ref.current?.remove();
    };
  }, [sketch]);

  const toggleOrbit = useCallback(() => {
    setOrbitMode((v) => !v);
  }, []);

  const resetOrbit = useCallback(() => {
    orbitRef.current = { x: -0.3, y: 0.15 };
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-2xl p-4"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Shape toggle */}
      <div
        className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl w-full"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        {SHAPES.map(({ value, label }) => (
          <button
            key={value}
            className="py-2.5 rounded-lg text-[11px] font-medium transition-all"
            style={{
              background:
                lightShape === value ? "var(--bg-secondary)" : "transparent",
              color:
                lightShape === value
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              boxShadow: lightShape === value ? "var(--shadow-sm)" : "none",
            }}
            onClick={() => setLightShape(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Canvas with angle overlay and orbit controls */}
      <div className="relative">
        <div
          ref={containerRef}
          className="rounded-2xl overflow-hidden"
          style={{
            width: 280,
            height: 280,
            background: "rgba(0, 0, 0, 0.92)",
            border: "1px solid var(--border-strong)",
            boxShadow:
              "inset 0 2px 20px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)",
            cursor: orbitMode ? "grab" : "crosshair",
          }}
        />
        <div
          className="absolute inset-x-0 top-2 text-center text-[9px] font-mono pointer-events-none"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          {angleDisplay}
        </div>

        {/* Orbit toggle + reset */}
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: orbitMode
                ? "var(--accent)"
                : "rgba(255,255,255,0.08)",
              color: orbitMode ? "white" : "rgba(255,255,255,0.5)",
              border: `1px solid ${orbitMode ? "transparent" : "rgba(255,255,255,0.12)"}`,
            }}
            onClick={toggleOrbit}
            title={orbitMode ? "Switch to light mode" : "Switch to orbit mode"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {orbitMode ? (
                <>
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
                </>
              ) : (
                <path d="M6 3h12l4 6-10 13L2 9z" />
              )}
            </svg>
          </button>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onClick={resetOrbit}
            title="Reset view"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Light selector */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5 justify-center">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all"
            style={{
              background:
                selectedLightId === "primary"
                  ? "var(--bg-secondary)"
                  : "var(--bg-tertiary)",
              color:
                selectedLightId === "primary"
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              border:
                selectedLightId === "primary"
                  ? "2px solid var(--accent)"
                  : "1px solid var(--border)",
              boxShadow:
                selectedLightId === "primary"
                  ? "0 0 0 1px var(--accent-glow)"
                  : "none",
            }}
            onClick={() => setSelectedLight("primary")}
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: primaryColor }}
            />
            {selectedLightId === "primary" && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
            Primary
          </button>
          {additionalLights.map((light) => (
            <button
              key={light.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all"
              style={{
                background:
                  selectedLightId === light.id
                    ? "var(--bg-secondary)"
                    : "var(--bg-tertiary)",
                color:
                  selectedLightId === light.id
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                border:
                  selectedLightId === light.id
                    ? `2px solid ${light.color}`
                    : "1px solid var(--border)",
                boxShadow:
                  selectedLightId === light.id
                    ? `0 0 0 1px ${light.color}44`
                    : "none",
              }}
              onClick={() => setSelectedLight(light.id)}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: light.color }}
              />
              {selectedLightId === light.id && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
              {light.name}
            </button>
          ))}
        </div>
        <p
          className="text-[10px] text-center"
          style={{ color: "var(--text-tertiary)" }}
        >
          {orbitMode
            ? "Orbit: drag to rotate view"
            : selectedLightId === "primary"
              ? "Primary: click & drag to position"
              : "Selected: click & drag to position"}
        </p>
      </div>
    </div>
  );
}
