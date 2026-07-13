import { create } from "zustand";
import type { Workspace, Generation, LightingSettings } from "@/types";
import { DEFAULT_LIGHTING } from "@/types";

interface WorkspaceState {
  workspaces: Workspace[];
  activeId: string | null;
  tabPage: number;
  isGenerating: boolean;
  generationProgress: string;
  magnifyActive: boolean;
  magnifyZoom: number;

  addWorkspace: (image: string, name?: string) => string;
  removeWorkspace: (id: string) => void;
  setActive: (id: string) => void;
  setTabPage: (page: number) => void;
  setOriginalImage: (id: string, img: string) => void;
  setRelitImage: (id: string, img: string | null) => void;
  addReferenceImages: (id: string, images: string[]) => void;
  removeReferenceImage: (id: string, index: number) => void;
  setLightingSettings: (id: string, s: LightingSettings) => void;
  addGeneration: (id: string, gen: Generation) => void;
  setGenerating: (v: boolean) => void;
  setProgress: (msg: string) => void;
  setMagnifyActive: (v: boolean) => void;
  setMagnifyZoom: (v: number) => void;
  restoreDefaults: (id: string) => void;
  getActive: () => Workspace | undefined;
}

const makeId = () => crypto.randomUUID();

const createWorkspace = (
  image: string | null,
  name?: string
): Workspace => ({
  id: makeId(),
  originalImage: image,
  relitImage: null,
  referenceImages: [],
  lightingSettings: { ...DEFAULT_LIGHTING },
  generations: [],
  createdAt: Date.now(),
  name: name || `Workspace ${Date.now()}`,
});

export const useWorkspaceStore = create<WorkspaceState>()((set, get) => ({
  workspaces: [],
  activeId: null,
  tabPage: 0,
  isGenerating: false,
  generationProgress: "",
  magnifyActive: false,
  magnifyZoom: 200,

  addWorkspace: (image, name) => {
    const ws = createWorkspace(image, name);
    set((s) => ({
      workspaces: [...s.workspaces, ws],
      activeId: ws.id,
    }));
    return ws.id;
  },

  removeWorkspace: (id) =>
    set((s) => {
      const filtered = s.workspaces.filter((w) => w.id !== id);
      return {
        workspaces: filtered,
        activeId:
          s.activeId === id
            ? filtered[0]?.id ?? null
            : s.activeId,
      };
    }),

  setActive: (id) => set({ activeId: id }),
  setTabPage: (page) => set({ tabPage: page }),

  setOriginalImage: (id, img) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) =>
        w.id === id ? { ...w, originalImage: img } : w
      ),
    })),

  setRelitImage: (id, img) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) =>
        w.id === id ? { ...w, relitImage: img } : w
      ),
    })),

  addReferenceImages: (id, images) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) =>
        w.id === id
          ? { ...w, referenceImages: [...(w.referenceImages ?? []), ...images] }
          : w
      ),
    })),

  removeReferenceImage: (id, index) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) =>
        w.id === id
          ? {
              ...w,
              referenceImages: (w.referenceImages ?? []).filter(
                (_, i) => i !== index
              ),
            }
          : w
      ),
    })),

  setLightingSettings: (id, settings) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) =>
        w.id === id ? { ...w, lightingSettings: settings } : w
      ),
    })),

  addGeneration: (id, gen) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) =>
        w.id === id
          ? { ...w, generations: [...w.generations, gen] }
          : w
      ),
    })),

  setGenerating: (v) => set({ isGenerating: v }),
  setProgress: (msg) => set({ generationProgress: msg }),
  setMagnifyActive: (v) => set({ magnifyActive: v }),
  setMagnifyZoom: (v) => set({ magnifyZoom: Math.max(100, Math.min(500, v)) }),

  restoreDefaults: (id) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) =>
        w.id === id
          ? {
              ...w,
              relitImage: null,
              lightingSettings: { ...DEFAULT_LIGHTING },
            }
          : w
      ),
    })),

  getActive: () => {
    const s = get();
    return s.workspaces.find((w) => w.id === s.activeId);
  },
}));
