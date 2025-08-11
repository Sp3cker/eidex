import mapsData from "./maps copy.json";

export type PlaceType = "route" | "city" | "town" | "dungeon" | "other";

// Create a lookup map for faster type determination
const mapTypeDict = new Map<string, PlaceType>();
mapsData.forEach((item) => {
  mapTypeDict.set(item.map, item.type as PlaceType);
});

/**
 * Determines the type of a place based on multiple methods
 */
export function getPlaceType(mapId: string): PlaceType {
  // First, check our data file
  const typeFromData = mapTypeDict.get(mapId);
  if (typeFromData) {
    return typeFromData;
  }

  // Fallback: determine type from the map ID pattern
  const cleanId = mapId.replace(/^MAP_/, "");

  // Routes
  if (cleanId.match(/^(ROUTE|UNDERWATER_ROUTE)\d+$/)) {
    return "route";
  }

  // Cities (typically end with _CITY)
  if (cleanId.includes("_CITY")) {
    return "city";
  }

  // Towns (typically end with _TOWN)
  if (cleanId.includes("_TOWN")) {
    return "town";
  }

  // Dungeons (caves, hideouts, special locations)
  const dungeonKeywords = [
    "CAVE", "CAVERN", "TUNNEL", "HIDEOUT", "TOWER", "PILLAR", 
    "RUINS", "TOMB", "SLAB", "WOODS", "PATH", "PASS", "FALLS",
    "PYRE", "VICTORY_ROAD", "SAFARI_ZONE", "MAUVILLE", "SHIP"
  ];
  
  if (dungeonKeywords.some(keyword => cleanId.includes(keyword))) {
    return "dungeon";
  }

  // Default to other
  return "other";
}

/**
 * Gets a display-friendly type name
 */
export function getPlaceTypeLabel(type: PlaceType): string {
  switch (type) {
    case "route": return "Routes";
    case "city": return "Cities";
    case "town": return "Towns";
    case "dungeon": return "Dungeons";
    case "other": return "Other";
    default: return "Unknown";
  }
}

/**
 * Gets an icon for the place type
 */
export function getPlaceTypeIcon(type: PlaceType): string {
  switch (type) {
    case "route": return "🛤️";
    case "city": return "🏙️";
    case "town": return "🏘️";
    case "dungeon": return "🕳️";
    case "other": return "📍";
    default: return "❓";
  }
}

/**
 * Sort places alphabetically
 */
export function sortPlacesAlphabetically<T extends { label: string }>(places: T[]): T[] {
  return [...places].sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Group places by type and sort within groups
 */
export function groupPlacesByType<T extends { id: string; label: string }>(places: T[]): { type: PlaceType; label: string; icon: string; places: T[] }[] {
  const groups = new Map<PlaceType, T[]>();

  // Group places by type
  places.forEach(place => {
    const type = getPlaceType(place.id);
    if (!groups.has(type)) {
      groups.set(type, []);
    }
    groups.get(type)!.push(place);
  });

  // Sort each group alphabetically and convert to array
  const typeOrder: PlaceType[] = ["city", "town", "route", "dungeon", "other"];
  
  return typeOrder
    .filter(type => groups.has(type))
    .map(type => ({
      type,
      label: getPlaceTypeLabel(type),
      icon: getPlaceTypeIcon(type),
      places: sortPlacesAlphabetically(groups.get(type)!)
    }));
}
