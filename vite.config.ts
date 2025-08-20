import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/postcss";

import path from "path";
import { fetchAssetsPlugin } from "./vite-plugin-fetch-assets.ts";
import process from "node:process";
// import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    // visualizer({
    //   filename: "report.html",
    //   open: true,
    //   template: "treemap", // or 'sunburst'
    //   gzipSize: true,
    //   brotliSize: true,
    // }),

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
  ];
  if (mode !== "test" && !process.env.VITEST) {
    plugins.push(
      fetchAssetsPlugin({
        baseUrl: "https://asset.imperiummap.com",
        files: [
          "nbit-Regular.woff2",
          "nbit-Bold.woff2",
          "nbit-Regular.ttf",
          "nbit-Bold.ttf",
        ],
        outputDir: "public/fonts/emerald-pro",
      }) as any,
    );
  }
  return {
    plugins,
    server: {
      open: true,
      port: 3000,
      watch: {
        ignored: ["**/node_modules/**", "**/dist/**", "**/public/fonts/**"],
        usePolling: true,
      },
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

    build: {
      sourcemap: process.env.NODE_ENV === "development",
      chunkSizeWarningLimit: 1000, // Increased from default 500KB
      // Enable minification
      // minify: "esbuild",
      target: "es2022",

      // terserOptions: {
      //   compress: {
      //     // Remove console.log in production
      //     drop_console: process.env.NODE_ENV === "production",
      //     drop_debugger: process.env.NODE_ENV === "production",

      //     // Optimize object property access
      //     // pure_getters: true,
      //     // unsafe: false,
      //     // unsafe_comps: false,

      //     // // Remove unused code
      //     // dead_code: true,
      //     // unused: true,
      //   },
      //   mangle: {
      //     // Mangle property names for smaller bundles
      //     properties: {
      //       regex: /^_/,
      //     },
      //   },
      // },

      // Target modern browsers for smaller bundles

      // Rollup configuration for better code splitting
      rollupOptions: {
        output: {
          chunkFileNames: () => {
            return `js/[name]-[hash].js`;
          },
          // Optimize asset naming
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || "asset";
            const info = name.split(".");
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(name)) {
              return `css/[name]-[hash].${ext}`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
              return `images/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },
          treeshake: {
            // moduleSideEffects: false, // treat modules as side-effect free by default
            // propertyReadSideEffects: false,
            tryCatchDeoptimization: false,
          },
          // Manual chunk splitting for better caching and loading
          // manualChunks: {
          //   // Vendor chunks - separate large libraries
          //   "react-vendor": ["react", "react-dom"],
          //   "ui-vendor": ["@headlessui/react"],
          //   "animation-vendor": ["react-spring", "@use-gesture/react"],
          //   "utility-vendor": ["zustand", "wouter", "clsx", "tailwind-merge"],
          //   "math-vendor": ["chroma-js"],

          //   // Data chunks - separate large JSON data
          //   "pokemon-data": [
          //     "./src/data/speciesData.json",
          //     "./src/data/abilityData.json",
          //     "./src/data/typeData.json",
          //   ],
          //   "move-data": [
          //     "./src/data/moveData.json",
          //     "./src/data/tmMoves.json",
          //     "./src/data/tutorMoves.json",
          //   ],
          //   "map-data": [
          //     "./src/data/map/levels.json",
          //     "./src/data/map/encounterGroup.json",
          //     "./src/data/map/items.json",
          //   ],

          //   // Component chunks - separate large components
          //   "map-components": [
          //     "./src/components/Map/ReactSvg.tsx",
          //     "./src/components/Map/Map.tsx",
          //   ],
          //   "pokemon-components": [
          //     "./src/components/PokemonView/PokemonView.tsx",
          //     "./src/components/PokemonModal.tsx",
          //   ],
          // },

          // Optimize chunk naming for better caching

          // External dependencies that shouldn't be bundled
          // external: [],
        },

        // Enable CSS code splitting

        // Optimize dependencies
      },
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    },
  };
});
