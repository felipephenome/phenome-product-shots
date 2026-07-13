import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

interface HeaderProps {
  onFolderToggle: () => void;
}

export function Header({ onFolderToggle }: HeaderProps) {
  const { isDark, toggle } = useThemeStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header
        className="flex items-center justify-between shrink-0"
        style={{
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          padding: "14px 24px",
          minHeight: 64,
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "var(--bg-tertiary)",
              border: "1px solid var(--border)",
            }}
          >
            <img
              src="/phenome-icon.png?v=2"
              alt=""
              className="w-6 h-6 object-contain"
              draggable={false}
            />
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--accent)" }}
            >
              Phenome
            </span>
            <span
              className="font-display text-[15px] font-bold tracking-[-0.02em] truncate"
              style={{ color: "var(--text-primary)" }}
            >
              Picture Stash
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="pill-btn" onClick={onFolderToggle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span className="hidden sm:inline">Gallery</span>
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "var(--text-secondary)", background: "var(--bg-tertiary)" }}
            title="Settings"
            aria-label="Open settings"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "var(--text-secondary)", background: "var(--bg-tertiary)" }}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
