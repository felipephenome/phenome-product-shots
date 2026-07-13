import { useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useLightingStore } from "@/stores/lightingStore";
import type { LightPosition, LightSource } from "@/types";

type PickerTab = "setups" | "natural" | "custom";

interface PresetLight {
  name: string;
  color: string;
  position: LightPosition;
  brightness: number;
  intensity: number;
  type: LightSource["type"];
  spreadAngle: number;
  subPrompt?: string;
}

interface CinematicPreset {
  id: string;
  name: string;
  description: string;
  primary: PresetLight;
  additionalLights?: PresetLight[];
}

interface NaturalSwatch {
  name: string;
  color: string;
}

const NATURAL_SWATCH_ROWS: NaturalSwatch[][] = [
  [
    { name: "Linen Diffusion", color: "#f7f2e8" },
    { name: "Cloud Silk", color: "#efe8dc" },
    { name: "Pearl Bounce", color: "#ecebe6" },
    { name: "Soft Ivory", color: "#f8f3df" },
    { name: "Mist White", color: "#e7ebe8" },
    { name: "Calm Sky", color: "#d9e5ed" },
    { name: "Snow Wash", color: "#f0f0ec" },
    { name: "Frosted Cream", color: "#f5ede1" },
  ],
  [
    { name: "Haze Blue", color: "#cad9e2" },
    { name: "Silver Overcast", color: "#d7ddd8" },
    { name: "Pale Mint Fill", color: "#d9e3d4" },
    { name: "Studio Muslin", color: "#efe2cb" },
    { name: "Warm Bounce", color: "#e5d5bb" },
    { name: "Parchment Glow", color: "#e8dcc4" },
    { name: "Ash Linen", color: "#ddd8ce" },
  ],
  [
    { name: "Sun Kiss", color: "#f8d49e" },
    { name: "Golden Hour", color: "#f0ba78" },
    { name: "Honey Key", color: "#e7aa62" },
    { name: "Candle Amber", color: "#d9974a" },
    { name: "Apricot Practical", color: "#e9b592" },
    { name: "Skin Tone Lift", color: "#d8ad8e" },
    { name: "Peach Fill", color: "#f2c9a0" },
    { name: "Copper Rim", color: "#c48a5c" },
  ],
  [
    { name: "Rose Fill", color: "#cda4a1" },
    { name: "Mauve Ambient", color: "#b89fb6" },
    { name: "Lavender Rim", color: "#a6a0cb" },
    { name: "Moon Cyan", color: "#85a7c8" },
    { name: "Steel Blue", color: "#5d7999" },
    { name: "Blush Key", color: "#d4a0ab" },
    { name: "Iris Spill", color: "#9190b8" },
  ],
  [
    { name: "Slate Shadow", color: "#4f5967" },
    { name: "Graphite Night", color: "#3c434d" },
    { name: "Deep Teal", color: "#355e67" },
    { name: "Sodium Street", color: "#b5792e" },
    { name: "Neon Magenta", color: "#cb538f" },
    { name: "RGB Cyan", color: "#49aebf" },
    { name: "Tungsten Warm", color: "#cf9545" },
    { name: "Cobalt Edge", color: "#3a5f94" },
  ],
];

