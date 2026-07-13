import type { VercelRequest, VercelResponse } from "@vercel/node";
import { del } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not configured" });

  try {
    const { urls } = req.body as { urls: string[] };
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "Missing urls array" });
    }

    await del(urls, { token });

    return res.status(200).json({ deleted: urls.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
