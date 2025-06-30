import { animated, useSpring } from "@react-spring/web";
import { useMapStore } from "@/stores/useMapStore";
import { useCallback, useRef, useState, memo } from "react";
import EncounterMonsContainer from "./EncounterMonsContainer";

const MapPlaceInfoContent = memo(() => {
  const [selectedTab, setSelectedTab] = useState("land");
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const title = target.getAttribute("title");
    if (title) {
      setSelectedTab(title);
    }
  }, []);

  return (
    <>
      <EncounterMonsContainer selectedTab={selectedTab} />
      <div
        className="font-pkmnem tab-list flex w-full justify-evenly text-nowrap lg:hidden"
        style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)" }}
        role="tablist"
        aria-label="Encounter type tabs"
      >
        <button
          title="land"
          className={`tab-label w-[2rem] text-lg font-bold md:text-xl ${selectedTab === "land" && "land-tab"}`}
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
          className={`tab-label w-[2rem] text-lg font-bold ${selectedTab === "water" && "water-tab"}`}
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
          className={`tab-label w-[3rem] text-lg font-bold ${selectedTab === "fishing" && "fishing-tab"}`}
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
    </>
  );
});

MapPlaceInfoContent.displayName = "MapPlaceInfoContent";

/** This component is animated. */
const MapPlaceInfo = memo(() => {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const dragging = useMapStore((state) => state.dragging);
  const divRef = useRef(null);

  const [spring] = useSpring(
    {
      translate: dragging ? 200 : 0,
      opacity: selectedMap ? 1 : 0,
      config: (key: string) =>
        key === "opacity"
          ? { duration: 200 }
          : { frequency: 0.62, damping: 0.81, mass: 0.1, stiffness: 0.5 },
    },
    [selectedMap, dragging],
  );

  return (
    <animated.div
      ref={divRef}
      style={{
        opacity: spring.opacity,
        pointerEvents: selectedMap !== null ? "all" : "none",
        transform: spring.translate.to((x) => `translate3d(${x}px, 0, 0)`),
      }}
      className="content-visibility map-place-info-textbox-gradient map-place-info-z-3 map-place-info-grid will-translate font-calamity cursor-touch flex max-h-[35rem] flex-col rounded-lg pb-1 pt-3"
    >
      <div className="fade-in">
        <MapPlaceInfoContent />
      </div>
    </animated.div>
  );
});

MapPlaceInfo.displayName = "MapPlaceInfo";

export default MapPlaceInfo;
