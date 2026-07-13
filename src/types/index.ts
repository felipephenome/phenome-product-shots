export interface LightPosition {
  azimuth: number;
  elevation: number;
}

export type LightPresetDirection =
  | "top"
  | "front"
  | "right"
  | "left"
  | "back"
  | "bottom";

export type LightShape = "sphere" | "cube" | "plane";

export interface LightSource {
  id: string;
  name: string;
  position: LightPosition;
  color: string;
  brightness: number;
  intensity: number;
  type: LightModifier;
  spreadAngle: number;
  enabled: boolean;
  subPrompt?: string;
}

export type LightModifier =
  | "softbox"
  | "natural"
  | "spotlight"
  | "hard"
  | "ambient"
  | "rim";

export type TimeOfDay = "day" | "night";

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "soft-light"
  | "hard-light";

export type ProductShotId = string;

export interface ProductShotPreset {
  id: ProductShotId;
  label: string;
  description: string;
  category: string;
  /** Prompt clause injected when this shot is active (empty for none). */
  promptClause: string;
}

export const PRODUCT_SHOT_PRESETS: ProductShotPreset[] = [
  {
    id: "none",
    label: "Relight only",
    description: "Keep composition; change lighting only",
    category: "Default",
    promptClause: "",
  },

  // Hero Still
  {
    id: "hero-still-centered",
    label: "Hero — Centered",
    description: "Upright, three-quarter angle, clean surface",
    category: "Hero Still",
    promptClause:
      "Compose as a premium product hero still: the main product standing upright and centered on a clean surface, slight three-quarter angle, generous negative space, studio product photography framing. Keep branding and label fully legible.",
  },
  {
    id: "hero-still-front",
    label: "Hero — Front-on",
    description: "Straight-on, symmetrical, label-forward",
    category: "Hero Still",
    promptClause:
      "Compose as a straight-on product hero still: the product centered and facing the camera directly, perfectly symmetrical, label fully forward and legible. Clean studio backdrop with even negative space on both sides.",
  },
  {
    id: "hero-still-low-angle",
    label: "Hero — Low angle",
    description: "Camera looks up, heroic and tall",
    category: "Hero Still",
    promptClause:
      "Compose as a heroic low-angle product still: camera positioned slightly below the product looking upward, making it feel tall and imposing. Keep the product centered and label readable, with a clean gradient backdrop.",
  },
  {
    id: "hero-still-overhead",
    label: "Hero — Overhead",
    description: "Top-down centered hero shot",
    category: "Hero Still",
    promptClause:
      "Compose as a top-down hero still: camera directly overhead looking straight down at the product, centered in frame with a clean, minimal surface. Preserve cap/lid detail and label orientation.",
  },

  // Bottle Toss
  {
    id: "bottle-toss-freeze",
    label: "Toss — Freeze frame",
    description: "Mid-air, slight tilt, frozen motion",
    category: "Bottle Toss",
    promptClause:
      "Recompose as a dynamic product action shot: the bottle is mid-air as if tossed, tilted and rotating slightly, frozen motion with subtle motion cues. Preserve bottle shape, label, and brand colors exactly. Soft studio backdrop.",
  },
  {
    id: "bottle-toss-spin",
    label: "Toss — Spin",
    description: "End-over-end spin mid-air",
    category: "Bottle Toss",
    promptClause:
      "Recompose as a spinning bottle toss shot: the bottle is captured mid-air spinning end-over-end, label partially rotated toward camera at the moment of capture. Frozen action, soft studio backdrop, brand details fully preserved.",
  },
  {
    id: "bottle-toss-low-angle",
    label: "Toss — Low angle",
    description: "Looking up at the tossed bottle",
    category: "Bottle Toss",
    promptClause:
      "Recompose as a low-angle bottle toss shot: camera positioned below, looking up at the bottle suspended mid-air against a clean sky-like or gradient backdrop. Dramatic, heroic energy. Preserve label and branding exactly.",
  },
  {
    id: "bottle-toss-arc",
    label: "Toss — Arc trail",
    description: "Full trajectory arc with motion trail",
    category: "Bottle Toss",
    promptClause:
      "Recompose as a bottle toss with a visible trajectory: the bottle mid-flight along an arcing path, with a subtle motion trail or streak indicating its arc through the air. Keep the bottle itself sharp and branding crisp.",
  },
  {
    id: "bottle-toss-slow-mo",
    label: "Toss — Slow motion",
    description: "Dramatic slow-motion style blur",
    category: "Bottle Toss",
    promptClause:
      "Recompose as a slow-motion style bottle toss: the bottle tumbling gently mid-air with cinematic slow-motion cues (soft directional motion blur at the edges only), while the label and cap remain sharp and legible.",
  },

  // Capsules Cascade
  {
    id: "capsules-cascade-pour",
    label: "Cascade — Pour arc",
    description: "Tipped bottle, controlled pour arc",
    category: "Capsules Cascade",
    promptClause:
      "Recompose as a product content reveal: the bottle is tipped or mid-pour with capsules/pills cascading out in a controlled arc, some mid-air and some landing. Keep capsules consistent with the product. Preserve bottle branding and label fidelity.",
  },
  {
    id: "capsules-cascade-closeup",
    label: "Cascade — Close-up",
    description: "Tight framing on falling capsules",
    category: "Capsules Cascade",
    promptClause:
      "Recompose as a close-up capsule cascade: tight framing on capsules/pills tumbling out of the bottle opening, sharp detail on capsule texture and color, bottle visible but secondary in frame. Preserve exact capsule appearance.",
  },
  {
    id: "capsules-cascade-slowfall",
    label: "Cascade — Slow fall",
    description: "Few capsules gently suspended mid-air",
    category: "Capsules Cascade",
    promptClause:
      "Recompose as a gentle capsule fall: a small number of capsules/pills suspended mid-air at varying heights above or beside the upright bottle, as if drifting slowly downward. Calm, elegant composition. Preserve capsule and bottle detail.",
  },
  {
    id: "capsules-cascade-overflow",
    label: "Cascade — Overflow",
    description: "Capsules overflowing from open cap",
    category: "Capsules Cascade",
    promptClause:
      "Recompose as an overflowing capsule shot: the open bottle cap sits beside the upright bottle with capsules/pills overflowing generously around and out of it onto the surface. Preserve bottle, cap, and capsule fidelity.",
  },
  {
    id: "capsules-cascade-handfree",
    label: "Cascade — Floating stream",
    description: "Capsules flowing without a visible hand",
    category: "Capsules Cascade",
    promptClause:
      "Recompose as a floating capsule stream: capsules/pills appear to flow in a continuous curved stream from the bottle opening as if poured, with no hand present, suspended mid-air in an elegant arc. Preserve product branding.",
  },

  // Spill / Pour
  {
    id: "spill-pour-powder-mound",
    label: "Spill — Powder mound",
    description: "Powder spilling into a mound",
    category: "Spill Pour",
    promptClause:
      "Recompose as a spill/pour product shot: bottle or container pouring or tipped, with powder spilling onto the surface into a natural mound beside it. Emphasize the texture and grain of the spilled powder. Keep packaging branding intact.",
  },
  {
    id: "spill-pour-liquid-splash",
    label: "Spill — Liquid splash",
    description: "Splashing droplets around the product",
    category: "Spill Pour",
    promptClause:
      "Recompose as a liquid splash product shot: the product surrounded by dynamic liquid splash droplets frozen mid-motion, as if just poured or dropped into liquid. Keep the product itself dry, sharp, and fully branded.",
  },
  {
    id: "spill-pour-side-stream",
    label: "Spill — Side stream",
    description: "Pouring sideways into a stream",
    category: "Spill Pour",
    promptClause:
      "Recompose as a side-pour product shot: the container tilted, pouring its contents sideways in a continuous stream that lands in a small pile or puddle beside the product. Dynamic diagonal composition, branding preserved.",
  },
  {
    id: "spill-pour-overhead",
    label: "Spill — Overhead pour",
    description: "Straight-down pour stream from above",
    category: "Spill Pour",
    promptClause:
      "Recompose as an overhead pour shot: camera looking down as contents pour straight down from above into a neat pile or puddle, product visible at the edge of frame. Clean, editorial, top-down composition.",
  },

  // Levitate
  {
    id: "levitate-centered",
    label: "Levitate — Centered",
    description: "Centered float, soft contact shadow",
    category: "Levitate",
    promptClause:
      "Recompose as a levitating product shot: the product floats centered above a clean surface with a soft grounded contact shadow beneath it. Minimal props. Keep exact product geometry, materials, and branding.",
  },
  {
    id: "levitate-tilted",
    label: "Levitate — Tilted",
    description: "Floating at a dynamic tilted angle",
    category: "Levitate",
    promptClause:
      "Recompose as a tilted levitation shot: the product floats at a dynamic tilted angle above a clean surface, with a soft directional shadow beneath indicating its height and tilt. Preserve product geometry and branding exactly.",
  },
  {
    id: "levitate-orbit",
    label: "Levitate — Orbiting particles",
    description: "Capsules or particles orbiting the product",
    category: "Levitate",
    promptClause:
      "Recompose as an orbiting levitation shot: the product floats centered while a few capsules or particles orbit gently around it at varying distances, as if suspended in the same field. Clean backdrop, soft contact shadow below.",
  },
  {
    id: "levitate-rotate",
    label: "Levitate — Rotating",
    description: "Floating and slowly rotating",
    category: "Levitate",
    promptClause:
      "Recompose as a rotating levitation shot: the product floats above the surface, angled to suggest a slow rotation with the label partially turned toward the camera. Soft ambient shadow beneath, minimal clean backdrop.",
  },

  // Flat Lay
  {
    id: "flat-lay-grid",
    label: "Flat lay — Grid",
    description: "Symmetric grid arrangement",
    category: "Flat Lay",
    promptClause:
      "Recompose as an overhead flat-lay grid: camera looking straight down, the product and related elements (capsules, scoop, lid) arranged in a neat symmetric grid with even spacing. Preserve brand colors and label detail.",
  },
  {
    id: "flat-lay-scattered",
    label: "Flat lay — Scattered",
    description: "Casual scattered top-down layout",
    category: "Flat Lay",
    promptClause:
      "Recompose as a casual overhead flat-lay: camera looking straight down, product and a few capsules or accessories scattered naturally around it in a relaxed, editorial arrangement. Preserve branding and label legibility.",
  },
  {
    id: "flat-lay-minimal",
    label: "Flat lay — Minimal",
    description: "Single product, generous negative space",
    category: "Flat Lay",
    promptClause:
      "Recompose as a minimal overhead flat-lay: camera looking straight down at just the product alone on a clean surface, generous negative space around it, no extra props. Preserve label orientation and branding.",
  },
  {
    id: "flat-lay-ingredients",
    label: "Flat lay — Ingredients",
    description: "Surrounded by ingredient elements",
    category: "Flat Lay",
    promptClause:
      "Recompose as an ingredient-story flat-lay: camera looking straight down, the product centered and surrounded by relevant raw ingredient elements (e.g. broccoli, seeds, powder) arranged aesthetically around it. Preserve product branding.",
  },

  // Deconstructed
  {
    id: "deconstructed-exploded",
    label: "Deconstructed — Exploded",
    description: "Parts separated with even spacing",
    category: "Deconstructed",
    promptClause:
      "Recompose as a deconstructed exploded-view layout: bottle, lid/cap, and contents (capsules or powder) separated with clear even spacing between each part, arranged along a single axis. Maintain accurate product identity and packaging graphics.",
  },
  {
    id: "deconstructed-cross-section",
    label: "Deconstructed — Cross-section",
    description: "Cut-away view revealing contents",
    category: "Deconstructed",
    promptClause:
      "Recompose as a cross-section product view: the container shown as if partially cut away, revealing an internal view of the capsules or powder inside alongside the intact exterior. Keep exterior branding and proportions accurate.",
  },
  {
    id: "deconstructed-layered",
    label: "Deconstructed — Layered depth",
    description: "Front-to-back layered arrangement",
    category: "Deconstructed",
    promptClause:
      "Recompose as a layered-depth deconstruction: bottle, cap, and contents arranged front-to-back with a shallow depth of field, each element slightly offset in depth to create a layered, editorial composition. Preserve branding fidelity.",
  },
  {
    id: "deconstructed-assembly",
    label: "Deconstructed — Assembly line",
    description: "Left-to-right sequential arrangement",
    category: "Deconstructed",
    promptClause:
      "Recompose as an assembly-line deconstruction: bottle, cap, and contents arranged left-to-right in a clear sequential order suggesting how the product is used or assembled. Even spacing, clean surface, accurate branding.",
  },

  // Dynamic Tumble
  {
    id: "dynamic-tumble-diagonal",
    label: "Tumble — Diagonal",
    description: "Tumbling along a diagonal motion path",
    category: "Dynamic Tumble",
    promptClause:
      "Recompose as a dynamic tumble shot: the product is rolling or tumbling mid-motion along a diagonal path at a dramatic angle, frozen in time with energetic composition. Preserve silhouette, materials, and branding. Soft studio environment.",
  },
  {
    id: "dynamic-tumble-spiral",
    label: "Tumble — Spiral",
    description: "Spiral rotation frozen mid-air",
    category: "Dynamic Tumble",
    promptClause:
      "Recompose as a spiraling tumble shot: the product frozen mid-air in a spiral rotation, as if caught spinning through multiple axes at once. Dynamic, energetic framing. Preserve exact product shape and branding.",
  },
  {
    id: "dynamic-tumble-bounce",
    label: "Tumble — Bounce",
    description: "Bouncing off the surface mid-motion",
    category: "Dynamic Tumble",
    promptClause:
      "Recompose as a bouncing tumble shot: the product captured mid-bounce just after impact with the surface, slightly airborne with a subtle impact shadow beneath. Energetic, frozen-action feel. Preserve product geometry and branding.",
  },
  {
    id: "dynamic-tumble-freefall",
    label: "Tumble — Free fall",
    description: "Vertical descent, frozen mid-fall",
    category: "Dynamic Tumble",
    promptClause:
      "Recompose as a free-fall tumble shot: the product frozen mid-fall in a vertical descent, slightly tilted as if caught by a high-speed camera. Clean gradient backdrop, dramatic framing. Preserve branding and material fidelity.",
  },

  // Macro Label
  {
    id: "macro-label-front",
    label: "Macro — Front label",
    description: "Tight crop on the front label",
    category: "Macro Label",
    promptClause:
      "Recompose as a macro product close-up: tight framing on the front label/branding, shallow depth of field, premium packaging detail. Keep typography and logo crisp and accurate.",
  },
  {
    id: "macro-label-cap",
    label: "Macro — Cap detail",
    description: "Close-up on the cap or lid",
    category: "Macro Label",
    promptClause:
      "Recompose as a macro cap/lid close-up: tight framing on the cap or lid texture and any embossed detail, shallow depth of field with the rest of the bottle softly out of focus behind it. Preserve material and color accuracy.",
  },
  {
    id: "macro-label-texture",
    label: "Macro — Surface texture",
    description: "Extreme close-up on material texture",
    category: "Macro Label",
    promptClause:
      "Recompose as an extreme macro texture shot: very close framing on the packaging surface material (glass, plastic, or matte finish), emphasizing texture and light reflection, with the label just barely legible at the edge of frame.",
  },
  {
    id: "macro-label-angled",
    label: "Macro — Angled reflection",
    description: "Angled close-up with reflective highlight",
    category: "Macro Label",
    promptClause:
      "Recompose as an angled macro close-up: camera angled to catch a subtle reflective highlight across the label/branding surface, tight framing, shallow depth of field. Keep logo and typography sharp and legible.",
  },

  // Tabletop Lifestyle
  {
    id: "tabletop-morning",
    label: "Tabletop — Morning routine",
    description: "Styled morning routine surface",
    category: "Tabletop Lifestyle",
    promptClause:
      "Recompose as a lifestyle tabletop shot styled as a morning routine: product placed naturally beside subtle props like a glass of water or a soft napkin on a warm-lit surface. Editorial, still-life feel, branding unobscured.",
  },
  {
    id: "tabletop-gym",
    label: "Tabletop — Gym bag",
    description: "Active lifestyle context",
    category: "Tabletop Lifestyle",
    promptClause:
      "Recompose as an active-lifestyle tabletop shot: product placed near subtle fitness-adjacent props (a towel, water bottle, or gym bag texture) without any people present. Clean, energetic still-life composition, branding fully visible.",
  },
  {
    id: "tabletop-kitchen",
    label: "Tabletop — Kitchen counter",
    description: "Kitchen counter context",
    category: "Tabletop Lifestyle",
    promptClause:
      "Recompose as a kitchen-counter lifestyle shot: product placed naturally on a styled kitchen countertop surface with soft complementary props (a spoon, small bowl, or cutting board) that do not obscure branding. Warm, natural light feel.",
  },
  {
    id: "tabletop-bathroom",
    label: "Tabletop — Bathroom shelf",
    description: "Bathroom shelf context",
    category: "Tabletop Lifestyle",
    promptClause:
      "Recompose as a bathroom-shelf lifestyle shot: product placed on a clean styled shelf or ledge with subtle spa-like props (a folded towel, small plant, or stone tray) that do not obscure branding. Calm, premium still-life feel.",
  },

  // Impact Scatter
  {
    id: "impact-scatter-radial",
    label: "Impact — Radial burst",
    description: "Contents bursting outward radially",
    category: "Impact Scatter",
    promptClause:
      "Recompose as an impact/scatter product moment: bottle landing or bouncing as capsules and contents scatter outward in a radial burst around it. High-energy but controlled, frozen action. Preserve product branding and capsule appearance.",
  },
  {
    id: "impact-scatter-bounce",
    label: "Impact — Bounce landing",
    description: "Capsules bouncing off the surface",
    category: "Impact Scatter",
    promptClause:
      "Recompose as a bounce-landing scatter shot: capsules frozen mid-bounce just after hitting the surface near the product, some airborne at small heights, others settled. Preserve capsule and bottle detail, controlled energetic feel.",
  },
  {
    id: "impact-scatter-splash",
    label: "Impact — Splash impact",
    description: "Liquid splash impact scatter",
    category: "Impact Scatter",
    promptClause:
      "Recompose as a splash-impact scatter shot: the product surrounded by a frozen liquid splash crown at the moment of impact, droplets suspended mid-air around it. Keep the product itself sharp, dry, and fully branded.",
  },
  {
    id: "impact-scatter-shatter",
    label: "Impact — Shatter ring",
    description: "Ring-shaped scatter pattern",
    category: "Impact Scatter",
    promptClause:
      "Recompose as a shatter-ring scatter shot: capsules or contents arranged in a dynamic ring-shaped scatter pattern radiating from the product's point of impact, as if captured at the peak of a burst. Preserve exact branding and capsule look.",
  },

  // Studio Sweep
  {
    id: "studio-sweep-curve",
    label: "Studio — Infinite curve",
    description: "Seamless curved studio backdrop",
    category: "Studio Sweep",
    promptClause:
      "Recompose against a seamless infinite-curve studio backdrop: the product placed on a smooth sweep surface where floor and background blend seamlessly, classic studio product photography setup. Preserve product placement and branding.",
  },
  {
    id: "studio-sweep-gradient",
    label: "Studio — Gradient backdrop",
    description: "Smooth gradient studio background",
    category: "Studio Sweep",
    promptClause:
      "Recompose against a smooth gradient studio backdrop: the product centered in front of a soft tonal gradient background that complements the packaging colors, clean and premium. Preserve product geometry and branding exactly.",
  },

  // Group Lineup
  {
    id: "group-lineup-row",
    label: "Group — Row formation",
    description: "Multiple units in a straight row",
    category: "Group Lineup",
    promptClause:
      "Recompose as a group lineup: multiple copies of the same product arranged in a straight evenly-spaced row, all facing the camera consistently. Keep every unit's branding and proportions identical and accurate to the source.",
  },
  {
    id: "group-lineup-staggered",
    label: "Group — Staggered depth",
    description: "Units staggered front to back",
    category: "Group Lineup",
    promptClause:
      "Recompose as a staggered group lineup: multiple copies of the same product arranged with staggered depth and slight offsets front-to-back, creating a sense of scale. Keep every unit's branding, color, and proportions consistent and accurate.",
  },
];

