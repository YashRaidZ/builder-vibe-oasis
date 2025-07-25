import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [
    react(),
    // Only include express plugin during development
    ...(command === "serve" ? [expressPlugin()] : [])
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Dynamic import to prevent loading during build
      import("./server/index.js")
        .then(({ createServer }) => {
          const app = createServer();
          // Add Express app as middleware to Vite dev server
          server.middlewares.use(app);
        })
        .catch((err) => {
          console.error("Failed to load Express server:", err);
        });
    },
  };
}
