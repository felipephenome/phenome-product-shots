import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api/fal": {
          target: "https://queue.fal.run",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/fal/, ""),
          headers: {
            Authorization: `Key ${env.FAL_KEY}`,
          },
        },
        "/api/fal-upload": {
          target: "https://fal.run",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/fal-upload/, ""),
          headers: {
            Authorization: `Key ${env.FAL_KEY}`,
          },
        },
      },
    },
  };
});
