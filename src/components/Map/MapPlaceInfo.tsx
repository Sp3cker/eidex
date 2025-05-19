import { animated, useSpring } from "react-spring";
import { useMapStore, formatMapString } from "@/stores/useMapStore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
const data = Array(17).fill("aaa");
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
      translate: clientWidth ,
    },
    [dexNavIsOpen, clientWidth],
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
      api.start({ translate: clientWidth - 800 });
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
      className={`absolute font-calamity top-[10%] cursor-move touch-none items-center justify-center hover:opacity-80`}
    >
      <div className="map-place-info-textbox rounded p-4 shadow-lg w-[130px] overflow-hidden ">
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
