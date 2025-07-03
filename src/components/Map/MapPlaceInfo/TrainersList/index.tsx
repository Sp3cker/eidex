import { memo } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { shallow } from "zustand/shallow";

import { useTrainersData } from "./useTrainersData";
import type { Trainer } from "@/data/map/trainers";

// Component to render individual trainer item
const TrainerItem = memo(function TrainerItem({
  trainer,
}: {
  trainer: Trainer;
}) {
  return (
    <div className="white-box w-full rounded-lg border p-3 text-left transition-colors hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Trainer icon */}
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
            ⚔️
          </div> */}

          {/* Trainer info */}
          <div>
            <h3 className="text-lg font-bold leading-tight">
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

const TrainersList = memo(function TrainersList() {
  const { trainers, isLoading, error, selectedMap } = useTrainersData();

  return (
    <nav className="rounded rounded-l-lg bg-gradient-to-br from-orange-50 via-white to-red-100 shadow-2xl">
      <div className="sticky top-0 z-10 flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full flex-row items-start justify-between pr-1">
          <div className="flex-1">
            <div className="flex flex-col items-start justify-between pb-1">
              <p className="font-pkmnem text-md text-neutral-500">
                {selectedMap
                  ? `${trainers.length} trainers`
                  : "No location selected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full overflow-y-auto pb-20">
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
            ) : trainers.length === 0 ? (
              <div className="white-box w-full rounded-lg border p-3 text-center text-gray-500">
                <p>No trainers found in this location</p>
              </div>
            ) : (
              trainers.map((trainer) => (
                <TrainerItem key={trainer.id} trainer={trainer} />
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default TrainersList;
