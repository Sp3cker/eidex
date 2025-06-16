import {
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Suspense,
} from "react";

import { useScreenWidth } from "../hooks/useScreenWidth";
import { useSpring, animated } from "@react-spring/web";
import { useUIStore } from "@/stores/uiStore";
import LoadingSpinner from "./ui/LoadingSpinner";
import PokemonModal from "./PokemonModal";
const DrawerContent = lazy(() => import("./DrawerContent"));

const Drawer = ({ currOpen, toggleOpen, currTailwindSize, ...props }: any) => {
  const desktopDisplayStyles = "flex bg-blue-800";
  const mobileDisplayStyles =
    "fixed w-3/4 h-screen right-0 inset-y-0 bg-black/30 backdrop-blur-md";

  const [currDisplayString, setCurrDisplayString] =
    useState(desktopDisplayStyles);
  const [drawerProps] = useSpring(
    {
      transform: currOpen ? `translateX(0%)` : `translateX(100%)`,
      config: { frequency: 0.4 }, // Smooth spring animation
    },
    [currOpen],
  );

  useLayoutEffect(() => {
    if (currTailwindSize === "md") {
      toggleOpen(false);
      return setCurrDisplayString(desktopDisplayStyles);
    }

    // Cleanup on unmount
    if (currOpen === true) {
      // This initializes as false
      setCurrDisplayString(`${mobileDisplayStyles}`);
    }
    if (currOpen === false) {
      setCurrDisplayString(`${mobileDisplayStyles}`);
    }
  }, [currOpen, currTailwindSize]);

  return (
    <animated.nav className={currDisplayString} style={drawerProps}>
      {props.children}
      <div className="justify-center-safe flex w-full flex-row">
        <button
          className="drawer-button pkmnem-face-shadow font-pkmnem"
          style={{
            display: currTailwindSize === "md" ? "none" : "",
          }}
          onClick={() => toggleOpen(!currOpen)}
        >
          <p>☓ Close</p>
        </button>
      </div>
    </animated.nav>
  );
};

const DrawerContainer = (props: any) => {
  const [currOpen, closeDrawer, openDrawer] = useUIStore((state) => [
    state.drawer,
    state.closeDrawer,
    state.openDrawer,
  ]);
  const currBreakpoint = useScreenWidth();
  const containerRef = useRef(null);
  const toggleOpen = useCallback(() => {
    if (currOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }, [currOpen]);

  useEffect(() => {
    if (props.closeDrawer) {
      closeDrawer();
    }
  }, [props.closeDrawer]);
  return (
    <div ref={containerRef} className="bg-gray-800 h-full w-full">
      {currBreakpoint === "md" ? (
        <Suspense fallback={<LoadingSpinner />}>
          <DrawerContent />
        </Suspense>
      ) : (
        <>
          <div
            onClick={toggleOpen}
            className={`${currOpen ? "block" : "hidden"} fade-in-background fixed inset-0 bg-black/80`}
            aria-hidden="true"
          />
          <Drawer
            currOpen={currOpen}
            toggleOpen={toggleOpen}
            currTailwindSize={currBreakpoint}
            parentRef={containerRef}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <DrawerContent />
            </Suspense>
          </Drawer>
          <PokemonModal />
        </>
      )}
    </div>
  );
};

export default DrawerContainer;
