import { animated, useSpring } from "react-spring";
import { useMapStore } from "@/stores/useMapStore";
import { useEffect, useState } from "react";
import EncounterMonsList from "./EncounterMonsList";
import { useScreenWidth } from "@/hooks/useScreenWidth";

const MapPlaceInfo = () => {
  // const [clientWidth, setClientWidth] = useState(window.innerWidth);
  const [selectedTab, setSelectedTab] = useState("land");

  const screenWidth = useScreenWidth();

  const [spring, api] = useSpring(
    {
      opacity: 0,

      translate: 200, // Start off-screen, animate to 2/3rd position
      // Start off-screen, animate to 2/3rd position
    },
    [],
  );
  // useEffect(() => {
  //   const handleResize = () => {
  //     setClientWidth(window.innerWidth);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  useEffect(() => {
    const unsub = useMapStore.subscribe((state) => {
      const show =
        state.selectedMapLandMons !== undefined ||
        state.selectedMapFishingMons !== undefined ||
        state.selectedMapWaterMons != undefined;
      if (show !== null && show) {
        // const toSize = screenWidth === "sm" ? 150 : 200;
        api.start({
          // delay: (key) => (key === "opacity" ? 0 : 300),
          config: { mass: 0.6, damping: 0.2 },

          translate: 0, // Ensure it doesn't go too far left
        });
        api.start({ opacity: 1 });
      } else {
        api.start({ translate: 0 });
      }
    });
    return () => {
      unsub();
    };
  }, [screenWidth]);

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
      className={`content-visibility map-place-info-z-3 map-place-info-grid will-translate font-calamity h-[256px] md:h-full cursor-touch pb-1`}
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
        <div className="overflow-scroll h-[200px] md:h-full mb-1">
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
