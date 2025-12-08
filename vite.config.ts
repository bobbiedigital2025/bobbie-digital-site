import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Security: Enable source maps only in development
    sourcemap: process.env.NODE_ENV !== "production",
    // Minify and tree-shake for production
    minify: "terser",
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    // Enhanced security settings
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "bodigi.site",
      ".bodigi.site",
      "bobbiedigital.base44.app",
      ".bobbiedigital.base44.app",
      "localhost",
      "127.0.0.1",
    ],
    cors: {
      origin: process.env.NODE_ENV === "production" 
        ? ["https://bodigi.site", "https://w2b.bobbiedigital.base44.app"]
        : true,
      credentials: true,
    },
    fs: {
      strict: true,
      deny: ["**/.*", "**/node_modules/**/.env*", "**/.git/**"],
    },
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "three"],
  },
});
