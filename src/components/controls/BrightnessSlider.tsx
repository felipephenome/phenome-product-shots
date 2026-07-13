import { useLightingStore } from "@/stores/lightingStore";

export function BrightnessSlider() {
  const selectedLightId = useLightingStore((s) => s.selectedLightId);
  const globalBrightness = useLightingStore((s) => s.settings.brightness);
  const additionalLights = useLightingStore((s) => s.settings.additionalLights);
  const setBrightness = useLightingStore((s) => s.setBrightness);
  const updateLight = useLightingStore((s) => s.updateLight);

  const isPrimary = selectedLightId === "primary";
  const selectedLight = isPrimary
    ? null
    : additionalLights.find((l) => l.id === selectedLightId);

  const brightness = isPrimary ? globalBrightness : (selectedLight?.brightness ?? globalBrightness);

  const handleChange = (v: number) => {
    if (isPrimary) {
      setBrightness(v);
    } else {
      updateLight(selectedLightId, { brightness: v });
    }
  };

  return (
    <div
      className="flex items-center gap-4 px-6 py-4 rounded-2xl"
      style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
    >
      <span
        className="text-[12px] font-medium shrink-0"
        style={{ color: "var(--text-primary)" }}
      >
        Brightness
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={brightness}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="slider-track flex-1 min-w-0"
        style={{
          background: `linear-gradient(to right, var(--text-secondary) 0%, var(--text-secondary) ${brightness}%, var(--border-strong) ${brightness}%, var(--border-strong) 100%)`,
        }}
      />
      <span
        className="text-[12px] font-display w-11 text-right shrink-0"
        style={{ color: "var(--text-secondary)" }}
      >
        {brightness}%
      </span>
    </div>
  );
}
