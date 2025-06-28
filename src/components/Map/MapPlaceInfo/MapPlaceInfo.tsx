import { animated, useSpring } from "@react-spring/web";
import { useMapStore } from "@/stores/useMapStore";
import { useCallback, useRef, useEffect, useState } from "react";
import EncounterMonsContainer from "./EncounterMonsContainer";
let currentBackdropAnimation: Animation | null = null;

const deopaque = (
  backdrop: HTMLDivElement,
  direction: "show" | "hide",
  onFinish?: () => void,
) => {
  if (currentBackdropAnimation) {
    currentBackdropAnimation.cancel();
    currentBackdropAnimation = null;
  }

  const showKeyframes = [
    {
      opacity: 0,
    },
    {
      opacity: 1,
    },
  ];

  const hideKeyframes = [
    {
      opacity: 1,
    },
    {
      opacity: 0,
    },
  ];

  if (direction === "show" && backdrop.style.display !== "block") {
    backdrop.style.display = "block";
  }

  currentBackdropAnimation = backdrop.animate(
    direction === "show" ? showKeyframes : hideKeyframes,
    {
      duration: 200,
      easing: direction === "show" ? "ease-out" : "ease-in",
      fill: "forwards",
    },
  );

  currentBackdropAnimation.addEventListener("finish", () => {
    if (direction === "hide") {
      backdrop.style.display = "none";
    }
    currentBackdropAnimation = null;
    if (onFinish) {
      onFinish();
    }
  });

  currentBackdropAnimation.addEventListener("cancel", () => {
    currentBackdropAnimation = null;
  });

  return currentBackdropAnimation;
};

const MapPlaceInfo = () => {
  const [selectedTab, setSelectedTab] = useState("land");
  const selectedMap = useMapStore((state) => state.selectedMap);
  const dragging = useMapStore((state) => state.dragging);
  const divRef = useRef(null);
  const [spring] = useSpring(
    {
      translate: dragging ? 200 : 0,
    },
    [selectedMap, dragging],
  );

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const title = target.getAttribute("title");
    if (title) {
      setSelectedTab(title);
    }
  }, []);
  const prevMapOpen = useRef<boolean>(!!selectedMap);

  useEffect(() => {
    if (!divRef.current) return;

    // Only animate when selectedMap actually toggles
    const wasOpen = prevMapOpen.current;
    const isOpen = !!selectedMap;
    if (isOpen !== wasOpen) {
      deopaque(divRef.current, isOpen ? "show" : "hide");
      prevMapOpen.current = isOpen;
    }
  }, [selectedMap]);
  return (
    <animated.div
      ref={divRef}
      style={{
        display: selectedMap ? "block" : "none",
        pointerEvents: selectedMap !== null ? "all" : "none", // Add this line
        transform: spring.translate.to((x) => `translate3d(${x}px, 0, 0)`),
      }}
      className={`content-visibility map-place-info-textbox-gradient map-place-info-z-3 map-place-info-grid will-translate font-calamity cursor-touch flex max-h-[35rem] min-w-[150px] max-w-[35rem] flex-col rounded-lg pb-1 pt-3`}
    >
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
    </animated.div>
  );
};

export default MapPlaceInfo;
