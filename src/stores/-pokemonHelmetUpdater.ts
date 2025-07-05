import { Pokemon } from '@/types';

export const updatePokemonHelmet = (selectedPokemon: Pokemon | null, isShiny: boolean) => {
  if (!selectedPokemon) {
    // Reset to default when no Pokemon is selected - this should be handled by route-level components
    return;
  }

  const pokemonTitle = `${selectedPokemon.nameKey} (#${selectedPokemon.dexId}) - Pokédex`;
  const pokemonDescription = `View detailed information for ${selectedPokemon.nameKey}, including stats, abilities, type matchups, and move learnsets. ${isShiny ? 'Viewing shiny form.' : ''}`;

  // Update document head directly
  document.title = pokemonTitle;
  
  // Update existing meta tags or create them if they don't exist
  const updateMetaTag = (property: string, content: string, isProperty = false) => {
    const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (isProperty) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Update all relevant meta tags
  updateMetaTag('description', pokemonDescription);
  updateMetaTag('og:title', pokemonTitle, true);
  updateMetaTag('og:description', pokemonDescription, true);
  updateMetaTag('twitter:title', pokemonTitle);
  updateMetaTag('twitter:description', pokemonDescription);
};
