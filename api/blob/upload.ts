import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not configured" });

  try {
    const { image, filename, type } = req.body as {
      image: string;
      filename: string;
      type: "original" | "relit" | "meta";
    };

    if (!image || !filename) {
      return res.status(400).json({ error: "Missing image or filename" });
    }

    let body: Buffer | string;
    let contentType = "image/png";

    if (type === "meta") {
      body = image;
      contentType = "application/json";
    } else if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return res.status(400).json({ error: "Invalid base64 data URL" });
      contentType = match[1];
      body = Buffer.from(match[2], "base64");
    } else {
      const upstream = await fetch(image);
      if (!upstream.ok) return res.status(502).json({ error: "Failed to fetch remote image" });
      contentType = upstream.headers.get("content-type") || "image/png";
      body = Buffer.from(await upstream.arrayBuffer());
    }

    const blob = await put(filename, body, {
      access: "public",
      token,
      contentType,
    });

    return res.status(200).json({ url: blob.url, pathname: blob.pathname });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
