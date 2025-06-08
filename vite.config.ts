import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/postcss";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      configPath: "./wrangler.toml",
      persistState: true,
      experimental: { headersAndRedirectsDevModeSupport: true },
    }),
  ],
  server: {
    open: true,
    port: 3000,
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

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },

});
