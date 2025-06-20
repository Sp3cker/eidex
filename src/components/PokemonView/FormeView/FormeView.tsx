import { useUIStore } from "@/stores/uiStore";
import { Pokemon } from "@/types";
import { getForms } from "@/utils/speciesData";
import React, { useMemo } from "react";

interface FormeViewProps {
  pokemon: Pokemon;
  isShiny: boolean;
  onClickPokemon: (pokemonId: number) => void;
}

export const FormeView: React.FC<FormeViewProps> = ({ onClickPokemon }) => {
  const selectedPokemon = useUIStore(state => state.selectedPokemon)
  
  // Memoize the forms to prevent unnecessary recalculations
  const sortedForms = useMemo(() => {
    if (!selectedPokemon) return [];
    const forms = getForms(selectedPokemon);
    // Sort deterministically by dexId, then by nameKey for consistent ordering
    return [...forms].sort((a, b) => {
      const dexIdDiff = a.dexId - b.dexId;
      if (dexIdDiff !== 0) return dexIdDiff;
      return a.nameKey.localeCompare(b.nameKey);
    });
  }, [selectedPokemon]);
  
  if (!selectedPokemon || sortedForms.length <= 1) return null

  return (
    <div className="neutral-box flex flex-row flex-wrap justify-evenly gap-2 rounded-md p-2">
      {sortedForms.map((form: Pokemon) => (
        <div
          key={`${form.dexId}-${form.nameKey}`} // Composite key for unique identification
          className="w-25 flex cursor-pointer flex-col items-center rounded-md bg-zinc-700 p-2"
          onClick={() => onClickPokemon(form.dexId)}
        >
          {/* <SpriteImage pokemon={form} /> */}
          <span className="font-pixel text-center text-xs text-gray-200">
            {form.nameKey}
          </span>
        </div>
      ))}
    </div>
  );
};
