import { animated, useSpring, useTransition } from "@react-spring/web";
import { useMapStore } from "@/stores/useMapStore";
import { useCallback, useState, memo, Suspense } from "react";
import EncounterMonsContainer from "./EncounterMonsContainer";
import TrainersList from "./TrainersList";
import { useElementSize } from "@/hooks/useElementSize";
import InfoToggleButtons from "./InfoToggleButtons";

const EncounterAreaButtons = ({
  handleClick,
  selectedTab,
}: {
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selectedTab: string;
}) => {
  const [haslandTab, hasWaterTab, hasFishingTab] = useMapStore((state) => [
    state.selectedLevelLandMons !== undefined,
    state.selectedLevelWaterMons !== undefined,
    state.selectedLevelFishingMons !== undefined,
  ]);
  return (
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
        disabled={!haslandTab}
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
        disabled={!hasWaterTab}
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
        disabled={!hasFishingTab}
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
};

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
      <div className="map-place-info-textbox-gradient h-full overflow-y-auto rounded-l-lg pb-10 pl-1 pr-3 pt-2 md:rounded-lg lg:h-full">
        <EncounterMonsContainer selectedTab={selectedTab} />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          top: `${containerHeight - 64}px`,
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
      }}
      className={`content-visibility map-place-info-z-3 map-place-info-grid will-translate font-calamity cursor-touch h-full `}
    >
      <InfoToggleButtons />

      <MapInfoSwitcher />
    </animated.div>
  );
});
const MapInfoSwitcher = memo(function Switcher() {
  const trainersListOpen = useMapStore((state) => state.isTrainersListOpen);

  const shuffleTransition = useTransition(trainersListOpen, {
    from: {
      translateX: "50%",
      rotateY: -30,
    },
    enter: {
      translateX: "0%",
      rotateY: 0,
    },
    leave: {
      translateX: "100%",
      rotateY: 30,
    },

    expires: false, // NEED THIS
    config: {
      tension: 280,
      friction: 25,
      mass: 0.8,
    },
  });
  return (
    <div className="h-full py-2">
      <div className="absolute py-2 bottom-0 left-0 right-0 top-7 flex flex-col">
        {shuffleTransition((style, isOpen) => (
          <animated.div style={style} className="absolute inset-0 pl-1 md:p-2">
            {isOpen ? (
              <div className="relative h-full overflow-hidden">
                <Suspense>
                  <TrainersList />
                </Suspense>
              </div>
            ) : (
              <div className="relative h-full">
                <MapPlaceInfoContentAnim />
              </div>
            )}
          </animated.div>
        ))}
      </div>
    </div>
  );
});
MapPlaceInfo.displayName = "MapPlaceInfo";

export default MapPlaceInfo;
