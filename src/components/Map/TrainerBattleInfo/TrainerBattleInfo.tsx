import { memo } from "react";
import { DisplayTrainer } from "@/data/map/trainers";
import { formatSpeciesString } from "@/utils/formatMapString";
import { aiFlags } from "./aiFlags";
// import { getMoveData } from "@/utils/moveData";
// import useMapStore from "@/stores/useMapStore";

interface TrainerBattleInfoProps {
  trainer: DisplayTrainer;
}
// grid grid-flow-col grid-rows-2 gap-1
const AIFlags = ({ flags }: { flags: (keyof typeof aiFlags)[] }) => {
  if (flags.length === 0) {
    return "None";
  }
  return (
    <div className="font-calamity pl-29 h-20 text-xs/4 text-gray-600">
      {flags.map((flag, index) => (
        <p
          className="py-0.25 rounded bg-gray-200 pl-1 text-gray-700"
          key={index}
        >
          {aiFlags[flag]}
        </p>
      ))}
    </div>
  );
};
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
    <div className="font-calamity flex h-full flex-col rounded rounded-l-lg">
      {/* Header */}
      <h5 className="text-center">UNDER CONSTRUCTION!!!!!</h5>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-4">
          <div className="max-h-60 max-w-60">
            <img
              src={`/trainers/${trainer.battlePic}`}
              alt={trainer.trainerName}
              className="h-31 w-30 absolute left-0 top-6 z-0 drop-shadow-md"
              style={{
                imageRendering: "pixelated",
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
              }}
            />
          </div>
          <hgroup className="flex flex-row justify-between overflow-hidden pl-24">
            <div>
              <h3 className="font-calamity text-xl font-bold text-gray-800">
                {trainer.trainerName}
              </h3>
            </div>
            <span className="flex flex-row pt-1">
              {trainer.boss && (
                <p className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">
                  Boss Fight
                </p>
              )}
              {trainer.rematch && (
                <p className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">
                  Rematchable
                </p>
              )}
              {/* <p className="text-sm text-gray-600">Level {trainer.level}</p> */}
            </span>
          </hgroup>
        </div>
      </div>

      {/* Battle Info */}
      <div className="flex-1 overflow-y-auto">
        <div className="font-pkmnem space-y-4 text-lg">
          {/* Battle Details */}

          <AIFlags flags={trainer.aiFlags as (keyof typeof aiFlags)[]} />

          {/* Pokemon Party */}
          <div className="rounded-lg p-3">
            {/* <h3 className="font-calamity mb-3 text-lg font-bold text-gray-800">
              {isRivalTrainer ? "Pokemon Teams" : "Pokemon Party"}
            </h3> */}
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
