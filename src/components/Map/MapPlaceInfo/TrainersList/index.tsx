import { memo } from "react";
import { DisplayTrainer, useTrainersData } from "./useTrainersData";
import { useSpring, animated } from "@react-spring/web";
import useMapStore from "@/stores/useMapStore";
import TrainerBattleInfo from "../TrainerBattleInfo";

// Component to render individual trainer item
const TrainerItem = memo(function TrainerItem({
  trainer,
}: {
  trainer: DisplayTrainer;
}) {
  const setSelectedTrainer = useMapStore((state) => state.setSelectedTrainer);

  const handleClick = () => {
    setSelectedTrainer(trainer);
  };

  return (
    <div
      className={`white-box w-full cursor-pointer rounded-lg border ${trainer.rematch ? "border-red-500" : "border-gray-600"} text-left transition-colors hover:bg-gray-50`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="trainer-sprite">
            <img src={`/trainers/48/${trainer.sprite}`} />
          </div>
          <div>
            <h3 className="font-calamity text-sm font-bold leading-tight text-neutral-700">
              {trainer.trainerName}
            </h3>
            {/* <p className="text-sm text-gray-600">{trainer.}</p> */}
          </div>
        </div>

        {/* Battle indicator */}
        <div className="text-red-500">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
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
            <TrainerItem key={trainer.script} trainer={trainer} />
          ))}
      </div>
    </section>
  );
};

const TrainersList = memo(function TrainersList() {
  const isTrainersListOpen = useMapStore((state) => state.isTrainersListOpen);
  const selectedTrainer = useMapStore((state) => state.selectedTrainer);
  const setAnimating = useMapStore((state) => state.setAnimating);
  const { trainers, isLoading, error, selectedMap } = useTrainersData();

  // Spring animation for sliding between list and trainer info
  const slideSpring = useSpring({
    transform: selectedTrainer ? "translateX(-100%)" : "translateX(0%)",
    config: { tension: 280, friction: 25 },
    onStart: () => {
      setAnimating(true);
    },
    onRest: () => {
      setAnimating(false);
    },
  });

  const trainerInfoSpring = useSpring({
    transform: selectedTrainer ? "translate3d(0%, 0%, 0)" : "translate3d(220%, 0%, 0)",
    config: { tension: 280, friction: 25 },
  });

  const numTrainers = Object.keys(trainers);

  return (
    <nav className="flex h-full flex-col overflow-hidden rounded rounded-l-lg bg-gradient-to-br from-orange-50 via-white to-red-100 shadow-2xl">
      <div className="relative flex-1">
        {/* Trainers List View */}
        <animated.div
          style={slideSpring}
          className="absolute inset-0 flex flex-col"
        >
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="font-pkmnem flex flex-col gap-2 md:gap-1">
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
                    <TrainersOnLevelList
                      key={level}
                      levelLabel={level}
                      trainers={trainers[level]}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </animated.div>

        {/* Trainer Battle Info View */}
        <animated.div
          style={trainerInfoSpring}
          className="absolute inset-0 flex flex-col"
        >
          {selectedTrainer && <TrainerBattleInfo trainer={selectedTrainer} />}
        </animated.div>
      </div>
    </nav>
  );
});

export default TrainersList;
