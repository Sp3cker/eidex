import { useUIStore } from "@/stores/uiStore";
import { Pokemon } from "@/types";
import { getForms } from "@/utils/speciesData";
import { memo, useMemo } from "react";

export const FormeView = memo(function FormViewMemo() {
  const selectedPokemon = useUIStore((state) => state.selectedPokemon);
  const setSelectedPokemon = useUIStore(
    (state) => state.setSelectedPokemonByIndex,
  );
  const selectedFormNameKey = selectedPokemon?.nameKey;
  // Memoize the forms to prevent unnecessary recalculations
  const sortedForms = useMemo(() => {
    if (!selectedPokemon) return [];
    const forms = getForms(selectedPokemon);
    // Sort deterministically by dexId, then by nameKey for consistent ordering
    return forms.sort((a, b) => {
      const dexIdDiff = a.dexId - b.dexId;
      if (dexIdDiff !== 0) return dexIdDiff;
      return a.nameKey.localeCompare(b.nameKey);
    });
  }, [selectedPokemon]);

  if (!selectedPokemon || sortedForms.length <= 1) return null;

  return (
    <div className="flex h-5 flex-row flex-wrap justify-evenly gap-2 rounded-md p-2">
      {sortedForms.map((form: Pokemon) => (
        <button
          key={`${form.dexId}-${form.nameKey}`} // Composite key for unique identification
          className={`${selectedFormNameKey === form.nameKey ? "bg-gray-900" : "bg-sky-700"} neutral-box flex w-20 cursor-pointer items-center rounded-md p-2`}
          onClick={() => setSelectedPokemon(form.speciesId)}
        >
          <p className="font-pkmnem pkmnem-face-shadow text-center text-lg font-bold text-gray-200">
            {form.forms === null
              ? form.nameKey.charAt(0).toUpperCase() + form.nameKey.slice(1)
              : form.forms[0].charAt(0).toUpperCase() + form.forms[0].slice(1)}
          </p>
        </button>
      ))}
    </div>
  );
});
