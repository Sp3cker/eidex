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
    let currentTargetCenterOffset = [WINDOW_WIDTH > 1000 ? 100 : 0, 0]; // Default if no coordinates or mapRef
    // Default config
    let currentSpringDelay = 0; // Default delay
    const xyScales =
      screenWidth === "sm" || screenWidth === "xs"
        ? [-3 * rootFontSize, 3 * rootFontSize]
        : [3 * rootFontSize, 4 * rootFontSize];
    if (selectedCoordinates && mapRef.current) {
      const [x, y] = selectedCoordinates;
      currentTargetCenterOffset = [
        WINDOW_WIDTH / 2 - x - xyScales[0],
        WINDOW_HEIGHT / 2 - y - xyScales[1],
      ];
      currentSpringDelay = 160; // Specific delay for this case
    }

    return {
      scale: 1.32, // Assuming scale remains constant
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

      bounds: {
        top: -200 * scale.get(),
        bottom: 200 * scale.get(),
        left: WINDOW_WIDTH < 768 ? -3600 : -400 * scale.get(),
        right: 200 * scale.get(),
      },
      from: () => {
        return [centerOffset.get()[0], centerOffset.get()[1]];
      },
    },
  );
  useEffect(() => {
    api.start({ centerOffset: [WINDOW_WIDTH > 1000 ? 100 : 0, 0] });
  }, []);
  return (
    <div
      ref={targetRef}
      className="fade-in map-grid font-calamity z-0 w-full touch-none cursor-move overflow-auto bg-[#0082CA]"
    >
      <animated.div
        ref={mapRef}
        id="map"
        style={{
          touchAction: "none",
          cursor: "move",
          // @ts-expect-error - React Spring transform typing issue
          transform: to([centerOffset, scale], ([x, y], scale) => {
            return `translate3d(${x}px,${y}px, 0) scale(${scale})`;
          }),
          transformOrigin: "center",
        }}
        className="will-transform h-[667px] w-[800px]"
      >
        {children}
      </animated.div>
    </div>
  );
};
export default MapContainer;
