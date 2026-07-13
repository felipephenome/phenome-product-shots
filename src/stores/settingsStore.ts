import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  falApiKey: string | null;
  setFalApiKey: (key: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      falApiKey: null,
      setFalApiKey: (key) => set({ falApiKey: key }),
    }),
    { name: "phenome-settings" }
  )
);
