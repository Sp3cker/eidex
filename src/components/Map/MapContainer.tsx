import { useScreenWidth } from "@/hooks/useScreenWidth";
import { useWindowSize } from "@/hooks/useWindowResize";
import useMapStore from "@/stores/useMapStore";
import { useSpring, animated, to } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { shallow } from "zustand/shallow";
const rootFontSize = parseFloat(
  getComputedStyle(document.documentElement).fontSize,
);
/* 
im not vibe coding im not vibecoding

  1. Use transform only, avoid scroll container work
     MapContainer uses overflow-auto on the drag target. If the browser is also considering scroll/overflow
     during gesture handling, it can add work. Since dragging is custom, overflow-hidden might feel
     smoother later if native scrolling is not needed.
  2. Make bounds match the active scale
     BOUNDS currently uses the desktop max scale. That is conservative, but on mobile it allows more drag
     range than needed. Scale-specific bounds may reduce rubberband weirdness.
  3. Avoid restarting the spring too often
     The effect depends on selectedCoordinates, screenWidth, WINDOW_WIDTH, WINDOW_HEIGHT, and mapScale.
     That is correct, but if resize hooks fire during mobile browser chrome changes, the spring can
     restart. Debouncing is already in the window hook, but mobile address-bar resize may still be
     noticeable.
  4. Tune selected-map transition separately from drag
     The same DEFAULT_SPRING_CONFIG handles programmed moves. Drag uses a different config. If the
     selected-map snap feels floaty or overshoots, a separate config for selection animations would be
     cleaner than tuning global values.
  5. Consider immediate during active drag
     Drag currently updates through api.start(), which keeps spring physics active while the pointer moves.
     For direct manipulation, using immediate updates during drag and spring only after release can feel
     tighter.
  6. Promote the SVG/map layer carefully
     You already have will-change: transform. If the SVG is heavy, rasterized image layers inside it may
     still be expensive. The big ReactSvg plus many interactive map places is likely the main cost, not the
     math in MapContainer.
*/
const DEFAULT_SPRING_CONFIG = Object.freeze({
  mass: 2,
  stiffness: 0.5,
  damping: 0.81,
  frequency: 0.62,
});
const MAP_RENDER_WIDTH = 720;
const MAP_RENDER_HEIGHT = 405;
const DEFAULT_MAP_SCALE = 1.55;
const DESKTOP_MAP_SCALE = 1.75;
const DEFAULT_MAP_COORDINATES = Object.freeze([400, 340] as const);
const MOBILE_MAP_PLACE_INFO_START_COLUMN = 8;
const MOBILE_GRID_COLUMN_COUNT = 12;
const MOBILE_NAV_HEIGHT_REMS = 3;
const MOBILE_FIXED_GRID_HEIGHT_REMS = 13;
const MOBILE_FLEX_GRID_ROWS = 5;
const SELECTED_MAP_TARGET_ADJUSTMENT = 0.8;
const MOBILE_SELECTED_MAP_VERTICAL_ADJUSTMENT = 1.6;

const getCoordinateCenterOffset = (
  coordinates: readonly number[],
  windowWidth: number,
  windowHeight: number,
  screenWidth: ReturnType<typeof useScreenWidth>,
  mapScale: number,
) => {
  const [x, y] = coordinates;
  const isDefaultCoordinates =
    x === DEFAULT_MAP_COORDINATES[0] && y === DEFAULT_MAP_COORDINATES[1];
  const isMobile = screenWidth === "sm" || screenWidth === "xs";
  const xyScales = isMobile
    ? [-3 * rootFontSize, 3 * rootFontSize]
    : [3 * rootFontSize, 4 * rootFontSize];
  const xOffsetFactor =
    isMobile && !isDefaultCoordinates
      ? ((MOBILE_MAP_PLACE_INFO_START_COLUMN - 1) /
          MOBILE_GRID_COLUMN_COUNT /
          2) *
        SELECTED_MAP_TARGET_ADJUSTMENT
      : isDefaultCoordinates
        ? 0.5
        : 0.375 * SELECTED_MAP_TARGET_ADJUSTMENT;
  const yOffsetFactor = isDefaultCoordinates
    ? 0.5
    : 0.375 * SELECTED_MAP_TARGET_ADJUSTMENT;
  const mobileFlexRowHeight = Math.max(
    0,
    (windowHeight - MOBILE_FIXED_GRID_HEIGHT_REMS * rootFontSize) /
      MOBILE_FLEX_GRID_ROWS,
  );
  const yTarget =
    isMobile && !isDefaultCoordinates
      ? MOBILE_NAV_HEIGHT_REMS * rootFontSize +
        mobileFlexRowHeight * MOBILE_SELECTED_MAP_VERTICAL_ADJUSTMENT
      : windowHeight * yOffsetFactor;
  const transformOriginAdjustment = [
    (MAP_RENDER_WIDTH / 2) * (mapScale - 1),
    (MAP_RENDER_HEIGHT / 2) * (mapScale - 1),
  ];

  return [
    windowWidth * xOffsetFactor -
      x -
      xyScales[0] +
      transformOriginAdjustment[0],
    yTarget - y - xyScales[1] + transformOriginAdjustment[1],
  ];
};

