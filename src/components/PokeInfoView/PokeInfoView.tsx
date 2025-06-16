import { useTransition, animated } from "@react-spring/web";
import { useUIStore } from "@/stores/uiStore"; // Corrected path
import type { Pokemon } from "@/types"; // Ensure Pokemon type is imported

interface PokemonDetailViewProps {
  isModal: boolean;
}

const PokeInfoView = ({ isModal }: PokemonDetailViewProps) => {
  const selectedPokemon = useUIStore((state) => state.selectedPokemon);
  const show = useUIStore((state) => state.selectedPokemon !== null);
  const closeModal = useUIStore((state) => state.closeModal);

  const transitions = useTransition(selectedPokemon, {
    from: {
      opacity: 0,
      transform: isModal ? "translateY(100%) scale(0.9)" : "translateX(100%)",
    },
    enter: {
      opacity: 1,
      transform: isModal ? "translateY(0%) scale(1)" : "translateX(0%)",
    },
    leave: {
      opacity: 0,
      transform: isModal ? "translateY(100%) scale(0.9)" : "translateX(100%)",
    },
    config: { tension: 220, friction: 22 },
  });

  const baseContainerClasses = "overflow-y-auto text-neutral-50";
  // For inline: absolute positioning to cover parent, solid background, and z-index
  const inlineContainerClasses = `${baseContainerClasses} absolute inset-0 w-full h-full bg-zinc-700 p-4 md:p-6 z-10`; // Added absolute, inset-0, z-10
  const modalWrapperClasses =
    "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4";
  const modalContentClasses = `${baseContainerClasses} relative bg-zinc-700 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[85vh]`;

  return transitions((style, pokemon) =>
    pokemon && (!isModal || pokemon) ? ( // Ensure pokemon exists for modal case too
      <animated.div
        style={style}
        className={isModal ? modalWrapperClasses : inlineContainerClasses}
      >
        <div className={isModal ? modalContentClasses : "h-full w-full"}>
          {" "}
          {/* Ensure inner div also takes full space for inline */}
          <button
            onClick={closeModal}
            className="absolute right-3 top-3 z-20 text-2xl font-semibold leading-none text-neutral-300 hover:text-neutral-100" // Higher z-index for button
            aria-label="Close"
          >
            &times;
          </button>
          <div className="space-y-3 pt-8">
            {" "}
            {/* Added pt-8 to avoid overlap with close button */}
            <h2 className="text-2xl font-bold text-amber-400">
              {pokemon.speciesName}
            </h2>
            <p className="text-sm text-neutral-300">ID: {pokemon.dexId}</p>
            <p className="text-sm text-neutral-300">
              Type: {pokemon.types.join(" / ")}
            </p>
            <div className="mt-4 space-y-1 border-t border-neutral-600 pt-4">
              <h4 className="text-lg font-semibold text-amber-300">
                Base Stats:
              </h4>
              <p className="text-sm">
                HP: <span className="font-medium">{pokemon.stats.hp}</span>
              </p>
              <p className="text-sm">
                Attack:{" "}
                <span className="font-medium">{pokemon.stats.attack}</span>
              </p>
              <p className="text-sm">
                Defense:{" "}
                <span className="font-medium">{pokemon.stats.defense}</span>
              </p>
              <p className="text-sm">
                Sp. Atk:{" "}
                <span className="font-medium">{pokemon.stats.sp_attack}</span>
              </p>
              <p className="text-sm">
                Sp. Def:{" "}
                <span className="font-medium">{pokemon.stats.sp_defense}</span>
              </p>
              <p className="text-sm">
                Speed:{" "}
                <span className="font-medium">{pokemon.stats.speed}</span>
              </p>
            </div>
          </div>
        </div>
      </animated.div>
    ) : null,
  );
};

export default PokeInfoView;
