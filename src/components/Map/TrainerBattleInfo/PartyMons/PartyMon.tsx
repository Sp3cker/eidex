import { lazy, memo, Suspense, useMemo } from "react";
import type { TrainerPartyMon } from "@/data/map/trainers";
import { pokemonDataMap } from "@/data/pokemon";
import SmallTypeBadge from "@/components/ui/SmallTypeBadge";
import { getPokemonMoveIdsAtLevel, getMoveDetails } from "@/utils/movesByLevel";

const PartyMonsStats = lazy(() => import("./PartyMonsStats"));
const PartyMonItemAbility = lazy(() => import("./PartyMonItemAbility"));
import { makeTypeObjects } from "@/utils/typeInfo";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PartyMonsMoves from "./PartyMonsMoves";

interface PartyMonProps {
  pokemon: TrainerPartyMon;
}

const pokemonFormattedData = (id: number) => {
  const data = pokemonDataMap.get(id.toString());
  if (!data) {
    throw new Error(`Pokemon with ID ${id} not found in data map`);
  }
  return {
    ...data,
    typeObjects: makeTypeObjects(data.types),
  };
};
// Note: By here, the trainer mon has been givin a numeric ID.
const PartyMon = memo(function PartyMon({ pokemon }: PartyMonProps) {
  if (pokemon.id === 0) {
    return (
      <h4 className="font-pkmnem py-2 text-center text-md/3 font-bold text-[var(--color-misc-error)]">
        Error formatting this Party.
      </h4>
    );
  }
  // Provide sensible defaults for optional properties
  const level = pokemon.lvl ?? 1;
  const evs = pokemon.ev ?? [0, 0, 0, 0, 0, 0];
  const nature = pokemon.nature ?? "";
  const ivs =
    pokemon.ivs ?? (pokemon.iv ? [31, 31, 31, 31, 31, 31] : undefined);

  const pokemonInfo = pokemonFormattedData(pokemon.id);
  const abilities = pokemon.ability || pokemonInfo.abilities;
  const speciesName = pokemonInfo?.nameKey || "Unknown";

  const moves = useMemo(
    () =>
      getMoveDetails(
        getPokemonMoveIdsAtLevel(pokemon.id, level, pokemon.moves).filter(
          (m) => m !== 0,
        ),
        pokemon.hpType,
      ),
    [pokemon.id, level, pokemon.moves, pokemon.hpType],
  );

  const levelIsLevelCap = level > 199;

  return (
    <div className="flex flex-col gap-y-1 bg-neutral-50 pl-1 drop-shadow-sm">
      <section className="flex cursor-grab flex-row items-center justify-between gap-x-2 rounded bg-stone-100">
        <div className="flex items-center gap-x-2">
          <div className="md:h-13 md:w-13 relative ml-1 overflow-hidden drop-shadow-md">
            <img
              className="aspect-square size-12 object-contain md:size-12"
              src={`/icon/${pokemon.id}/icon.webp`}
            />
          </div>
          <hgroup className="pb-0 pt-2 md:pt-2">
            <h4 className="font-calamity text-sm/2 mb-0 font-bold text-stone-800 sm:text-base">
              {speciesName}
            </h4>

            <p className="pkmn-types text-nowrap text-stone-700 sm:mb-2 sm:text-xl/4">
              {levelIsLevelCap
                ? `Party Lv. - ${(level - 200).toString()}`
                : `Lv. ${level} `}
            </p>
          </hgroup>
        </div>
        <div className="flex flex-row gap-x-2 pr-2">
          <SmallTypeBadge
            typeObjects={pokemonInfo.typeObjects}
            className="md:min-w-15 w-13 h-5 whitespace-nowrap px-1 text-base/5 md:h-6 md:text-xl/6"
          />
        </div>
      </section>
      <Suspense
        fallback={
          <div className="h-10">
            <LoadingSpinner />
          </div>
        }
      >
        <PartyMonItemAbility heldItem={pokemon.item} ability={abilities} />
      </Suspense>
      {/** Ability - Item - Nature */}
      <Suspense
        fallback={
          <div className="h-10">
            <LoadingSpinner />
          </div>
        }
      >
        <PartyMonsStats
          level={level}
          id={pokemon.id}
          ivs={ivs}
          evs={evs}
          nature={nature}
        />
      </Suspense>

      <div className="mt-2 flex flex-col space-y-0">
        <PartyMonsMoves moves={moves} />
      </div>
    </div>
  );
});

export default PartyMon;
