import React, { useActionState, useEffect, useReducer, useState } from "react";
import { FilterBar } from "./FilterUI";
import { useTailwindWidth } from "../../hooks/useWindowDimensions";

const Drawer = ({ currOpen, toggleOpen, currTailwindSize, ...props }: any) => {
  const [currDisplayString, setCurrDisplayString] =
    useState("flex mt-20 pt-10");
  const desktopStyle = "fixed z-10 w-3/4 h-screen right-0 inset-y-0 bg-black/30 backdrop-blur-md";

  useEffect(() => {
    console.log(currTailwindSize);
    if (currTailwindSize === "md") {
      toggleOpen(false);
      return setCurrDisplayString("");
    }
    if (currOpen === true) {
      console.log(currOpen);
      // This initializes as false
      setCurrDisplayString(`${desktopStyle} block`);
    }
    if (currOpen === false) {
      return setCurrDisplayString(`${desktopStyle} hidden`);
    }
  }, [currOpen, currTailwindSize]);


  return (
    <nav className={currDisplayString}>
      
      <button
        style={{ display: currTailwindSize === "md" ? "none" : "" }}
        onClick={() => toggleOpen(!currOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <FilterBar filters={props.filters} setFilters={props.setFilters} />
    </nav>
  );
};

const DrawerContainer = (props: any) => {
  const [currOpen, toggleOpen] = useState(false);
  const currBreakpoint = useTailwindWidth();
  return (
    <div>
      <button
        className={`${currBreakpoint === "md" ? "hidden" : ""} float-right pkmnem-face-shadow bg-fieldset font-pkmnem hover:bg-fieldset/80 rounded-sm px-5 text-lg text-gray-200`}
        onClick={() => toggleOpen(!currOpen)}
      >
        Filters
      </button>
      <Drawer
        currOpen={currOpen}
        toggleOpen={toggleOpen}
        currTailwindSize={currBreakpoint}
        {...props}
      />
    </div>
  );
};

export { DrawerContainer };
