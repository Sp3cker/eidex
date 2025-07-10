import { memo, useCallback, useMemo, useState } from "react";
import type { PartyMon as PartyMonType } from "@/data/map/trainers";
import { pokemonDataMap } from "@/data/pokemon";
import { getPokemonMoveIdsAtLevel, getMoveDetails } from "@/utils/movesByLevel";
import { calculateStats } from "@/utils/calcStatsByLevel";
import caps from "@/data/caps.json";
import { getItemSpriteStyle } from "@/utils/itemSprites";
import { Items } from "@/data/map";
import { getAbility } from "@/utils/abilityData";

interface CapLevel {
  desc: string;
  cap: number;
}

interface PartyMonProps {
  pokemon: PartyMonType;
}
const StatLevels = ["HP", "Atk", "Def", "SpA", "SpD", "Spd"] as const;
const HeldItemIcon = ({ heldItem }: { heldItem: string }) => {
  const spriteStyle = getItemSpriteStyle(heldItem, 24); // Changed from 64 to 32
  const itemName = Items.get(heldItem);
  return spriteStyle ? (
    <div className="flex size-max flex-row items-center px-1 ring-1 ring-stone-300">
      <img
        src="/spritesheet-items-16.webp"
        className="shrink-0"
        style={spriteStyle}
      />
      <p>{itemName?.name}</p>
    </div>
  ) : (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
      ?
    </div>
  );
};

const AbilityDesc = ({ ability }: { ability: number[] }) => {
  const abilityNames = ability.map(getAbility);

  if (abilityNames.length === 0) {
    return <div className="text-red-500">Unknown Ability</div>;
  }
  return abilityNames.map((a) =>
    a ? <div key={a?.name}>{a.name}</div> : null,
  );
};

const PartyMon = memo(function PartyMon({ pokemon }: PartyMonProps) {
  const [currLevelCap, setCurrentLevelCap] = useState(
    pokemon.lvl > 199 ? 50 : pokemon.lvl,
  );
  const pokemonInfo = pokemonDataMap.get(pokemon.id.toString());
  const speciesName = pokemonInfo?.nameKey || "Unknown";
  const moves = useMemo(
    () => getPokemonMoveIdsAtLevel(pokemon.id, pokemon.lvl),
    [pokemon.id, pokemon.lvl],
  );
  const levelIsLevelCap = pokemon.lvl > 199;
  const moveDetails = getMoveDetails(moves);
  const isDefinedPokemon = pokemon.item || pokemon.ability || pokemon.nature;
  const stats = useMemo(() => {
    return calculateStats(
      pokemon.id,
      currLevelCap,
      pokemon.iv ? true : false,
      pokemon.ev,
      pokemon.nature || "",
    );
  }, [pokemon.id, currLevelCap, pokemon.iv, pokemon.ev, pokemon.nature]);
  const handleCapChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCurrentLevelCap(Number(e.target.value));
    },
    [],
  );
  return (
    <div className="flex flex-col gap-y-1 rounded-lg bg-neutral-50 drop-shadow-sm md:px-3">
      <div className="flex flex-row items-center justify-start gap-x-2 rounded bg-stone-200">
        <div className="md:h-13 md:w-13 relative ml-1 h-10 w-9 overflow-hidden">
          <img
            className="pokemon-sprite sprite-animation md:size-22 aspect-square size-20 object-contain drop-shadow-md"
            src={`/icon/${pokemon.id}/icon.webp`}
          />
        </div>
        <div className="pb-0 pt-1 md:pt-2">
          <h4 className="font-calamity mb-0 text-xs font-bold text-gray-800 md:text-base">
            {speciesName}
          </h4>

          {levelIsLevelCap ? (
            <label
              htmlFor="level-cap-select"
              className="font-calamity mt-0 text-xs text-gray-600 md:text-sm"
            >
              Level Cap:
            </label>
          ) : (
            <span className="text-lg/1 pkmn-types text-gray-600">
              Lv. {levelIsLevelCap ? "Scaling" : pokemon.lvl}
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
      {/** Ability - Item - Nature */}
      <div className="max-w-120 flex flex-row items-center gap-x-1 text-neutral-800 md:justify-evenly">
        {stats?.map((stat, index) => (
          <div
            className="border-1 md:w-15 flex w-10 flex-col items-center justify-evenly rounded-md border-gray-400 bg-stone-100 p-1"
            key={index}
          >
            <span className="font-calamity text-[0.5rem] font-bold text-neutral-600">
              {StatLevels[index]}
            </span>
            <span className="pkmn-types font-calamity text-xs tracking-tight">
              {stat}
            </span>
          </div>
        ))}
      </div>
      {isDefinedPokemon && (
        <div className="flex flex-row items-center justify-between gap-x-2 rounded bg-zinc-100 p-1">
          {pokemon.ability && <AbilityDesc ability={pokemon.ability} />}
          {pokemon.item && <HeldItemIcon heldItem={pokemon.item} />}
        </div>
      )}

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
