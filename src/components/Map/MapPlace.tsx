import useMapStore from "@/stores/useMapStore";
import { forwardRef, Ref, useCallback } from "react";

interface MapPlaceProps {
  mapName: string;
  type: string;
}
const MapPlace = forwardRef<HTMLDivElement, MapPlaceProps>(function MapPlace(
  { mapName, type }: MapPlaceProps,
  ref: Ref<HTMLDivElement>,
) {
  const setSelectedCoordinates = useMapStore(
    (state) => state.setSelectedCoordinates,
  );
  const mapScale = useMapStore((state) => state.mapScale);
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e && e.currentTarget && e.currentTarget.parentElement) {
      const childRect = e.currentTarget.getBoundingClientRect();
      const parentRect = e.currentTarget.parentElement.getBoundingClientRect();

      setSelectedCoordinates([
        (childRect.x - parentRect.x) * mapScale,
        (childRect.y - parentRect.y) * mapScale,
      ]);
      setSelectedMap(mapName);
    }
  }, []);

  return (
    <div
      ref={ref}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClick(e)}
      title={mapName}
      className={`touch-none ${mapName} ${type}`}
    ></div>
  );
});

export default MapPlace;
