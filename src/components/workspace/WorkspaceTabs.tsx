import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useCallback, useRef } from "react";
import { fileToBase64 } from "@/utils/imageUtils";

const PAGE_SIZE = 10;

export function WorkspaceTabs() {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const activeId = useWorkspaceStore((s) => s.activeId);
  const tabPage = useWorkspaceStore((s) => s.tabPage);
  const setActive = useWorkspaceStore((s) => s.setActive);
  const setTabPage = useWorkspaceStore((s) => s.setTabPage);
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace);
  const removeWorkspace = useWorkspaceStore((s) => s.removeWorkspace);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(workspaces.length / PAGE_SIZE);
  const start = tabPage * PAGE_SIZE;
  const visible = workspaces.slice(start, start + PAGE_SIZE);

  const handleAdd = useCallback(
    async (files: FileList) => {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const b64 = await fileToBase64(file);
        addWorkspace(b64, file.name.replace(/\.[^.]+$/, ""));
      }
    },
    [addWorkspace]
  );

  return (
    <div className="flex items-center gap-1.5">
      {tabPage > 0 && (
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ color: "var(--text-secondary)" }}
          onClick={() => setTabPage(tabPage - 1)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Add button */}
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
        style={{
          background: "var(--bg-tertiary)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
        }}
        onClick={() => inputRef.current?.click()}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Workspace thumbnails */}
      {visible.map((ws) => {
        const isActive = ws.id === activeId;
        return (
          <div key={ws.id} className="relative group">
            <button
              className="w-8 h-8 rounded-full overflow-hidden shrink-0 transition-all"
              style={{
                border: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                boxShadow: isActive ? "0 0 0 2px var(--accent-glow)" : "none",
                opacity: isActive ? 1 : 0.7,
              }}
              onClick={() => setActive(ws.id)}
            >
              {ws.originalImage && (
                <img src={ws.originalImage} alt="" className="w-full h-full object-cover" draggable={false} />
              )}
            </button>
            <button
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "var(--accent)", color: "white", fontSize: "8px", lineHeight: 1 }}
              onClick={(e) => { e.stopPropagation(); removeWorkspace(ws.id); }}
            >
              &times;
            </button>
          </div>
        );
      })}

      {totalPages > 1 && tabPage < totalPages - 1 && (
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ color: "var(--text-secondary)" }}
          onClick={() => setTabPage(tabPage + 1)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) handleAdd(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
