import { memo, useCallback, useEffect, useRef, useMemo } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { formatMapString } from "@/utils/formatMapString";
import { useSpring, animated } from "@react-spring/web";
import mapsvgs from "@/data/map/mapsvgs.json";
import { shallow } from "zustand/shallow";

// Extract unique map IDs from the mapsvgs data
const getAllMapIds = () => {
  const mapIds = new Set<string>();

  mapsvgs.forEach((item: { id?: string }) => {
    if (item.id && typeof item.id === "string" && item.id.startsWith("MAP_")) {
      mapIds.add(item.id);
    }
  });

  return Array.from(mapIds).sort();
};

// Type for a clickable map area/location
interface Place {
  id: string;
  label: string;
  isCurrentLevel: boolean; // Whether this location is currently selected on the map
}

// Component to render individual place item
const PlaceItem = ({
  place,
  onClick,
}: {
  place: Place;
  onClick: (id: string) => void;
}) => (
  <button
    className={`mb-1 w-full rounded-lg border border-transparent p-3 text-left transition-colors ${
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
  </button>
);

const PlacesList = memo(function PlacesList() {
  const { selectedMap, isPlacesListOpen, setSelectedMap, setPlacesListOpen } =
    useMapStore(
      (state) => ({
        selectedMap: state.selectedMap,
        isPlacesListOpen: state.isPlacesListOpen,
        setSelectedMap: state.setSelectedMap,
        setPlacesListOpen: state.setPlacesListOpen,
      }),
      shallow,
    );

  // Spring animations for sliding in from the left
  const [slideAnimation, api] = useSpring(
    {
      transform: "translateX(-100%)",
      config: { tension: 240, friction: 34 },
    },
    [],
  );
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    if (isPlacesListOpen) {
      api.start({ transform: "translateX(0%)" });
      // Show backdrop and animate in
      backdrop.style.display = "block";
      backdrop.animate(
        [
          {
            opacity: 0,
            backdropFilter: "blur(0px)",
            background: "rgba(0, 0, 0, 0.0)",
          },
          {
            opacity: 0.6,
            backdropFilter: "blur(5px)",
            background: "rgba(0, 0, 0, 0.6)",
          },
        ],
        {
          duration: 200,
          easing: "ease-out",
          fill: "forwards",
        },
      );
    }
    // else if (backdrop.style.opacity !== "0") {
    //   // Animate out then hide
    //   handleClose();
    // }
  }, [isPlacesListOpen, api]);

  // Get all clickable places from mapsvgs - these are the SVG elements on the main map
  const places: Place[] = useMemo(() => {
    return getAllMapIds().map((mapId: string) => ({
      id: mapId,
      label: formatMapString(mapId),
      isCurrentLevel: selectedMap === mapId, // Check if this map is currently selected
    }));
  }, [selectedMap]);

  const handlePlaceClick = (mapId: string) => {
    setSelectedMap(mapId); // This will select the map on the main SVG
    handleClose(); // Close the panel after selection
  };
  const handleClose = useCallback(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;
    api.start({ transform: "translateX(-100%)" });
    const animation = backdrop.animate(
      [
        {
          opacity: 0.6,
          backdropFilter: "blur(5px)",
          background: "rgba(0, 0, 0, 0.6)",
        },
        {
          opacity: 0,
          backdropFilter: "blur(0px)",
          background: "rgba(0, 0, 0, 0.0)",
        },
      ],
      {
        duration: 200,
        easing: "ease-in",
        fill: "forwards",
      },
    );

    animation.addEventListener("finish", () => {
      backdrop.style.display = "none";
      setPlacesListOpen(false);
      //   setPlacesListOpen(false);
    });
  }, [api]);

  // Show the component if places list is open (regardless of selected map)
  //   if (!isPlacesListOpen) {
  //     return null;
  //   }

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        style={{ display: "none" }}
        className="places-list-backdrop-z fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      <animated.nav
        style={slideAnimation}
        className="places-list-z fixed bottom-0 left-0 top-0 w-80 max-w-[80vw] overflow-hidden border-r border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-gray-100 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4">
          <h3 className="cool-font md:text-md text-sm font-bold text-neutral-700">
            Hoenn
          </h3>
          <button
            onClick={handleClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="Close places list"
          >
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-pkmnem text-xs text-neutral-500">
                {places.length} area{places.length !== 1 ? "s" : ""}{" "}
              </span>
            </div>

            {/* <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs text-blue-700">
                💡 Click any location below to view it on the Hoenn region map
              </p>
            </div> */}

            <div className="font-pkmnem flex flex-col gap-1">
              {places.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p className="text-sm">No locations available</p>
                </div>
              ) : (
                <div>
                  {places.map((place) => (
                    <PlaceItem
                      key={place.id}
                      place={place}
                      onClick={handlePlaceClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </animated.nav>
    </>
  );
});

export default PlacesList;
