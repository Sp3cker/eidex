import { memo, useDeferredValue, useCallback } from "react";
import TrainerInfo from "./TrainerInfo";
import useMapStore from "@/stores/useMapStore";
import PartyMons from "./PartyMons";

const rainbowNames = ["Spencer", "iriv24"];
// Trainer party is "normalized" in TrainerList.
// Here down is pretty much just display logic.
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
  const isRainbowName = rainbowNames.includes(trainer.trainerName);

  return (
    <div
      className={`font-calamity transition-colors ${isRainbowName ? "rainbow-bg" : ""} h-full w-[115%] pt-2 sm:w-[115%] md:p-3`}
    >
      <button
        onClick={handleClose}
        className="font-pkmnem -right-15 absolute top-2 hidden cursor-pointer rounded bg-gray-200 p-2 py-1 hover:bg-gray-300 focus:outline-none sm:block"
      >
        <p className="text-xl font-bold">↙</p>
      </button>
      <div className="min-h-40 p-1 pl-2 md:p-3">
        <TrainerInfo
          aiFlags={trainer.aiFlags}
          trainerName={trainer.trainerName}
          battlePic={trainer.battlePic}
        />
      </div>

      <div className="font-pkmnem space-y-4 overflow-y-auto text-lg">
        <PartyMons party={trainer.party} />
      </div>
    </div>
  );
});

export default TrainerBattleInfo;
