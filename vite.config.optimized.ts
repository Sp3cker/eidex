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
      files: ["nbit-Regular.woff2", "nbit-Bold.woff2"],
      outputDir: "public/fonts/emerald-pro"
    }),
  ],
  server: {
    open: true,
    port: 3000,
    watch: {
      ignored: ["**/node_modules/**", "**/dist/**", "**/public/fonts/**"],
      usePolling: true
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
  build: {
    // Enable source maps for debugging (disable in production for smaller bundles)
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000, // Increased from default 500KB
    
    // Rollup configuration for better code splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and loading
        manualChunks: {
          // Vendor chunks - separate large libraries
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@headlessui/react', '@radix-ui/react-slider', '@radix-ui/react-tooltip'],
          'animation-vendor': ['react-spring', '@use-gesture/react'],
          'utility-vendor': ['zustand', 'wouter', 'clsx', 'tailwind-merge'],
          'math-vendor': ['mathjs', 'chroma-js'],
          
          // Data chunks - separate large JSON data
          'pokemon-data': [
            './src/data/speciesData.json',
            './src/data/abilityData.json',
            './src/data/typeData.json'
          ],
          'move-data': [
            './src/data/moveData.json',
            './src/data/tmMoves.json',
            './src/data/tutorMoves.json'
          ],
          'map-data': [
            './src/data/map/levels.json',
            './src/data/map/encounterGroup.json',
            './src/data/map/items.json'
          ],
          
          // Component chunks - separate large components
          'map-components': [
            './src/components/Map/ReactSvg.tsx',
            './src/components/Map/Map.tsx'
          ],
          'pokemon-components': [
            './src/components/PokemonView/PokemonView.tsx',
            './src/components/PokemonView/PokemonModal.tsx'
          ],
        },
        
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
      
      // External dependencies that shouldn't be bundled
      external: [],
    },
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.log in production
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
        
        // Optimize object property access
        pure_getters: true,
        unsafe: false,
        unsafe_comps: false,
        
        // Remove unused code
        dead_code: true,
        unused: true,
      },
      mangle: {
        // Mangle property names for smaller bundles
        properties: {
          regex: /^_/,
        },
      },
    },
    
    // Target modern browsers for smaller bundles
    target: 'es2020',
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      'wouter',
      'clsx',
      'tailwind-merge',
      'mathjs',
      'chroma-js',
      '@headlessui/react',
      '@radix-ui/react-slider',
      '@radix-ui/react-tooltip',
      'react-spring',
      '@use-gesture/react',
    ],
    exclude: [
      // Exclude large data files from dependency optimization
      './src/data/speciesData.json',
      './src/data/moveData.json',
      './src/data/map/levels.json',
    ],
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});