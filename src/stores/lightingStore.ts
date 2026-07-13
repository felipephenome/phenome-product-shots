import { create } from "zustand";
import type {
  LightPosition,
  LightingSettings,
  LightSource,
  LightEffect,
  BlendMode,
  TimeOfDay,
  RelightModel,
  LightShape,
  ProductShotId,
} from "@/types";
import { DEFAULT_LIGHTING } from "@/types";

export type SelectedLightId = "primary" | string;

interface LightingState {
  settings: LightingSettings;
  selectedModel: RelightModel;
  customPrompt: string | null;
  lightShape: LightShape;
  selectedLightId: SelectedLightId;
  /** Per-shot-template starting-prompt overrides, keyed by ProductShotId. */
  productShotPrompts: Record<string, string>;

  setPrimaryLight: (pos: LightPosition) => void;
  setSelectedLight: (id: SelectedLightId) => void;
  setBrightness: (v: number) => void;
  setIntensity: (v: number) => void;
  setColor: (c: string) => void;
  setTimeOfDay: (t: TimeOfDay) => void;
  setBlendMode: (m: BlendMode) => void;
  setProductShot: (shot: ProductShotId) => void;
  setProductShotPromptOverride: (id: ProductShotId, text: string) => void;
  resetProductShotPrompt: (id: ProductShotId) => void;
  addLight: (light: LightSource) => void;
  removeLight: (id: string) => void;
  updateLight: (id: string, patch: Partial<LightSource>) => void;
  toggleEffect: (effect: LightEffect) => void;
  setModel: (m: RelightModel) => void;
  setCustomPrompt: (p: string | null) => void;
  setLightShape: (s: LightShape) => void;
  applyLightingSetup: (patch: Partial<LightingSettings>) => void;
  reset: () => void;
}

export const useLightingStore = create<LightingState>()((set) => ({
  settings: { ...DEFAULT_LIGHTING },
  selectedModel: "fal-ai/nano-banana-pro/edit",
  customPrompt: null,
  lightShape: "sphere" as LightShape,
  selectedLightId: "primary" as SelectedLightId,
  productShotPrompts: {},

  setPrimaryLight: (pos) =>
    set((s) => ({
      settings: { ...s.settings, primaryLight: pos },
    })),

  setBrightness: (v) =>
    set((s) => ({
      settings: { ...s.settings, brightness: v },
    })),

  setIntensity: (v) =>
    set((s) => ({
      settings: { ...s.settings, intensity: v },
    })),

  setColor: (c) =>
    set((s) => ({
      settings: { ...s.settings, color: c },
    })),

  setTimeOfDay: (t) =>
    set((s) => ({
      settings: { ...s.settings, timeOfDay: t },
    })),

  setBlendMode: (m) =>
    set((s) => ({
      settings: { ...s.settings, blendMode: m },
    })),

  setProductShot: (shot) =>
    set((s) => ({
      settings: { ...s.settings, productShot: shot },
      customPrompt: null,
    })),

  setProductShotPromptOverride: (id, text) =>
    set((s) => ({
      productShotPrompts: { ...s.productShotPrompts, [id]: text },
      customPrompt: null,
    })),

  resetProductShotPrompt: (id) =>
    set((s) => {
      const next = { ...s.productShotPrompts };
      delete next[id];
      return { productShotPrompts: next, customPrompt: null };
    }),

  addLight: (light) =>
    set((s) => ({
      settings: {
        ...s.settings,
        additionalLights: [...s.settings.additionalLights, light],
      },
    })),

  removeLight: (id) =>
    set((s) => ({
      settings: {
        ...s.settings,
        additionalLights: s.settings.additionalLights.filter(
          (l) => l.id !== id
        ),
      },
      selectedLightId:
        s.selectedLightId === id ? ("primary" as SelectedLightId) : s.selectedLightId,
    })),

  updateLight: (id, patch) =>
    set((s) => ({
      settings: {
        ...s.settings,
        additionalLights: s.settings.additionalLights.map((l) =>
          l.id === id ? { ...l, ...patch } : l
        ),
      },
    })),

  toggleEffect: (effect) =>
    set((s) => {
      const existing = s.settings.effects.find(
        (e) => e.type === effect.type
      );
      if (existing) {
        return {
          settings: {
            ...s.settings,
            effects: s.settings.effects.map((e) =>
              e.type === effect.type
                ? { ...e, enabled: !e.enabled }
                : e
            ),
          },
        };
      }
      return {
        settings: {
          ...s.settings,
          effects: [...s.settings.effects, effect],
        },
      };
    }),

  setModel: (m) => set({ selectedModel: m }),
  setCustomPrompt: (p) => set({ customPrompt: p }),
  setLightShape: (s) => set({ lightShape: s }),
  applyLightingSetup: (patch) =>
    set((s) => ({
      settings: { ...s.settings, ...patch },
      selectedLightId: "primary",
    })),
  setSelectedLight: (id) => set({ selectedLightId: id }),
  reset: () =>
    set({
      settings: { ...DEFAULT_LIGHTING },
      customPrompt: null,
      selectedLightId: "primary",
      productShotPrompts: {},
    }),
}));
