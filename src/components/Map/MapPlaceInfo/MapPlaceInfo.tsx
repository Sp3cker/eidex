import { animated, useSpring, useTransition } from "@react-spring/web";
import { useMapStore } from "@/stores/useMapStore";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  Suspense,
  lazy,
} from "react";
import EncounterMonsContainer from "./EncounterMonsContainer";
import TrainersList from "./TrainersList";
import { useElementSize } from "@/hooks/useElementSize";
import InfoToggleButtons from "./InfoToggleButtons";
import ScrollArea from "@/components/ui/ScrollArea";

const CaughtStoreLoader = lazy(() => import("./CaughtStoreLoader"));

const DRAGGING_TRANSLATE = 100;
const XS_SCREEN = window.innerWidth > 768;
const OVERLAY_RETURN_DELAY_MS = 260;

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

  const handleTabClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget;
      const title = target.getAttribute("title");
      if (title) {
        setSelectedTab(title);
      }
    },
    [],
  );
  const topStyle = {
    top: `${containerHeight - 64}px`,
  };
  // Determine which page to show (0 for list, 1 for details)

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto relative flex h-full flex-col"
    >
      <ScrollArea
        className="map-place-info-textbox-gradient simplebar-theme-map h-full rounded-l-lg pb-10 pl-1 pr-3 pt-2 md:rounded-lg lg:h-full"
        noX
      >
        <EncounterMonsContainer selectedTab={selectedTab} />
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0" style={topStyle}>
        <EncounterAreaButtons
          handleClick={handleTabClick}
          selectedTab={selectedTab}
        />
      </div>
    </div>
  );
});

MapPlaceInfoContent.displayName = "MapPlaceInfoContent";

const MapPlaceInfo = memo(() => {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const dragging = useMapStore((state) => state.dragging);
  const isTrainersListOpen = useMapStore((state) => state.isTrainersListOpen);
  const wasDraggingRef = useRef(false);
  const [shouldLoadCaughtStore, setShouldLoadCaughtStore] = useState(false);
  const shouldDelayOverlayReturn =
    selectedMap !== null && !dragging && wasDraggingRef.current;

  useEffect(() => {
    wasDraggingRef.current = dragging;
  }, [dragging]);

  const [spring] = useSpring(
    {
      translate: selectedMap
        ? dragging
          ? DRAGGING_TRANSLATE
          : isTrainersListOpen && XS_SCREEN
            ? DRAGGING_TRANSLATE
            : 0
        : 100,
      opacity: selectedMap ? 1 : 0,
      delay: shouldDelayOverlayReturn ? OVERLAY_RETURN_DELAY_MS : 0,
      onRest: () => {
        if (!selectedMap) {
          return;
        }
        setShouldLoadCaughtStore(true);
      },
      config: (key: string) =>
        key === "opacity"
          ? { duration: 200 }
          : {
              tension: 280,
              friction: 25,
              mass: isTrainersListOpen ? 0.5 : 0.75,
            },
    },
    [selectedMap, dragging, isTrainersListOpen, shouldDelayOverlayReturn],
  );

  return (
    <div
      className={`map-place-info-z-3 map-place-info-grid font-calamity pointer-events-none`}
    >
      <div className={selectedMap ? "visible" : "invisible"}>
        <InfoToggleButtons />
      </div>
      <animated.div
        style={{
          opacity: spring.opacity,
          transform: spring.translate.to((x) => `translate3d(${x}px, 0, 0)`),
        }}
        className={`${!selectedMap && "will-translate-opacity"} pointer-events-none h-full`}
      >
        <MapInfoSwitcher />
      </animated.div>
      {shouldLoadCaughtStore && (
        <Suspense fallback={null}>
          <CaughtStoreLoader />
        </Suspense>
      )}
    </div>
  );
});
MapPlaceInfo.displayName = "MapPlaceInfo";

const pages = [
  ({ style }: any) => (
    <animated.div style={style} className="absolute inset-0 pl-1 md:p-2">
      <div className="relative h-full overflow-hidden">
        <Suspense>
          <TrainersList />
        </Suspense>
      </div>
    </animated.div>
  ),
  ({ style }: any) => (
    <animated.div style={style} className="absolute inset-0 pl-1 md:p-2">
      <div className="relative h-full">
        <MapPlaceInfoContent />
      </div>
    </animated.div>
  ),
];

const MapInfoSwitcher = memo(function Switcher() {
  const trainersListOpen = useMapStore((state) => state.isTrainersListOpen);
  const shuffleTransition = useTransition(trainersListOpen, {
    from: {
      translateX: "100%",
    },
    enter: {
      translateX: "0%",
    },
    leave: {
      translateX: "100%",
    },
    expires: false, // NEED THIS
    config: (showingTrainers) =>
      showingTrainers
        ? { tension: 220, friction: 21, mass: 0.8 }
        : {
            tension: 280,
            friction: 25,
            mass: 0.8,
          },
  });

  return (
    <div className="pointer-events-none h-full py-2">
      <animated.div className="absolute bottom-0 left-0 right-0 top-0 py-2">
        {shuffleTransition((style, isOpen) => pages[isOpen ? 0 : 1]({ style }))}
      </animated.div>
    </div>
  );
});
MapPlaceInfo.displayName = "MapPlaceInfo";

export default MapPlaceInfo;
