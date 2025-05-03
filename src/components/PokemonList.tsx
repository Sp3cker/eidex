import { useEffect, useState } from "react";
import { PokemonCard } from "./PokemonCard";
import { Pokemon } from "../types";
import { PokemonModal } from "./PokemonModal/PokemonModal";
import useBodyScrollLock from "../hooks/useBodyScrollLock";

type PokemonListProps = {
  pokemons: Pokemon[];
  isShiny?: boolean;
  setSelectedPokemon: (p: Pokemon | null) => void;
  selectedPokemon: Pokemon | null;
};

export function PokemonList({
  pokemons,
  isShiny,
  setSelectedPokemon,
  selectedPokemon,
}: PokemonListProps) {
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setVisibleCount((prev) => Math.min(prev + 10, pokemons.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pokemons.length]);

  // Prevent background scroll when modal is open
  useBodyScrollLock(!!selectedPokemon);

  return (
    <div className="flex w-full flex-col items-center">
      {pokemons.slice(0, visibleCount).map((pokemon) => (
        <PokemonCard
          key={pokemon.ID}
          {...pokemon}
          isShiny={isShiny}
          onClick={() => setSelectedPokemon(pokemon)}
        />
      ))}
      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        isShiny={isShiny}
      />
    </div>
  );
}
