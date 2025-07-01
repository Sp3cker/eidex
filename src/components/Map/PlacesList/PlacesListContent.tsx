import { memo, useMemo } from "react";
import { groupPlacesByType, sortPlacesAlphabetically } from "./placeUtils";
import { formatMapString } from "@/utils/formatMapString";
import mapsvgs from "@/data/map/mapsvgs.json";
import { usePlacesListSortStore } from "@/stores/placesListSortStore";

interface Place {
  id: string;
  label: string;
  isCurrentLevel: boolean; // Whether this location is currently selected on the map
}
const getAllMapIds = () => {
  const mapIds = new Set<string>();

  mapsvgs.forEach((item: { id?: string }) => {
    if (item.id && typeof item.id === "string" && item.id.startsWith("MAP_")) {
      mapIds.add(item.id);
    }
  });

  return Array.from(mapIds).sort();
};

const PlaceItem = memo(
  function PlaceItem({
    place,
    onClick,
  }: {
    place: Place;
    onClick: (id: string) => void;
  }) {
    return (
      <div
        role="button"
        className={`white-box w-full cursor-pointer rounded-lg border p-3 text-left transition-colors ${
          place.isCurrentLevel
            ? "border-blue-200 bg-blue-50 text-blue-900"
            : "text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => onClick(place.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Map icon */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                place.isCurrentLevel
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            {/* Place name */}
            <div>
              <h3 className="text-lg font-bold leading-tight">{place.label}</h3>
            </div>
          </div>

          {/* Selected indicator */}
          {place.isCurrentLevel && (
            <div className="text-blue-500">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.place.id === next.place.id &&
    prev.place.isCurrentLevel !== next.place.isCurrentLevel,
);

const PlacesListContent = ({
  selectedMap,
  handlePlaceClick,
}: {
  selectedMap: string | null;
  handlePlaceClick: (mapId: string) => void;
}) => {
  const { sortMode } = usePlacesListSortStore();
  
  const places: Place[] = useMemo(() => {
    return getAllMapIds().map((mapId: string) => ({
      id: mapId,
      label: formatMapString(mapId),
      isCurrentLevel: selectedMap === mapId,
    }));
  }, [selectedMap]);

  const sortedPlaces = useMemo(() => {
    if (sortMode === "alphabetical") {
      return sortPlacesAlphabetically(places);
    } else {
      return groupPlacesByType(places);
    }
  }, [places, sortMode]);

  return sortMode === "alphabetical"
    ? (sortedPlaces as Place[]).map((place) => (
        <PlaceItem key={place.id} place={place} onClick={handlePlaceClick} />
      ))
    : (sortedPlaces as ReturnType<typeof groupPlacesByType>).map((group) => (
        <div key={group.type} className="mb-6">
          <div className="sticky top-0 z-10 mb-3 flex items-center gap-2 rounded-lg border border-gray-200/50 bg-linear-to-r from-emerald-50 to-white px-3 py-2 backdrop-blur-sm">
            <span className="text-lg">{group.icon}</span>
            <h4 className="font-calamity text-sm font-bold  tracking-wide text-gray-700">
              {group.label}
            </h4>
            <span className="ml-auto rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
              {group.places.length}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {group.places.map((place) => (
              <PlaceItem
                key={place.id}
                place={{
                  ...place,
                  isCurrentLevel: selectedMap === place.id,
                }}
                onClick={handlePlaceClick}
              />
            ))}
          </div>
        </div>
      ));
};
export default PlacesListContent;
