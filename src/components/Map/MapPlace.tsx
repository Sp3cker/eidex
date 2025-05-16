import useMapStore from "@/stores/useMapStore";
import { forwardRef, Ref, useCallback } from "react";

interface MapPlaceProps {}
const MapPlace = forwardRef<HTMLDivElement, MapPlaceProps>(
  ({ children, map, type }: any, ref: Ref<HTMLDivElement>) => {
    const setSelectedCoordinates = useMapStore(
      (state) => state.setSelectedCoordinates,
    );
    const mapScale = useMapStore((state) => state.mapScale);
    const setSelectedMap = useMapStore((state) => state.setSelectedMap);
    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (e && e.currentTarget && e.currentTarget.parentElement) {
        const childRect = e.currentTarget.getBoundingClientRect();
        const parentRect =
          e.currentTarget.parentElement.getBoundingClientRect();

        // console.log(JSON.stringify([x, y, width, height, bottom, left, top, right]));
        setSelectedCoordinates([
          (childRect.x - parentRect.x) * mapScale,
          (childRect.y - parentRect.y) * mapScale,
        ]);
        setSelectedMap(map)
      }
    }, []);

    return (
      <div
        ref={ref}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClick(e)}
        title={map}
        className={`touch-none ${map} ${type}`}
      >
        {children}
      </div>
    );
  },
);

export default MapPlace;
