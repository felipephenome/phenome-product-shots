import { LightPresets } from "../controls/LightPresets";
import { LightPicker } from "../controls/LightPicker";
import { BrightnessSlider } from "../controls/BrightnessSlider";
import { IntensitySlider } from "../controls/IntensitySlider";
import { ColorPicker } from "../controls/ColorPicker";
import { DayNightToggle } from "../controls/DayNightToggle";
import { ProductPlacementPanel } from "../controls/ProductPlacementPanel";
import { ModelSelector } from "../controls/ModelSelector";
import { ReferenceImagesPanel } from "../controls/ReferenceImagesPanel";
import { GenerateButton } from "../controls/GenerateButton";
import { AdvancedPanel } from "../advanced/AdvancedPanel";

export function ControlPanel() {
  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="pb-5 pr-10">
        <h2
          className="font-display text-[15px] font-bold tracking-[-0.02em]"
          style={{ color: "var(--text-primary)" }}
        >
          Picture Stash
        </h2>
        <p className="text-[12px] mt-1.5" style={{ color: "var(--text-secondary)" }}>
          Change lighting instantly
        </p>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 min-w-0 flex flex-col gap-6">
        <LightPresets />

        <LightPicker />

        <div className="flex flex-col gap-4">
          <BrightnessSlider />
          <IntensitySlider />
          <ColorPicker />
        </div>

        <div style={{ height: 1, background: "var(--border-strong)" }} />

        <DayNightToggle />

        <div style={{ height: 1, background: "var(--border-strong)" }} />

        <ProductPlacementPanel />

        <div style={{ height: 1, background: "var(--border-strong)" }} />

        <ModelSelector />

        <ReferenceImagesPanel />

        <AdvancedPanel />

        <GenerateButton />
      </div>
    </div>
  );
}
