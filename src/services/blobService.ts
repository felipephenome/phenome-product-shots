import type { Generation } from "@/types";

export interface CloudGeneration extends Generation {
  _metaUrl?: string;
}

interface UploadResult {
  url: string;
  pathname: string;
}

async function uploadToBlob(
  image: string,
  filename: string,
  type: "original" | "relit" | "meta"
): Promise<UploadResult> {
  const res = await fetch("/api/blob/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, filename, type }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || "Upload failed");
  }

  return res.json();
}

export async function persistGeneration(gen: Generation): Promise<Generation> {
  const id = gen.id;

  const [originalResult, relitResult] = await Promise.all([
    uploadToBlob(gen.originalImage, `originals/${id}.png`, "original"),
    uploadToBlob(gen.relitImage, `relit/${id}.png`, "relit"),
  ]);

  const cloudGen: Generation = {
    ...gen,
    originalImage: originalResult.url,
    relitImage: relitResult.url,
  };

  const meta = {
    id: cloudGen.id,
    originalImage: cloudGen.originalImage,
    relitImage: cloudGen.relitImage,
    prompt: cloudGen.prompt,
    model: cloudGen.model,
    timestamp: cloudGen.timestamp,
    format: cloudGen.format,
  };

  await uploadToBlob(JSON.stringify(meta), `meta/${id}.json`, "meta");

  return cloudGen;
}

export async function fetchCloudGallery(): Promise<CloudGeneration[]> {
  const res = await fetch("/api/blob/list");
  if (!res.ok) return [];
  const data = await res.json();
  return data.generations ?? [];
}

export async function deleteFromCloud(gen: CloudGeneration): Promise<void> {
  const urls: string[] = [];

  if (gen.originalImage) urls.push(gen.originalImage);
  if (gen.relitImage) urls.push(gen.relitImage);
  if (gen._metaUrl) urls.push(gen._metaUrl);

  if (urls.length === 0) return;

  await fetch("/api/blob/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });
}
