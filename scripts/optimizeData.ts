import fs from 'fs';
import path from 'path';

interface TypeData {
  typeID: number;
  typeName: string;
  color: string;
  colorEnd: string;
  cssClass: string;
  matchup: number[];
}

interface AbilityData {
  id: number;
  name: string;
  description: string;
}

interface MoveData {
  id: number;
  name: string;
  type: number;
  description: string;
  power: number;
  acc: number;
  cat: number;
  properties: string[];
}

interface PokemonData {
  speciesId: number;
  speciesName: string;
  types: number[];
  stats: number[];
  abilities: number[];
  heldItems: number[];
  levelUpMoves: [number, number][];
  tmMoves: number[];
  eggMoves: number[] | null;
  dexId: number;
  evolutions: [number, number, number][] | null;
  forms: any | null;
  formId: number;
  nameKey: string;
}

/**
 * Convert type data to optimized format
 */
function optimizeTypeData(typeData: Record<string, TypeData>) {
  const lookups: Record<string, Record<string, string>> = {};
  const optimizedData: Record<string, any> = {};

  // Create type name lookup
  lookups.types = {};
  Object.entries(typeData).forEach(([id, type]) => {
    lookups.types[id] = type.typeName;
  });

  // Optimize type data
  Object.entries(typeData).forEach(([id, type]) => {
    optimizedData[id] = {
      n: type.typeName,
      c: type.color,
      ce: type.colorEnd,
      css: type.cssClass,
      m: type.matchup
    };
  });

  return { lookups, data: optimizedData };
}

/**
 * Convert ability data to optimized format
 */
function optimizeAbilityData(abilityData: AbilityData[]) {
  const lookups: Record<string, Record<string, string>> = {};
  const optimizedData: Record<string, any> = {};

  // Create ability name lookup
  lookups.abilities = {};
  abilityData.forEach(ability => {
    lookups.abilities[ability.id.toString()] = ability.name;
  });

  // Optimize ability data
  abilityData.forEach(ability => {
    optimizedData[ability.id.toString()] = {
      n: ability.name,
      d: ability.description
    };
  });

  return { lookups, data: optimizedData };
}

/**
 * Convert move data to optimized format
 */
function optimizeMoveData(moveData: MoveData[]) {
  const lookups: Record<string, Record<string, string | number>> = {};
  const optimizedData: any[] = [];

  // Create lookups
  lookups.types = {};
  lookups.categories = { "0": "Physical", "1": "Special", "2": "Status" };
  lookups.properties = { "contact": 1, "punching": 2, "wind": 3, "dance": 4, "slicing": 5 };

  // Get unique types from move data
  const uniqueTypes = new Set(moveData.map(move => move.type));
  uniqueTypes.forEach(typeId => {
    lookups.types[typeId.toString()] = `Type${typeId}`; // Placeholder, should be filled from typeData
  });

  // Optimize move data
  moveData.forEach(move => {
    optimizedData.push({
      i: move.id,
      n: move.name,
      t: move.type,
      d: move.description,
      p: move.power,
      a: move.acc,
      c: move.cat,
      pr: move.properties.map(prop => lookups.properties[prop] || 0)
    });
  });

  return { lookups, data: optimizedData };
}

/**
 * Convert Pokemon data to optimized format
 */
function optimizePokemonData(pokemonData: Record<string, PokemonData>) {
  const lookups: Record<string, Record<string, string>> = {};
  const optimizedData: Record<string, any> = {};

  // Create lookups (these should be shared across all data types)
  lookups.types = {};
  lookups.abilities = {};

  // Optimize Pokemon data
  Object.entries(pokemonData).forEach(([id, pokemon]) => {
    optimizedData[id] = {
      n: pokemon.speciesName,
      t: pokemon.types,
      s: pokemon.stats,
      a: pokemon.abilities,
      h: pokemon.heldItems,
      l: pokemon.levelUpMoves,
      tm: pokemon.tmMoves,
      e: pokemon.eggMoves,
      d: pokemon.dexId,
      ev: pokemon.evolutions,
      f: pokemon.forms,
      fi: pokemon.formId,
      nk: pokemon.nameKey
    };
  });

  return { lookups, data: optimizedData };
}

/**
 * Main optimization function
 */
async function optimizeAllData() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const outputDir = path.join(process.cwd(), 'src', 'data', 'optimized');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Read and optimize type data
    const typeDataPath = path.join(dataDir, 'typeData.json');
    const typeData = JSON.parse(fs.readFileSync(typeDataPath, 'utf8'));
    const optimizedTypeData = optimizeTypeData(typeData);
    fs.writeFileSync(
      path.join(outputDir, 'typeData-optimized.json'),
      JSON.stringify(optimizedTypeData, null, 2)
    );

    // Read and optimize ability data
    const abilityDataPath = path.join(dataDir, 'abilityData.json');
    const abilityData = JSON.parse(fs.readFileSync(abilityDataPath, 'utf8'));
    const optimizedAbilityData = optimizeAbilityData(abilityData);
    fs.writeFileSync(
      path.join(outputDir, 'abilityData-optimized.json'),
      JSON.stringify(optimizedAbilityData, null, 2)
    );

    // Read and optimize move data
    const moveDataPath = path.join(dataDir, 'moveData.json');
    const moveData = JSON.parse(fs.readFileSync(moveDataPath, 'utf8'));
    const optimizedMoveData = optimizeMoveData(moveData);
    fs.writeFileSync(
      path.join(outputDir, 'moveData-optimized.json'),
      JSON.stringify(optimizedMoveData, null, 2)
    );

    // Read and optimize Pokemon data
    const pokemonDataPath = path.join(dataDir, 'speciesData.json');
    const pokemonData = JSON.parse(fs.readFileSync(pokemonDataPath, 'utf8'));
    const optimizedPokemonData = optimizePokemonData(pokemonData);
    fs.writeFileSync(
      path.join(outputDir, 'speciesData-optimized.json'),
      JSON.stringify(optimizedPokemonData, null, 2)
    );

    console.log('✅ Data optimization completed successfully!');
    console.log('📁 Optimized files saved to:', outputDir);

    // Calculate size savings
    const originalSizes = {
      typeData: fs.statSync(typeDataPath).size,
      abilityData: fs.statSync(abilityDataPath).size,
      moveData: fs.statSync(moveDataPath).size,
      pokemonData: fs.statSync(pokemonDataPath).size
    };

    const optimizedSizes = {
      typeData: fs.statSync(path.join(outputDir, 'typeData-optimized.json')).size,
      abilityData: fs.statSync(path.join(outputDir, 'abilityData-optimized.json')).size,
      moveData: fs.statSync(path.join(outputDir, 'moveData-optimized.json')).size,
      pokemonData: fs.statSync(path.join(outputDir, 'speciesData-optimized.json')).size
    };

    console.log('\n📊 Size comparison:');
    Object.entries(originalSizes).forEach(([key, originalSize]) => {
      const optimizedSize = optimizedSizes[key as keyof typeof optimizedSizes];
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      console.log(`${key}: ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${savings}% reduction)`);
    });

  } catch (error) {
    console.error('❌ Error optimizing data:', error);
    process.exit(1);
  }
}

// Run the optimization if this script is executed directly
if (require.main === module) {
  optimizeAllData();
}

export { optimizeAllData };