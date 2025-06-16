import useMapStore from "@/stores/useMapStore";
import { useSpring, animated, to } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import {  useRef } from "react";
import { shallow } from "zustand/shallow";

const MapContainer = ({ children }: any) => {
  const [selectedCoordinates, setDragging] = useMapStore(
    (state) => [state.selectedCoordinates, state.setDragging],
    shallow,
  );

  const targetRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [{ scale, centerOffset }, api] = useSpring(
    () => {
      // Default values for the spring
      let currentTargetCenterOffset = [400, 340]; // Default if no coordinates or mapRef
      let currentSpringConfig = {
        mass: 5,
        tension: 800,
        friction: 200,
        precision: 0.2,
      }; // Default config
      let currentSpringDelay = 0; // Default delay

      // This logic is moved from the useEffect:
      // If selectedCoordinates are present and mapRef.current is available,
      // then we update the target offset, config, and delay for the spring.
      if (selectedCoordinates && mapRef.current) {
        const [x, y] = selectedCoordinates;
        currentTargetCenterOffset = [
          window.innerWidth / 2 - x,
          window.innerHeight / 2 - y,
        ];
        // currentSpringConfig = { damping: 2.5, precision: 0.2 }; // Specific config for this case
        currentSpringDelay = 160; // Specific delay for this case
      }
      // If the above condition (selectedCoordinates && mapRef.current) is not met,
      // the spring will use the default values defined at the start of this function.
      // This means if selectedCoordinates is set but mapRef.current is null,
      // or if selectedCoordinates is null, it defaults to the initial state.

      return {
        scale: 1.32, // Assuming scale remains constant
        centerOffset: currentTargetCenterOffset,
        config: currentSpringConfig,
        delay: currentSpringDelay,
        onRest: () => {
          // Ensure setDragging is available and is a function before calling
          if (typeof setDragging === "function") {
            setDragging(false);
          }
        },
      };
    },
    [selectedCoordinates], // The spring definition will re-evaluate when selectedCoordinates changes.
    // Note: Changes to mapRef.current will not trigger re-evaluation,
    // which matches the behavior of your original useEffect's dependency array.
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
        setDragging(true);
        api.start({ centerOffset: [x, y] });
      } else if (!dragging) {
        // setDragging(false);
      }
    },
    {
      target: targetRef,

      filterTaps: true,
      bounds: {
        top: -200 ^ scale.toJSON(),
        bottom: 200 ^ scale.toJSON(),
        left: -400 ^ scale.toJSON(),
        right: 500 ^ scale.toJSON(),
      },
      from: () => {
        return [centerOffset.get()[0], centerOffset.get()[1]];
      },
    },
  );
  return (
    <div
      ref={targetRef}
      className="map-grid font-calamity z-0 w-full touch-none overflow-auto bg-[#0082CA]"
    >
      <animated.div
        ref={mapRef}
        id="map"
        style={{
          touchAction: "none",
          cursor: "move",
          //@ts-ignore
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
