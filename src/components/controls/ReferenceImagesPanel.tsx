import { useCallback, useRef, useState } from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useLightingStore } from "@/stores/lightingStore";
import { fileToBase64 } from "@/utils/imageUtils";

const MAX_REFERENCES = 6;

export function ReferenceImagesPanel() {
  const activeId = useWorkspaceStore((s) => s.activeId);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const addReferenceImages = useWorkspaceStore((s) => s.addReferenceImages);
  const removeReferenceImage = useWorkspaceStore((s) => s.removeReferenceImage);
  const selectedModel = useLightingStore((s) => s.selectedModel);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const active = workspaces.find((w) => w.id === activeId);
  const references = active?.referenceImages ?? [];
  const remaining = MAX_REFERENCES - references.length;
  const isMultiImageModel = selectedModel === "fal-ai/nano-banana-pro/edit";

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!activeId || remaining <= 0) return;
      const fileArr = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);
      if (fileArr.length === 0) return;
      const encoded = await Promise.all(fileArr.map(fileToBase64));
      addReferenceImages(activeId, encoded);
    },
    [activeId, remaining, addReferenceImages]
  );

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "var(--text-secondary)" }}
        >
          Reference images
        </p>
        <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
          {isMultiImageModel
            ? "Add extra angles or packaging shots to help Nano Banana Pro match the product more accurately."
            : "Only used by Nano Banana Pro. Switch models above to use these references."}
        </p>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {references.map((img, i) => (
          <div
            key={i}
            className="relative rounded-lg overflow-hidden aspect-square group"
            style={{ border: "1px solid var(--border)" }}
          >
            <img
              src={img}
              alt={`Reference ${i + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <button
              type="button"
              onClick={() => activeId && removeReferenceImage(activeId, i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
              aria-label={`Remove reference ${i + 1}`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}

        {remaining > 0 && (
          <label
            htmlFor="reference-upload-input"
            className="rounded-lg aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
            style={{
              background: dragging ? "var(--accent-soft)" : "var(--bg-tertiary)",
              border: `1.5px dashed ${dragging ? "var(--accent)" : "var(--border-strong)"}`,
            }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
              Add
            </span>
          </label>
        )}
      </div>

      <input
        ref={inputRef}
        id="reference-upload-input"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-label="Upload reference images"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) processFiles(files);
          e.target.value = "";
        }}
      />

      {references.length > 0 && (
        <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
          {references.length}/{MAX_REFERENCES} references added
        </p>
      )}
    </div>
  );
}
