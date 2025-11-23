import { useScreenWidth } from "@/hooks/useScreenWidth";
import { useWindowSize } from "@/hooks/useWindowResize";
import useMapStore from "@/stores/useMapStore";
import { useSpring, animated, to } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
const rootFontSize = parseFloat(
  getComputedStyle(document.documentElement).fontSize,
);

const DEFAULT_SPRING_CONFIG = Object.freeze({
  mass: 2,
  stiffness: 0.5,
  damping: 0.81,
  frequency: 0.62,
});
// Allow dragging any corner to center by using map dimensions
// Map is 800x667px with scale 1.32, so scaled dimensions are ~1056x880px
// To center any corner, we need bounds that allow the map to move by its full dimensions
const BOUNDS = {
  top: -(667 * 1.32),
  bottom: 667 * 1.32,
  left: -(800 * 1.32),
  right: 800 * 1.32,
};
const MapContainer = ({ children }: any) => {
  const [selectedCoordinates, setDragging] = useMapStore(
    (state) => [state.selectedCoordinates, state.setDragging],
    shallow,
  );
  const screenWidth = useScreenWidth();
  const targetRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = windowSize;
  const [{ scale, centerOffset }, api] = useSpring(() => {
    // Booleans as 0/1 so the rest of the math can stay branchless
    const isSmallScreen = Number(screenWidth === "sm" || screenWidth === "xs");
    const xyScales: [number, number] = [
      3 * rootFontSize * (1 - 2 * isSmallScreen),
      (3 + (1 - isSmallScreen)) * rootFontSize,
    ];
    // Default center translation before any coordinate selection kicks in
    const baseTargetCenterOffset: [number, number] = [
      200 * Number(WINDOW_WIDTH > 1000),
      150,
    ];
    const hasSelection = Number(Boolean(selectedCoordinates && mapRef.current));
    const [x = 0, y = 0] = selectedCoordinates ?? [];
    // When the special 400x340 point is active, nudge toward center instead of upper-left
    const isDefaultCoordinate = Number(x === 400 && y === 340);
    const offsetFactorHorizontal = 0.1 + isDefaultCoordinate * (1.75 - 0.1);
    const offsetFactorVertical = 0.2 + isDefaultCoordinate * (1.5 - 0.2);
    const selectionTargetCenterOffset: [number, number] = [
      WINDOW_WIDTH * offsetFactorHorizontal - x - xyScales[0],
      WINDOW_HEIGHT * offsetFactorVertical - y - xyScales[1],
    ];
    // Blend between the base offset and the selection-driven offset with the hasSelection flag
    const currentTargetCenterOffset: [number, number] = [
      baseTargetCenterOffset[0] +
        hasSelection * (selectionTargetCenterOffset[0] - baseTargetCenterOffset[0]),
      baseTargetCenterOffset[1] +
        hasSelection * (selectionTargetCenterOffset[1] - baseTargetCenterOffset[1]),
    ];
    const currentSpringDelay = 113 * hasSelection;

    return {
      scale: 1.32,
      centerOffset: currentTargetCenterOffset,
      config: DEFAULT_SPRING_CONFIG,
      delay: currentSpringDelay,
      onRest: () => {
        setDragging(false);
      },
    };
  }, [selectedCoordinates, screenWidth]);

  useDrag(
    ({ offset: [x, y], dragging, velocity: [vx, vy] }) => {
      if (dragging) {
        setDragging(true);

        // Apply velocity-based smoothing - higher velocity = more responsive
        const velocityFactor = Math.min(
          Math.max(Math.sqrt(vx * vx + vy * vy) / 10, 0.1),
          1,
        );
        const smoothingFactor = 0.7 + velocityFactor * 0.3; // Range: 0.7 to 1.0

        api.start({
          centerOffset: [x * smoothingFactor, y * smoothingFactor],
          config: {
            mass: 1,
            tension: velocityFactor > 0.5 ? 200 : 100, // More responsive at higher velocities
            friction: velocityFactor > 0.5 ? 25 : 15,
          },
        });
      }
    },
    {
      target: targetRef,
      filterTaps: true,
      bounds: BOUNDS,
      rubberband: true,
      from: () => {
        return [centerOffset.get()[0], centerOffset.get()[1]];
      },
    },
  );
  const mapStyle = {
    // @ts-expect-error - React Spring transform typing issue
    transform: to([centerOffset, scale], ([x, y], scale) => {
      return `translate3d(${x}px,${y}px, 0) scale(${scale})`;
    }),
  };
  useEffect(() => {
    api.start({ centerOffset: [WINDOW_WIDTH > 1000 ? 200 : 0, 150] });
  }, []);
  return (
    <div
      ref={targetRef}
      className="fade-in map-grid font-calamity z-0 w-full cursor-move touch-none overflow-auto bg-[var(--hearth-gray-2)]"
    >
      <animated.div
        ref={mapRef}
        id="map"
        style={mapStyle}
        className="will-transform h-[405px] w-[720px] origin-center cursor-move touch-none"
      >
        {children}
      </animated.div>
    </div>
  );
};
export default MapContainer;
