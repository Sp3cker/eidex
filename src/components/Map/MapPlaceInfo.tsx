import { animated, useSpring } from "react-spring";
import { useMapStore, formatMapString } from "@/stores/useMapStore";
import { useEffect, useRef, useState } from "react";
const MapPlaceInfo = () => {
  const [clientWidth, setClientWidth] = useState(window.innerWidth);
  //   const [mouseMoving, setMouseMoving] = useState(false);
  const selectedMap = useMapStore((state) => state.selectedMap);
  const dexNavIsOpen = useMapStore((state) => state.dexNavIsOpen);
  const ref = useRef<HTMLDivElement>(null);
  const [spring] = useSpring(
    {
      translateOrigin: "top left",
      //   translateX: window.innerWidth + 100,
      translateX: dexNavIsOpen ? clientWidth - 200 : clientWidth + 200,
    },
    [dexNavIsOpen],
  );
  useEffect(() => {
    const handleResize = () => {
      setClientWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <animated.div
      ref={ref}
      style={{ transform: spring.translateX.to((x) => `translateX(${x}px)`) }}
      className={`absolute top-[10%] flex w-[200px] cursor-move touch-none items-center justify-center hover:opacity-80`}
    >
      <div className="map-place-info-textbox rounded p-4 shadow-lg">
        <h2 className="text-sm font-bold">
          {formatMapString(selectedMap || "")}
        </h2>
        <p className="text-sm">
          Details about the selected place will go here.
        </p>
      </div>
    </animated.div>
  );
};

export default MapPlaceInfo;
