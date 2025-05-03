import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FilterBar } from "./FilterUI";
import { useScreenWidth } from "../../hooks/useScreenWidth";
import { useSpring, animated, useTransition } from "react-spring";

const Drawer = ({
  currOpen,
  toggleOpen,
  currTailwindSize,
  parentRef,
  ...props
}: any) => {
  const desktopDisplayStyles = "flex";
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
  const [currOpen, toggleOpen] = useState(false);
  const currBreakpoint = useScreenWidth();
  const containerRef = useRef(null);
  useEffect(() => {
    if (props.closeDrawer) {
      toggleOpen(false);
    }
  }, [props.closeDrawer]);
  return (
    <div ref={containerRef}>
      <button
        className={`${currBreakpoint === "md" ? "hidden" : ""} pkmnem-face-shadow bg-fieldset font-pkmnem hover:bg-fieldset/80 float-right rounded-sm px-5 text-lg text-gray-200`}
        onClick={() => toggleOpen(!currOpen)}
      >
        ✨ Filters
      </button>
      {currBreakpoint === "md" ? (
        <FilterBar filters={props.filters} setFilters={props.setFilters} />
      ) : (
        <Drawer
          currOpen={currOpen}
          toggleOpen={toggleOpen}
          currTailwindSize={currBreakpoint}
          parentRef={containerRef}
        >
          <FilterBar filters={props.filters} setFilters={props.setFilters} />
        </Drawer>
      )}
    </div>
  );
};

export { DrawerContainer };
