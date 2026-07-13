import { useLightingStore } from "@/stores/lightingStore";
import { LIGHT_PRESETS, type LightPresetDirection } from "@/types";

const presets: { key: LightPresetDirection; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "front", label: "Front" },
  { key: "right", label: "Right" },
  { key: "left", label: "Left" },
  { key: "back", label: "Back" },
  { key: "bottom", label: "Bottom" },
];

export function LightPresets() {
  const setPrimaryLight = useLightingStore((s) => s.setPrimaryLight);
  const current = useLightingStore((s) => s.settings.primaryLight);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="grid grid-cols-3 gap-2">
      {presets.map(({ key, label }) => {
        const target = LIGHT_PRESETS[key];
        const isActive =
          Math.abs(current.azimuth - target.azimuth) < 5 &&
          Math.abs(current.elevation - target.elevation) < 5;
        return (
          <button
            key={key}
            className="py-3.5 px-2 rounded-xl text-[12px] font-medium transition-all"
            style={{
              background: isActive
                ? "var(--text-primary)"
                : "var(--bg-secondary)",
              color: isActive
                ? "var(--bg-primary)"
                : "var(--text-secondary)",
              border: `1px solid ${isActive ? "transparent" : "var(--border)"}`,
            }}
            onClick={() => setPrimaryLight(target)}
          >
            {label}
          </button>
        );
      })}
      </div>
    </div>
  );
}
