import { memo, useDeferredValue, useMemo } from "react";
import { PartyMon } from "@/data/map/trainers";

import { pokemonDataMap } from "@/data/pokemon";
import TrainerInfo from "./TrainerInfo";
import useMapStore from "@/stores/useMapStore";
import { getPokemonMoveIdsAtLevel, getMoveDetails } from "@/utils/movesByLevel";

// import useMapStore from "@/stores/useMapStore";

const TrainerBattleInfo = memo(function TrainerBattleInfo() {
  const trainer = useDeferredValue(
    useMapStore(
      (state) => state.selectedTrainer,
      (a, b) => a?.id === b?.id,
    ),
    null,
  );
  if (!trainer) {
    return null;
  }
  // Check if this is a rival trainer with multiple parties
  const isRivalTrainer = "parties" in trainer;
  return (
    <div className="font-calamity flex h-full flex-col rounded rounded-l-lg">
      {/* Header */}
      <h5 className="text-center">UNDER CONSTRUCTION!!!!!</h5>
      <div className="p-1 md:p-3 pl-2">
        <TrainerInfo trainer={trainer} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="font-pkmnem space-y-4 text-lg">
          <div className="rounded-lg p-1 md:p-3">
            {isRivalTrainer ? (
              // Rival trainer with multiple parties
              <div className="space-y-4">
                {Object.entries(trainer.parties).map(([starter, party]) => (
                  <div key={starter} className="rounded-lg border p-3">
                    <h4 className="mb-2 font-bold text-gray-700">
                      If you chose {starter}
                    </h4>
                    <div className="grid gap-2">
                      {party.map((pokemon, index) => (
                        <PokemonCard key={index} pokemon={pokemon} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Regular trainer party
              <div className="grid gap-2">
                {trainer.party.map((pokemon, index) => (
                  <PokemonCard key={index} pokemon={pokemon} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

interface PokemonCardProps {
  pokemon: PartyMon;
}
const PartyMonMoves = ({ ids }: { ids: number[] }) => {
  const moveDetails = getMoveDetails(ids);

  return (
    <div className="flex w-full flex-col space-y-1">
      {moveDetails.map((m) => (
        <div key={m.name}>
          <div>
            <h3 className="font-calamity text-sm/6 font-bold">{m.name}</h3>
          </div>

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
  );
};
const PokemonCard = memo(function PokemonCard({ pokemon }: PokemonCardProps) {
  const speciesName = pokemonDataMap[pokemon.id].nameKey;
  const moves = useMemo(() => {
    return getPokemonMoveIdsAtLevel(pokemon.id, pokemon.lvl);
  }, [pokemon.moves]);
  const levelIsLevelCap = pokemon.lvl > 199;
  return (
    <div className="flex flex-col rounded-lg bg-neutral-50 p-3 drop-shadow-sm">
      <div className="flex flex-row items-center justify-center">
        <div className="icon-sprite-box mb-1">
          <img
            className="pokemon-icon-sprite"
            src={`/icon/${pokemon.id}/icon.webp`}
            // alt={formatMapString(mon.species)}
          />
        </div>
        <h4 className="text-xl font-bold text-gray-800">{speciesName}</h4>
        {"\u00A0"}
        <span className="text-base/2 text-gray-600">
          Lv. {levelIsLevelCap ? "Scaling" : pokemon.lvl}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2"></div>
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
          <div className="flex flex-row justify-between leading-tight">
            <PartyMonMoves ids={moves} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default TrainerBattleInfo;
