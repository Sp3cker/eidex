import useMapStore from "@/stores/useMapStore";
import { useSpring, animated, to } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";

const MapContainer = ({ children }: any) => {
  const [selectedCoordinates, setDragging] = useMapStore(
    (state) => [state.selectedCoordinates, state.setDragging],
    shallow,
  );

  const targetRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [{ scale, centerOffset }, api] = useSpring(() => {
    let currentTargetCenterOffset = [30, 40]; // Default if no coordinates or mapRef
    const currentSpringConfig = {
      mass: 4,
      tension: 550,
      friction: 100,
      precision: 0.2,
      
    }; // Default config
    let currentSpringDelay = 0; // Default delay

    if (selectedCoordinates && mapRef.current) {
      const [x, y] = selectedCoordinates;
      currentTargetCenterOffset = [
        window.innerWidth / 2 - x,
        window.innerHeight / 2 - y,
      ];
      currentSpringDelay = 160; // Specific delay for this case
    }

    return {
      scale: 1.32, // Assuming scale remains constant
      centerOffset: currentTargetCenterOffset,
      config: currentSpringConfig,
      delay: currentSpringDelay,
      onRest: () => {
        if (typeof setDragging === "function") {
          setDragging(false);
        }
      },
    };
  }, [selectedCoordinates]);

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
  useEffect(() => {
    api.start({ centerOffset: [0, 0] });
  }, []);
  return (
    <div
      ref={targetRef}
      className="fade-in map-grid font-calamity z-0 w-full touch-none overflow-auto bg-[#0082CA]"
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
