import { useState, useEffect } from "react";
import { useMapStore } from "@/stores/useMapStore";
import {
  getTrainersForMap,
  getCachedTrainersForMap,
  type Trainer,
  type RivalTrainer,
  type DisplayTrainer,
} from "@/data/map/trainers";


function groupRivals(trainers: Trainer[]): DisplayTrainer[] {
  const result = trainers.reduce(
    (acc, trainer) => {
      if (trainer.youPicked) {
        // Build parties object for rival trainers
        acc.rivalParties[trainer.youPicked] = trainer.party;

        // Store the first rival as base for consolidation
        if (!acc.baseRival) {
          acc.baseRival = trainer;
        }
      } else {
        // Add regular trainers directly
        acc.regularTrainers.push(trainer);
      }
      return acc;
    },
    {
      regularTrainers: [] as DisplayTrainer[],
      rivalParties: {} as Record<"Treecko" | "Torchic" | "Mudkip", unknown[]>,
      baseRival: null as Trainer | null,
    },
  );

  // Return regular trainers with consolidated rival if any rivals were found
  return result.baseRival
    ? [
        ...result.regularTrainers,
        {
          ...result.baseRival,
          trainerName: "Rival",
          sprite: "may.webp",
          parties: result.rivalParties,
        } as RivalTrainer,
      ]
    : result.regularTrainers;
}

export const useTrainersData = () => {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const [trainers, setTrainers] = useState<Record<string, DisplayTrainer[]>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!selectedMap) {
      setTrainers({});
      return;
    }

    // Check if we have cached data first
    const cachedTrainers = getCachedTrainersForMap(selectedMap);
    if (cachedTrainers.length > 0) {
      console.time("start");
      setTrainers(groupTrainersByLevel(groupRivals(cachedTrainers)));
      console.timeEnd("start");
      return;
    }

    // Load trainers data
    setIsLoading(true);
    setError(null);

    getTrainersForMap(selectedMap)
      .then((mapTrainers) => {
        setTrainers(groupTrainersByLevel(groupRivals(mapTrainers)));
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        setTrainers({});
      });
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

      // Insert trainer in sorted position (Rival first, then alphabetical)
      if (trainer.trainerName === "Rival") {
        // Rival always goes first - find first non-Rival position
        const firstNonRivalIndex = groups[level].findIndex(
          (existing) => existing.trainerName !== "Rival",
        );
        if (firstNonRivalIndex === -1) {
          groups[level].push(trainer);
        } else {
          groups[level].splice(firstNonRivalIndex, 0, trainer);
        }
      } else {
        // For non-Rivals, find correct alphabetical position after any Rivals
        const insertIndex = groups[level].findIndex(
          (existing) =>
            existing.trainerName !== "Rival" &&
            existing.trainerName > trainer.trainerName,
        );

        if (insertIndex === -1) {
          groups[level].push(trainer);
        } else {
          groups[level].splice(insertIndex, 0, trainer);
        }
      }

      return groups;
    },
    {} as Record<string, DisplayTrainer[]>,
  );
}

/**
 * Groups trainers by level and sorts both the levels and trainers within each level
 * @param trainers - Array of trainers to group and sort
 * @param levelSortFn - Optional function to sort level keys (defaults to alphabetical)
 * @param trainerSortFn - Optional function to sort trainers within each level (defaults to alphabetical by name)
 * @returns Object with sorted level keys and sorted arrays of trainers as values
 */
function groupAndSortTrainersByLevel(
  trainers: DisplayTrainer[],
  levelSortFn?: (a: string, b: string) => number,
  trainerSortFn?: (a: DisplayTrainer, b: DisplayTrainer) => number,
): Record<string, DisplayTrainer[]> {
  const grouped = groupTrainersByLevel(trainers);

  // Sort trainers within each level
  const sortedGrouped = Object.fromEntries(
    Object.entries(grouped).map(([level, levelTrainers]) => [
      level,
      levelTrainers.sort(
        trainerSortFn || ((a, b) => a.trainerName.localeCompare(b.trainerName)),
      ),
    ]),
  );

  // Sort the level keys
  const sortedLevels = Object.keys(sortedGrouped).sort(levelSortFn);

  // Return object with sorted keys
  return Object.fromEntries(
    sortedLevels.map((level) => [level, sortedGrouped[level]]),
  );
}
