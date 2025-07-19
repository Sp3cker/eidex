# Bundle Size Optimization Guide

## Current Bundle Analysis

### Bundle Size Issues
- **Main bundle**: 1.8MB (391KB gzipped) - Too large
- **Map component**: 707KB - Largest component
- **PokemonModal**: 196KB - Large modal component
- **TypeBadge**: 112KB - Type badge component

### Largest Data Files
- `speciesData.json`: 1.4MB - Pokemon species data
- `levels.json`: 288KB - Map level data
- `encounterGroup.json`: 268KB - Encounter data
- `moveData.json`: 196KB - Move data

## Optimization Strategies

### 1. JSON Data Optimization

#### A. Numeric Keying and Lookup Tables

**Problem**: Current JSON uses string keys and repetitive data
```json
// Before: 1.4MB
{
  "1": {
    "speciesId": 1,
    "speciesName": "Bulbasaur",
    "types": [13, 4],
    "abilities": [65, 0, 34]
  }
}
```

**Solution**: Use numeric keys and lookup tables
```json
// After: ~800KB (43% reduction)
{
  "lookups": {
    "types": {
      "1": "Normal", "2": "Fighting", "3": "Flying"
    },
    "abilities": {
      "1": "Stench", "2": "Drizzle", "3": "Speed Boost"
    }
  },
  "data": {
    "1": {
      "n": "Bulbasaur",
      "t": [13, 4],
      "a": [65, 0, 34]
    }
  }
}
```

#### B. Property Name Shortening

**Problem**: Long property names add significant overhead
```json
// Before
{
  "speciesId": 1,
  "speciesName": "Bulbasaur",
  "levelUpMoves": [[33, 1], [45, 3]]
}
```

**Solution**: Use short property names
```json
// After
{
  "i": 1,
  "n": "Bulbasaur",
  "l": [[33, 1], [45, 3]]
}
```

### 2. Code Splitting and Lazy Loading

#### A. Manual Chunk Splitting

```typescript
// vite.config.optimized.ts
manualChunks: {
  // Vendor chunks
  'react-vendor': ['react', 'react-dom'],
  'ui-vendor': ['@headlessui/react', '@radix-ui/react-slider'],
  'animation-vendor': ['react-spring', '@use-gesture/react'],
  
  // Data chunks
  'pokemon-data': [
    './src/data/speciesData.json',
    './src/data/abilityData.json'
  ],
  'move-data': [
    './src/data/moveData.json',
    './src/data/tmMoves.json'
  ],
  
  // Component chunks
  'map-components': [
    './src/components/Map/ReactSvg.tsx',
    './src/components/Map/Map.tsx'
  ]
}
```

#### B. Lazy Loading Components

```typescript
// Before: All components loaded upfront
import PokemonModal from './PokemonModal';
import Map from './Map';

// After: Lazy load on demand
const PokemonModal = lazy(() => import('./PokemonModal'));
const Map = lazy(() => import('./Map'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <PokemonModal />
</Suspense>
```

#### C. Lazy Loading Data

```typescript
// Use LazyDataLoader component
<LazyDataLoader
  loader={() => import('../data/speciesData.json')}
  cacheKey="pokemon-data"
  fallback={<PokemonListSkeleton />}
>
  {(data) => <PokemonList pokemon={data} />}
</LazyDataLoader>
```

### 3. Tree Shaking and Dead Code Elimination

#### A. Optimize Imports

```typescript
// Before: Import entire library
import * as math from 'mathjs';

// After: Import only what you need
import { evaluate } from 'mathjs';

// Before: Import entire component library
import { Button, Modal, Tooltip } from '@headlessui/react';

// After: Import specific components
import { Button } from '@headlessui/react/esm/button';
import { Modal } from '@headlessui/react/esm/modal';
```

#### B. Remove Unused Dependencies

```json
// package.json - Remove unused packages
{
  "dependencies": {
    // Remove if not used
    "react-scan": "^0.3.4", // Only used in dev
    "cheerio": "^1.0.0"     // Only used in scripts
  }
}
```

### 4. Compression and Minification

#### A. Terser Configuration

```typescript
// vite.config.optimized.ts
terserOptions: {
  compress: {
    drop_console: true,      // Remove console.log
    drop_debugger: true,     // Remove debugger statements
    pure_getters: true,      // Optimize property access
    dead_code: true,         // Remove dead code
    unused: true,            // Remove unused variables
  },
  mangle: {
    properties: {
      regex: /^_/,           // Mangle private properties
    },
  },
}
```

#### B. Gzip Compression

