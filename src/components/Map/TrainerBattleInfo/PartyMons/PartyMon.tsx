import { memo, useCallback, useMemo, useState } from "react";
import type { TrainerPartyMon } from "@/data/map/trainers";
import { pokemonDataMap } from "@/data/pokemon";
import SmallTypeBadge from "@/components/ui/SmallTypeBadge";
import { getPokemonMoveIdsAtLevel, getMoveDetails } from "@/utils/movesByLevel";
import { calculateStats } from "@/utils/calcStatsByLevel";
import caps from "@/data/caps.json";
import PartyMonItemAbility from "./PartyMonItemAbility";
import { getTypeCSSColors, getTypeNamesArr } from "@/utils/typeInfo";
interface CapLevel {
  desc: string;
  cap: number;
}

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
const StatLevels = ["HP", "Atk", "Def", "SpA", "SpD", "Spd"] as const;
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

  const [currLevelCap, setCurrentLevelCap] = useState(level > 199 ? 50 : level);

  const pokemonInfo = pokemonFormattedData(pokemon.id);

  const speciesName = pokemonInfo?.nameKey || "Unknown";

  const moves = useMemo(
    () => getPokemonMoveIdsAtLevel(pokemon.id, level, pokemon.moves),
    [pokemon.id, level],
  );

  const levelIsLevelCap = level > 199;
  const moveDetails = getMoveDetails(moves);

  const stats = useMemo(() => {
    return calculateStats(pokemon.id, currLevelCap, hasIvs, evs, nature);
  }, [pokemon.id, currLevelCap, hasIvs, evs, nature]);
  const handleCapChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCurrentLevelCap(Number(e.target.value));
    },
    [],
  );
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

            {levelIsLevelCap ? (
              <label
                htmlFor="level-cap-select"
                className="font-calamity text-xs/2 mt-0 text-gray-600 md:text-sm"
              >
                Level Cap:
              </label>
            ) : (
              <span className="text-lg/1 pkmn-types text-gray-600">
                Lv. {levelIsLevelCap ? "Scaling" : level}
              </span>
            )}
          </div>
          <div>
            {levelIsLevelCap && (
              <>
                <select
                  id="level-cap-select"
                  value={currLevelCap}
                  onChange={handleCapChange}
                  className="border-1 rounded px-2 py-1 text-xl ring-1 ring-neutral-500 hover:border-slate-400 focus:border-slate-400"
                >
                  {caps.map((cap: CapLevel, index: number) => (
                    <option key={index} value={cap.cap}>
                      Lv. {cap.cap}{" "}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-x-2 pr-2">
          <SmallTypeBadge
            typeObjects={pokemonInfo.typeObjects}
            className="md:min-w-15 w-13 h-5 whitespace-nowrap px-1 text-base/5 md:h-6 md:text-xl/6"
          />
        </div>
      </div>
      <PartyMonItemAbility heldItem={pokemon.item} ability={pokemon.ability} />
      {/** Ability - Item - Nature */}
      <div className="max-w-120 flex flex-row items-center gap-x-1 pt-1 text-neutral-800 md:justify-evenly">
        {stats &&
          stats[0].map((stat, index) => (
            <div
              className={`${stats[1] === index ? "border-1 border-green-500 bg-green-500/15" : stats[2] === index ? "border-1 border-red-500 bg-red-500/15" : "border-1 border-gray-400 bg-stone-100"} md:w-15 flex w-10 flex-col items-center justify-evenly rounded-md p-1`}
              key={index}
            >
              <p className="font-calamity text-[8px]/3 font-bold text-neutral-600">
                {StatLevels[index]}
              </p>
              <p className="pkmn-types font-calamity text-xs/4 tracking-tight">
                {stat}
              </p>
            </div>
          ))}
      </div>

      <div className="flex items-center space-x-1 md:px-3">
        <div className="mt-2 flex flex-col space-y-0">
          {moveDetails.map((m) => (
            <div key={m.name}>
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
