import { animated, useSpring, useTransition } from "@react-spring/web";
import { useMapStore } from "@/stores/useMapStore";
import { useCallback, useState, memo } from "react";
import EncounterMonsContainer from "./EncounterMonsContainer";
import TrainersList from "./TrainersList";

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
    <div className="map-place-info-textbox-gradient flex max-h-[35rem] flex-col rounded-lg pb-1 pt-3 relative">
      {/* scrollable content area */}
    
      {/* floating tab list - moved outside scrollable area */}
      <div
        className="font-pkmnem tab-list flex w-full justify-evenly text-nowrap lg:hidden bg-white/80 backdrop-blur-sm md:absolute md:bottom-0 md:left-0 md:right-0 sm:relative sm:mt-auto"
        style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)" }}
        role="tablist"
        aria-label="Encounter type tabs"
      >
        <button
          title="land"
          className={`tab-label w-8 text-lg font-bold md:text-xl ${selectedTab === "land" && "land-tab"}`}
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
          className={`tab-label w-8 text-lg font-bold ${selectedTab === "water" && "water-tab"}`}
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
          className={`tab-label w-12 text-lg font-bold ${selectedTab === "fishing" && "fishing-tab"}`}
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
        <div className="overflow-y-auto flex-1">
        <EncounterMonsContainer selectedTab={selectedTab} />
      </div>
    </div>
  );
});

MapPlaceInfoContent.displayName = "MapPlaceInfoContent";
const MapPlaceInfoContentAnim = animated(MapPlaceInfoContent);
/** This component is animated. */
const MapPlaceInfo = memo(() => {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const dragging = useMapStore((state) => state.dragging);
  const trainersListOpen = useMapStore((state) => state.isTrainersListOpen);

  // Card shuffling transition - both components exist in DOM during animation
  const shuffleTransition = useTransition(trainersListOpen, {
    from: {
      translateX: "100%",
      opacity: 0,
      // zIndex: 10,
    },
    enter: {
      translateX: "0%",
      opacity: 1,
      // zIndex: 10,
    },
    leave: {
      translateX: "100%",
      opacity: 0,
    },
    config: {
      tension: 280,
      friction: 25,
      mass: 0.8,
    },
  });
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
      style={{
        opacity: spring.opacity,
        pointerEvents: selectedMap !== null ? "all" : "none",
        transform: spring.translate.to((x) => `translate3d(${x}px, 0, 0)`),
        border: "1px solid red",
      }}
      className="content-visibility map-place-info-z-3 h-full map-place-info-grid will-translate font-calamity cursor-touch"
    >
      <button
        onClick={() =>
          useMapStore.getState().setTrainersListOpen(!trainersListOpen)
        }
      >
        <span className="text-lg font-bold">Trainers</span>
      </button>

      <div className="relative">
        {shuffleTransition((style, isOpen) =>
          isOpen ? (
            <animated.div style={style} className="absolute inset-0">
              <TrainersList />
            </animated.div>
          ) : (
            <animated.div
              style={style}
              className="absolute sm:inset-0"
            >
              <MapPlaceInfoContentAnim />
            </animated.div>
          ),
        )}
      </div>
    </animated.div>
  );
});

MapPlaceInfo.displayName = "MapPlaceInfo";

export default MapPlaceInfo;
