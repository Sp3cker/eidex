import { CloseButton } from "@headlessui/react";
import PokemonView from "./PokemonView/PokemonView";
import { useUIStore } from "@/stores/uiStore";

function PokemonModal() {
  const closeModal = useUIStore((state) => state.closeModal);
  const selectedPokemon = useUIStore((state) => state.selectedPokemon);
  if (!selectedPokemon) return null;

  return (
    <div
      className="z-9 fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md"
      onClick={closeModal}
    >
      <div
        className="w-xl no-scrollbar relative my-0 h-[95dvh] max-h-screen justify-normal overflow-y-auto rounded-lg border border-gray-100 bg-zinc-800 px-6 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute right-5 top-5 flex flex-row items-center gap-1 self-center">
          <button
            onClick={closeModal}
            className="font-pkmnem text-3xl font-bold rounded px-3 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100" // Example styling
          >
            X
          </button>
        </span>
        <PokemonView pokemon={selectedPokemon} />
      </div>
    </div>
  );
}
export default PokemonModal;
