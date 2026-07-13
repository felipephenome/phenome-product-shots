import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const falApiKey = useSettingsStore((s) => s.falApiKey);
  const setFalApiKey = useSettingsStore((s) => s.setFalApiKey);
  const [draft, setDraft] = useState(falApiKey ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(falApiKey ?? "");
      setSaved(false);
    }
  }, [open, falApiKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    const trimmed = draft.trim();
    setFalApiKey(trimmed.length > 0 ? trimmed : null);
    setSaved(true);
  };

  const handleClear = () => {
    setDraft("");
    setFalApiKey(null);
    setSaved(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(29, 29, 31, 0.5)", padding: 24 }}
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-md flex flex-col gap-6"
        style={{ padding: "28px 28px 24px" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="settings-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="pr-2">
            <h2
              id="settings-title"
              className="font-display text-[16px] font-bold tracking-[-0.02em]"
              style={{ color: "var(--text-primary)" }}
            >
              Settings
            </h2>
            <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Connect your own fal.ai API key for image generation.
            </p>
          </div>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ color: "var(--text-secondary)", background: "var(--bg-tertiary)" }}
            onClick={onClose}
            aria-label="Close settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          <label
            htmlFor="fal-api-key"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            fal.ai API Key
          </label>
          <input
            id="fal-api-key"
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setSaved(false);
            }}
            placeholder="Paste your fal.ai key"
            className="w-full rounded-xl text-[13px] outline-none"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-strong)",
              padding: "12px 14px",
            }}
          />
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            Get a key from{" "}
            <a
              href="https://fal.ai/dashboard/keys"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}
            >
              fal.ai dashboard
            </a>
            . Stored only in this browser&apos;s localStorage. Leave empty to use the server/env fallback.
          </p>
          {falApiKey && (
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              If Generate fails with an unauthorized/401 error, this key is invalid or expired — copy a fresh one from the fal.ai dashboard, or Clear it to fall back to the server key.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button type="button" className="pill-btn" onClick={handleClear}>
            Clear
          </button>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-[12px]" style={{ color: "var(--success, #2E7D4F)" }}>
                Saved
              </span>
            )}
            <button type="button" className="pill-btn accent" onClick={handleSave}>
              Save key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
