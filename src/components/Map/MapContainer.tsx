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

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;
const DAMPING_FACTOR = 0.1;

// Allow dragging any corner to center by using map dimensions
// Map is 1440x600px with scale 0.5, so scaled dimensions are ~720x300px
// To center any corner, we need bounds that allow the map to move by its full dimensions
const BOUNDS = {
  top: -(600 * 0.5),
  bottom: 600 * 0.5,
  left: -(1440 * 0.5),
  right: 1440 * 0.5,
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
    // Booleans and clearer names for readability
    const isSmallScreen = screenWidth === "sm" || screenWidth === "xs";
    const xyScales: [number, number] = [
      3 * rootFontSize * (isSmallScreen ? -1 : 1),
      (isSmallScreen ? 3 : 4) * rootFontSize,
    ];
    // Default center translation before any coordinate selection kicks in
    const baseTargetCenterOffset: [number, number] = [
      WINDOW_WIDTH > 1000 ? -400 : 0,
      150,
    ];
    const hasSelection = !!(selectedCoordinates && mapRef.current);
    const [x = 0, y = 0] = selectedCoordinates ?? [];
    // When the special 400x340 point is active, nudge toward center instead of upper-left
    const isDefaultCoordinate = x === 400 && y === 340;
    const horizontalOffsetFactor = isDefaultCoordinate
      ? 1.75
      : isSmallScreen
        ? -0.21
        : 0.1;
    const verticalOffsetFactor = isDefaultCoordinate
      ? 1.5
      : isSmallScreen
        ? 0.15
        : 0.2;

    const dampingX = (x / MAP_WIDTH - 0.5) * MAP_WIDTH * DAMPING_FACTOR;
    const dampingY = (y / MAP_HEIGHT - 0.5) * MAP_HEIGHT * DAMPING_FACTOR;

    const selectionTargetCenterOffset: [number, number] = [
      WINDOW_WIDTH * horizontalOffsetFactor - x - xyScales[0] + dampingX,
      WINDOW_HEIGHT * verticalOffsetFactor - y - xyScales[1] + dampingY,
    ];
    // Choose the appropriate target offset
    const currentTargetCenterOffset: [number, number] = hasSelection
      ? selectionTargetCenterOffset
      : baseTargetCenterOffset;
    const currentSpringDelay = hasSelection ? 113 : 0;

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

        api.start({
          centerOffset: [x, y],
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
    if (!selectedCoordinates) {
      api.start({ centerOffset: [WINDOW_WIDTH > 1000 ? 200 : 0, 150] });
    }
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
