import { useEffect, useMemo, useState } from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { ImageViewport } from "../viewport/ImageViewport";
import { UploadZone } from "../viewport/UploadZone";
import { ControlPanel } from "./ControlPanel";
import { WorkspaceTabs } from "../workspace/WorkspaceTabs";
import { Toolbar } from "../workspace/Toolbar";

export function MainLayout() {
  const MIN_SIDEBAR = 360;
  const MAX_SIDEBAR = 620;
  const DEFAULT_SIDEBAR = 420;
  const activeId = useWorkspaceStore((s) => s.activeId);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const setActive = useWorkspaceStore((s) => s.setActive);
  const active = workspaces.find((w) => w.id === activeId);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR);
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    if (workspaces.length === 0) return;
    const activeExists = workspaces.some((w) => w.id === activeId);
    if (!activeExists) setActive(workspaces[0].id);
  }, [workspaces, activeId, setActive]);

  const showImage = active?.originalImage;
  const resolvedSidebarWidth = useMemo(
    () => Math.max(MIN_SIDEBAR, Math.min(MAX_SIDEBAR, sidebarWidth)),
    [sidebarWidth]
  );

  useEffect(() => {
    if (!showImage) return;
    setSidebarOpen(true);
  }, [showImage]);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: MouseEvent) => {
      const viewportWidth = window.innerWidth;
      const next = viewportWidth - e.clientX;
      const maxByViewport = Math.max(MIN_SIDEBAR, viewportWidth - 240);
      setSidebarWidth(Math.max(MIN_SIDEBAR, Math.min(Math.min(MAX_SIDEBAR, maxByViewport), next)));
    };
    const onUp = () => {
      setResizing(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resizing]);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main viewport area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 relative overflow-hidden">
          {showImage && active ? (
            <ImageViewport workspace={active} />
          ) : (
            <UploadZone />
          )}
        </div>

        {/* Floating bottom bar -- centered over viewport */}
        {workspaces.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            <div className="floating-bar flex items-center gap-2">
              <WorkspaceTabs />
            </div>
            <div className="floating-bar flex items-center gap-1.5">
              <Toolbar />
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      {showImage && active && (
        <>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{
                background: "var(--glass)",
                color: "var(--text-secondary)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-md)",
                backdropFilter: "blur(10px)",
              }}
              title="Show controls"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          <div
            className="shrink-0 overflow-hidden transition-[width] duration-200 ease-out"
            style={{
              width: sidebarOpen ? resolvedSidebarWidth : 0,
              background: "var(--bg-secondary)",
              borderLeft: sidebarOpen ? "1px solid var(--border)" : "none",
              minWidth: sidebarOpen ? MIN_SIDEBAR : 0,
              maxWidth: sidebarOpen ? MAX_SIDEBAR : 0,
            }}
          >
            {sidebarOpen && (
              <div className="relative h-full">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute right-4 top-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                  title="Hide controls"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div
                  className="absolute left-0 top-0 h-full w-2 cursor-col-resize z-20"
                  onMouseDown={() => {
                    setResizing(true);
                  }}
                  title="Resize sidebar"
                >
                  <div
                    className="h-full w-[1px] mx-auto"
                    style={{
                      background: resizing ? "var(--accent)" : "var(--border-strong)",
                      opacity: resizing ? 0.7 : 0.35,
                    }}
                  />
                </div>

                <div className="h-full overflow-y-auto overflow-x-hidden min-w-0" style={{ padding: "20px 24px 28px" }}>
                  <ControlPanel />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
