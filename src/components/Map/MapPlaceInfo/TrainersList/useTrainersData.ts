import { useState, useEffect, useTransition, useCallback } from "react";
import { useMapStore } from "@/stores/useMapStore";
import {
  getTrainersForMap,
  getCachedTrainersForMap,
  DisplayTrainer,
} from "@/data/map/trainers";

export const useTrainersData = () => {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const [trainers, setTrainers] = useState<Record<string, DisplayTrainer[]>>(
    {},
  );
  const [isLoading, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);

  const handleLoadTrainers = useCallback(async (selectedMap: string) => {
    // Check if we have cached data first
    const cachedTrainers = getCachedTrainersForMap(selectedMap);
    if (cachedTrainers.length > 0) {
      setTrainers(groupTrainersByLevel(determineHardTrainers(cachedTrainers)));

      return;
    }

    // Load trainers data
    // setIsLoading(true);
    setError(null);

    startTransition(async () => {
      try {
        const mapTrainers = await getTrainersForMap(selectedMap);
        startTransition(() => {
          setTrainers(
            groupTrainersByLevel(determineHardTrainers(mapTrainers)),
          );
        });
      } catch (err) {
        setError(err as any);
        // setIsLoading(false);
        setTrainers({});
      }
    });
  }, []);
  useEffect(() => {
    if (!selectedMap) {
      setTrainers({});
      return;
    }

    handleLoadTrainers(selectedMap);
  }, [selectedMap]);

  // Group trainers by level using useMemo for performance
  // const groupedTrainers = useMemo(() => {
  //   return groupAndSortTrainersByLevel(trainers);
  // }, [trainers]);

  return {
    trainers,
    isLoading,
    error,
    selectedMap,
  };
};

/**
 * Groups an array of trainers by their level property and sorts them with Rival first
 * @param trainers - Array of trainers to group
 * @returns Object with level keys and arrays of trainers as values (Rival trainers first)
 */
export function groupTrainersByLevel(
  trainers: DisplayTrainer[],
): Record<string, DisplayTrainer[]> {
  return trainers.reduce(
    (groups, trainer) => {
      const level = trainer.level || "Unknown";
      if (!groups[level]) {
        groups[level] = [];
      }

      const insertIndex = groups[level].findIndex(
        (existing) =>
          existing.trainerName.localeCompare(trainer.trainerName) > 0,
      );

      if (insertIndex === -1) {
        groups[level].push(trainer);
      } else {
        groups[level].splice(insertIndex, 0, trainer);
      }

      return groups;
    },
    {} as Record<string, DisplayTrainer[]>,
  );
}

const determineHardTrainers = (
  trainers: DisplayTrainer[],
): DisplayTrainer[] => {
  const hardFlags = new Set([
    "OMNISCIENT",
    "ACE_POKEMON",
    "SMART_TRAINER",
    "SMARTISH_TRAINER",
  ]);

  return trainers.map((trainer) => {
    // Determine if the trainer is "hard" based on some criteria
    const hard =
      trainer.aiFlags && trainer.aiFlags.some((flag) => hardFlags.has(flag));

    return {
      ...trainer,
      hard,
    };
  });
};
// /**
//  * Groups trainers by level and sorts both the levels and trainers within each level
//  * @param trainers - Array of trainers to group and sort
//  * @param levelSortFn - Optional function to sort level keys (defaults to alphabetical)
//  * @param trainerSortFn - Optional function to sort trainers within each level (defaults to alphabetical by name)
//  * @returns Object with sorted level keys and sorted arrays of trainers as values
//  */
// function groupAndSortTrainersByLevel(
//   trainers: DisplayTrainer[],
//   levelSortFn?: (a: string, b: string) => number,
//   trainerSortFn?: (a: DisplayTrainer, b: DisplayTrainer) => number,
// ): Record<string, DisplayTrainer[]> {
//   const grouped = groupTrainersByLevel(trainers);

//   // Sort trainers within each level
//   const sortedGrouped = Object.fromEntries(
//     Object.entries(grouped).map(([level, levelTrainers]) => [
//       level,
//       levelTrainers.sort(
//         trainerSortFn || ((a, b) => a.trainerName.localeCompare(b.trainerName)),
//       ),
//     ]),
//   );

//   // Sort the level keys
//   const sortedLevels = Object.keys(sortedGrouped).sort(levelSortFn);

//   // Return object with sorted keys
//   return Object.fromEntries(
//     sortedLevels.map((level) => [level, sortedGrouped[level]]),
//   );
// }
