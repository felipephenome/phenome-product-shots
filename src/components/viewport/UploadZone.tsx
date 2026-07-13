import { useCallback, useState } from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { fileToBase64 } from "@/utils/imageUtils";

export function UploadZone() {
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace);
  const [dragging, setDragging] = useState(false);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (fileArr.length === 0) return;
      for (const file of fileArr) {
        try {
          const base64 = await fileToBase64(file);
          if (base64 && base64.length > 0) {
            addWorkspace(base64, file.name.replace(/\.[^.]+$/, ""));
          }
        } catch (err) {
          console.error("Failed to process image:", err);
        }
      }
    },
    [addWorkspace]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ padding: "clamp(24px, 5vw, 64px)" }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <label
        htmlFor="upload-input"
        className="w-full h-full max-w-3xl max-h-[520px] rounded-2xl flex flex-col items-center justify-center gap-5 transition-all duration-300 cursor-pointer group"
        style={{
          background: dragging ? "var(--accent-soft)" : "var(--bg-secondary)",
          border: `1.5px dashed ${dragging ? "var(--accent)" : "var(--border-strong)"}`,
          boxShadow: dragging ? "0 0 0 4px var(--accent-glow)" : "none",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: "var(--accent-soft)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <div className="text-center space-y-1.5">
          <p className="font-display text-[13px] font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>
            Drop images here or click to upload
          </p>
          <p
            className="font-accent text-[18px] leading-snug"
            style={{ color: "var(--text-secondary)", letterSpacing: "-0.01em" }}
          >
            the science of you
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Supports PNG, JPEG, WebP &mdash; multiple files create separate workspaces
          </p>
        </div>
      </label>

      <input
        id="upload-input"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-label="Upload images"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) processFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
