import speciesData from "./data/speciesData.json";
import { PokemonList } from "./components/PokemonList/PokemonList";
import { filterPokemon } from "./utils/filterPokemon";
import { useState, useMemo, useEffect } from "react";
import { FilterOptions, Pokemon } from "./types";
import CreditsButton from "./components/CreditsButton";
import { DrawerContainer } from "./components/FilterUI/Drawer";
import { PokemonModal } from "./components/PokemonModal/PokemonModal";
import Footer from "./components/Footer";
import { useTheme } from "./context/ThemeContext";
const pokemonData = Object.values(speciesData);

function App() {
  // State for the actual filters used for searching (debounced)
  const [filters, setFilters] = useState<FilterOptions>({
    name: "",
    typeId: undefined,
    minStat: undefined,
    levelupMove: "",
    tmMove: "",
    tutorMove: "",
  });
  const { theme, toggleTheme } = useTheme();
  // Retrieve the shiny state from localStorage or default to false
  const [isShiny, setIsShiny] = useState(() => {
    const savedShinyState = localStorage.getItem("isShiny");
    return savedShinyState == "true"; // beacuse it's stored as a string
  });

  // State for the raw filter input (updates immediately as user types)
  const [rawFilters, setRawFilters] = useState<FilterOptions>({
    name: "",
    typeId: undefined,
    minStat: undefined,
    levelupMove: "",
    tmMove: "",
    tutorMove: "",
  });
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Debounce delay in milliseconds
  const DEBOUNCE_DELAY = 300;

  // Effect to update filters after user stops typing for DEBOUNCE_DELAY ms
  useEffect(() => {
    // Start a timer to update filters after delay
    const handler = setTimeout(() => {
      setFilters(rawFilters);
    }, DEBOUNCE_DELAY);

    // If rawFilters changes before timer ends, clear the previous timer
    return () => {
      clearTimeout(handler);
    };
  }, [rawFilters]); // Only re-run when rawFilters changes

  // Memoized filtered Pokémon list (only updates when filters change)
  const filteredPokemon = useMemo(() => {
    return filterPokemon(pokemonData, filters);
  }, [filters]);

  // Effect to save shiny state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isShiny", isShiny.toString());
  }, [isShiny]);

  return (
    <div
      className={`${theme} flex min-h-screen flex-col justify-center bg-zinc-800 md:flex-row`}
    >
      <div className="border-1 shadow-2xl/60 order-2 flex w-full flex-col rounded-lg border-neutral-900/50 md:order-1 md:w-3/4">
        {/* Pass rawFilters and setRawFilters to FilterBar for immediate UI updates */}

        {/* Shiny toggle UI */}
        <div className="flex items-center justify-between gap-2 bg-neutral-800/30 px-3 py-2">
          <div className="flex flex-row items-center">
            <img
              src="/shinycharm.png"
              alt="Shiny Mode"
              className="h-6.5 w-6.5 object-contain"
              title="Shiny Mode"
            />
            <button
              type="button"
              role="switch"
              aria-checked={isShiny}
              onClick={() => setIsShiny((prev) => !prev)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none ${isShiny ? "bg-blue-600" : "bg-zinc-600"}`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-200 ${isShiny ? "translate-x-5" : "translate-x-1"}`}
              />
            </button>
          </div>
          <CreditsButton />
          <button onClick={toggleTheme} className="btn">Theme</button>
        </div>
        <PokemonList
          pokemons={filteredPokemon}
          isShiny={isShiny}
          selectedPokemon={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
        />
      </div>
    
      <div className="order-1 w-full md:order-2 md:w-auto md:pl-1">
        <DrawerContainer
          closeDrawer={selectedPokemon !== null}
          filters={rawFilters}
          setFilters={setRawFilters}
        />
      </div>
      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        isShiny={isShiny}
      />
    </div>
  );
}
const AppWrapper = () => {
  return (
    <div className="flex flex-col">
      <App />
      <Footer />
    </div>
  );
};
export default AppWrapper;
