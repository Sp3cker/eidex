import { memo, useDeferredValue } from "react";
import { PartyMon } from "@/data/map/trainers";

import { pokemonDataMap } from "@/data/pokemon";
import TrainerInfo from "./TrainerInfo";
import useMapStore from "@/stores/useMapStore";
// import { getMoveData } from "@/utils/moveData";
// import useMapStore from "@/stores/useMapStore";

// interface TrainerBattleInfoProps {
//   trainer: DisplayTrainer | null;
// }
// grid grid-flow-col grid-rows-2 gap-1

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
      <div className="p-2">
        <TrainerInfo trainer={trainer} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="font-pkmnem space-y-4 text-lg">
          <div className="rounded-lg p-3">
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

const PokemonCard = memo(function PokemonCard({ pokemon }: PokemonCardProps) {
  const speciesName = pokemonDataMap[pokemon.id].nameKey;

  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-3 drop-shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="pokemon-sprite">
          {/* <img
            src={`/sprites/front/${pokemon.species.toLowerCase().replace("species_", "")}.webp`}
            alt={speciesName}
            className="rendering-crisp-edges h-12 w-12"
            onError={(e) => {
              // Fallback if sprite doesn't exist
              e.currentTarget.src = "/sprites/front/missingno.png";
            }}
          /> */}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-gray-800">{speciesName}</h4>
            <span className="text-sm text-gray-600">Lv. {pokemon.lvl}</span>
          </div>
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
          {pokemon.moves && pokemon.moves.length > 0 && (
            <div className="text-base text-neutral-700">
              <span className="font-medium">Moves:</span>{" "}
              {/* {pokemon.moves.map(getMoveData)[0]?.name} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default TrainerBattleInfo;
