import { Pokemon, StatArray } from "../../types";
import { useInView } from "@react-spring/web";
import { lazy, Suspense } from "react";
import { hasForms } from "@/utils/speciesData";
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
  const [tabsRef, tabsInView] = useInView();

  const tabsData = buildPokemonMoveTabs(pokemon);

  return (
    <div className="font-calamity flex w-full flex-col items-center">
      <div className="flex items-center gap-3 pb-3 pt-5 text-center">
        <h2 className="text-lg font-bold text-gray-200">{pokemon.nameKey}</h2>
        <p className="font-pkmnem pkmnem-font-shadow pt-1 text-gray-300">
          #{pokemon.dexId}
        </p>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-col pr-5">
          <PokemonSprite
            nameKey={pokemon.nameKey}
            spriteIndex={pokemon.speciesId}
            alt={pokemon.speciesName}
          />

          <div className="flex flex-row gap-1">
            {pokemon.types.map((typeId: number, index: number) => (
              <div key={index}>
                <TypeBadge typeId={typeId} screenWidth={"sm"} />
              </div>
            ))}
          </div>
        </div>
        <div className="needs-to-be-right flex-grow flex-col">
          <div className="flex w-full">
            <StatBars stats={pokemon.stats as StatArray} />
          </div>
          <div className="h-15">
            {hasForms(pokemon) && (
              <Suspense fallback={<LoadingSpinner />}>
                <FormeView />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <AbilityBox key={pokemon.speciesId} abilities={pokemon.abilities} />
        </Suspense>

        {/* <div className="w-full"><AbilityDescription /></div> */}

        <div className="py-3">
          <Suspense fallback={<LoadingSpinner />}>
            <EvolutionView speciesId={pokemon.speciesId} />
          </Suspense>
        </div>

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