const DAY_PRESETS: CinematicPreset[] = [
  {
    id: "day-window-key",
    name: "Window Key 45",
    description: "Natural key from screen-left with a soft fill.",
    primary: {
      name: "Window Key",
      color: "#f2d9b1",
      position: { azimuth: -40, elevation: 25 },
      brightness: 74,
      intensity: 63,
      type: "natural",
      spreadAngle: 60,
    },
    additionalLights: [
      {
        name: "Bounce Fill",
        color: "#dbe6ef",
        position: { azimuth: 60, elevation: 5 },
        brightness: 42,
        intensity: 34,
        type: "softbox",
        spreadAngle: 80,
      },
    ],
  },
  {
    id: "day-rembrandt",
    name: "Rembrandt Day",
    description: "Angled key and controlled opposite-side fill.",
    primary: {
      name: "Key Light",
      color: "#edc58d",
      position: { azimuth: -50, elevation: 35 },
      brightness: 70,
      intensity: 72,
      type: "softbox",
      spreadAngle: 45,
    },
    additionalLights: [
      {
        name: "Negative Fill Lift",
        color: "#b2bfd1",
        position: { azimuth: 55, elevation: 0 },
        brightness: 32,
        intensity: 26,
        type: "ambient",
        spreadAngle: 90,
      },
    ],
  },
  {
    id: "day-butterfly",
    name: "Butterfly Beauty",
    description: "High frontal key with soft under-fill.",
    primary: {
      name: "Beauty Key",
      color: "#f4e2c7",
      position: { azimuth: 0, elevation: 58 },
      brightness: 78,
      intensity: 56,
      type: "softbox",
      spreadAngle: 70,
    },
    additionalLights: [
      {
        name: "Clamshell Fill",
        color: "#dfd5c9",
        position: { azimuth: 0, elevation: -22 },
        brightness: 40,
        intensity: 28,
        type: "softbox",
        spreadAngle: 95,
      },
    ],
  },
  {
    id: "day-split",
    name: "Split Lighting",
    description: "Hard side key with minimal fill for shape.",
    primary: {
      name: "Side Key",
      color: "#f0c88d",
      position: { azimuth: -90, elevation: 8 },
      brightness: 68,
      intensity: 84,
      type: "hard",
      spreadAngle: 28,
    },
  },
  {
    id: "day-high-key",
    name: "High-Key Commercial",
    description: "Bright, wrapped, low-contrast setup.",
    primary: {
      name: "Main Soft Key",
      color: "#f5f1e5",
      position: { azimuth: -20, elevation: 35 },
      brightness: 86,
      intensity: 42,
      type: "softbox",
      spreadAngle: 100,
    },
    additionalLights: [
      {
        name: "Fill Softbox",
        color: "#edf2f7",
        position: { azimuth: 35, elevation: 18 },
        brightness: 64,
        intensity: 30,
        type: "softbox",
        spreadAngle: 100,
      },
      {
        name: "Hair Light",
        color: "#f6dfb4",
        position: { azimuth: 160, elevation: 40 },
        brightness: 40,
        intensity: 30,
        type: "rim",
        spreadAngle: 35,
      },
    ],
  },
  {
    id: "day-overcast",
    name: "Overcast Top Soft",
    description: "Top soft ambient with gentle wrap.",
    primary: {
      name: "Sky Soft Source",
      color: "#d7e4ea",
      position: { azimuth: 0, elevation: 78 },
      brightness: 67,
      intensity: 34,
      type: "natural",
      spreadAngle: 120,
    },
  },
  {
    id: "day-golden-back",
    name: "Golden Backlight",
    description: "Warm sun backlight with fill from camera side.",
    primary: {
      name: "Sun Back Key",
      color: "#efb064",
      position: { azimuth: 165, elevation: 22 },
      brightness: 82,
      intensity: 66,
      type: "natural",
      spreadAngle: 42,
    },
    additionalLights: [
      {
        name: "Camera Fill",
        color: "#f3d8ad",
        position: { azimuth: 5, elevation: 6 },
        brightness: 45,
        intensity: 30,
        type: "ambient",
        spreadAngle: 95,
      },
    ],
  },
  {
    id: "day-product-wrap",
    name: "Product Wrap",
    description: "Top-front soft key with clean edge separation.",
    primary: {
      name: "Top Key",
      color: "#f0ece2",
      position: { azimuth: -10, elevation: 62 },
      brightness: 76,
      intensity: 46,
      type: "softbox",
      spreadAngle: 85,
    },
    additionalLights: [
      {
        name: "Rim Edge",
        color: "#dbe4ee",
        position: { azimuth: 180, elevation: 12 },
        brightness: 35,
        intensity: 32,
        type: "rim",
        spreadAngle: 30,
      },
    ],
  },
  {
    id: "day-chiaroscuro",
    name: "Day Chiaroscuro",
    description: "Directional dramatic side key with heavy falloff.",
    primary: {
      name: "Hard Window Slash",
      color: "#e6b06f",
      position: { azimuth: -65, elevation: 18 },
      brightness: 62,
      intensity: 88,
      type: "hard",
      spreadAngle: 24,
    },
  },
  {
    id: "day-documentary",
    name: "Documentary Natural",
    description: "Practical natural balance with subtle contrast.",
    primary: {
      name: "Ambient Key",
      color: "#e6dbc8",
      position: { azimuth: -25, elevation: 20 },
      brightness: 64,
      intensity: 45,
      type: "natural",
      spreadAngle: 72,
    },
    additionalLights: [
      {
        name: "Passive Fill",
        color: "#cedce8",
        position: { azimuth: 35, elevation: 0 },
        brightness: 34,
        intensity: 24,
        type: "ambient",
        spreadAngle: 105,
      },
    ],
  },
  {
    id: "day-top-noon",
    name: "Noon Overhead",
    description: "Sharper overhead daylight, high contrast.",
    primary: {
      name: "Noon Sun",
      color: "#f3e2bf",
      position: { azimuth: 20, elevation: 82 },
      brightness: 84,
      intensity: 78,
      type: "hard",
      spreadAngle: 20,
    },
  },
  {
    id: "day-rim-fashion",
    name: "Fashion Edge Day",
    description: "Balanced frontal key with pronounced clean rim.",
    primary: {
      name: "Face Key",
      color: "#f3dcc0",
      position: { azimuth: -18, elevation: 26 },
      brightness: 72,
      intensity: 56,
      type: "softbox",
      spreadAngle: 64,
    },
    additionalLights: [
      {
        name: "Back Rim",
        color: "#f7d39a",
        position: { azimuth: 180, elevation: 35 },
        brightness: 47,
        intensity: 38,
        type: "rim",
        spreadAngle: 25,
      },
    ],
  },
  {
    id: "day-practical-interior",
    name: "Practical Interior Day",
    description: "Warm practical key with cooler window fill.",
    primary: {
      name: "Practical Key",
      color: "#eeb779",
      position: { azimuth: -32, elevation: 18 },
      brightness: 66,
      intensity: 58,
      type: "natural",
      spreadAngle: 52,
    },
    additionalLights: [
      {
        name: "Window Fill",
        color: "#b8d0e6",
        position: { azimuth: 80, elevation: 12 },
        brightness: 36,
        intensity: 27,
        type: "natural",
        spreadAngle: 90,
      },
    ],
  },
  {
    id: "day-soft-side",
    name: "Soft Side Portrait",
    description: "Wide side key and subtle opposite bounce.",
    primary: {
      name: "Soft Side Key",
      color: "#ead7b9",
      position: { azimuth: -55, elevation: 20 },
      brightness: 69,
      intensity: 49,
      type: "softbox",
      spreadAngle: 82,
    },
    additionalLights: [
      {
        name: "Cheek Fill",
        color: "#d8e1e8",
        position: { azimuth: 35, elevation: -2 },
        brightness: 30,
        intensity: 20,
        type: "ambient",
        spreadAngle: 110,
      },
    ],
  },
  {
    id: "day-architectural",
    name: "Architectural Day",
    description: "Clean directional key emphasizing shape and texture.",
    primary: {
      name: "Directional Key",
      color: "#eed0a2",
      position: { azimuth: 42, elevation: 32 },
      brightness: 73,
      intensity: 70,
      type: "spotlight",
      spreadAngle: 35,
    },
  },
];

