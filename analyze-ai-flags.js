import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the trainers.json file
const trainersPath = path.join(__dirname, 'public', 'trainers.json');
const trainersData = JSON.parse(fs.readFileSync(trainersPath, 'utf8'));

// Object to store AI flag counts
const aiFlagCounts = {};
// Object to store trainers with each flag
const aiFlagTrainers = {};

// Function to count AI flags
function countAIFlags(trainers) {
  for (const trainer of trainers) {
    if (trainer.aiFlags && Array.isArray(trainer.aiFlags)) {
      for (const flag of trainer.aiFlags) {
        aiFlagCounts[flag] = (aiFlagCounts[flag] || 0) + 1;
        if (!aiFlagTrainers[flag]) {
          aiFlagTrainers[flag] = [];
        }
        aiFlagTrainers[flag].push(trainer.trainerName);
      }
    }
  }
}

// Count AI flags for all maps
for (const mapName in trainersData) {
  if (Array.isArray(trainersData[mapName])) {
    countAIFlags(trainersData[mapName]);
  }
}

// Sort by count (descending) and then by name
const sortedFlags = Object.entries(aiFlagCounts)
  .sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1]; // Sort by count descending
    }
    return a[0].localeCompare(b[0]); // Sort by name ascending if counts are equal
  });

// Display results
console.log('AI Flag Usage Statistics:');
console.log('========================');
console.log('Flag Name'.padEnd(30) + 'Count');
console.log('-'.repeat(40));

for (const [flag, count] of sortedFlags) {
  console.log(flag.padEnd(30) + count);
}

console.log('-'.repeat(40));
console.log('Total unique AI flags:', Object.keys(aiFlagCounts).length);
console.log('Total trainers with AI flags:', Object.values(aiFlagCounts).reduce((sum, count) => sum + count, 0));

// Log trainers with rare flags (count < 10)
console.log('\nTrainers with rare AI flags (count < 10):');
console.log('==========================================');
for (const [flag, count] of sortedFlags) {
  if (count < 10) {
    console.log(`\n${flag} (${count} trainers):`);
    for (const trainerName of aiFlagTrainers[flag]) {
      console.log(`  - ${trainerName}`);
    }
  }
}

// Also save to a JSON file for further analysis
const outputPath = path.join(__dirname, 'ai-flags-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify({ 
  flagCounts: aiFlagCounts, 
  flagTrainers: aiFlagTrainers,
  sortedFlags: sortedFlags,
  totalUniqueFlags: Object.keys(aiFlagCounts).length,
  totalTrainersWithFlags: Object.values(aiFlagCounts).reduce((sum, count) => sum + count, 0)
}, null, 2));

console.log(`\nDetailed analysis saved to: ${outputPath}`);
