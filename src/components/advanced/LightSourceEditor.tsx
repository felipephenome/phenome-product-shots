import { useState } from "react";
import { useLightingStore } from "@/stores/lightingStore";
import type { LightSource } from "@/types";
import { directionLabel } from "@/utils/lightMath";
import { LIGHT_PRESETS, type LightPresetDirection } from "@/types";

const TEMPLATES: { name: string; defaults: Omit<LightSource, "id"> }[] = [
  {
    name: "Key Light",
    defaults: {
      name: "Key Light",
      position: { azimuth: -45, elevation: 30 },
      color: "#ffd700",
      brightness: 80,
      intensity: 70,
      type: "softbox",
      spreadAngle: 50,
      enabled: true,
      subPrompt: "",
    },
  },
  {
    name: "Fill Light",
    defaults: {
      name: "Fill Light",
      position: { azimuth: 45, elevation: 0 },
      color: "#87ceeb",
      brightness: 50,
      intensity: 40,
      type: "natural",
      spreadAngle: 80,
      enabled: true,
      subPrompt: "",
    },
  },
  {
    name: "Rim Light",
    defaults: {
      name: "Rim Light",
      position: { azimuth: 180, elevation: 20 },
      color: "#ff69b4",
      brightness: 60,
      intensity: 30,
      type: "rim",
      spreadAngle: 30,
      enabled: true,
      subPrompt: "",
    },
  },
  {
    name: "Accent Light",
    defaults: {
      name: "Accent Light",
      position: { azimuth: -120, elevation: 10 },
      color: "#00ff88",
      brightness: 40,
      intensity: 50,
      type: "spotlight",
      spreadAngle: 25,
      enabled: true,
      subPrompt: "",
    },
  },
];

const DIRECTIONS: { key: LightPresetDirection; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "front", label: "Front" },
  { key: "right", label: "Right" },
  { key: "left", label: "Left" },
  { key: "back", label: "Back" },
  { key: "bottom", label: "Bottom" },
];

function LightCard({ light }: { light: LightSource }) {
  const updateLight = useLightingStore((s) => s.updateLight);
  const removeLight = useLightingStore((s) => s.removeLight);
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div
      className="rounded-xl"
      style={{
        background: "var(--bg-tertiary)",
        border: `1.5px solid ${light.enabled ? light.color + "44" : "var(--border)"}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-3.5 h-3.5 rounded-full shrink-0"
            style={{
              background: light.color,
              boxShadow: light.enabled
                ? `0 0 8px ${light.color}66`
                : "none",
            }}
          />
          <span
            className="text-[13px] font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {light.name}
          </span>
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            {directionLabel(light.position)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-[10px] px-3 py-1.5 rounded-full font-medium transition-all"
            style={{
              background: light.enabled
                ? "var(--accent)"
                : "var(--border)",
              color: light.enabled ? "white" : "var(--text-secondary)",
            }}
            onClick={() =>
              updateLight(light.id, { enabled: !light.enabled })
            }
          >
            {light.enabled ? "ON" : "OFF"}
          </button>
          <button
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
            style={{ color: "var(--text-tertiary)" }}
            onClick={() => removeLight(light.id)}
            title="Remove"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Controls */}
      {light.enabled && (
        <div className="px-6 pb-5 flex flex-col gap-4">
          {/* Direction presets */}
          <div className="grid grid-cols-6 gap-2">
            {DIRECTIONS.map(({ key, label }) => {
              const target = LIGHT_PRESETS[key];
              const isActive =
                Math.abs(light.position.azimuth - target.azimuth) < 10 &&
                Math.abs(light.position.elevation - target.elevation) <
                  10;
              return (
                <button
                  key={key}
                  className="py-2.5 rounded-md text-[10px] font-medium transition-all"
                  style={{
                    background: isActive
                      ? light.color + "33"
                      : "transparent",
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-tertiary)",
                    border: `1px solid ${isActive ? light.color + "55" : "var(--border)"}`,
                  }}
                  onClick={() =>
                    updateLight(light.id, { position: target })
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Brightness slider */}
          <div className="flex items-center gap-4">
            <span
              className="text-[11px] w-12 shrink-0"
              style={{ color: "var(--text-secondary)" }}
            >
              Brt
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={light.brightness}
              onChange={(e) =>
                updateLight(light.id, {
                  brightness: Number(e.target.value),
                })
              }
              className="slider-track flex-1"
            />
            <span
              className="text-[11px] w-10 text-right shrink-0"
              style={{ color: "var(--text-secondary)" }}
            >
              {light.brightness}%
            </span>
          </div>

          {/* Intensity slider */}
          <div className="flex items-center gap-4">
            <span
              className="text-[11px] w-12 shrink-0"
              style={{ color: "var(--text-secondary)" }}
            >
              Int
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={light.intensity}
              onChange={(e) =>
                updateLight(light.id, {
                  intensity: Number(e.target.value),
                })
              }
              className="slider-track flex-1"
            />
            <span
              className="text-[11px] w-10 text-right shrink-0"
              style={{ color: "var(--text-secondary)" }}
            >
              {light.intensity}%
            </span>
          </div>

          {/* Color */}
          <div className="flex items-center gap-4">
            <span
              className="text-[11px] w-12 shrink-0"
              style={{ color: "var(--text-secondary)" }}
            >
              Color
            </span>
            <label className="relative cursor-pointer">
              <input
                type="color"
                value={light.color}
                onChange={(e) =>
                  updateLight(light.id, { color: e.target.value })
                }
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div
                className="w-8 h-8 rounded-full border-2"
                style={{
                  background: light.color,
                  borderColor: "var(--border-strong)",
                }}
              />
            </label>
          </div>

          {/* Sub-prompt toggle */}
          <button
            className="text-[11px] self-start font-medium pt-1"
            style={{ color: "var(--accent)" }}
            onClick={() => setShowPrompt((p) => !p)}
          >
            {showPrompt ? "Hide prompt" : "Add custom prompt"}
          </button>

          {showPrompt && (
            <textarea
              value={light.subPrompt || ""}
              onChange={(e) =>
                updateLight(light.id, { subPrompt: e.target.value })
              }
              placeholder={`Describe what ${light.name} should do...`}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg text-[11px] leading-relaxed resize-none outline-none"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: `1px solid ${light.color}33`,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function LightSourceEditor() {
  const lights = useLightingStore((s) => s.settings.additionalLights);
  const addLight = useLightingStore((s) => s.addLight);

  const availableTemplates = TEMPLATES.filter(
    (t) => !lights.find((l) => l.name === t.name)
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p
          className="text-[11px] font-medium uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          Light Sources
        </p>
        <p
          className="text-[11px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          {lights.length} / {TEMPLATES.length}
        </p>
      </div>

      {lights.map((light) => (
        <LightCard key={light.id} light={light} />
      ))}

      {availableTemplates.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {availableTemplates.map((template) => (
            <button
              key={template.name}
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-[11px] font-medium transition-all"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
              onClick={() =>
                addLight({
                  ...template.defaults,
                  id: crypto.randomUUID(),
                })
              }
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: template.defaults.color }}
              />
              + {template.name}
            </button>
          ))}
        </div>
      )}

      {lights.length === 0 && (
        <p
          className="text-[10px] text-center py-3"
          style={{ color: "var(--text-tertiary)" }}
        >
          Add light sources to create multi-light setups.
          <br />
          Each source adds a sub-prompt to the generation.
        </p>
      )}
    </div>
  );
}
