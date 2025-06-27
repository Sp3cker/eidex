import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface FetchAssetsOptions {
  baseUrl: string;
  files: string[];
  outputDir?: string;
}

export function fetchAssetsPlugin(options: FetchAssetsOptions): Plugin {
  return {
    name: 'fetch-assets',
    buildStart: async () => {
      const outputDir = options.outputDir || 'public/assets';
      
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      console.log(`📦 Fetching assets from ${options.baseUrl}...`);

      // Fetch each file
      for (const file of options.files) {
        try {
          const response = await fetch(`${options.baseUrl}/${file}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
          }
          
          const buffer = await response.arrayBuffer();
          const filePath = path.join(outputDir, file);
          
          // Create subdirectories if needed
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
          fs.writeFileSync(filePath, Buffer.from(buffer));
          
          console.log(`✓ Downloaded: ${file}`);
        } catch (error) {
          console.error(`✗ Failed to download ${file}:`, error);
          throw error; // Fail the build if assets can't be downloaded
        }
      }
      
      console.log(`🎉 Successfully fetched ${options.files.length} assets`);
    }
  };
}
