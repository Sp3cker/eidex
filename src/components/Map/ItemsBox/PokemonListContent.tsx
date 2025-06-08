import React from "react";
import { formatSpeciesString } from "@/utils/formatMapString";
import { BaseListContent } from "./BaseListContent";

interface PokemonListItem {
  name: string;
  id: string;
  description?: string;
}

interface PokemonListContentProps {
  pokemon: string[];
  emptyMessage?: string;
}

const renderIcon = () => (
  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-yellow-200 text-xs text-yellow-700">
    ⭐
  </div>
);

const renderContent = (item: PokemonListItem) => (
  <h3 className="text-xs/4 font-bold text-yellow-900 md:text-sm">
    {item.name}
  </h3>
);
const getKey = (item: PokemonListItem) => item.id;

export const PokemonListContent = React.memo(function PokemonListContent({
  pokemon,
  emptyMessage = "No Pokémon here",
}: PokemonListContentProps) {
  // Convert pokemon strings to the expected format
  const pokemonItems: PokemonListItem[] = pokemon.map((p) => ({
    name: formatSpeciesString(p),
    id: p,
    description: "", // No description for pokemon
  }));

  return (
    <BaseListContent
      items={pokemonItems}
      emptyMessage={emptyMessage}
      className="border-yellow-200 bg-gradient-to-r from-yellow-50/50 to-white-50 text-yellow-900 hover:bg-yellow-100"
      renderIcon={renderIcon}
      renderContent={renderContent}
      getKey={getKey}
    />
  );
});

export default PokemonListContent;
