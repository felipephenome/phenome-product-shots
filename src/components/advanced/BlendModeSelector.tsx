import { useLightingStore } from "@/stores/lightingStore";
import type { BlendMode } from "@/types";

const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "soft-light", label: "Soft Light" },
  { value: "hard-light", label: "Hard Light" },
];

export function BlendModeSelector() {
  const blendMode = useLightingStore((s) => s.settings.blendMode);
  const setBlendMode = useLightingStore((s) => s.setBlendMode);

  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-[11px] font-medium uppercase tracking-wider"
        style={{ color: "var(--text-secondary)" }}
      >
        Blend Mode
      </p>
      <select
        value={blendMode}
        onChange={(e) => setBlendMode(e.target.value as BlendMode)}
        className="w-full px-4 py-3 rounded-xl text-[11px] cursor-pointer outline-none"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
        }}
      >
        {BLEND_MODES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
