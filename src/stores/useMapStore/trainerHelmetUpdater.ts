import { DisplayTrainer } from "@/components/Map/MapPlaceInfo/TrainersList/useTrainersData";

export const updateTrainerHelmet = (
  selectedTrainer: DisplayTrainer | null, 
  mapName?: string
) => {
  if (!selectedTrainer) {
    // Reset to default when no trainer is selected
    return;
  }

  const trainerTitle = `${selectedTrainer.trainerName} - ${mapName || 'Map'} Trainer Battle`;
  
  // Handle both regular trainers and rival trainers
  const partyCount = 'party' in selectedTrainer 
    ? selectedTrainer.party.length 
    : Object.keys(selectedTrainer.parties).length;
  
  const trainerDescription = `Battle against ${selectedTrainer.trainerName} with ${partyCount} Pokémon. ${selectedTrainer.rematch ? 'Rematch battle available.' : ''}`;

  // Update document head directly
  document.title = trainerTitle;
  
  // Update existing meta tags or create them if they don't exist
  const updateMetaTag = (property: string, content: string, isProperty = false) => {
    const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (isProperty) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Update all relevant meta tags
  updateMetaTag('description', trainerDescription);
  updateMetaTag('og:title', trainerTitle, true);
  updateMetaTag('og:description', trainerDescription, true);
  updateMetaTag('twitter:title', trainerTitle);
  updateMetaTag('twitter:description', trainerDescription);
};
