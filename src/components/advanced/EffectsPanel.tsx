import { useLightingStore } from "@/stores/lightingStore";
import type { LightEffect } from "@/types";

const EFFECT_OPTIONS: { type: LightEffect["type"]; label: string }[] = [
  { type: "fog", label: "Fog" },
  { type: "haze", label: "Haze" },
  { type: "volumetric", label: "Volumetric" },
  { type: "bloom", label: "Bloom" },
  { type: "godrays", label: "God Rays" },
];

export function EffectsPanel() {
  const effects = useLightingStore((s) => s.settings.effects);
  const toggleEffect = useLightingStore((s) => s.toggleEffect);

  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-[11px] font-medium uppercase tracking-wider"
        style={{ color: "var(--text-secondary)" }}
      >
        Atmospheric Effects
      </p>
      <div className="flex flex-wrap gap-2.5">
        {EFFECT_OPTIONS.map(({ type, label }) => {
          const existing = effects.find((e) => e.type === type);
          const isActive = existing?.enabled ?? false;

          return (
            <button
              key={type}
              className="px-4 py-2.5 rounded-lg text-[11px] font-medium transition-all"
              style={{
                background: isActive
                  ? "var(--text-primary)"
                  : "var(--bg-secondary)",
                color: isActive
                  ? "var(--bg-primary)"
                  : "var(--text-secondary)",
                border: `1px solid ${isActive ? "transparent" : "var(--border)"}`,
              }}
              onClick={() =>
                toggleEffect({ type, intensity: 50, enabled: true })
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