const NIGHT_PRESETS: CinematicPreset[] = [
  {
    id: "night-moon-rim",
    name: "Moon Rim",
    description: "Cool back rim with very low frontal fill.",
    primary: {
      name: "Moon Backlight",
      color: "#8aa8d6",
      position: { azimuth: 170, elevation: 25 },
      brightness: 52,
      intensity: 67,
      type: "rim",
      spreadAngle: 28,
    },
    additionalLights: [
      {
        name: "Front Lift",
        color: "#4b607e",
        position: { azimuth: 0, elevation: 2 },
        brightness: 20,
        intensity: 15,
        type: "ambient",
        spreadAngle: 100,
      },
    ],
  },
  {
    id: "night-noir-kicker",
    name: "Noir Kicker",
    description: "Hard side kicker with deep shadows.",
    primary: {
      name: "Kicker",
      color: "#9bb7df",
      position: { azimuth: -105, elevation: 18 },
      brightness: 48,
      intensity: 92,
      type: "hard",
      spreadAngle: 18,
    },
  },
  {
    id: "night-sodium-street",
    name: "Sodium Streetlamp",
    description: "Warm overhead practical with cool ambient contrast.",
    primary: {
      name: "Street Practical",
      color: "#cb8b3f",
      position: { azimuth: 20, elevation: 72 },
      brightness: 62,
      intensity: 73,
      type: "spotlight",
      spreadAngle: 30,
    },
    additionalLights: [
      {
        name: "Night Ambient",
        color: "#4f6f8f",
        position: { azimuth: -40, elevation: 0 },
        brightness: 23,
        intensity: 20,
        type: "ambient",
        spreadAngle: 120,
      },
    ],
  },
  {
    id: "night-neon-mix",
    name: "Neon Mix",
    description: "Magenta key and cyan fill for stylized night.",
    primary: {
      name: "Neon Key",
      color: "#d3549d",
      position: { azimuth: -35, elevation: 18 },
      brightness: 58,
      intensity: 71,
      type: "spotlight",
      spreadAngle: 36,
    },
    additionalLights: [
      {
        name: "Neon Fill",
        color: "#4ab4c9",
        position: { azimuth: 55, elevation: 8 },
        brightness: 37,
        intensity: 44,
        type: "spotlight",
        spreadAngle: 42,
      },
    ],
  },
  {
    id: "night-police-flash",
    name: "Emergency Flash",
    description: "Strong directional emergency-style contrast.",
    primary: {
      name: "Red Side",
      color: "#d2494e",
      position: { azimuth: -78, elevation: 10 },
      brightness: 64,
      intensity: 90,
      type: "hard",
      spreadAngle: 24,
    },
    additionalLights: [
      {
        name: "Blue Counter",
        color: "#3f78d2",
        position: { azimuth: 80, elevation: 12 },
        brightness: 51,
        intensity: 84,
        type: "hard",
        spreadAngle: 24,
      },
    ],
  },
  {
    id: "night-candle-practical",
    name: "Candle Practical",
    description: "Small warm source with rapid falloff.",
    primary: {
      name: "Candle Key",
      color: "#d89142",
      position: { azimuth: -20, elevation: -12 },
      brightness: 48,
      intensity: 82,
      type: "spotlight",
      spreadAngle: 20,
    },
  },
  {
    id: "night-sci-fi-underlight",
    name: "Sci-Fi Underlight",
    description: "Low cyan source for ominous under lighting.",
    primary: {
      name: "Under Key",
      color: "#5ea6c1",
      position: { azimuth: 0, elevation: -55 },
      brightness: 54,
      intensity: 77,
      type: "spotlight",
      spreadAngle: 30,
    },
  },
  {
    id: "night-tv-screen",
    name: "TV Screen Glow",
    description: "Frontal cool key with low room ambient.",
    primary: {
      name: "Screen Key",
      color: "#6f93c2",
      position: { azimuth: -8, elevation: 4 },
      brightness: 42,
      intensity: 48,
      type: "softbox",
      spreadAngle: 78,
    },
    additionalLights: [
      {
        name: "Room Base",
        color: "#2f3f57",
        position: { azimuth: 180, elevation: 4 },
        brightness: 17,
        intensity: 16,
        type: "ambient",
        spreadAngle: 120,
      },
    ],
  },
  {
    id: "night-rim-fashion",
    name: "Night Rim Fashion",
    description: "Strong separation rim with subtle front key.",
    primary: {
      name: "Front Key",
      color: "#99abc8",
      position: { azimuth: -22, elevation: 16 },
      brightness: 46,
      intensity: 51,
      type: "softbox",
      spreadAngle: 60,
    },
    additionalLights: [
      {
        name: "Blue Rim",
        color: "#7f97d2",
        position: { azimuth: 180, elevation: 38 },
        brightness: 44,
        intensity: 45,
        type: "rim",
        spreadAngle: 22,
      },
    ],
  },
  {
    id: "night-silhouette-back",
    name: "Silhouette Backlight",
    description: "Dominant backlight and near-zero frontal fill.",
    primary: {
      name: "Back Spot",
      color: "#9eb9dc",
      position: { azimuth: 180, elevation: 15 },
      brightness: 62,
      intensity: 95,
      type: "hard",
      spreadAngle: 18,
    },
  },
  {
    id: "night-warehouse",
    name: "Warehouse Top",
    description: "Industrial overhead practical with cool spill.",
    primary: {
      name: "Top Practical",
      color: "#9caec2",
      position: { azimuth: 10, elevation: 76 },
      brightness: 49,
      intensity: 69,
      type: "spotlight",
      spreadAngle: 28,
    },
    additionalLights: [
      {
        name: "Floor Bounce",
        color: "#4e6075",
        position: { azimuth: -8, elevation: -24 },
        brightness: 21,
        intensity: 18,
        type: "ambient",
        spreadAngle: 110,
      },
    ],
  },
  {
    id: "night-lantern-motivated",
    name: "Lantern Motivated",
    description: "Warm practical key with cool moon edge.",
    primary: {
      name: "Lantern Key",
      color: "#cc8b44",
      position: { azimuth: -25, elevation: -8 },
      brightness: 58,
      intensity: 74,
      type: "natural",
      spreadAngle: 34,
    },
    additionalLights: [
      {
        name: "Moon Edge",
        color: "#7fa3cf",
        position: { azimuth: 165, elevation: 25 },
        brightness: 30,
        intensity: 33,
        type: "rim",
        spreadAngle: 25,
      },
    ],
  },
  {
    id: "night-green-mercury",
    name: "Mercury Vapor",
    description: "Green-blue urban night cast with hard top key.",
    primary: {
      name: "Mercury Key",
      color: "#79a399",
      position: { azimuth: 25, elevation: 58 },
      brightness: 53,
      intensity: 71,
      type: "hard",
      spreadAngle: 24,
    },
  },
  {
    id: "night-dreamy-moon",
    name: "Dreamy Moonlight",
    description: "Soft cool moon key with airy fill.",
    primary: {
      name: "Moon Key",
      color: "#9bb9dc",
      position: { azimuth: -40, elevation: 30 },
      brightness: 43,
      intensity: 45,
      type: "softbox",
      spreadAngle: 84,
    },
    additionalLights: [
      {
        name: "Mist Fill",
        color: "#6b82a1",
        position: { azimuth: 55, elevation: 8 },
        brightness: 26,
        intensity: 24,
        type: "ambient",
        spreadAngle: 120,
      },
    ],
  },
  {
    id: "night-spot-hero",
    name: "Hero Spotlight",
    description: "Focused front key with deep surrounding falloff.",
    primary: {
      name: "Hero Spot",
      color: "#c7ccd9",
      position: { azimuth: 0, elevation: 20 },
      brightness: 61,
      intensity: 92,
      type: "spotlight",
      spreadAngle: 16,
    },
  },
];

