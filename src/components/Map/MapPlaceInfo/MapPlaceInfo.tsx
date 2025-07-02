import { animated, useSpring, useTransition } from "@react-spring/web";
import { useMapStore } from "@/stores/useMapStore";
import { useCallback, useState, memo } from "react";
import EncounterMonsContainer from "./EncounterMonsContainer";
import TrainersList from "./TrainersList";
import { useElementSize } from "@/hooks/useElementSize";
const EncounterAreaButtons = ({
  handleClick,
  selectedTab,
}: {
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selectedTab: string;
}) => (
  <div
    className="font-pkmnem tab-list flex w-full justify-evenly text-nowrap bg-neutral-200 text-slate-900 lg:hidden"
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 30,
    }}
    role="tablist"
    aria-label="Encounter type tabs"
  >
    <button
      title="land"
      className={`tab-label text-lg font-bold md:text-xl ${selectedTab === "land" && "land-tab"}`}
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
      className={`tab-label text-lg font-bold ${selectedTab === "water" && "water-tab"}`}
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
      className={`tab-label text-lg font-bold ${selectedTab === "fishing" && "fishing-tab"}`}
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
);
const MapPlaceInfoContent = memo(() => {
  const [selectedTab, setSelectedTab] = useState("land");
  const { ref: containerRef, height: containerHeight } = useElementSize();

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const title = target.getAttribute("title");
    if (title) {
      setSelectedTab(title);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative flex h-full flex-col">
      <div className="map-place-info-textbox-gradient h-auto overflow-y-auto rounded-lg pl-1 pt-2 pb-10 lg:h-full">
        <EncounterMonsContainer selectedTab={selectedTab} />
      </div>
      <div
        className="absolute left-0 right-0 z-30"
        style={{
          bottom: 0,
          top: containerHeight > 0 ? `${containerHeight - 64}px` : "auto",
        }}
      >
        <EncounterAreaButtons
          handleClick={handleClick}
          selectedTab={selectedTab}
        />
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

  const shuffleTransition = useTransition(trainersListOpen, {
    from: {
      translateX: "100%",
      opacity: 0,
    },
    enter: {
      translateX: "0%",
      opacity: 1,
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
      className={`content-visibility map-place-info-z-3 map-place-info-grid will-translate font-calamity cursor-touch h-full`}
    >
      <button
        onClick={() =>
          useMapStore.getState().setTrainersListOpen(!trainersListOpen)
        }
      >
        <span className="text-lg font-bold">Trainers</span>
      </button>

      <div className="h-auto w-auto overscroll-y-auto">
        {shuffleTransition((style, isOpen) =>
          isOpen ? (
            <animated.div
              style={style}
              className="absolute bottom-0 left-0 right-0 top-5"
            >
              <TrainersList />
            </animated.div>
          ) : (
            <animated.div
              style={style}
              className="absolute bottom-0 left-0 right-0 top-5"
            >
              <div className="relative h-full">
                <MapPlaceInfoContentAnim />
              </div>
            </animated.div>
          ),
        )}
      </div>
    </animated.div>
  );
});

MapPlaceInfo.displayName = "MapPlaceInfo";

export default MapPlaceInfo;
