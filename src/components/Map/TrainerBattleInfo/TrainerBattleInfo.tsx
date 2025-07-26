import { memo, useDeferredValue, lazy, Suspense, useCallback } from "react";
const PartyMon = lazy(() => import("./PartyMons/PartyMon"));

import TrainerInfo from "./TrainerInfo";
import useMapStore from "@/stores/useMapStore";
import PartyMons from "./PartyMons";

const rainbowNames = ["Spencer", "iriv24"];

const TrainerBattleInfo = memo(function TrainerBattleInfo() {
  const trainer = useDeferredValue(
    useMapStore(
      (state) => state.selectedTrainer,
      (a, b) => a?.id === b?.id,
    ),
    null,
  );

  const closeTrainer = useMapStore((state) => state.setTrainersListOpen);

  const handleClose = useCallback(() => {
    closeTrainer(false);
  }, [closeTrainer]);

  if (!trainer) {
    return null;
  }
  // Check if this is a rival trainer with multiple parties
  const isRivalTrainer = "parties" in trainer;
  const isRainbowName = rainbowNames.includes(trainer.trainerName);

  return (
    <div
      className={`font-calamity transition-colors ${isRainbowName ? "rainbow-bg" : ""} flex h-full w-[118%] flex-col pt-2 md:p-3`}
    >
      <button
        onClick={handleClose}
        className="font-pkmnem absolute right-2 top-2 hidden cursor-pointer rounded bg-gray-200 p-2 py-1 hover:bg-gray-300 focus:outline-none sm:block"
      >
        <p className="text-xl font-bold">↙</p>
      </button>
      <div className="min-h-40  p-1 pl-2 md:p-3">
        <TrainerInfo
          aiFlags={trainer.aiFlags}
          trainerName={trainer.trainerName}
          battlePic={trainer.battlePic}
        />
        <div></div>
      </div>

      <div className="font-pkmnem space-y-4 overflow-y-auto text-lg">
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
