import { useTransition, animated } from "@react-spring/web";
import { useUIStore } from "@/stores/uiStore";
import FilterBar from "./Filter/FilterBar"; // Adjust path as needed
import { useWindowSize } from "@/hooks/useWindowResize";
import PokemonView from "./PokemonView/PokemonView";
const AnimatedArea = () => {
  const selectedPokemon = useUIStore((state) => state.selectedPokemon);
  const closeModal = useUIStore((state) => state.closeModal);
  const activeView = selectedPokemon ? "pokeInfo" : "filterBar";

  const transitions = useTransition(activeView, {
    keys: (item) => item, // Use the view name ('pokeInfo' or 'filterBar') as the key
    from: (item) => ({
      opacity: 0,
      transform:
        item !== "filterBar" ? "translateX(100%)" : "translateX(-100%)",
    }),
    enter: {
      opacity: 1,
      transform: "translateX(0%)",
    },
    leave: (item) => ({
      opacity: 0,
      transform:
        item !== "filterBar" ? "translateX(100%)" : "translateX(-100%)",
      position: "absolute", // Crucial: keeps the leaving item from affecting layout
    }),
    config: { tension: 220, friction: 24 },
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-800">
      {transitions((style, item) => {
        if (item === "pokeInfo") {
          return (
            <animated.div style={{ ...style }} className="absolute inset-0">
              <div
                className="relative max-h-screen justify-normal overflow-y-auto rounded-lg bg-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="absolute left-3 top-5 flex flex-row items-center gap-1 self-center">
                  <button
                    onClick={closeModal}
                    className="font-pkmnem rounded px-3 text-3xl font-bold text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100" // Example styling
                  >
                    X
                  </button>
                </span>
                {selectedPokemon && <PokemonView pokemon={selectedPokemon} />}
              </div>
            </animated.div>
          );
        } else {
          // item === "filterBar"
          return (
            <animated.div
              style={{ ...style, width: "100%", height: "100%" }}
              className="absolute inset-0"
            >
              <FilterBar />
            </animated.div>
          );
        }
      })}
    </div>
  );
};
const DrawerContent = () => {
  const { width } = useWindowSize();
  const isDesktop = width && width > 768;
  if (isDesktop) {
    return <AnimatedArea />;
  } else {
    // Mobile: Only show FilterBar. This will be placed inside the sliding mobile drawer.
    return <FilterBar />;
  }
};

export default DrawerContent;
