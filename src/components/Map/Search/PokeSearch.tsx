import { useState } from "react";
import pokemonSearchStore from "@/stores/pokemonSearchStore";
import { useMapStore } from "@/stores/useMapStore";
import { useUIStore } from "@/stores/uiStore";
const PokeSearch = () => {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const setSelectedPokemon = useUIStore((state) => state.setSelectedPokemon);
  const setSelectedMapLevel = useMapStore((state) => state.setSelectedMapLevel);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const results = pokemonSearchStore.search(query);
    if (results) {
      setSearchResults(results.matches);
    }
  };

  const handleSelect = (pokemonNameKey: string) => {
    const mon = //getfromSpeciesJson 
    const searchResult = pokemonSearchStore.search(pokemonName); // Assuming search returns the object
    if (!searchResult) {
      console.error("error selecting mon search result");
      return;
    }
    // const selectedMonName =
      /* logic to get the full selected pokemon name from searchResult.matches if it's a list */ pokemonName;

    if (searchResult.foundInEncounters) {
      // Get *all* level IDs for the selected Pokémon name
      const levelIDs =
        pokemonSearchStore.getLevelIDsForPokemon(selectedMonName); // NEW function needed in store
      if (levelIDs && levelIDs.length > 0) {
        // For now, let's pick the first one. UI might let user choose if multiple.
        // You'd call your new store action here:
        // selectMapByLevelId(levelIDs[0]);
        console.log(`Set map to level: ${levelIDs[0]}`); // Placeholder
      }
    } else {
      const details = pokemonSearchStore.getPokemonDetails(selectedMonName);
      if (details) {
        // setSelectedPokemon(details); // Your existing logic
        console.log(`Set selected Pokémon: ${details.speciesName}`); // Placeholder
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Pokémon"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((result) => (
          <li key={result} onClick={() => handleSelect(result)}>
            {result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokeSearch;
