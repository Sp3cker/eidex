import { memo, useDeferredValue, lazy, Suspense } from "react";
const PartyMon = lazy(() => import("./PartyMons/PartyMon"));

import TrainerInfo from "./TrainerInfo";
import useMapStore from "@/stores/useMapStore";
import PartyMons from "./PartyMons";

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
  if (trainer === null) {
    return null;
  }
  return (
    <div className="font-calamity flex h-full flex-col rounded rounded-l-lg p-1 pt-2 md:p-3">
      {/* Header */}

      <div className="min-h-40 p-1 pl-2 md:p-3">
        <TrainerInfo trainer={trainer} />
      </div>

      <div className="font-pkmnem flex-1 space-y-4 overflow-y-auto text-lg">
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
                    <Suspense
                      key={index}
                      fallback={
                        <div className="h-24 animate-pulse rounded bg-gray-200" />
                      }
                    >
                      <PartyMon pokemon={pokemon} />
                    </Suspense>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Regular trainer party

          <Suspense
            fallback={
              <div className="h-24 animate-pulse rounded bg-gray-200" />
            }
          >
            <PartyMons party={trainer.party} />
          </Suspense>
        )}
      </div>
    </div>
  );
});

export default TrainerBattleInfo;
