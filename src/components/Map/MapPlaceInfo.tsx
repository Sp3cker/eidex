import { animated, useSpring } from "react-spring";
import { useMapStore, formatMapString } from "@/stores/useMapStore";
import { useEffect, useRef, useState } from "react";

const MapPlaceInfo = () => {
  const [clientWidth, setClientWidth] = useState(window.innerWidth);
  //   const [mouseMoving, setMouseMoving] = useState(false);
  const selectedMap = useMapStore((state) => state.selectedMap);
  const dexNavIsOpen = useMapStore((state) => state.dexNavIsOpen);
  const ref = useRef<HTMLDivElement>(null);
  const [spring, api] = useSpring(
    {
      translateOrigin: "top left",
      //   translateX: window.innerWidth + 100,
      translate: clientWidth,
    },
    [clientWidth],
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
  useEffect(() => {
    if (dexNavIsOpen) {
      console.log(`${clientWidth} ${clientWidth - clientWidth /5}`)
      api.start({ translate: clientWidth / 3 });
    } else {
      api.start({ translate: clientWidth });
    }
  }, [clientWidth, dexNavIsOpen]);
  return (
    <animated.div
      ref={ref}
      style={{
        transform: spring.translate.to((x) => `translate3d(${x}px, 0, 0)`),
      }}
      className={`font-calamity absolute top-[10%] cursor-move touch-none items-center justify-center hover:opacity-80`}
    >
      <div className="map-place-info-textbox w-[130px] overflow-hidden rounded p-4 shadow-lg">
        <h2 className="text-sm font-bold">
          {formatMapString(selectedMap || "")}
        </h2>
        <div className="h-[200px] overflow-scroll">
          {/* {data.map((d) => (
            <p>{d}</p>
          ))} */}
        </div>
      </div>
    </animated.div>
  );
};

export default MapPlaceInfo;
