import { animated, useSpring } from "@react-spring/web";
import { useMapStore } from "@/stores/useMapStore";
import { useCallback, useState } from "react";
import EncounterMonsList from "./EncounterMonsList";
const SelectedLevel = () => {
  const selectedMapLabel = useMapStore((state) => state.selectedLevelLabel);
  return <h3 className="font-bold text-sm text-neutral-700">{selectedMapLabel}</h3>;
};
const MapPlaceInfo = () => {
  const [selectedTab, setSelectedTab] = useState("land");
  const show = useMapStore((state) => {
    return state.selectedMap !== null && state.dragging === false;
  });
  const [spring] = useSpring(
    {
      opacity: show ? 1 : 0,
      translate: show ? 0 : 200,
    },
    [show],
  );

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
      className={`content-visibility map-place-info-textbox-gradient map-place-info-z-3 map-place-info-grid will-translate font-calamity cursor-touch flex h-full w-[150px] flex-col rounded-lg pb-1`}
    >
      <div className="tabs w-full overflow-hidden px-3 py-3">
        <SelectedLevel />
      </div>
      <div className="mb-1 flex-1 overflow-y-auto">
        {selectedTab === "land" ? (
          <EncounterMonsList zone="land" />
        ) : selectedTab === "water" ? (
          <EncounterMonsList zone="water" />
        ) : selectedTab === "fishing" ? (
          <EncounterMonsList zone="fishing" />
        ) : null}
      </div>
      <div
        className="font-pkmnem tab-list flex w-full justify-evenly text-nowrap"
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
    </animated.div>
  );
};

export default MapPlaceInfo;
