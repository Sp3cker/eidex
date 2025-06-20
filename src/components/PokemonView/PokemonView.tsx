import { Pokemon, StatArray } from "../../types";
import { useUIStore } from "@/stores/uiStore";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { useInView } from "@react-spring/web";
import { lazy, Suspense } from "react";
import { getSpeciesData, hasForms } from "@/utils/speciesData";
import { buildPokemonMoveTabs } from "./Learnset/learnsetTabs";
import LoadingSpinner from "../ui/LoadingSpinner";
import PokemonSprite from "./PokemonSprite";
import { TypeBadge } from "../TypeBadges/TypeBadge";
import StatBars from "./StatBars";

// Lazy load components
const AbilityBox = lazy(() => import("./AbilityBox"));
const TabbedInterface = lazy(() => import("./TabbedInterface"));
const TypeMatchup = lazy(() => import("./TypeMatchup"));
const FormeView = lazy(() =>
  import("./FormeView/FormeView").then((module) => ({
    default: module.FormeView,
  })),
);
const EvolutionView = lazy(() => import("./EvolutionView"));
function PokemonView({ pokemon }: { pokemon: Pokemon }) {
  const setSelectedPokemon = useUIStore((state) => state.setSelectedPokemon);
  const isShiny = useUIStore((state) => state.isShiny);
  const [tabsRef, tabsInView] = useInView();

  const tabsData = buildPokemonMoveTabs(pokemon);

  const handleSelectPokemon = (pokemonId: number) => {
    const pokemon: Pokemon = getSpeciesData(pokemonId);
    setSelectedPokemon(pokemon);
  };

  return (
    <div className="font-calamity flex w-full flex-col items-center">
      <div className="flex w-full flex-row justify-evenly items-center">
        <div className="needs-to-be-left">
          <PokemonSprite
            isOpen={pokemon !== null}
            spriteIndex={pokemon.speciesId}
            alt={pokemon.speciesName}
          />

          <div className="flex flex-row gap-1">
            {pokemon.types.map((typeId: number, index: number) => (
              <div key={index}>
                <TypeBadge typeId={typeId} screenWidth={'sm'} />
              </div>
            ))}
          </div>
          <div className="flex items-center text-center gap-3">
            <h2 className="text-lg font-bold text-gray-200">
              {pokemon.nameKey}
            </h2>
            <p className="font-pkmnem pt-1 mb-0 pkmnem-font-shadow text-gray-300">
              #{pokemon.dexId}
            </p>
          </div>
        </div>
        <div className="needs-to-be-right flex-grow">
          <div className="flex w-full">
            <StatBars stats={pokemon.stats as StatArray} />
          </div>
        </div>
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