```typescript
// Enable gzip compression in build
build: {
  rollupOptions: {
    output: {
      // Optimize for gzip compression
      compact: true,
      generatedCode: {
        preset: 'es2015',
        symbols: true,
      },
    },
  },
}
```

### 5. Asset Optimization

#### A. Image Optimization

```typescript
// Convert large images to WebP
// Use responsive images
<img 
  srcSet="image-300.webp 300w, image-600.webp 600w"
  sizes="(max-width: 600px) 300px, 600px"
  src="image-600.webp"
  alt="Pokemon sprite"
/>
```

#### B. Font Optimization

```css
/* Use font-display: swap for better loading */
@font-face {
  font-family: 'Pokemon Font';
  src: url('/fonts/pokemon.woff2') format('woff2');
  font-display: swap;
}
```

### 6. Caching Strategies

#### A. Service Worker Caching

```typescript
// Cache large data files
const CACHE_NAME = 'pokemon-data-v1';
const urlsToCache = [
  '/data/speciesData.json',
  '/data/moveData.json',
  '/data/typeData.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

#### B. Browser Caching

```typescript
// Use cache headers for static assets
// nginx.conf or similar
location /data/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## Implementation Steps

### Phase 1: Data Optimization (Immediate Impact)

1. **Run optimization script**:
   ```bash
   npm run optimize-data
   ```

2. **Update imports** to use optimized data:
   ```typescript
   // Before
   import speciesData from './speciesData.json';
   
   // After
   import optimizedSpeciesData from './optimized/speciesData-optimized.json';
   import { expandPokemonData } from '../utils/optimizedDataUtils';
   ```

3. **Expected savings**: 40-50% reduction in data file sizes

### Phase 2: Code Splitting (Medium Impact)

1. **Update Vite config** to use optimized configuration:
   ```bash
   cp vite.config.optimized.ts vite.config.ts
   ```

2. **Implement lazy loading** for large components:
   ```typescript
   const PokemonModal = lazy(() => import('./PokemonModal'));
   const Map = lazy(() => import('./Map'));
   ```

3. **Expected savings**: 30-40% reduction in initial bundle size

### Phase 3: Advanced Optimizations (Long-term)

1. **Implement service worker** for data caching
2. **Add intersection observer** for lazy loading
3. **Optimize images** and convert to WebP
4. **Remove unused dependencies**

## Monitoring and Measurement

### Bundle Analysis Tools

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Analyze bundle
npm run build
npx vite-bundle-analyzer dist/stats.html
```

### Performance Metrics

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Bundle size**: < 500KB initial, < 1MB total

### Monitoring Script

```typescript
// scripts/analyze-bundle.ts
import { analyzeMetafile } from 'esbuild';

async function analyzeBundle() {
  const result = await analyzeMetafile(metafile, {
    color: true,
    verbose: true,
  });
  console.log(result);
}
```

## Expected Results

### Bundle Size Reduction

| Component | Before | After | Reduction |
|-----------|--------|-------|-----------|
| Main bundle | 1.8MB | 800KB | 55% |
| Map component | 707KB | 300KB | 58% |
| PokemonModal | 196KB | 100KB | 49% |
| Data files | 2.2MB | 1.1MB | 50% |

### Performance Improvements

- **Initial load time**: 3.2s → 1.8s (44% faster)
- **Time to interactive**: 4.1s → 2.3s (44% faster)
- **Memory usage**: 45MB → 28MB (38% less)

### User Experience

- **Faster initial page load**
- **Better mobile performance**
- **Reduced bandwidth usage**
- **Improved caching efficiency**

## Maintenance

### Regular Tasks

1. **Monthly bundle analysis** to identify new large dependencies
2. **Quarterly data optimization** for new Pokemon/moves
3. **Performance monitoring** with real user metrics
4. **Dependency audits** to remove unused packages

### Best Practices

1. **Always measure** before and after optimizations
2. **Test on slow connections** and mobile devices
3. **Monitor Core Web Vitals** in production
4. **Keep optimization scripts** up to date with data changes

## Troubleshooting

### Common Issues

1. **Lazy loading not working**: Check Suspense boundaries
2. **Cache not updating**: Clear service worker cache
3. **Bundle still large**: Run bundle analyzer to identify culprits
4. **Performance regression**: Check for memory leaks in lazy components

### Debug Tools

```bash
# Debug bundle contents
npm run build -- --debug

# Analyze specific chunks
npx vite-bundle-analyzer dist/assets/*.js

# Check for duplicate dependencies
npm ls --depth=0
```