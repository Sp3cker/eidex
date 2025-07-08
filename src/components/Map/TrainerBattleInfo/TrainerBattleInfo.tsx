import { memo, useDeferredValue } from "react";
import PartyMon from "./PartyMon";

import TrainerInfo from "./TrainerInfo";
import useMapStore from "@/stores/useMapStore";

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
      <div className="p-1 pl-2 md:p-3">
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
                        <PartyMon key={index} pokemon={pokemon} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Regular trainer party
              <div className="grid gap-2">
                {trainer.party.map((pokemon, index) => (
                  <PartyMon key={index} pokemon={pokemon} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default TrainerBattleInfo;
