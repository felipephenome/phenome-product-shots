import { fal } from "@fal-ai/client";
import type { LightingSettings, RelightModel } from "@/types";
import { useSettingsStore } from "@/stores/settingsStore";
import { useLightingStore } from "@/stores/lightingStore";
import {
  buildPrompt,
  settingsToFiboParams,
  settingsToRelightingStyle,
} from "./promptEngine";

export function configureFal() {
  const userKey = useSettingsStore.getState().falApiKey?.trim();
  if (userKey) {
    // User explicitly opted into a client-side key via Settings; the
    // library's default credentials-exposed warning is expected/accepted.
    fal.config({
      credentials: userKey,
      suppressLocalCredentialsWarning: true,
    });
  } else if (import.meta.env.DEV && import.meta.env.VITE_FAL_KEY) {
    fal.config({
      credentials: import.meta.env.VITE_FAL_KEY as string,
    });
  } else {
    // Explicitly clear credentials so the client doesn't fall back to its
    // built-in env-based resolver, which can otherwise bypass the proxy.
    fal.config({
      proxyUrl: "/api/fal",
      credentials: undefined,
    });
  }
}

configureFal();

useSettingsStore.subscribe((state, prev) => {
  if (state.falApiKey !== prev.falApiKey) {
    configureFal();
  }
});

if (useSettingsStore.persist?.onFinishHydration) {
  useSettingsStore.persist.onFinishHydration(() => {
    configureFal();
  });
}

export interface GenerateResult {
  imageUrl: string;
  prompt: string;
}

export async function uploadImage(file: File): Promise<string> {
  const url = await fal.storage.upload(file);
  return url;
}

export async function generateRelight(
  imageUrl: string,
  settings: LightingSettings,
  model: RelightModel,
  customPrompt?: string | null,
  onProgress?: (msg: string) => void,
  referenceImageUrls?: string[]
): Promise<GenerateResult> {
  configureFal();
  const productShotPrompts = useLightingStore.getState().productShotPrompts;
  const prompt = customPrompt || buildPrompt(settings, productShotPrompts);
  onProgress?.("Submitting to " + model.split("/").pop() + "...");

  let result: { data: Record<string, unknown>; requestId: string };

  switch (model) {
    case "fal-ai/nano-banana-pro/edit":
      result = await fal.subscribe(model, {
        input: {
          prompt,
          image_urls: [imageUrl, ...(referenceImageUrls ?? [])],
          output_format: "png",
          resolution: "1K",
          limit_generations: true,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            onProgress?.("Generating...");
          } else if (update.status === "IN_QUEUE") {
            onProgress?.("In queue...");
          }
        },
      });
      break;

    case "fal-ai/image-apps-v2/relighting":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = await (fal as any).subscribe(model, {
        input: {
          image_url: imageUrl,
          lighting_style: settingsToRelightingStyle(settings),
        },
        logs: true,
        onQueueUpdate: (update: { status: string }) => {
          if (update.status === "IN_PROGRESS") onProgress?.("Generating...");
          else if (update.status === "IN_QUEUE") onProgress?.("In queue...");
        },
      });
      break;

    case "fal-ai/iclight-v2":
      result = await fal.subscribe(model, {
        input: {
          prompt,
          image_url: imageUrl,
          num_images: 1,
          output_format: "png",
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") onProgress?.("Generating...");
          else if (update.status === "IN_QUEUE") onProgress?.("In queue...");
        },
      });
      break;

    case "bria/fibo-edit/relight": {
      const fiboParams = settingsToFiboParams(settings);
      result = await fal.subscribe(model, {
        input: {
          image_url: imageUrl,
          ...fiboParams,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") onProgress?.("Generating...");
          else if (update.status === "IN_QUEUE") onProgress?.("In queue...");
        },
      });
      break;
    }

    default:
      throw new Error(`Unsupported model: ${model}`);
  }

  const data = result.data as Record<string, unknown>;
  let outputUrl = "";

  if (Array.isArray(data.images) && data.images.length > 0) {
    outputUrl = (data.images[0] as { url: string }).url;
  } else if (data.image && typeof data.image === "object") {
    outputUrl = (data.image as { url: string }).url;
  }

  if (!outputUrl) {
    throw new Error("No image returned from API");
  }

  return { imageUrl: outputUrl, prompt };
}
