import { useState, useEffect } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { getTrainersForMap, getCachedTrainersForMap, type Trainer } from "@/data/map/trainers";

export const useTrainersData = () => {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!selectedMap) {
      setTrainers([]);
      return;
    }

    // Check if we have cached data first
    const cachedTrainers = getCachedTrainersForMap(selectedMap);
    if (cachedTrainers.length > 0) {
      setTrainers(cachedTrainers);
      return;
    }

    // Load trainers data
    setIsLoading(true);
    setError(null);

    getTrainersForMap(selectedMap)
      .then((mapTrainers) => {
        setTrainers(mapTrainers);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        setTrainers([]);
      });
  }, [selectedMap]);

  return {
    trainers,
    isLoading,
    error,
    selectedMap,
  };
};
