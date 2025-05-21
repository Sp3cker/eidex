import { animated, useSpring } from "react-spring";
import { useMapStore } from "@/stores/useMapStore";
import { useEffect, useState } from "react";
import EncounterMonsList from "./EncounterMonsList";
import { useScreenWidth } from "@/hooks/useScreenWidth";
const MapPlaceInfo = () => {
  const [clientWidth, setClientWidth] = useState(window.innerWidth);
  const [selectedTab, setSelectedTab] = useState("land");
  const dexNavIsOpen = useMapStore((state) => state.dexNavIsOpen);
  const screenWidth = useScreenWidth();

  const [spring, api] = useSpring(
    {
      opacity: 0,

      translate: clientWidth, // Start off-screen, animate to 2/3rd position
      // Start off-screen, animate to 2/3rd position
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
      // const toSize =
      //   screenWidth === "sm"
      //     ? 300
      //     : screenWidth === "md"
      //       ? (clientWidth + 900) / 3
      //       : (clientWidth + 600) / 3;

      api.start({
        // delay: (key) => (key === "opacity" ? 0 : 300),

        translate: dexNavIsOpen
          ? clientWidth - 200 // Ensure it doesn't go too far left
          : clientWidth,
      });
      api.start({ opacity: 1 });
    } else {
      // api.start({ translate: clientWidth });
    }
  }, [clientWidth, dexNavIsOpen, screenWidth]);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const title = target.getAttribute("title");
    if (title) {
      setSelectedTab(title);
    }
  };
  return (
    <animated.div
      style={{
        opacity: spring.opacity,
        transform: spring.translate.to((x) => `translate3d(${x}px, 0, 0)`),
      }}
      className={`content-visibility will-translate font-calamity cursor-touch absolute top-[7%] h-[256px] overflow-x-hidden`}
    >
      <div className="tabs map-place-info-textbox-gradient w-[150px] overflow-hidden rounded px-3 py-3 shadow-2xl">
        <div className="font-pkmnem tab-list block text-nowrap">
          <button
            title="land"
            className={`tab w-[36px] text-lg font-bold ${selectedTab === "land" && "land-tab"}`}
            onClick={handleClick}
          >
            Land
          </button>
          <button
            title="water"
            className={`tab w-[44px] text-lg font-bold ${selectedTab === "water" && "water-tab"}`}
            onClick={handleClick}
          >
            Water
          </button>
          <button
            title="fishing"
            className={`tab w-[46px] text-lg font-bold ${selectedTab === "fishing" && "fishing-tab"}`}
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
