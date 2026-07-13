import type { LightingSettings, ProductShotId } from "@/types";
import { PRODUCT_SHOT_PRESETS } from "@/types";
import { directionLabel } from "@/utils/lightMath";

const EFFECT_ORDER = ["fog", "haze", "volumetric", "bloom", "godrays"] as const;
const EFFECT_LABEL: Record<(typeof EFFECT_ORDER)[number], string> = {
  fog: "Fog",
  haze: "Haze",
  volumetric: "Volumetric",
  bloom: "Bloom",
  godrays: "God Rays",
};

function colorToDescription(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b);
  const isWarm = r > b && r > 150;
  const isCool = b > r && b > 150;
  const isNeutral = Math.abs(r - g) < 40 && Math.abs(g - b) < 40;

  if (isNeutral && max > 200) return "bright white";
  if (isNeutral && max > 120) return "neutral gray";
  if (isNeutral) return "dim warm";
  if (isWarm && g > 150) return "warm golden";
  if (isWarm && g < 100) return "deep red";
  if (isWarm) return "warm orange";
  if (isCool && g > 150) return "cool cyan";
  if (isCool) return "cool blue";
  if (g > r && g > b) return "natural green-tinted";
  if (r > 200 && g < 100 && b > 150) return "magenta-pink";
  return "colored";
}

function brightnessDescription(v: number): string {
  if (v < 20) return "very dim";
  if (v < 40) return "subdued";
  if (v < 60) return "moderate";
  if (v < 80) return "bright";
  return "very bright";
}

function intensityDescription(v: number): string {
  if (v < 30) return "soft and diffused";
  if (v < 60) return "moderately focused";
  if (v < 85) return "focused";
  return "intense and concentrated";
}

export function getDefaultProductShotClause(shotId: ProductShotId | undefined): string {
  const id = shotId ?? "none";
  return PRODUCT_SHOT_PRESETS.find((p) => p.id === id)?.promptClause ?? "";
}

function getProductShotClause(
  shotId: ProductShotId | undefined,
  overrides?: Record<string, string>
): string {
  const id = shotId ?? "none";
  const override = overrides?.[id];
  if (override !== undefined) return override;
  return getDefaultProductShotClause(id);
}

function buildLightingSection(settings: LightingSettings): string {
  const direction = directionLabel(settings.primaryLight);
  const color = colorToDescription(settings.color);
  const brightness = brightnessDescription(settings.brightness);
  const intensity = intensityDescription(settings.intensity);
  const time =
    settings.timeOfDay === "day"
      ? "in a daytime environment"
      : "in a nighttime/dark environment";

  let section = `Light the scene with ${color} light coming from the ${direction}. `;
  section += `The light should be ${brightness} and ${intensity}. `;
  section += `Set the scene ${time}. `;
  section += `Brightness level: ${settings.brightness}%. Intensity: ${settings.intensity}%. `;

  if (settings.additionalLights.length > 0) {
    const enabled = settings.additionalLights.filter((l) => l.enabled);
    if (enabled.length > 0) {
      section += "Additional light sources: ";
      for (const l of enabled) {
        if (l.subPrompt && l.subPrompt.trim()) {
          section += `${l.name}: ${l.subPrompt.trim()}. `;
        } else {
          const d = directionLabel(l.position);
          const c = colorToDescription(l.color);
          const bDesc = brightnessDescription(l.brightness);
          const iDesc = intensityDescription(l.intensity);
          section += `${l.name} (${l.type}) with ${c} light from the ${d}, ${bDesc} at ${l.brightness}% brightness and ${iDesc} at ${l.intensity}% intensity. `;
        }
      }
    }
  }

  return section;
}

function buildEffectsSection(settings: LightingSettings): string {
  const activeEffects = settings.effects.filter((e) => e.enabled);
  const enabledEffects = EFFECT_ORDER.filter((type) =>
    activeEffects.some((e) => e.type === type)
  ).map((type) => EFFECT_LABEL[type]);
  const disabledEffects = EFFECT_ORDER.filter(
    (type) => !activeEffects.some((e) => e.type === type)
  ).map((type) => EFFECT_LABEL[type]);

  let section = `Enabled atmospheric effects: [${enabledEffects.join(", ")}]. `;
  section += `Disabled atmospheric effects: [${disabledEffects.join(", ")}]. `;

  if (activeEffects.length > 0) {
    const efx = activeEffects
      .map((e) => {
        const amount =
          e.intensity < 30 ? "subtle" : e.intensity < 70 ? "moderate" : "heavy";
        const label = EFFECT_LABEL[e.type];
        return `${amount} ${label}`;
      })
      .join(", ");
    section += `Apply only enabled atmospheric effects: ${efx}. Keep them subtle, scene-consistent, and non-destructive to product structure and branding. Never apply disabled effects. `;
  } else {
    section +=
      "Atmospheric effects are forbidden by default. Do not add fog, haze, volumetric light, bloom, or god rays unless explicitly enabled. ";
  }

  return section;
}

