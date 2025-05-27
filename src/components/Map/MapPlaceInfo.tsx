import { animated, useSpring } from "react-spring";
import { useMapStore } from "@/stores/useMapStore";
import { useCallback, useEffect, useState } from "react";
import EncounterMonsList from "./EncounterMonsList";

const MapPlaceInfo = () => {
  // const [clientWidth, setClientWidth] = useState(window.innerWidth);
  const [selectedTab, setSelectedTab] = useState("land");

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
        (state.selectedMapLandMons && state.selectedMapLandMons.length !== 0) ||
        (state.selectedMapFishingMons &&
          state.selectedMapFishingMons.length !== 0) ||
        (state.selectedMapWaterMons && state.selectedMapWaterMons.length !== 0);
      if (show !== null && show) {
        // const toSize = screenWidth === "sm" ? 150 : 200;
        api.start({
          // delay: (key) => (key === "opacity" ? 0 : 300),
          config: { mass: 0.6, damping: 0.2 },
          opacity: 1,
          translate: 0, // Ensure it doesn't go too far left
        });
        // if (state.selectedMapLandMons?.length === 0) {
        //   setSelectedTab("water");
        // } else {
        //   setSelectedTab("land");
        // }
      } else {
        api.start({ translate: 200 });
      }
    });
    return () => {
      unsub();
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const title = target.getAttribute("title");
    if (title) {
      setSelectedTab(title);
    }
  }, []);
  return (
    <animated.div
      style={{
        opacity: spring.opacity,
        transform: spring.translate.to((x) => `translate3d(${x}px, 0, 0)`),
      }}
      className={`h-full flex flex-col w-[150px] md:w-full rounded-lg content-visibility map-place-info-textbox-gradient map-place-info-z-3 map-place-info-grid will-translate font-calamity cursor-touch pb-1`}
    >
      <div className="tabs w-full overflow-hidden px-3 py-3">
        <div className="font-pkmnem tab-list flex w-full justify-evenly text-nowrap" role="tablist" aria-label="Encounter type tabs">
          <button
            title="land"
            className={`tab-label w-[36px] text-lg md:text-xl font-bold ${selectedTab === "land" && "land-tab"}`}
            onClick={handleClick}
            role="tab"
            aria-selected={selectedTab === "land"}
            aria-controls="land-panel"
            tabIndex={selectedTab === "land" ? 0 : -1}
            id="land-tab"
            type="button"
          >
            Land
          </button>
          <button
            title="water"
            className={`tab-label w-[44px] text-lg md:text-xl font-bold ${selectedTab === "water" && "water-tab"}`}
            onClick={handleClick}
            role="tab"
            aria-selected={selectedTab === "water"}
            aria-controls="water-panel"
            tabIndex={selectedTab === "water" ? 0 : -1}
            id="water-tab"
            type="button"
          >
            Water
          </button>
          <button
            title="fishing"
            className={`tab-label w-[46px] text-lg md:text-xl font-bold ${selectedTab === "fishing" && "fishing-tab"}`}
            onClick={handleClick}
            role="tab"
            aria-selected={selectedTab === "fishing"}
            aria-controls="fishing-panel"
            tabIndex={selectedTab === "fishing" ? 0 : -1}
            id="fishing-tab"
            type="button"
          >
            Fishing
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-1">
        {selectedTab === "land" ? (
          <EncounterMonsList zone="land" />
        ) : selectedTab === "water" ? (
          <EncounterMonsList zone="water" />
        ) : selectedTab === "fishing" ? (
          <EncounterMonsList zone="fishing" />
        ) : null}
      </div>
    </animated.div>
  );
};

export default MapPlaceInfo;
