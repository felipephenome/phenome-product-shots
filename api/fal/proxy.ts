import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY not configured" });
  }

  try {
    const targetUrl = req.headers["x-fal-target-url"] as string | undefined;
    if (!targetUrl) {
      return res.status(400).json({
        error: "Missing x-fal-target-url header. Use @fal-ai/client with proxyUrl.",
      });
    }

    const method = req.method ?? "GET";
    const headers: Record<string, string> = {
      Authorization: `Key ${falKey}`,
    };

    if (method !== "GET" && method !== "HEAD") {
      headers["Content-Type"] = "application/json";
    }

    const falRes = await fetch(targetUrl, {
      method,
      headers,
      body:
        method === "GET" || method === "HEAD"
          ? undefined
          : JSON.stringify(req.body),
    });

    const contentType = falRes.headers.get("content-type");
    if (contentType) {
      res.setHeader("content-type", contentType);
    }

    const raw = await falRes.text();
    return res.status(falRes.status).send(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
