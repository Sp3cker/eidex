import { memo, useCallback, useEffect, useRef } from "react";
import { useMapStore } from "@/stores/useMapStore";

import { shallow } from "zustand/shallow";
import { useSpring, animated } from "@react-spring/web";
import Clock from "./Clock";
import CloseButton from "@/components/ui/CloseButton";
import OpenButton from "./OpenButton";
import SortBar from "./SortBar";
import PlaceListContent from "./PlacesListContent";
import {
  caughtEncounterStore,
  useCaughtEncounterStore,
} from "@/stores/caughtEncounterStore";
import { cancelIdleTask, scheduleIdleTask } from "@/lib/scheduleIdleTask";
// Stable className for Clock to prevent re-renders

// Extract unique map IDs from the mapsvgs data

// Type for a clickable map area/location

// Component to render individual place item

let currentBackdropAnimation: Animation | null = null;

const animateBackdrop = (
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
      backdropFilter: "blur(0px)",
      background: "rgba(0, 0, 0, 0.0)",
    },
    {
      opacity: 0.6,
      backdropFilter: "blur(5px)",
      background: "rgba(0, 0, 0, 0.6)",
    },
  ];

  const hideKeyframes = [
    {
      opacity: 0.6,
      backdropFilter: "blur(5px)",
      background: "rgba(0, 0, 0, 0.6)",
    },
    {
      opacity: 0,
      backdropFilter: "blur(0px)",
      background: "rgba(0, 0, 0, 0.0)",
    },
  ];

  if (direction === "show") {
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

const PlacesList = memo(function PlacesList() {
  const { selectedMap, isPlacesListOpen, setSelectedMap, setPlacesListOpen } =
    useMapStore(
      (state) => ({
        selectedMap: state.selectedMap,
        isPlacesListOpen: state.isPlacesListOpen,
        setSelectedMap: state.setSelectedMap,
        setPlacesListOpen: state.setPlacesListOpen,
      }),
      shallow,
    );

  // Spring animations for sliding in from the left
  const [slideAnimation, api] = useSpring(() => ({
    transform: "translateX(-100%)",
    config: { mass: 0.5, friction: 20 },
  }));
  const backdropRef = useRef<HTMLDivElement>(null);
  const caughtLoadIdleRef = useRef<number | null>(null);
  const caughtStatus = useCaughtEncounterStore((state) => state.status);
  const caughtCount = useCaughtEncounterStore((state) => state.caughtKeys.size);
  const clearCaught = useCaughtEncounterStore((state) => state.clearCaught);

  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    if (isPlacesListOpen) {
      api.start({ transform: "translateX(0%)" });
      animateBackdrop(backdrop, "show");
      if (caughtLoadIdleRef.current !== null) {
        cancelIdleTask(caughtLoadIdleRef.current);
      }
      caughtLoadIdleRef.current = scheduleIdleTask(() => {
        caughtLoadIdleRef.current = null;
        void caughtEncounterStore.getState().beginLazyLoad();
      });
    } else {
      api.start({ transform: "translateX(-100%)" });
      animateBackdrop(backdrop, "hide");
    }
  }, [isPlacesListOpen]);

  useEffect(() => {
    return () => {
      if (caughtLoadIdleRef.current !== null) {
        cancelIdleTask(caughtLoadIdleRef.current);
      }
    };
  }, []);

  const handlePlaceClick = (mapId: string) => {
    setSelectedMap(mapId);
    handleClose();
  };
  const handleClose = useCallback(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    api.start({ transform: "translateX(-100%)" });
    animateBackdrop(backdrop, "hide", () => {
      setPlacesListOpen(false);
    });
  }, [api, setPlacesListOpen]);

  //   if (!isPlacesListOpen) {
  //     return null;
  //   }

  return (
    <>
      <div
        ref={backdropRef}
        style={{ display: "none" }}
        className="places-list-backdrop-z fixed inset-0 hidden bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Static tab that's always visible on the left side */}
      {!isPlacesListOpen && <OpenButton />}

      <animated.nav
        style={slideAnimation}
        className="places-list-z pb-safe-or-8 bg-linear-to-br fixed bottom-6 left-0 top-0 w-80 max-w-[80vw] overflow-hidden border-r border-gray-200 from-emerald-50 via-white to-gray-100 shadow-2xl"
      >
        <div className="bg-linear-to-br sticky top-0 z-10 flex flex-col items-center justify-between border-b border-gray-200 from-neutral-50 via-white to-neutral-100 p-2">
          <div className="flex w-full justify-end">
            <CloseButton
              onClick={handleClose}
              variant="minimal"
              aria-label="Close Places List"
              className="text-neutral-700 hover:bg-neutral-300"
            />
          </div>
          <div className="flex w-full flex-row items-start justify-between pl-1">
            <div>
              <div className="flex flex-col items-start justify-between pb-1">
                <h3 className="font-calamity font-bold text-neutral-700">
                  Hoenn
                </h3>
                <p className="font-pkmnem text-md text-neutral-500">74 areas</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {isPlacesListOpen && <Clock />}
            </div>
          </div>
        </div>

        <SortBar
          rightSide={
            caughtStatus === "ready" &&
            caughtCount > 0 && (
              <button
                type="button"
                onClick={() => void clearCaught()}
                className="hover-active-button font-pkmnem rounded-sm bg-neutral-200 px-2 py-1 text-sm font-bold text-neutral-700 ring-1 ring-neutral-300"
              >
                Clear caught
              </button>
            )
          }
        />

        <div className="h-full overflow-y-auto pb-20">
          <div className="p-2">
            <div className="font-pkmnem flex flex-col gap-2 md:gap-1">
              <PlaceListContent
                handlePlaceClick={handlePlaceClick}
                selectedMap={selectedMap}
              />
            </div>
          </div>
        </div>
      </animated.nav>
    </>
  );
});

export default PlacesList;
