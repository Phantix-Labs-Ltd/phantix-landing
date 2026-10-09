import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { prerenderCompany } from "./scripts/prerender-company";

/**
 * Landing dev server (phantixlabs.com).
 * No sandbox-apply proxy Ã¢â‚¬â€ landing only links out to APP_URL/sandbox-apply.
 *
 *   API_PROXY_TARGET   default https://staging.phantix.site  (pricing / legal)
 *   DEV_PORT           default 5175
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.API_PROXY_TARGET || process.env.API_PROXY_TARGET || "https://staging.phantix.site";
  const port = Number(env.DEV_PORT || process.env.DEV_PORT || 5175);

  return {
    plugins: [react(), prerenderCompany()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port,
      host: true,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
          ws: true,
        },
      },
    },
    build: {
      // Warn on any chunk past 500 KB (Vite default): the site has no heavy
      // diagram or graph libraries, so nothing legitimate needs more.
      chunkSizeWarningLimit: 500,
    },
  };
});