export interface LightingSettings {
  primaryLight: LightPosition;
  brightness: number;
  intensity: number;
  color: string;
  timeOfDay: TimeOfDay;
  additionalLights: LightSource[];
  effects: LightEffect[];
  blendMode: BlendMode;
  productShot: ProductShotId;
}

export interface LightEffect {
  type: "fog" | "haze" | "volumetric" | "bloom" | "godrays";
  intensity: number;
  enabled: boolean;
}

export type RelightModel =
  | "fal-ai/nano-banana-pro/edit"
  | "fal-ai/image-apps-v2/relighting"
  | "fal-ai/iclight-v2"
  | "bria/fibo-edit/relight";

export interface ModelInfo {
  id: RelightModel;
  name: string;
  description: string;
  costLabel: string;
}

export interface Workspace {
  id: string;
  originalImage: string | null;
  relitImage: string | null;
  /** Extra reference images (e.g. other angles, packaging shots) used to steer multi-image models like Nano Banana Pro. */
  referenceImages: string[];
  lightingSettings: LightingSettings;
  generations: Generation[];
  createdAt: number;
  name: string;
}

export interface Generation {
  id: string;
  originalImage: string;
  relitImage: string;
  prompt: string;
  model: RelightModel;
  settings: LightingSettings;
  timestamp: number;
  format: "png" | "jpeg" | "webp";
}

