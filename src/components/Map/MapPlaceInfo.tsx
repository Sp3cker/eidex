import { animated, useSpring } from "react-spring";
import { useMapStore, formatMapString } from "@/stores/useMapStore";
import {  useEffect, useState } from "react";
import EncounterMonsList from "./EncounterMonsList";

const MapPlaceInfo = () => {
  const [clientWidth, setClientWidth] = useState(window.innerWidth);
  const [selectedTab, setSelectedTab] = useState("land");
  const selectedMap = useMapStore((state) => state.selectedMap);
  const dexNavIsOpen = useMapStore((state) => state.dexNavIsOpen);

  const [spring, api] = useSpring(
    {
      translateOrigin: "50% 50%",
      //   translateX: window.innerWidth + 100,
      translate: dexNavIsOpen ? clientWidth / 3 : clientWidth,
    },
    [],
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
      api.start({ translate: clientWidth / 3 });
    } else {
      // api.start({ translate: clientWidth });
    }
  }, [clientWidth, dexNavIsOpen]);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    console.log("target", target);
    const title = target.getAttribute("title");
    if (title) {
      setSelectedTab(title);
    }
  };
  return (
    <animated.div
      style={{
        transform: spring.translate.to((x) => `translate3d(${x}px, 0, 0)`),
      }}
      className={`z-99 content-visibility font-calamity absolute top-[7%] cursor-move items-center justify-center overflow-x-hidden`}
    >
      <div className="tabs map-place-info-textbox-gradient w-[150px] overflow-hidden rounded px-3 py-3 shadow-2xl">
        <h2 className="text-sm font-bold">
          {formatMapString(selectedMap || "")}
        </h2>
        <div className="font-pkmnem tab-list block text-nowrap">
          <button
            title="land"
            className={`text-md tab w-[38px] font-bold ${selectedTab === "land" && "land-tab"}`}
            onClick={handleClick}
          >
            Land
          </button>
          <button
            title="water"
            className={`text-md tab w-[42px] font-bold ${selectedTab === "water" && "water-tab"}`}
            onClick={handleClick}
          >
            Water
          </button>
          <button
            title="fishing"
            className={`text-md tab w-[46px] font-bold ${selectedTab === "fishing" && "fishing-tab"}`}
            onClick={handleClick}
          >
            Fishing
          </button>
        </div>
        <div className="h-[200px] overflow-scroll">
          {selectedTab === "land" ? (
            <EncounterMonsList zone="land" />
          ) : selectedTab === "water" ? (
            <EncounterMonsList zone="water" />
          ) : selectedTab === "fishing" ? (
            <EncounterMonsList zone="fishing" />
          ) : null}
        </div>
      </div>
    </animated.div>
  );
};

export default MapPlaceInfo;
