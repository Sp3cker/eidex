import { createWithEqualityFn as create } from "zustand/traditional";
import { Pokemon } from "@/types";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { pokemonData as pokemons } from "@/data/pokemon";
import { updatePokemonHelmet } from "./pokemonHelmetUpdater";

interface UIState {
  isShiny: boolean;
  selectedPokemon: Pokemon | null;
  drawer: boolean;
  isModalOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleShiny: () => void;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  setSelectedPokemonByIndex: (index: number) => void;
  openModal: (pokemon: Pokemon) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        //Properties
        isShiny: false,
        selectedPokemon: null,
        isModalOpen: false,
        drawer: false,
        openDrawer: () => set({ drawer: true }),
        closeDrawer: () => set({ drawer: false }),
        //Actions
        toggleShiny: () => set((state) => ({ isShiny: !state.isShiny })),
        setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
        setSelectedPokemonByIndex: (index: number) => {
          const pokemon = pokemons.find((p) => p.dexId === index);
          if (pokemon) {
            set({ selectedPokemon: pokemon });
          }
        },
        openModal: (pokemon) =>
          set({ selectedPokemon: pokemon, isModalOpen: true }),
        closeModal: () => set({ isModalOpen: false, selectedPokemon: null }),
      }),
      {
        name: "eidex-ui-storage",
        // Only persist the shiny state
        partialize: (state) => ({ isShiny: state.isShiny }),
      },
    ),
  ),
);

// Subscribe to Pokemon modal changes and update head tags only when modal is open
useUIStore.subscribe(
  (state) => ({
    selectedPokemon: state.selectedPokemon,
    isShiny: state.isShiny,
    isModalOpen: state.isModalOpen,
  }),
  ({ selectedPokemon, isShiny, isModalOpen }) => {
    // Only update head when modal is open and pokemon is selected
    if (isModalOpen && selectedPokemon) {
      updatePokemonHelmet(selectedPokemon, isShiny);
    }
  },
  {
    equalityFn: (a, b) =>
      a.selectedPokemon?.dexId === b.selectedPokemon?.dexId &&
      a.isShiny === b.isShiny &&
      a.isModalOpen === b.isModalOpen,
  },
);
