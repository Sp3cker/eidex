import GenericComboBox, { ComboBoxEntry } from "./GenericComboBox";
import { pokemonData } from "@/data/pokemon";
import { Pokemon } from "@/types";
import { useMemo, useState, useEffect, useCallback } from "react";
import { MdSearch } from "react-icons/md";
import { useFilterStore } from "@/stores/filterStore";
import { useUIStore } from "@/stores/uiStore";

const speciesIDMap: ComboBoxEntry[] = pokemonData
  .filter((p) => typeof p === "object" && !!p && "nameKey" in p)
  .map((p) => ({
    id: (p as Pokemon).speciesId,
    name: (p as Pokemon).nameKey,
  }));

function NameCombobox() {
  const setFilterValue = useFilterStore((state) => state.setFilter);
  const currentName = useFilterStore((state) => state.name);
  const [selectedEntry, setSelectedEntry] = useState<ComboBoxEntry | null>(
    null,
  );
  const setSelectedPokemonByDexId = useUIStore(
    (state) => state.setSelectedPokemonByIndex,
  );
  const pokemonEntries: ComboBoxEntry[] = useMemo(() => speciesIDMap, []);

  // Reset the component when nameValue is cleared
  useEffect(() => {
    if (!currentName && selectedEntry) {
      setSelectedEntry(null);
    }
  }, [currentName, selectedEntry]);
  
  const handleClear = useCallback(() => {
    setFilterValue("name", "");
    setSelectedEntry(null);
  }, [setFilterValue]);
  
  // Custom wrapper around onSelect that also updates our local state
  const handleSelect = (entry: ComboBoxEntry | null) => {
    if (entry) {
      setSelectedEntry(entry);
      setFilterValue("name", entry.name);
      setSelectedPokemonByDexId(entry.id);
      return;
    }
    handleClear();
  };

  return (
    <GenericComboBox
      entries={pokemonEntries}
      onSelect={handleSelect}
      placeholder="Pick a pokemon..."
      icon={<MdSearch />}
      value={selectedEntry}
    />
  );
}

export default NameCombobox;
