import { memo, useMemo } from "react";
import type { PartyMon as PartyMonType } from "@/data/map/trainers";
import { pokemonDataMap } from "@/data/pokemon";
import { getPokemonMoveIdsAtLevel, getMoveDetails } from "@/utils/movesByLevel";
import { calculateStats } from "@/utils/calcStatsByLevel";
interface PartyMonProps {
  pokemon: PartyMonType;
}
const StatLevels = ["HP", "Atk", "Def", "SpAtk", "SpDef", "Speed"] as const;

const PartyMon = memo(function PartyMon({ pokemon }: PartyMonProps) {
  const pokemonInfo = pokemonDataMap.get(pokemon.id.toString());
  const speciesName = pokemonInfo?.nameKey || "Unknown";
  const moves = useMemo(
    () => getPokemonMoveIdsAtLevel(pokemon.id, pokemon.lvl),
    [pokemon.id, pokemon.lvl],
  );
  const levelIsLevelCap = pokemon.lvl > 199;
  const moveDetails = getMoveDetails(moves);
  const stats = calculateStats(
    pokemon.id,
    pokemon.lvl,
    pokemon.iv ? true : false,
    pokemon.ev,
    pokemon.nature || "",
  );

  return (
    <div className="flex flex-col rounded-lg bg-neutral-50 p-3 drop-shadow-sm">
      <div className="flex flex-row items-center justify-center">
        <div className="icon-sprite-box mb-1">
          <img
            className="pokemon-icon-sprite"
            src={`/icon/${pokemon.id}/icon.webp`}
          />
        </div>
        <h4 className="text-xl font-bold text-gray-800">{speciesName}</h4>
        {"\u00A0"}
        <span className="text-base/2 text-gray-600">
          Lv. {levelIsLevelCap ? "Scaling" : pokemon.lvl}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between text-sm text-gray-700">
        {stats?.map((stat, index) => (
          <div
            className="flex flex-col items-center justify-between"
            key={index}
          >
            <span className="capitalize">{stat}</span>
            <span className="font-medium">{StatLevels[index]}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="text-xs text-gray-500">
            {pokemon.nature && (
              <span className="mr-3">
                Nature: <span className="font-medium">{pokemon.nature}</span>
              </span>
            )}
            {pokemon.ability && (
              <span className="mr-3">
                Ability: <span className="font-medium">{pokemon.ability}</span>
              </span>
            )}
            {pokemon.heldItem && (
              <span>
                Item: <span className="font-medium">{pokemon.heldItem}</span>
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-col space-y-1">
            {moveDetails.map((m) => (
              <div key={m.name}>
                <h3 className="font-calamity text-sm/6 font-bold">{m.name}</h3>
                <div className="flex min-h-[3rem] flex-row overflow-x-hidden">
                  <div className="min-h-[3rem] w-10 md:w-20">
                    <p className="text-base/1 py-1">Power</p>
                    <p>{m.power}</p>
                  </div>
                  <div className="w-50 min-h-[2.5rem]">
                    <p className="leading-4">{m.description}</p>
                  </div>
                  <p
                    className={`w-8 text-center ${m.typeColors} text-md/1 font-pkmnem pkmnem-face-shadow h-5 font-bold`}
                  >
                    {m.typeName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default PartyMon;
