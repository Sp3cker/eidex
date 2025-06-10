import { readdirSync, writeFileSync } from "fs";
import { join, basename, extname } from "path";
import { execSync } from "child_process";

interface SpriteCoordinate {
  spriteName: string;
  coords: [number, number];
}

interface SpritesheetConfig {
  // Individual sprite size
  spriteWidth: number;
  spriteHeight: number;
  // Padding between sprites
  padding: number;
  // Number of sprites per row
  spritesPerRow: number;
  // Output paths
  outputImagePath: string;
  outputJsonPath: string;
}

const config: SpritesheetConfig = {
  spriteWidth: 64,
  spriteHeight: 64,
  padding: 2,
  spritesPerRow: 16,
  outputImagePath: "./public/spritesheet-pokemon-front.png",
  outputJsonPath: "./src/data/pokemon-front-coords.json",
};

function getImageFiles(directory: string): string[] {
  try {
    const files = readdirSync(directory);
    return files
      .filter((file) => extname(file).toLowerCase() === ".png")
      .sort((a, b) => {
        // Extract numbers from filenames for proper numerical sorting
        const numA = parseInt(basename(a, extname(a)));
        const numB = parseInt(basename(b, extname(b)));

        // If both are valid numbers, sort numerically
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }

        // Fallback to alphabetical sorting for non-numeric filenames
        return a.localeCompare(b);
      });
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

function calculateSpriteCoordinates(
  imageCount: number,
  config: SpritesheetConfig,
): SpriteCoordinate[] {
  const coordinates: SpriteCoordinate[] = [];

  for (let i = 0; i < imageCount; i++) {
    const row = Math.floor(i / config.spritesPerRow);
    const col = i % config.spritesPerRow;

    const x = col * (config.spriteWidth + config.padding);
    const y = row * (config.spriteHeight + config.padding);

    coordinates.push({
      spriteName: "",
      coords: [x, y],
    });
  }

  return coordinates;
}

function calculateCanvasSize(
  imageCount: number,
  config: SpritesheetConfig,
): [number, number] {
  const rows = Math.ceil(imageCount / config.spritesPerRow);
  const cols = Math.min(imageCount, config.spritesPerRow);

  const width = cols * config.spriteWidth + (cols - 1) * config.padding;
  const height = rows * config.spriteHeight + (rows - 1) * config.padding;

  return [width, height];
}

function generatePokemonSpritesheet(
  inputDir: string,
  config: SpritesheetConfig,
): void {
  console.log("🔍 Scanning for Pokémon WebP files...");
  const imageFiles = getImageFiles(inputDir);

  if (imageFiles.length === 0) {
    console.error("❌ No WebP files found in the input directory!");
    process.exit(1);
  }

  console.log(`📊 Found ${imageFiles.length} Pokémon sprites`);

  // Calculate canvas size
  const [canvasWidth, canvasHeight] = calculateCanvasSize(
    imageFiles.length,
    config,
  );
  console.log(`📐 Canvas size: ${canvasWidth}x${canvasHeight}px`);

  // Calculate coordinates
  const coordinates = calculateSpriteCoordinates(imageFiles.length, config);

  // Fill in the sprite names (using base filename)
  imageFiles.forEach((file, index) => {
    const spriteName = basename(file, extname(file));
    coordinates[index].spriteName = spriteName;
  });

  // Build ImageMagick command
  console.log("🎨 Generating spritesheet with ImageMagick...");

  // Create a transparent canvas
  let magickCmd = `magick -size ${canvasWidth}x${canvasHeight} xc:transparent`;

  // Add each image to the canvas - process in smaller batches to avoid command line length limits
  const BATCH_SIZE = 50;
  for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
    const batchFiles = imageFiles.slice(i, i + BATCH_SIZE);
    let batchCmd = magickCmd;

    batchFiles.forEach((file, batchIndex) => {
      const index = i + batchIndex;
      const filePath = join(inputDir, file);
      const coord = coordinates[index];

      // Resize image to sprite size using point filter for crisp pixel art
      batchCmd += ` \\( "${filePath}" -filter point -resize ${config.spriteWidth}x${config.spriteHeight}! \\)`;
      batchCmd += ` -geometry +${coord.coords[0]}+${coord.coords[1]} -composite`;
    });

    // For intermediate batches, save to temp file and use as input for next batch
    const outputPath =
      i + BATCH_SIZE < imageFiles.length
        ? "./public/spritesheet-pokemon-temp.png"
        : config.outputImagePath;

    batchCmd += ` "${outputPath}"`;

    try {
      console.log(
        `⚡ Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(imageFiles.length / BATCH_SIZE)}...`,
      );
      execSync(batchCmd);

      // If not the last batch, use the temp file as the base for the next batch
      if (i + BATCH_SIZE < imageFiles.length) {
        magickCmd = `magick "./public/spritesheet-pokemon-temp.png"`;
      }
    } catch (error) {
      console.error("❌ ImageMagick command failed:", error);
      process.exit(1);
    }
  }

  console.log(`✅ Spritesheet saved to: ${config.outputImagePath}`);

  // Save coordinates JSON
  try {
    const jsonOutput = JSON.stringify(coordinates, null, 2);
    writeFileSync(config.outputJsonPath, jsonOutput, "utf8");
    console.log(`✅ Coordinates saved to: ${config.outputJsonPath}`);
  } catch (error) {
    console.error("❌ Failed to save coordinates JSON:", error);
    process.exit(1);
  }

  // Convert to WebP
  const webpOutputPath = config.outputImagePath.replace(".png", ".webp");
  try {
    console.log("📸 Converting spritesheet to WebP format...");
    execSync(
      `cwebp -near_lossless 0 "${config.outputImagePath}" -o "${webpOutputPath}"`,
    );
    console.log(`✅ WebP spritesheet saved to: ${webpOutputPath}`);
  } catch (error) {
    console.error("❌ WebP conversion failed:", error);
  }

  // Clean up temp file if it exists
  try {
    execSync("rm -f ./public/spritesheet-pokemon-temp.png");
  } catch (error) {
    // Ignore cleanup errors
  }

  // Print summary
  console.log("\n📋 Summary:");
  console.log(`   • Pokémon sprites processed: ${imageFiles.length}`);
  console.log(
    `   • Sprite size: ${config.spriteWidth}x${config.spriteHeight}px`,
  );
  console.log(`   • Canvas size: ${canvasWidth}x${canvasHeight}px`);
  console.log(`   • Sprites per row: ${config.spritesPerRow}`);
  console.log(
    `   • Total rows: ${Math.ceil(imageFiles.length / config.spritesPerRow)}`,
  );
}

// Main execution
function main() {
  const inputDirectory = "./public/sprites/front";

  console.log("🚀 Starting Pokémon spritesheet generation...");
  console.log(`📁 Input directory: ${inputDirectory}`);

  // Check if ImageMagick is available
  try {
    execSync("magick -version");
    console.log("✅ ImageMagick is available");
  } catch (error) {
    console.error(
      "❌ ImageMagick is not available. Please install ImageMagick.",
    );
    process.exit(1);
  }

  // Check if cwebp is available
  try {
    execSync("cwebp -version");
    console.log("✅ WebP tools are available");
  } catch (error) {
    console.warn("⚠️ WebP tools are not available. PNG output only.");
  }

  generatePokemonSpritesheet(inputDirectory, config);

  console.log("🎉 Pokémon spritesheet generation complete!");
}

main();
