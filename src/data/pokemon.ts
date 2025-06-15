import speciesDataJson from './speciesData.json';
import type { Pokemon } from '@/types';

// Transform the JSON object to an array of values immediately
export const pokemonData: Pokemon[] = Object.values(speciesDataJson);
