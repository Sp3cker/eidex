import { memo } from "react";
import { DisplayTrainer } from "@/data/map/trainers";
import { formatSpeciesString } from "@/utils/formatMapString";

// import useMapStore from "@/stores/useMapStore";

interface TrainerBattleInfoProps {
  trainer: DisplayTrainer;
}

const TrainerBattleInfo = memo(function TrainerBattleInfo({
  trainer,
}: TrainerBattleInfoProps) {
  console.log(trainer);
  if (!trainer) {
    return null; // Handle case where trainer is not provided
  }
  // Check if this is a rival trainer with multiple parties
  const isRivalTrainer = "parties" in trainer;
  return (
    <div className="flex h-full flex-col rounded rounded-l-lg">
      {/* Header */}
      <div
        className={`${isRivalTrainer && "via-orange bg-gradient-to-br from-orange-50 to-orange-300"} flex items-center justify-between border-b border-gray-200 p-2`}
      >
        <div className="flex items-center space-x-4">
          <div className="max-h-60 max-w-60">
            <img
              src={`/trainers/${trainer.battlePic}`}
              alt={trainer.trainerName}
              className="h-30 w-30 absolute right-0 top-0 z-0 drop-shadow-md"
              style={{
                imageRendering: "pixelated",
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-center space-x-1">
            <h2 className="font-calamity text-xl font-bold text-gray-800">
              {trainer.trainerName}
            </h2>
            {trainer.boss && (
              <p className="font-pkmnem mt-1 inline-block rounded bg-amber-100 px-2 py-0 text-base font-bold text-amber-800">
                Boss Fight
              </p>
            )}
            {/* <p className="text-sm text-gray-600">Level {trainer.level}</p> */}
          </div>
        </div>
      </div>

      {/* Battle Info */}
      <div className="flex-1 overflow-y-auto">
        {trainer.rematch && (
          <p className="inline-block rounded bg-amber-100 px-2 py-1 text-xs font-medium text-red-800">
            Rematch
          </p>
        )}

        <div className="font-pkmnem space-y-4 text-lg">
          {/* Battle Details */}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-lg font-medium text-gray-600">
                Double:{"\u00A0"}
              </span>
              <span className="font-bold text-gray-800">
                {trainer.doubleBattle ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">AI Flags:</span>
              <span className="ml-2 text-gray-800">
                {trainer.aiFlags.length > 0
                  ? trainer.aiFlags.join(", ")
                  : "None"}
              </span>
            </div>
          </div>

          {/* Pokemon Party */}
          <div className="white-box rounded-lg border p-3">
            <h3 className="font-calamity mb-3 text-lg font-bold text-gray-800">
              {isRivalTrainer ? "Pokemon Teams" : "Pokemon Party"}
            </h3>

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
  pokemon: {
    lvl: number;
    species: string;
    nature?: string;
    ability?: string;
    heldItem?: string;
    moves?: string[];
  };
}

const PokemonCard = memo(function PokemonCard({ pokemon }: PokemonCardProps) {
  const speciesName = formatSpeciesString(pokemon.species);

  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="pokemon-sprite">
          <img
            src={`/sprites/front/${pokemon.species.toLowerCase().replace("species_", "")}.png`}
            alt={speciesName}
            className="rendering-crisp-edges h-12 w-12"
            onError={(e) => {
              // Fallback if sprite doesn't exist
              e.currentTarget.src = "/sprites/front/missingno.png";
            }}
          />
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
            <div className="mt-1 text-xs text-gray-500">
              <span className="font-medium">Moves:</span>{" "}
              {pokemon.moves.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default TrainerBattleInfo;
