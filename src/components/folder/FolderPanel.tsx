import { useEffect, useState } from "react";
import { loadGenerations, deleteGeneration } from "@/services/storageService";
import { fetchCloudGallery, deleteFromCloud, type CloudGeneration } from "@/services/blobService";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { GenerationCard } from "./GenerationCard";
import type { Generation } from "@/types";

interface FolderPanelProps {
  open: boolean;
  onClose: () => void;
}

export function FolderPanel({ open, onClose }: FolderPanelProps) {
  const [generations, setGenerations] = useState<CloudGeneration[]>([]);
  const [loading, setLoading] = useState(false);
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace);
  const setRelitImage = useWorkspaceStore((s) => s.setRelitImage);

  useEffect(() => {
    if (!open) return;
    setLoading(true);

    Promise.all([fetchCloudGallery(), loadGenerations()])
      .then(([cloud, local]) => {
        const cloudIds = new Set(cloud.map((g) => g.id));
        const localOnly = local.filter((g) => !cloudIds.has(g.id));
        const merged = [...cloud, ...localOnly];
        merged.sort((a, b) => b.timestamp - a.timestamp);
        setGenerations(merged);
      })
      .catch(() => {
        loadGenerations().then(setGenerations);
      })
      .finally(() => setLoading(false));
  }, [open]);

  const handleLoad = (gen: Generation) => {
    const id = addWorkspace(gen.originalImage, `Gen ${new Date(gen.timestamp).toLocaleTimeString()}`);
    setRelitImage(id, gen.relitImage);
    onClose();
  };

  const handleDelete = async (id: string) => {
    const gen = generations.find((g) => g.id === id);
    if (gen) {
      deleteFromCloud(gen).catch(() => {});
    }
    await deleteGeneration(id);
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose} />
      <div
        className="fixed top-0 right-0 bottom-0 z-50 overflow-y-auto flex flex-col"
        style={{
          width: 320,
          background: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display text-[13px] font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>
            Gallery
          </h2>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ color: "var(--text-secondary)" }}
            onClick={onClose}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div
              className="w-6 h-6 rounded-full border-2 animate-spin"
              style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
            />
          </div>
        ) : generations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
              No generations yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 p-4">
            {generations.map((gen) => (
              <GenerationCard key={gen.id} generation={gen} onLoad={handleLoad} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
