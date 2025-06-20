import GenericComboBox, { ComboBoxEntry } from "./GenericComboBox";
import { pokemonData } from "@/data/pokemon";
import { Pokemon } from "@/types";
import { useMemo, useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { useFilterStore } from "@/stores/filterStore";
import { useUIStore } from "@/stores/uiStore";

const speciesIDMap: ComboBoxEntry[] = pokemonData
  .filter((p) => typeof p === "object" && !!p && "nameKey" in p)
  .map((p) => ({
    id: (p as Pokemon).speciesId,
    name: (p as Pokemon).nameKey,
  }));

const setNameValueSelector = (state: any) => (name: string | null) => {
  state.setFilter("name", name);
};
function NameCombobox() {
  const nameValue = useFilterStore(setNameValueSelector);
  const [selectedEntry, setSelectedEntry] = useState<ComboBoxEntry | null>(
    null,
  );
  const setSelectedPokemonByDexId  = useUIStore(state => state.setSelectedPokemonByIndex) 
  const pokemonEntries: ComboBoxEntry[] = useMemo(() => speciesIDMap, []);

  // Reset the component when nameValue is cleared
  useEffect(() => {
    if (!nameValue && selectedEntry) {
      setSelectedEntry(null);
    }
  }, [nameValue, selectedEntry]);

  // Custom wrapper around onSelect that also updates our local state
  const handleSelect = (entry: ComboBoxEntry | null) => {
    if (entry) {
      // setSelectedEntry(entry);
      // nameValue(entry.name);
      setSelectedPokemonByDexId(entry.id)
      return;
    }
    nameValue(null);
    setSelectedEntry(null);
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
