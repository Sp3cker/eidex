import { Pokemon, StatArray } from "../../types";
import { useUIStore } from "@/stores/uiStore";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { useInView } from "@react-spring/web";
import { lazy, Suspense } from "react";
import { getSpeciesData, hasForms } from "@/utils/speciesData";
import { buildPokemonMoveTabs } from "./Learnset/learnsetTabs";
import LoadingSpinner from "../ui/LoadingSpinner";
import PokemonSprite from "./PokemonSprite";

// Lazy load components
const AbilityBox = lazy(() => import("./AbilityBox"));
const TabbedInterface = lazy(() => import("./TabbedInterface"));
const TypeMatchup = lazy(() => import("./TypeMatchup"));
import { TypeBadge } from "../TypeBadges/TypeBadge";
import StatBars from "./StatBars";
const FormeView = lazy(() =>
  import("../FormeView/FormeView").then((module) => ({
    default: module.FormeView,
  })),
);
const EvolutionView = lazy(() => import("../EvolutionView/EvolutionDetails"));
function PokemonView({ pokemon }: { pokemon: Pokemon }) {
  const setSelectedPokemon = useUIStore((state) => state.setSelectedPokemon);
  const isShiny = useUIStore((state) => state.isShiny);
  const screenWidth = useScreenWidth();
  const [tabsRef, tabsInView] = useInView();

  const tabsData = buildPokemonMoveTabs(pokemon);

  const handleSelectPokemon = (pokemonId: number) => {
    const pokemon: Pokemon = getSpeciesData(pokemonId);
    setSelectedPokemon(pokemon);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <PokemonSprite
        isOpen={pokemon !== null}
        spriteIndex={pokemon.speciesId}
        alt={pokemon.speciesName}
      />

      <div className="mt-0 flex flex-row gap-1">
        {pokemon.types.map((typeId: number, index: number) => (
          <div key={index}>
            <TypeBadge typeId={typeId} screenWidth={screenWidth} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="font-pixel text-xl font-bold text-gray-200">
          {pokemon.nameKey}
        </div>
        <div className="text-md font-pixel text-gray-400">#{pokemon.dexId}</div>
      </div>

      <div className="mt-2 flex w-full">
        <StatBars stats={pokemon.stats as StatArray} />
      </div>

      <div className="my-2 mt-6 flex w-full flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <AbilityBox key={pokemon.speciesId} abilities={pokemon.abilities} />
        </Suspense>

        <div className="w-full">{/* <AbilityDescription /> */}</div>

        <div className="my-3">
          <Suspense fallback={<LoadingSpinner />}>
            <EvolutionView speciesId={pokemon.speciesId} />
          </Suspense>
        </div>

        {hasForms(pokemon) && (
          <div className="mb-3">
            <Suspense fallback={<LoadingSpinner />}>
              <FormeView
                pokemon={pokemon}
                isShiny={isShiny}
                onClickPokemon={handleSelectPokemon}
              />
            </Suspense>
          </div>
        )}

        <div className="flex flex-wrap text-gray-100">
          <Suspense fallback={<LoadingSpinner />}>
            <TypeMatchup pokemon={pokemon} />
          </Suspense>
        </div>
      </div>

      <div className="flex w-full flex-grow" ref={tabsRef}>
        {tabsInView && (
          <Suspense fallback={<LoadingSpinner />}>
            <TabbedInterface tabs={tabsData} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default PokemonView;
