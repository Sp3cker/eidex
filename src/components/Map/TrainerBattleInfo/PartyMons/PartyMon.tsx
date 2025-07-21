import { lazy, memo, Suspense, useMemo } from "react";
import type { TrainerPartyMon } from "@/data/map/trainers";
import { pokemonDataMap } from "@/data/pokemon";
import SmallTypeBadge from "@/components/ui/SmallTypeBadge";
import { getPokemonMoveIdsAtLevel, getMoveDetails } from "@/utils/movesByLevel";

const PartyMonsStats = lazy(() => import("./PartyMonsStats"));
const PartyMonItemAbility = lazy(() => import("./PartyMonItemAbility"));
import { getTypeCSSColors, getTypeNamesArr } from "@/utils/typeInfo";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface PartyMonProps {
  pokemon: TrainerPartyMon;
}
const makeTypeObjects = (typeIds: number[]) => {
  // typeCssColors returns an array of css classes
  // getTypeNameArr returns an array of type names
  // I need to return an array of objects with css and name properties
  // There's a elegant way to do this where I call each function only once.
  // and not in a map function. Because each function takes an array.
  const typeCss = getTypeCSSColors(typeIds);
  const typeNames = getTypeNamesArr(typeIds);

  return typeIds.map((_, index) => {
    return {
      css: typeCss[index],
      name: typeNames[index],
    };
  });
};
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
const PartyMon = memo(function PartyMon({ pokemon }: PartyMonProps) {
  // Provide sensible defaults for optional properties
  const level = pokemon.lvl ?? 1;
  const evs = pokemon.ev ?? [0, 0, 0, 0, 0, 0];
  const nature = pokemon.nature ?? "";
  const hasIvs = pokemon.iv !== undefined;

  const pokemonInfo = pokemonFormattedData(pokemon.id);
  const abilities = pokemon.ability || pokemonInfo.abilities;
  const speciesName = pokemonInfo?.nameKey || "Unknown";

  const moves = useMemo(
    () =>
      getPokemonMoveIdsAtLevel(pokemon.id, level, pokemon.moves).filter(
        (m) => m !== 0,
      ),
    [pokemon.id, level],
  );

  const levelIsLevelCap = level > 199;
  const moveDetails = getMoveDetails(moves);

  return (
    <div className="drop-shadow-lgflex flex-col gap-y-1 rounded-lg bg-neutral-50 drop-shadow-sm">
      <div className="flex cursor-grab flex-row items-center justify-between gap-x-2 rounded bg-stone-100">
        <div className="flex items-center gap-x-2">
          <div className="md:h-13 md:w-13 relative ml-1 overflow-hidden drop-shadow-md">
            <img
              className="aspect-square size-12 object-contain md:size-12"
              src={`/icon/${pokemon.id}/icon.webp`}
            />
          </div>
          <div className="pb-0 pt-2 md:pt-2">
            <h4 className="font-calamity text-xs/2 mb-0 font-bold text-gray-800 md:text-base">
              {speciesName}
            </h4>

            <span className="sm:text-lg/1 pkmn-types text-nowrap text-gray-600">
              Lv.{" "}
              {levelIsLevelCap ? `Cap - ${(level - 200).toString()}` : level}{" "}
              {nature ? `(${nature})` : ""}
            </span>
          </div>
          <div></div>
        </div>
        <div className="flex flex-row gap-x-2 pr-2">
          <SmallTypeBadge
            typeObjects={pokemonInfo.typeObjects}
            className="md:min-w-15 w-13 h-5 whitespace-nowrap px-1 text-base/5 md:h-6 md:text-xl/6"
          />
        </div>
      </div>
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
      <div className="max-w-120 flex flex-row items-center gap-x-1 pt-1 text-neutral-800 md:justify-evenly">
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
            hasIvs={hasIvs}
            evs={evs}
            nature={nature}
          />
        </Suspense>
      </div>

      <div className="flex items-center space-x-1 md:px-3">
        <div className="mt-2 flex flex-col space-y-0">
          <p className="px-2 text-center font-bold leading-tight text-emerald-800 ring-1 ring-emerald-200">
            I'm verifying trainer movesets! They're mostly accurate!
          </p>

          {moveDetails.map((m) => (
            <div key={m.name} title={m.id.toString()}>
              <h3 className="font-calamity text-xs font-bold sm:text-sm/6">
                {m.name}
              </h3>
              <div className="flex min-h-[3rem] flex-row overflow-x-hidden">
                <div className="min-h-[3rem] w-10 md:w-20">
                  <p className="text-base/1 py-1">Power</p>
                  <p>{m.power}</p>
                </div>
                <div className="w-50 min-h-[2.5rem]">
                  <p className="leading-4">{m.description}</p>
                </div>
                <p
                  className={`w-8 text-center ${m.typeColors} font-pkmnem pkmnem-face-shadow h-4 text-sm/4 font-bold`}
                >
                  {m.typeName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PartyMon;
