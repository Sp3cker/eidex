/**
 * Normalizes a Pokemon name for consistent comparison across the application.
 * This function handles various edge cases like special characters, gender symbols, and diacritics.
 */
export const superNormalizeName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/-/g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/'/g, "")
    .replace(/♂/g, "_m")
    .replace(/♀/g, "_f"); 