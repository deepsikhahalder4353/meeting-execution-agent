// vite.config.ts
import path from "path";
import react from "file:///C:/Users/khusi/Downloads/meeting-execution-agent-source/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///C:/Users/khusi/Downloads/meeting-execution-agent-source/node_modules/@tailwindcss/vite/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/khusi/Downloads/meeting-execution-agent-source/node_modules/vite/dist/node/index.js";
import runtimeErrorOverlay from "file:///C:/Users/khusi/Downloads/meeting-execution-agent-source/node_modules/@replit/vite-plugin-runtime-error-modal/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\khusi\\Downloads\\meeting-execution-agent-source";
var rawPort = process.env.PORT || "5173";
var port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}
var basePath = process.env.BASE_PATH || "/";
function fixExtractedCssPlugin() {
  return {
    name: "fix-extracted-css",
    enforce: "pre",
    transform(code, id) {
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
    }
  };
}
var vite_config_default = defineConfig({
  base: basePath,
  plugins: [
    fixExtractedCssPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("file:///C:/Users/khusi/Downloads/meeting-execution-agent-source/node_modules/@replit/vite-plugin-cartographer/dist/index.mjs").then(
        (m) => m.cartographer({
          root: path.resolve(__vite_injected_original_dirname, "..")
        })
      ),
      await import("file:///C:/Users/khusi/Downloads/meeting-execution-agent-source/node_modules/@replit/vite-plugin-dev-banner/dist/index.mjs").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src"),
      "@assets": path.resolve(
        __vite_injected_original_dirname,
        "..",
        "..",
        "attached_assets"
      )
    },
    dedupe: ["react", "react-dom"]
  },
  root: path.resolve(__vite_injected_original_dirname),
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    port,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    },
    fs: {
      strict: true
    }
  },
  preview: {
    port,
    host: "0.0.0.0"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxraHVzaVxcXFxEb3dubG9hZHNcXFxcbWVldGluZy1leGVjdXRpb24tYWdlbnQtc291cmNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxraHVzaVxcXFxEb3dubG9hZHNcXFxcbWVldGluZy1leGVjdXRpb24tYWdlbnQtc291cmNlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9raHVzaS9Eb3dubG9hZHMvbWVldGluZy1leGVjdXRpb24tYWdlbnQtc291cmNlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tIFwiQHRhaWx3aW5kY3NzL3ZpdGVcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgdHlwZSBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJ1bnRpbWVFcnJvck92ZXJsYXkgZnJvbSBcIkByZXBsaXQvdml0ZS1wbHVnaW4tcnVudGltZS1lcnJvci1tb2RhbFwiO1xuXG5jb25zdCByYXdQb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCBcIjUxNzNcIjtcbmNvbnN0IHBvcnQgPSBOdW1iZXIocmF3UG9ydCk7XG5cbmlmIChOdW1iZXIuaXNOYU4ocG9ydCkgfHwgcG9ydCA8PSAwKSB7XG4gIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBQT1JUIHZhbHVlOiBcIiR7cmF3UG9ydH1cImApO1xufVxuXG5jb25zdCBiYXNlUGF0aCA9IHByb2Nlc3MuZW52LkJBU0VfUEFUSCB8fCBcIi9cIjtcblxuZnVuY3Rpb24gZml4RXh0cmFjdGVkQ3NzUGx1Z2luKCk6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJmaXgtZXh0cmFjdGVkLWNzc1wiLFxuICAgIGVuZm9yY2U6IFwicHJlXCIsXG4gICAgdHJhbnNmb3JtKGNvZGU6IHN0cmluZywgaWQ6IHN0cmluZykge1xuICAgICAgaWYgKGlkLmVuZHNXaXRoKFwiLmNzc1wiKSAmJiBjb2RlLmluY2x1ZGVzKFwiY29uc3QgX192aXRlX19jc3MgPVwiKSkge1xuICAgICAgICBjb25zdCBtYXJrZXIgPSBcImNvbnN0IF9fdml0ZV9fY3NzID0gXCI7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gY29kZS5pbmRleE9mKG1hcmtlcik7XG4gICAgICAgIGlmIChzdGFydCAhPT0gLTEpIHtcbiAgICAgICAgICBjb25zdCBlbmRNYXJrZXIgPSBcIlxcbl9fdml0ZV9fdXBkYXRlU3R5bGVcIjtcbiAgICAgICAgICBjb25zdCBlbmQgPSBjb2RlLmxhc3RJbmRleE9mKGVuZE1hcmtlcik7XG4gICAgICAgICAgaWYgKGVuZCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhd1N0cmluZyA9IGNvZGUuc2xpY2Uoc3RhcnQgKyBtYXJrZXIubGVuZ3RoLCBlbmQpLnRyaW0oKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGNvZGU6IEpTT04ucGFyc2UocmF3U3RyaW5nKSwgbWFwOiBudWxsIH07XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcGFyc2UgZXh0cmFjdGVkIENTU1wiLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiBiYXNlUGF0aCxcbiAgcGx1Z2luczogW1xuICAgIGZpeEV4dHJhY3RlZENzc1BsdWdpbigpLFxuICAgIHJlYWN0KCksXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgICBydW50aW1lRXJyb3JPdmVybGF5KCksXG4gICAgLi4uKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgIHByb2Nlc3MuZW52LlJFUExfSUQgIT09IHVuZGVmaW5lZFxuICAgICAgPyBbXG4gICAgICAgICAgYXdhaXQgaW1wb3J0KFwiQHJlcGxpdC92aXRlLXBsdWdpbi1jYXJ0b2dyYXBoZXJcIikudGhlbigobSkgPT5cbiAgICAgICAgICAgIG0uY2FydG9ncmFwaGVyKHtcbiAgICAgICAgICAgICAgcm9vdDogcGF0aC5yZXNvbHZlKGltcG9ydC5tZXRhLmRpcm5hbWUsIFwiLi5cIiksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICApLFxuICAgICAgICAgIGF3YWl0IGltcG9ydChcIkByZXBsaXQvdml0ZS1wbHVnaW4tZGV2LWJhbm5lclwiKS50aGVuKChtKSA9PlxuICAgICAgICAgICAgbS5kZXZCYW5uZXIoKSxcbiAgICAgICAgICApLFxuICAgICAgICBdXG4gICAgICA6IFtdKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKGltcG9ydC5tZXRhLmRpcm5hbWUsIFwic3JjXCIpLFxuICAgICAgXCJAYXNzZXRzXCI6IHBhdGgucmVzb2x2ZShcbiAgICAgICAgaW1wb3J0Lm1ldGEuZGlybmFtZSxcbiAgICAgICAgXCIuLlwiLFxuICAgICAgICBcIi4uXCIsXG4gICAgICAgIFwiYXR0YWNoZWRfYXNzZXRzXCIsXG4gICAgICApLFxuICAgIH0sXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiXSxcbiAgfSxcbiAgcm9vdDogcGF0aC5yZXNvbHZlKGltcG9ydC5tZXRhLmRpcm5hbWUpLFxuICBidWlsZDoge1xuICAgIG91dERpcjogcGF0aC5yZXNvbHZlKGltcG9ydC5tZXRhLmRpcm5hbWUsIFwiZGlzdC9wdWJsaWNcIiksXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQsXG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgcHJveHk6IHtcbiAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDFcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAgcHJldmlldzoge1xuICAgIHBvcnQsXG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gIH0sXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQWlXLE9BQU8sVUFBVTtBQUNsWCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxvQkFBaUM7QUFDMUMsT0FBTyx5QkFBeUI7QUFKaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTSxVQUFVLFFBQVEsSUFBSSxRQUFRO0FBQ3BDLElBQU0sT0FBTyxPQUFPLE9BQU87QUFFM0IsSUFBSSxPQUFPLE1BQU0sSUFBSSxLQUFLLFFBQVEsR0FBRztBQUNuQyxRQUFNLElBQUksTUFBTSx3QkFBd0IsT0FBTyxHQUFHO0FBQ3BEO0FBRUEsSUFBTSxXQUFXLFFBQVEsSUFBSSxhQUFhO0FBRTFDLFNBQVMsd0JBQWdDO0FBQ3ZDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxJQUNULFVBQVUsTUFBYyxJQUFZO0FBQ2xDLFVBQUksR0FBRyxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMscUJBQXFCLEdBQUc7QUFDL0QsY0FBTSxTQUFTO0FBQ2YsY0FBTSxRQUFRLEtBQUssUUFBUSxNQUFNO0FBQ2pDLFlBQUksVUFBVSxJQUFJO0FBQ2hCLGdCQUFNLFlBQVk7QUFDbEIsZ0JBQU0sTUFBTSxLQUFLLFlBQVksU0FBUztBQUN0QyxjQUFJLFFBQVEsSUFBSTtBQUNkLGtCQUFNLFlBQVksS0FBSyxNQUFNLFFBQVEsT0FBTyxRQUFRLEdBQUcsRUFBRSxLQUFLO0FBQzlELGdCQUFJO0FBQ0YscUJBQU8sRUFBRSxNQUFNLEtBQUssTUFBTSxTQUFTLEdBQUcsS0FBSyxLQUFLO0FBQUEsWUFDbEQsU0FBUyxHQUFHO0FBQ1Ysc0JBQVEsTUFBTSxpQ0FBaUMsQ0FBQztBQUFBLFlBQ2xEO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLHNCQUFzQjtBQUFBLElBQ3RCLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLG9CQUFvQjtBQUFBLElBQ3BCLEdBQUksUUFBUSxJQUFJLGFBQWEsZ0JBQzdCLFFBQVEsSUFBSSxZQUFZLFNBQ3BCO0FBQUEsTUFDRSxNQUFNLE9BQU8sOEhBQWtDLEVBQUU7QUFBQSxRQUFLLENBQUMsTUFDckQsRUFBRSxhQUFhO0FBQUEsVUFDYixNQUFNLEtBQUssUUFBUSxrQ0FBcUIsSUFBSTtBQUFBLFFBQzlDLENBQUM7QUFBQSxNQUNIO0FBQUEsTUFDQSxNQUFNLE9BQU8sNEhBQWdDLEVBQUU7QUFBQSxRQUFLLENBQUMsTUFDbkQsRUFBRSxVQUFVO0FBQUEsTUFDZDtBQUFBLElBQ0YsSUFDQSxDQUFDO0FBQUEsRUFDUDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQXFCLEtBQUs7QUFBQSxNQUM1QyxXQUFXLEtBQUs7QUFBQSxRQUNkO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxFQUMvQjtBQUFBLEVBQ0EsTUFBTSxLQUFLLFFBQVEsZ0NBQW1CO0FBQUEsRUFDdEMsT0FBTztBQUFBLElBQ0wsUUFBUSxLQUFLLFFBQVEsa0NBQXFCLGFBQWE7QUFBQSxJQUN2RCxhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ047QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLElBQUk7QUFBQSxNQUNGLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1A7QUFBQSxJQUNBLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
