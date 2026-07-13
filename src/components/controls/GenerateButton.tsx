import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useLightingStore } from "@/stores/lightingStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { generateRelight, uploadImage } from "@/services/falClient";
import { saveGeneration } from "@/services/storageService";
import { persistGeneration } from "@/services/blobService";
import type { Generation } from "@/types";

function describeGenerationError(err: unknown, hasUserKey: boolean): string {
  const status = (err as { status?: number } | undefined)?.status;
  if (status === 401 || status === 403) {
    return hasUserKey
      ? "Error: fal.ai rejected your API key (unauthorized). Open Settings and check the key."
      : "Error: fal.ai request unauthorized. Add a key in Settings.";
  }
  return `Error: ${err instanceof Error ? err.message : "Unknown error"}`;
}

export function GenerateButton() {
  const activeId = useWorkspaceStore((s) => s.activeId);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const isGenerating = useWorkspaceStore((s) => s.isGenerating);
  const generationProgress = useWorkspaceStore((s) => s.generationProgress);
  const setGenerating = useWorkspaceStore((s) => s.setGenerating);
  const setProgress = useWorkspaceStore((s) => s.setProgress);
  const setRelitImage = useWorkspaceStore((s) => s.setRelitImage);
  const addGeneration = useWorkspaceStore((s) => s.addGeneration);
  const settings = useLightingStore((s) => s.settings);
  const selectedModel = useLightingStore((s) => s.selectedModel);
  const customPrompt = useLightingStore((s) => s.customPrompt);
  const active = workspaces.find((w) => w.id === activeId);

  const handleGenerate = async () => {
    if (!active?.originalImage || !activeId) return;
    setGenerating(true);
    setProgress("Preparing image...");

    try {
      let imageUrl = active.originalImage;
      if (imageUrl.startsWith("data:")) {
        setProgress("Uploading image...");
        const blob = await fetch(imageUrl).then((r) => r.blob());
        const file = new File([blob], "image.png", { type: blob.type });
        imageUrl = await uploadImage(file);
      }

      const references = active.referenceImages ?? [];
      let referenceImageUrls: string[] = [];
      if (references.length > 0) {
        setProgress(`Uploading ${references.length} reference image${references.length > 1 ? "s" : ""}...`);
        referenceImageUrls = await Promise.all(
          references.map(async (ref, i) => {
            if (!ref.startsWith("data:")) return ref;
            const blob = await fetch(ref).then((r) => r.blob());
            const file = new File([blob], `reference-${i}.png`, { type: blob.type });
            return uploadImage(file);
          })
        );
      }

      const result = await generateRelight(
        imageUrl,
        settings,
        selectedModel,
        customPrompt,
        setProgress,
        referenceImageUrls
      );
      setRelitImage(activeId, result.imageUrl);

      const gen: Generation = {
        id: crypto.randomUUID(),
        originalImage: active.originalImage,
        relitImage: result.imageUrl,
        prompt: result.prompt,
        model: selectedModel,
        settings: { ...settings },
        timestamp: Date.now(),
        format: "png",
      };
      addGeneration(activeId, gen);
      await saveGeneration(gen);

      setProgress("Saving to cloud...");
      persistGeneration(gen).catch((err) =>
        console.warn("Cloud persist failed (images saved locally):", err)
      );

      setProgress("Done!");
    } catch (err) {
      console.error("Generation failed:", err);
      const hasUserKey = Boolean(useSettingsStore.getState().falApiKey?.trim());
      setProgress(describeGenerationError(err, hasUserKey));
      await new Promise((r) => setTimeout(r, 4000));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        className="w-full py-4 rounded-2xl text-[13px] font-bold font-display tracking-wider uppercase transition-all"
        style={{
          background: isGenerating
            ? "var(--bg-tertiary)"
            : "var(--accent)",
          color: isGenerating ? "var(--text-secondary)" : "white",
          boxShadow: isGenerating
            ? "none"
            : "0 4px 20px var(--accent-glow)",
        }}
        onClick={handleGenerate}
        disabled={isGenerating || !active?.originalImage}
      >
        {isGenerating ? generationProgress || "Generating..." : "Generate"}
      </button>

      {isGenerating && (
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--bg-tertiary)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: "var(--accent)",
              animation: "progress-bar 2s ease-in-out infinite",
            }}
          />
        </div>
      )}
    </div>
  );
}