function sourceToLight(
  source: PresetLight,
  presetId: string,
  index: number
): LightSource {
  return {
    id: `${presetId}-${index}-${source.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: source.name,
    position: source.position,
    color: source.color,
    brightness: source.brightness,
    intensity: source.intensity,
    type: source.type,
    spreadAngle: source.spreadAngle,
    enabled: true,
    subPrompt: source.subPrompt ?? "",
  };
}

export function ColorPicker() {
  const globalColor = useLightingStore((s) => s.settings.color);
  const selectedLightId = useLightingStore((s) => s.selectedLightId);
  const additionalLights = useLightingStore((s) => s.settings.additionalLights);
  const timeOfDay = useLightingStore((s) => s.settings.timeOfDay);
  const settings = useLightingStore((s) => s.settings);
  const setGlobalColor = useLightingStore((s) => s.setColor);
  const updateLight = useLightingStore((s) => s.updateLight);
  const applyLightingSetup = useLightingStore((s) => s.applyLightingSetup);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PickerTab>("setups");

  const isPrimary = selectedLightId === "primary";
  const selectedLight = isPrimary
    ? null
    : additionalLights.find((l) => l.id === selectedLightId);
  const color = isPrimary ? globalColor : (selectedLight?.color ?? globalColor);

  const setColor = (c: string) => {
    if (isPrimary) {
      setGlobalColor(c);
    } else {
      updateLight(selectedLightId, { color: c });
    }
  };

  const cinematicPresets = useMemo(
    () => (timeOfDay === "day" ? DAY_PRESETS : NIGHT_PRESETS),
    [timeOfDay]
  );

  const applyPreset = (preset: CinematicPreset) => {
    const additionalSources = preset.additionalLights ?? [];
    applyLightingSetup({
      color: preset.primary.color,
      brightness: preset.primary.brightness,
      intensity: preset.primary.intensity,
      primaryLight: preset.primary.position,
      additionalLights: additionalSources.map((source, index) =>
        sourceToLight(source, preset.id, index + 1)
      ),
    });
  };

  const isPresetActive = (preset: CinematicPreset) => {
    const samePrimary =
      settings.color.toLowerCase() === preset.primary.color.toLowerCase() &&
      Math.abs(settings.primaryLight.azimuth - preset.primary.position.azimuth) < 1 &&
      Math.abs(settings.primaryLight.elevation - preset.primary.position.elevation) < 1 &&
      settings.brightness === preset.primary.brightness &&
      settings.intensity === preset.primary.intensity;
    if (!samePrimary) return false;
    const presetAdditionalCount = preset.additionalLights?.length ?? 0;
    return settings.additionalLights.length === presetAdditionalCount;
  };

  return (
    <div className="w-full min-w-0">
      <button
        className="flex items-center gap-4 px-6 py-4 rounded-2xl w-full text-left transition-all"
        style={{
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border)",
        }}
        onClick={() => setOpen((p) => !p)}
      >
        <span
          className="text-[12px] font-medium flex-1 truncate"
          style={{ color: "var(--text-primary)" }}
        >
          Light Color
        </span>
        <div
          className="w-8 h-8 rounded-full shrink-0"
          style={{
            background: color,
            boxShadow: `0 0 12px ${color}55, inset 0 1px 2px rgba(255,255,255,0.3)`,
          }}
        />
      </button>

      {open && (
        <div
          className="mt-2 w-full rounded-2xl overflow-hidden"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-strong)",
            boxShadow: "var(--shadow-lg)",
            padding: 16,
          }}
        >
          <div
            className="grid grid-cols-3 gap-1 p-1.5 rounded-xl mb-3"
            style={{ background: "var(--bg-tertiary)" }}
          >
            {([
              { id: "setups", label: "Setups" },
              { id: "natural", label: "Honeycomb" },
              { id: "custom", label: "Custom" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                className="px-2 py-2.5 rounded-lg text-[10px] font-medium transition-all truncate"
                style={{
                  background: activeTab === tab.id ? "var(--bg-secondary)" : "transparent",
                  color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
                  boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "setups" && (
            <div className="min-w-0">
              <p className="text-[10px] mb-2.5 truncate" style={{ color: "var(--text-tertiary)" }}>
                {timeOfDay === "day"
                  ? "Day cinematic sources and angles"
                  : "Night cinematic sources and angles"}
              </p>
              <div className="max-h-[280px] overflow-y-auto flex flex-col gap-2">
                {cinematicPresets.map((preset) => {
                  const active = isPresetActive(preset);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className="text-left px-3 py-2.5 rounded-xl transition-all w-full min-w-0"
                      style={{
                        background: active ? "var(--bg-secondary)" : "var(--bg-tertiary)",
                        border: `1px solid ${active ? `${preset.primary.color}77` : "var(--border)"}`,
                        boxShadow: active ? `0 0 0 1px ${preset.primary.color}22` : "none",
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ background: preset.primary.color }}
                        />
                        <span className="text-[11px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                          {preset.name}
                        </span>
                        <span className="text-[9px] ml-auto shrink-0" style={{ color: "var(--text-tertiary)" }}>
                          {Math.round(preset.primary.position.azimuth)}/{Math.round(preset.primary.position.elevation)}°
                        </span>
                      </div>
                      <p className="text-[10px] mt-1 truncate" style={{ color: "var(--text-secondary)" }}>
                        {preset.description}
                      </p>
                      <p className="text-[9px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        {preset.additionalLights?.length
                          ? `${preset.additionalLights.length + 1}-point`
                          : "Single source"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "natural" && (
            <div className="min-w-0">
              <p className="text-[10px] mb-3 truncate" style={{ color: "var(--text-tertiary)" }}>
                Natural light tones for cinematic relighting
              </p>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {NATURAL_SWATCH_ROWS.map((row, rowIndex) => (
                  <div
                    key={`row-${rowIndex}`}
                    className="flex"
                    style={{
                      marginLeft: rowIndex % 2 === 1 ? 16 : 0,
                      marginRight: rowIndex % 2 === 1 ? 16 : 0,
                      marginTop: rowIndex > 0 ? -4 : 0,
                    }}
                  >
                    {row.map((swatch) => {
                      const isSelected = color.toLowerCase() === swatch.color.toLowerCase();
                      return (
                        <button
                          key={swatch.name}
                          onClick={() => setColor(swatch.color)}
                          title={swatch.name}
                          className="flex-1 transition-transform hover:scale-110 hover:z-10 relative"
                          style={{
                            aspectRatio: "1 / 1.12",
                            clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0 50%)",
                            background: swatch.color,
                            border: isSelected ? "2px solid rgba(255,255,255,0.95)" : "none",
                            boxShadow: isSelected
                              ? `0 0 0 1px ${swatch.color}, 0 0 12px ${swatch.color}55`
                              : "none",
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-3 truncate" style={{ color: "var(--text-secondary)" }}>
                Selected: <span style={{ color: "var(--text-primary)" }}>{color}</span>
              </p>
            </div>
          )}

          {activeTab === "custom" && (
            <div className="min-w-0">
              <HexColorPicker color={color} onChange={setColor} />
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) {
                      setColor(e.target.value);
                    }
                  }}
                  className="flex-1 min-w-0 px-3 py-1.5 rounded-lg text-[11px] font-display outline-none"
                  style={{
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
