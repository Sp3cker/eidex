import { Pokemon, StatArray } from "../../types";
import CloseButton from "../CloseButton";
import EvolutionView from "../EvolutionView/EvolutionView";
import AbilityBox from "./AbilityBox";
import { getEvolutionaryFamily } from "@/utils/evoFamily";
import TabbedInterface from "./TabbedInterface";
import TypeMatchup from "./TypeMatchup";
import { buildPokemonMoveTabs } from "./Learnset/learnsetTabs";
import { TypeBadge } from "../TypeBadges/TypeBadge";
import StatBars from "./StatBars";
import { FormeView } from "../FormeView/FormeView";
import PokemonSprite from "./PokemonSprite";
import { getSpeciesData, hasForms } from "@/utils/speciesData";
import { useUIStore } from "@/stores/uiStore";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { useInView } from "@react-spring/web";

function PokemonView({ pokemon }: { pokemon: Pokemon }) {
  const setSelectedPokemon = useUIStore((state) => state.setSelectedPokemon);
  const isShiny = useUIStore((state) => state.isShiny);
  const screenWidth = useScreenWidth();
  const [tabsRef, tabsInView] = useInView();
  const evoFamily = getEvolutionaryFamily(pokemon.speciesId);
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
        <AbilityBox key={pokemon.speciesId} abilities={pokemon.abilities} />
        <div className="w-full">{/* <AbilityDescription /> */}</div>
        <div className="my-3">
          <EvolutionView
            pokemon={pokemon}
            family={evoFamily}
            onClickPokemon={handleSelectPokemon}
          />
        </div>
        {hasForms(pokemon) && (
          <div className="mb-3">
            <FormeView
              pokemon={pokemon}
              isShiny={isShiny}
              onClickPokemon={handleSelectPokemon}
            />
          </div>
        )}
        <div className="flex flex-wrap text-gray-100">
          <TypeMatchup pokemon={pokemon} />
        </div>
      </div>

      <div className="flex w-full flex-grow" ref={tabsRef}>
        {tabsInView && <TabbedInterface tabs={tabsData} />}
      </div>
    </div>
  );
}

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
        <span className="absolute right-3 flex flex-row items-center gap-1 self-center">
          <CloseButton onClick={closeModal} />
        </span>
        <PokemonView pokemon={selectedPokemon} />
      </div>
    </div>
  );
}

export default PokemonModal;
