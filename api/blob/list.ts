import type { VercelRequest, VercelResponse } from "@vercel/node";
import { list } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not configured" });

  try {
    const metaBlobs = await list({ prefix: "meta/", token });

    const generations = await Promise.all(
      metaBlobs.blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          if (!response.ok) return null;
          const data = await response.json();
          data._metaUrl = blob.url;
          return data;
        } catch {
          return null;
        }
      })
    );

    const valid = generations.filter(Boolean);
    valid.sort((a: any, b: any) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

    return res.status(200).json({ generations: valid });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