const DRAG_RELEASE_VELOCITY_MULTIPLIER = 48;
const MAX_DRAG_RELEASE_THROW = 64;
const MIN_DRAG_RELEASE_DISTANCE = 3;
const MOBILE_RIGHT_OVERLAY_WIDTH_FACTOR = 5 / 12;
const MAX_OFFSCREEN_MAP_FACTOR = 0.5;
const MOBILE_MAX_OFFSCREEN_MAP_FACTOR = 0.35;
const MAX_BOTTOM_OFFSCREEN_MAP_FACTOR = 0.25;

type DragBounds = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

const getDragBounds = (
  mapScale: number,
  windowWidth: number,
  screenWidth: ReturnType<typeof useScreenWidth>,
): DragBounds => {
  const isMobile = screenWidth === "sm" || screenWidth === "xs";
  const maxOffscreenFactor = isMobile
    ? MOBILE_MAX_OFFSCREEN_MAP_FACTOR
    : MAX_OFFSCREEN_MAP_FACTOR;
  const maxOffscreenX = MAP_RENDER_WIDTH * mapScale * maxOffscreenFactor;
  const maxOffscreenY = MAP_RENDER_HEIGHT * mapScale * maxOffscreenFactor;
  const maxBottomOffscreenY =
    MAP_RENDER_HEIGHT * mapScale * MAX_BOTTOM_OFFSCREEN_MAP_FACTOR;
  const rightOverlayWidth = isMobile
    ? windowWidth * MOBILE_RIGHT_OVERLAY_WIDTH_FACTOR
    : 0;

  return {
    top: -maxBottomOffscreenY,
    bottom: maxOffscreenY,
    left: -(maxOffscreenX + rightOverlayWidth),
    right: maxOffscreenX,
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const clampToBounds = (x: number, y: number, bounds: DragBounds) => [
  clamp(x, bounds.left, bounds.right),
  clamp(y, bounds.top, bounds.bottom),
];

type MapContainerProps = {
  children: ReactNode;
};

const MapContainer = ({ children }: MapContainerProps) => {
  const [selectedCoordinates, setDragging] = useMapStore(
    (state) => [state.selectedCoordinates, state.setDragging],
    shallow,
  );
  const screenWidth = useScreenWidth();
  const targetRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = windowSize;
  const mapScale = screenWidth === "lg" ? DESKTOP_MAP_SCALE : DEFAULT_MAP_SCALE;
  const dragBounds = getDragBounds(
    mapScale,
    WINDOW_WIDTH,
    screenWidth,
  );
  const [{ scale, centerOffset }, api] = useSpring(() => {
    const currentTargetCenterOffset = getCoordinateCenterOffset(
      selectedCoordinates ?? DEFAULT_MAP_COORDINATES,
      WINDOW_WIDTH,
      WINDOW_HEIGHT,
      screenWidth,
      mapScale,
    );

    return {
      scale: mapScale,
      centerOffset: currentTargetCenterOffset,
      config: DEFAULT_SPRING_CONFIG,
      delay: selectedCoordinates ? 113 : 0,
      onRest: () => {
        setDragging(false);
      },
    };
  }, [selectedCoordinates, screenWidth]);

  useDrag(
    ({
      offset: [x, y],
      dragging,
      last,
      movement: [mx, my],
      velocity: [vx, vy],
      direction: [dx, dy],
    }) => {
      if (dragging) {
        setDragging(true);

        api.set({
          centerOffset: clampToBounds(x, y, dragBounds),
        });
        return;
      }

      if (!last) {
        return;
      }

      requestAnimationFrame(() => setDragging(false));

      if (Math.hypot(mx, my) >= MIN_DRAG_RELEASE_DISTANCE) {
        const throwX =
          dx *
          Math.min(
            vx * DRAG_RELEASE_VELOCITY_MULTIPLIER,
            MAX_DRAG_RELEASE_THROW,
          );
        const throwY =
          dy *
          Math.min(
            vy * DRAG_RELEASE_VELOCITY_MULTIPLIER,
            MAX_DRAG_RELEASE_THROW,
          );

        api.start({
          centerOffset: clampToBounds(x + throwX, y + throwY, dragBounds),
        });
      }
    },
    {
      target: targetRef,
      filterTaps: true,
      bounds: dragBounds,
      rubberband: false,
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
    api.start({
      scale: mapScale,
      centerOffset: getCoordinateCenterOffset(
        selectedCoordinates ?? DEFAULT_MAP_COORDINATES,
        WINDOW_WIDTH,
        WINDOW_HEIGHT,
        screenWidth,
        mapScale,
      ),
      delay: selectedCoordinates ? 113 : 0,
      config: DEFAULT_SPRING_CONFIG,
    });
  }, [
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    api,
    mapScale,
    screenWidth,
    selectedCoordinates,
  ]);
  return (
    <div
      ref={targetRef}
      className="fade-in map-grid font-calamity z-0 w-full cursor-move touch-none overflow-auto bg-[#0082CA]"
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