export function buildPrompt(
  settings: LightingSettings,
  productShotPromptOverrides?: Record<string, string>
): string {
  const shotId = settings.productShot ?? "none";
  const productClause = getProductShotClause(shotId, productShotPromptOverrides);
  const isProductCompose = shotId !== "none" && productClause.length > 0;

  let prompt = "";

  if (isProductCompose) {
    prompt +=
      "Product photography edit for a supplement/packaging shot. ";
    prompt +=
      "Preserve exact product identity: branding, logo, label typography, colors, materials, bottle/container shape, and any visible capsules or powder texture from the source. ";
    prompt +=
      "Do not invent a different product, rebrand, or alter logo/wordmark spelling. ";
    prompt +=
      "You MAY change composition, camera angle, pose, placement, and motion of the product and its contents as specified below. ";
    prompt += productClause + " ";
    prompt +=
      "Also apply the requested lighting setup while keeping speculars and shadows physically plausible on packaging materials. ";
  } else {
    prompt +=
      "Relight only. Preserve the exact geometry, materials, branding, labels, proportions, silhouette, object layout, scale, camera angle, lens perspective, framing, and product identity from the source image. ";
    prompt +=
      "Do not add, remove, replace, deform, redesign, or reposition any subject or object. ";
    prompt +=
      "Only modify illumination: lighting direction, intensity, color, reflections, shadows, exposure, and existing surface light response. ";
    prompt +=
      "Preserve original materials, albedo, textures, micro-detail, and edges. ";
    prompt +=
      "Keep lighting physically plausible with realistic falloff, grounded contact shadows, and correct specular behavior for each light direction. ";
  }

  prompt += buildLightingSection(settings);
  prompt += buildEffectsSection(settings);

  if (isProductCompose) {
    prompt +=
      "Final guardrail: keep product branding accurate; composition and placement follow the selected product shot; lighting matches the controls.";
  } else {
    prompt +=
      "Final guardrail: lighting-only edit, zero composition change, zero subject movement, zero identity drift.";
  }

  return prompt;
}

export interface NativeFiboParams {
  light_direction: "front" | "side" | "bottom" | "top-down";
  light_type: string;
}

export function settingsToFiboParams(
  settings: LightingSettings
): NativeFiboParams {
  const { azimuth, elevation } = settings.primaryLight;
  let direction: NativeFiboParams["light_direction"] = "front";
  const a = ((azimuth % 360) + 360) % 360;
  if (a >= 60 && a < 120) direction = "side";
  else if (a >= 240 && a < 300) direction = "side";
  if (elevation > 45) direction = "top-down";
  if (elevation < -45) direction = "bottom";

  const isDay = settings.timeOfDay === "day";
  let light_type = isDay
    ? "soft overcast daylight lighting"
    : "moonlight lighting";
  if (settings.intensity > 80)
    light_type = isDay ? "harsh studio lighting" : "spotlight on product";
  if (settings.brightness < 30)
    light_type = "fog-diffused lighting";

  return { light_direction: direction, light_type };
}

export function settingsToRelightingStyle(
  settings: LightingSettings
): string {
  const { azimuth, elevation } = settings.primaryLight;
  const isDay = settings.timeOfDay === "day";
  const isIntense = settings.intensity > 70;

  if (elevation > 60) return "studio";
  if (elevation < -30) return "rim_light";

  const a = ((azimuth % 360) + 360) % 360;
  if (a >= 60 && a < 120) return "side_light";
  if (a >= 240 && a < 300) return "side_light";
  if (a >= 135 && a < 225) return "backlight";

  if (isDay && settings.brightness > 60) return "golden_hour";
  if (!isDay && isIntense) return "spotlight";
  if (!isDay) return "moonlight";
  if (isIntense) return "dramatic";
  return "natural";
}
