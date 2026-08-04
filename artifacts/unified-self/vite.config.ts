import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      // @fusionstrings/swisseph-wasi's browser bundle eagerly imports these
      // Node built-ins from an unused dnt (Deno-to-Node) build artifact —
      // stub them out so the module resolves in the browser. See
      // src/lib/node-url-stub.ts for details.
      "node:url": path.resolve(import.meta.dirname, "src/lib/node-url-stub.ts"),
      "node:module": path.resolve(import.meta.dirname, "src/lib/node-url-stub.ts"),
      "node:path": path.resolve(import.meta.dirname, "src/lib/node-url-stub.ts"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: Number(process.env.PORT) || 5173,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port: Number(process.env.PORT) || 4173,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
