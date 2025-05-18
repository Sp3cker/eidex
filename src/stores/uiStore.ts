import { create } from "zustand";
import { Pokemon } from "@/types";
import { persist } from "zustand/middleware";
import pokemons from "@/data/speciesData.json";

interface UIState {
  isShiny: boolean;
  selectedPokemon: Pokemon | null;

  isModalOpen: boolean;
  toggleShiny: () => void;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  setSelectedPokemonByIndex: (index: number) => void;
  openModal: (pokemon: Pokemon) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      //Properties
      isShiny: false,
      selectedPokemon: null,
      isModalOpen: false,

      //Actions
      toggleShiny: () => set((state) => ({ isShiny: !state.isShiny })),
      setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
      setSelectedPokemonByIndex: (index: number) => {
        const pokemon = pokemons.find((p) => p.index === index);
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
);
