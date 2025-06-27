import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/postcss";
import tailwindcsssafearea from "tailwindcss-safe-area";
import path from "path";
import { fetchAssetsPlugin } from "./vite-plugin-fetch-assets.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcsssafearea,
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
    }),
    cloudflare({
      configPath: "./wrangler.toml",
      persistState: true,
      experimental: { headersAndRedirectsDevModeSupport: true },
    }),
    fetchAssetsPlugin({
      baseUrl: "https://asset.imperiummap.com",
      files: ["nbit-Regular.woff2", "nbit-Bold.woff2"], // Replace with your actual file names
      outputDir: "public/fonts/emerald-pro" // Will be included in build
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
