import fs from 'fs';
import path from 'path'
// --- CONFIGURATION ---
// Set the target percentage here (e.g., 50 = 50% size, 25 = 25% size)
const TARGET_PERCENTAGE = 80; 

// Paths relative to this script file
const INPUT_PATH = 'src/data/map/reconstructed_map_sections.json';
const OUTPUT_PATH =  'src/data/map/reconstructed_map_sections_scaled.json';
// ---------------------

try {
    // 1. Read the file
    if (!fs.existsSync(INPUT_PATH)) {
        throw new Error(`Input file not found at: ${INPUT_PATH}`);
    }
    const rawData = fs.readFileSync(INPUT_PATH, 'utf8');
    const data = JSON.parse(rawData);

    // 2. Calculate scale factor
    const scaleFactor = TARGET_PERCENTAGE / 100;
    console.log(`Reading from: ${INPUT_PATH}`);
    console.log(`Scaling map sections to ${TARGET_PERCENTAGE}% (Factor: ${scaleFactor})...`);

    // 3. Transform data
    const scaledSections = data.map_sections.map(section => {
        return {
            ...section,
            x: Math.round(section.x * scaleFactor),
            y: Math.round(section.y * scaleFactor),
            width: Math.round(section.width * scaleFactor),
            height: Math.round(section.height * scaleFactor)
        };
    });

    const outputData = { map_sections: scaledSections };

    // 4. Write to new file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputData, null, 2));
    console.log(`Success! Scaled data written to: ${OUTPUT_PATH}`);

} catch (error) {
    console.error('Error processing file:', error.message);
}