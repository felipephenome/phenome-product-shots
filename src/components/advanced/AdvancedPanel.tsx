import { useState } from "react";
import { LightSourceEditor } from "./LightSourceEditor";
import { EffectsPanel } from "./EffectsPanel";
import { BlendModeSelector } from "./BlendModeSelector";
import { PromptOverride } from "./PromptOverride";
import { useLightingStore } from "@/stores/lightingStore";

export function AdvancedPanel() {
  const [open, setOpen] = useState(false);
  const lights = useLightingStore((s) => s.settings.additionalLights);

  return (
    <div>
      <button
        className="w-full flex items-center justify-between px-6 py-4 rounded-xl text-[12px] font-medium transition-all"
        style={{
          background: "var(--bg-tertiary)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
        }}
        onClick={() => setOpen((p) => !p)}
      >
        <span>
          Advanced Options
          {lights.length > 0 && (
            <span
              className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold"
              style={{ background: "var(--accent)", color: "white" }}
            >
              {lights.length}
            </span>
          )}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="mt-3 rounded-2xl p-6 flex flex-col gap-6"
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
          }}
        >
          <LightSourceEditor />

          <div style={{ height: 1, background: "var(--border-strong)" }} />

          <EffectsPanel />

          <div style={{ height: 1, background: "var(--border-strong)" }} />

          <BlendModeSelector />

          <div style={{ height: 1, background: "var(--border-strong)" }} />

          <PromptOverride />
        </div>
      )}
    </div>
  );
}
