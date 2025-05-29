import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/postcss";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, _, next) => {
          // Only redirect URLs that look like routes (no file extension and not starting with /@)
          // This preserves Vite's handling of module imports
          if (req.url && !req.url.includes('.') && !req.url.startsWith('/@')) {
            req.url = '/index.html';
          }
          next();
        });
      },
    },
    react(),
    // cloudflare(),
  ],
  server: {
    open: true,
    port: 3000
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: process.env.BASE_PATH || "/",
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
