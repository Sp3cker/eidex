import useMapStore from "@/stores/useMapStore";
import { useSpring, animated, to } from "@react-spring/web";
import { useDrag, usePinch } from "@use-gesture/react";
import { useEffect, useLayoutEffect, useRef } from "react";

const MapContainer = ({ children }) => {
  const setMapOffset = useMapStore((state) => state.setMapOffset);
  const selectedCoordinates = useMapStore((state) => state.selectedCoordinates);
  const mapRef = useRef<HTMLDivElement>(null);
  const setMapScale = useMapStore((state) => state.setMapScale);
  // const setMapScale = useMapStore((state) => state.setMapScale);
  // const { zoomingState } = usePinchZoom(mapRef);

  const [{ scale, centerOffset }, api] = useSpring(
    () => ({
      scale: 1,
      centerOffset: [400, 340],
      config: { mass: 5, tension: 800, friction: 200 },
      onRest: () => {
        setMapOffset(centerOffset.toJSON());
      },
    }),
    [],
  );

  const targetRef = useRef<HTMLDivElement>(null);
  // Pinch-to-zoom
  useEffect(() => {
    if (selectedCoordinates && mapRef.current) {
      const [x, y] = selectedCoordinates;
      const centerX = window.innerWidth / 2 - x; // X/y is center of target locale
      const centerY = window.innerHeight / 2 - y;
      api.start({
        centerOffset: [centerX, centerY],
      });
    }
  }, [selectedCoordinates, api, scale]);
  usePinch(
    ({ offset: [s] }) => {
      const toScale = Math.min(Math.max(s, 0.5), 1.5);
      setMapScale(toScale);

      api.set({ scale: toScale }); // Limit: 0.5x to 3x
    },
    {
      target: mapRef,
      scaleBounds: { min: 0.75, max: 1.5 },
    },
  );
  // useWheel(
  //   ({ movement: [, y] }) => {
  //     const calcY = Math.abs(Math.min(Math.max(y, 0.75), 2));
  //     setMapScale(calcY);
  //     api.start({ scale: calcY }); // Limit: 0.5x to 3x
  //   },
  //   {
  //     target: targetRef,
  //     bounds: { bottom: 1 },
  //   },
  // );
  useDrag(
    ({ offset: [x, y], dragging }) => {
      if (dragging) {
        api.start({ centerOffset: [x, y] });
      }
    },
    {
      target: targetRef,
      rubberband: true,
      filterTaps: true,
      bounds: {
        top: -200 ^ scale.toJSON(),
        bottom: 200 ^ scale.toJSON(),
        left: -500 ^ scale.toJSON(),
        right: 100 ^ scale.toJSON(),
      },
      from: () => {
        // console.log(centerOffset.get());
        return [centerOffset.get()[0], centerOffset.get()[1]];
      },
    },
  );
  return (
    <div
      ref={targetRef}
      className="font-calamity flex h-screen w-full touch-none flex-col overflow-auto bg-sky-700"
    >
      <animated.div
        ref={mapRef}
        id="map"
        style={{
          touchAction: "none",
          cursor: "move",
          //@ts-ignore
          transform: to([centerOffset, scale], ([x, y], scale) => {
            return `translate3d(${x}px,${y}px, ${x}px) scale(${scale})`;
          }),
          transformOrigin: "center",
        }}
        className="h-[680px] w-[800px] shadow-sm"
      >
        {children}
      </animated.div>
    </div>
  );
};
export default MapContainer;
