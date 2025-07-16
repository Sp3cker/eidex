import { memo, startTransition, Suspense } from "react";
import { useTrainersData } from "./useTrainersData";
import useMapStore from "@/stores/useMapStore";
import { DisplayTrainer } from "@/data/map/trainers";
// import TrainerBattleInfo from "../../TrainerBattleInfo";

// Component to render individual trainer item
const TrainerItem = memo(function TrainerItem({
  trainer,
}: {
  trainer: DisplayTrainer;
}) {
  const setSelectedTrainer = useMapStore((state) => state.setSelectedTrainer);
  const handleClick = () => {
    startTransition(() => {
      setSelectedTrainer(trainer);
    });
  };

  return (
    <div
      className={`white-box w-full cursor-pointer rounded-sm border md:rounded-lg ${trainer.rematch ? "border-red-500" : "border-gray-600"} text-left transition-colors hover:bg-gray-50`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-0">
          <div className="pixelated -mt-2 mb-1 size-8 overflow-hidden drop-shadow-md">
            <img
              className="object-cover"
              src={`/trainers/48/${trainer.sprite}`}
            />
          </div>
          <div>
            <h3 className="font-calamity text-xs font-bold leading-tight text-neutral-700 md:text-sm">
              {trainer.trainerName}
            </h3>
          </div>
        </div>

        {/* Battle indicator */}
        {trainer.hard && (
          <div className="pr-5 text-xs font-medium text-amber-800 dark:text-blue-300">
            <h1 className="text-2xl font-bold">Ω</h1>
          </div>
        )}
      </div>
    </div>
  );
});
const TrainersOnLevelList = ({
  levelLabel,
  trainers,
}: {
  trainers: DisplayTrainer[];
  levelLabel: string;
}) => {
  return (
    <section>
      <h3 className="cool-font md:text-md py-2 pb-1 text-xs/4 font-bold tracking-tight text-stone-800">
        {levelLabel}
      </h3>
      <div className="h-full space-y-2">
        {trainers.length > 0 &&
          trainers.map((trainer) => (
            <TrainerItem
              key={trainer.trainerName + trainer.script}
              trainer={trainer}
            />
          ))}
      </div>
    </section>
  );
};

const TrainersList = memo(function TrainersList() {
  const isTrainersListOpen = useMapStore((state) => state.isTrainersListOpen);
  // const selectedTrainer = useMapStore((state) => state.selectedTrainer);
  // const setAnimating = useMapStore((state) => state.setAnimating);
  const { trainers, isLoading, error, selectedMap } = useTrainersData();

  // Spring animation for sliding between list and trainer info

  const numTrainers = Object.keys(trainers);

  return (
    <div className="map-place-info-textbox-gradient max-w-50 pointer-events-auto absolute bottom-0 right-0 top-0 w-[75%] overflow-y-auto rounded rounded-l-lg md:left-0 md:rounded-lg">
      <div className="font-pkmnem flex flex-1 flex-col gap-2 p-2 md:gap-1">
        {isLoading ? (
          <div className="white-box w-full rounded-lg border p-3 text-center text-gray-500">
            <p>Loading trainers...</p>
          </div>
        ) : error ? (
          <div className="white-box w-full rounded-lg border p-3 text-center text-red-500">
            <p>Error loading trainers: {error.message}</p>
          </div>
        ) : !selectedMap ? (
          <div className="white-box w-full rounded-lg border p-3 text-center text-gray-500">
            <p>Select a location to view trainers</p>
          </div>
        ) : numTrainers.length === 0 ? (
          <div className="white-box w-full rounded-lg border p-3 text-center text-gray-500">
            <p>No trainers found in this location</p>
          </div>
        ) : (
          isTrainersListOpen &&
          numTrainers.map((level) => (
            <Suspense key={level} fallback={<div>Loading...</div>}>
              <TrainersOnLevelList
                key={level}
                levelLabel={level}
                trainers={trainers[level]}
              />
            </Suspense>
          ))
        )}
      </div>
    </div>
  );
});

export default TrainersList;
