import { useEffect } from "react";
import { useMapStore } from "./useMapStore";
import { getTrainersForMap } from "@/data/map/trainers";

/**
 * Hook to handle URL-based trainer selection
 * This should be used in a component that mounts when the app loads
 */
export const useURLTrainerSync = () => {
  const { setSelectedMap, setTrainersListOpen, setSelectedTrainer } = useMapStore();

  useEffect(() => {
    const handleURLChange = async () => {
      const path = window.location.pathname;
      const mapMatch = path.match(/^\/map\/([^/]+)$/);
      const trainerMatch = path.match(/^\/map\/([^/]+)\/([^/]+)$/);
      
      if (trainerMatch) {
        const [, mapName, trainerName] = trainerMatch;
        
        try {
          // Set map first
          setSelectedMap(mapName);
          setTrainersListOpen(true);
          
          // Load trainers and find the specific one
          const trainers = await getTrainersForMap(mapName);
          const decodedTrainerName = decodeURIComponent(trainerName);
          
          // Handle rival trainers specially
          const foundTrainer = trainers.find(
            (trainer) => trainer.trainerName === decodedTrainerName
          );
          
          if (foundTrainer) {
            setSelectedTrainer(foundTrainer);
          } else {
            console.warn(`Trainer "${decodedTrainerName}" not found in ${mapName}`);
          }
        } catch (error) {
          console.error("Error loading trainer from URL:", error);
        }
      } else if (mapMatch) {
        setSelectedMap(mapMatch[1]);
      }
    };

    // Handle initial page load
    handleURLChange();

    // Handle browser back/forward
    const handlePopState = () => {
      handleURLChange();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setSelectedMap, setTrainersListOpen, setSelectedTrainer]);
};