export type ImageFormat = "png" | "jpeg" | "webp" | "base64";

export const DEFAULT_LIGHTING: LightingSettings = {
  primaryLight: { azimuth: 0, elevation: 0 },
  brightness: 70,
  intensity: 100,
  color: "#ff6b6b",
  timeOfDay: "night",
  additionalLights: [],
  effects: [],
  blendMode: "normal",
  productShot: "none",
};

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: "fal-ai/nano-banana-pro/edit",
    name: "Nano Banana Pro",
    description: "Best quality, prompt-based relighting",
    costLabel: "$0.15/img",
  },
  {
    id: "fal-ai/image-apps-v2/relighting",
    name: "Quick Relight",
    description: "Fast preset-based lighting styles",
    costLabel: "$0.04/img",
  },
  {
    id: "fal-ai/iclight-v2",
    name: "IC-Light v2",
    description: "Advanced relighting + background",
    costLabel: "$0.10/mpx",
  },
  {
    id: "bria/fibo-edit/relight",
    name: "Fibo Relight",
    description: "Structured direction + type control",
    costLabel: "$0.04/img",
  },
];

export const LIGHT_PRESETS: Record<
  LightPresetDirection,
  LightPosition
> = {
  top: { azimuth: 0, elevation: 90 },
  bottom: { azimuth: 0, elevation: -90 },
  front: { azimuth: 0, elevation: 0 },
  back: { azimuth: 180, elevation: 0 },
  left: { azimuth: -90, elevation: 0 },
  right: { azimuth: 90, elevation: 0 },
};
