import { execSync } from 'child_process';
import { readdirSync, statSync, writeFileSync, readFileSync } from 'fs';
import { join, basename, extname } from 'path';

interface SpriteCoordinate {
  item: string;
  coords: [number, number];
}

interface ItemData {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface SpritesheetConfig {
  // Individual sprite size (will resize all images to this)
  spriteWidth: number;
  spriteHeight: number;
  // Padding between sprites
  padding: number;
  // Number of sprites per row
  spritesPerRow: number;
  // Output paths
  outputImagePath: string;
  outputJsonPath: string;
  // Resize filter for smoothing ('sample', 'lanczos', 'cubic', 'catrom', 'spline', 'gaussian')
  resizeFilter: string;
  // Optional suffix for file naming
  sizeSuffix?: string;
}

// Multiple configurations for different sprite sizes
const configs: SpritesheetConfig[] = [
  {
    spriteWidth: 30,
    spriteHeight: 30,
    padding: 2,
    spritesPerRow: 16,
    outputImagePath: './public/spritesheet-items-36.png',
    outputJsonPath: './src/data/spritesheet-coords-36.json',
    resizeFilter: 'catrom',
    sizeSuffix: '36'
  },
  {
    spriteWidth: 24,
    spriteHeight: 24,
    padding: 2,
    spritesPerRow: 16, // More sprites per row for smaller size
    outputImagePath: './public/spritesheet-items-16.png',
    outputJsonPath: './src/data/spritesheet-coords-16.json',
    resizeFilter: 'catrom',
    sizeSuffix: '24'
  }
];

function loadItemsData(): Set<string> {
  try {
    const itemsJsonPath = './src/data/map/items.json';
    const itemsData: ItemData[] = JSON.parse(readFileSync(itemsJsonPath, 'utf8'));
    return new Set(itemsData.map(item => item.id));
  } catch (error) {
    console.error('❌ Failed to load items.json:', error);
    process.exit(1);
  }
}

function imageNameToItemId(imageName: string): string {
  // Convert image name to ITEM_ format
  // Examples: "absolite" -> "ITEM_ABSOLITE", "poke_ball" -> "ITEM_POKE_BALL"
  return `ITEM_${imageName.toUpperCase()}`;
}

function validateAndFilterImages(imageFiles: string[], validItemIds: Set<string>): string[] {
  const validImages: string[] = [];
  const invalidImages: string[] = [];
  
  imageFiles.forEach(file => {
    const imageName = basename(file, extname(file));
    const itemId = imageNameToItemId(imageName);
    
    if (validItemIds.has(itemId)) {
      validImages.push(file);
    } else {
      invalidImages.push(file);
    }
  });
  
  console.log(`✅ Valid images: ${validImages.length}`);
  if (invalidImages.length > 0) {
    console.log(`⚠️  Invalid images (no matching item ID): ${invalidImages.length}`);
    console.log('   First few invalid images:');
    invalidImages.slice(0, 5).forEach(file => {
      const imageName = basename(file, extname(file));
      const attemptedId = imageNameToItemId(imageName);
      console.log(`     • ${file} -> ${attemptedId}`);
    });
    if (invalidImages.length > 5) {
      console.log(`     ... and ${invalidImages.length - 5} more`);
    }
  }
  
  return validImages;
}

function getImageFiles(directory: string): string[] {
  try {
    const files = readdirSync(directory);
    return files
      .filter(file => {
        const filePath = join(directory, file);
        return statSync(filePath).isFile() && extname(file).toLowerCase() === '.png';
      })
      .sort(); // Sort alphabetically for consistent ordering
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

function calculateSpriteCoordinates(
  imageCount: number,
  config: SpritesheetConfig
): SpriteCoordinate[] {
  const coordinates: SpriteCoordinate[] = [];
  
  for (let i = 0; i < imageCount; i++) {
    const row = Math.floor(i / config.spritesPerRow);
    const col = i % config.spritesPerRow;
    
    const x = col * (config.spriteWidth + config.padding);
    const y = row * (config.spriteHeight + config.padding);
    
    coordinates.push({
      item: '', // Will be filled in later
      coords: [x, y]
    });
  }
  
  return coordinates;
}

function calculateCanvasSize(imageCount: number, config: SpritesheetConfig): [number, number] {
  const rows = Math.ceil(imageCount / config.spritesPerRow);
  const cols = Math.min(imageCount, config.spritesPerRow);
  
  const width = cols * config.spriteWidth + (cols - 1) * config.padding;
  const height = rows * config.spriteHeight + (rows - 1) * config.padding;
  
  return [width, height];
}

function generateSpritesheet(inputDir: string, config: SpritesheetConfig): void {
  console.log('🔍 Scanning for PNG files...');
  const allImageFiles = getImageFiles(inputDir);
  
  if (allImageFiles.length === 0) {
    console.error('❌ No PNG files found in the input directory!');
    process.exit(1);
  }
  
  console.log(`📊 Found ${allImageFiles.length} images`);
  
  // Load valid item IDs
  console.log('📋 Loading items data for validation...');
  const validItemIds = loadItemsData();
  console.log(`📋 Loaded ${validItemIds.size} valid item IDs`);
  
  // Filter images to only include those with valid item IDs
  const imageFiles = validateAndFilterImages(allImageFiles, validItemIds);
  
  if (imageFiles.length === 0) {
    console.error('❌ No valid images found after filtering!');
    process.exit(1);
  }
  
  // Calculate canvas size
  const [canvasWidth, canvasHeight] = calculateCanvasSize(imageFiles.length, config);
  console.log(`📐 Canvas size: ${canvasWidth}x${canvasHeight}px`);
  
  // Calculate coordinates
  const coordinates = calculateSpriteCoordinates(imageFiles.length, config);
  
  // Fill in the image names (using ITEM_ format)
  imageFiles.forEach((file, index) => {
    const imageName = basename(file, extname(file));
    coordinates[index].item = imageNameToItemId(imageName);
  });
  
  // Build ImageMagick command
  console.log('🎨 Generating spritesheet with ImageMagick...');
  
  // Create a transparent canvas
  let magickCmd = `magick -size ${canvasWidth}x${canvasHeight} +antialias xc:transparent`;
  
  // Add each image to the canvas
  imageFiles.forEach((file, index) => {
    const filePath = join(inputDir, file);
    const coord = coordinates[index];
    
    // Apply the configured resize filter
    if (config.resizeFilter === 'sample') {
      // Use -sample for pixel-perfect scaling (no anti-aliasing)
      magickCmd += ` \\( "${filePath}" -sample ${config.spriteWidth}x${config.spriteHeight}! \\)`;
    } else {
      // Use specified filter for smooth anti-aliasing
      magickCmd += ` \\( "${filePath}" -filter ${config.resizeFilter} -resize ${config.spriteWidth}x${config.spriteHeight}! \\)`;
    }
    magickCmd += ` -geometry +${coord.coords[0]}+${coord.coords[1]} -composite`;
  });
  
  // Output the final image
  magickCmd += ` "${config.outputImagePath}"`;
  
  try {
    console.log('⚡ Executing ImageMagick command...');
    execSync(magickCmd, { stdio: 'pipe' });
    console.log(`✅ Spritesheet saved to: ${config.outputImagePath}`);
  } catch (error) {
    console.error('❌ ImageMagick command failed:', error);
    console.error('Command was:', magickCmd);
    process.exit(1);
  }
  
  // Save coordinates JSON
  try {
    const jsonOutput = JSON.stringify(coordinates, null, 2);
    writeFileSync(config.outputJsonPath, jsonOutput, 'utf8');
    console.log(`✅ Coordinates saved to: ${config.outputJsonPath}`);
  } catch (error) {
    console.error('❌ Failed to save coordinates JSON:', error);
    process.exit(1);
  }
  
  // Print summary
  console.log('\n📋 Summary:');
  console.log(`   • Images processed: ${imageFiles.length}`);
  console.log(`   • Sprite size: ${config.spriteWidth}x${config.spriteHeight}px`);
  console.log(`   • Canvas size: ${canvasWidth}x${canvasHeight}px`);
  console.log(`   • Sprites per row: ${config.spritesPerRow}`);
  console.log(`   • Padding: ${config.padding}px`);
  console.log(`   • Total rows: ${Math.ceil(imageFiles.length / config.spritesPerRow)}`);
}

// Main execution
function main() {
  const inputDirectory = './public/items';
  
  console.log('🚀 Starting spritesheet generation...');
  console.log(`📁 Input directory: ${inputDirectory}`);
  
  // Check if ImageMagick is available
  try {
    execSync('magick -version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ ImageMagick not found! Please install ImageMagick first.');
    console.error('   macOS: brew install imagemagick');
    console.error('   Ubuntu: sudo apt-get install imagemagick');
    console.error('   Windows: Download from https://imagemagick.org/script/download.php');
    process.exit(1);
  }
  
  // Check if cwebp is available
  try {
    execSync('cwebp -version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ cwebp not found! Please install WebP tools first.');
    console.error('   macOS: brew install webp');
    console.error('   Ubuntu: sudo apt-get install webp');
    process.exit(1);
  }
  
  // Generate spritesheets for each configuration
  configs.forEach((config, index) => {
    console.log(`\n🚀 Generating spritesheet ${index + 1}/${configs.length} (${config.spriteWidth}x${config.spriteHeight})...`);
    generateSpritesheet(inputDirectory, config);
    
    // Convert PNG to WebP for each size
    console.log(`📸 Converting ${config.spriteWidth}x${config.spriteHeight} spritesheet to WebP format...`);
    const webpOutputPath = config.outputImagePath.replace('.png', '.webp');
    
    try {
      // Use cwebp with quality 100 and lossless compression for pixel art
      const cwebpCommand = `cwebp -lossless -q 100 "${config.outputImagePath}" -o "${webpOutputPath}"`;
      execSync(cwebpCommand, { stdio: 'inherit' });
      console.log(`✅ WebP spritesheet saved to: ${webpOutputPath}`);
    } catch (error) {
      console.error('❌ Failed to convert to WebP:', error);
      console.log('⚠️  PNG version is still available at:', config.outputImagePath);
    }
  });
  
  console.log('\n🎉 All spritesheet generation complete!');
  console.log(`📋 Generated ${configs.length} different sizes:`);
  configs.forEach(config => {
    console.log(`   • ${config.spriteWidth}x${config.spriteHeight}px: ${config.outputImagePath.replace('.png', '.webp')}`);
  });
}

// Run main function directly (ES module style)
main();

export { generateSpritesheet, SpritesheetConfig, SpriteCoordinate };
