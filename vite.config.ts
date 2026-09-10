import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT || "5173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";

function fixExtractedCssPlugin(): Plugin {
  return {
    name: "fix-extracted-css",
    enforce: "pre",
    transform(code: string, id: string) {
      if (id.endsWith(".css") && code.includes("const __vite__css =")) {
        const marker = "const __vite__css = ";
        const start = code.indexOf(marker);
        if (start !== -1) {
          const endMarker = "\n__vite__updateStyle";
          const end = code.lastIndexOf(endMarker);
          if (end !== -1) {
            const rawString = code.slice(start + marker.length, end).trim();
            try {
              return { code: JSON.parse(rawString), map: null };
            } catch (e) {
              console.error("Failed to parse extracted CSS", e);
            }
          }
        }
      }
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    fixExtractedCssPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets",
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3001",
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
  },
});