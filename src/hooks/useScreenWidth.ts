//https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
import { useState, useEffect } from "react";

type ScreenWidth = "xs" | "sm" | "md" | "lg";

//Got numbers from here: https://tailwindcss.com/docs/responsive-design
// const getScreenWidth = (): ScreenWidth => {
//   const width = window.innerWidth;
//   return width > 768 && width < 1024
//     ? "md"
//     : width <= 451
//       ? "sm"
//       : width >= 1024
//         ? "lg"
//         : "xs";
// };
const getScreenWidth = (): ScreenWidth => {
  // Guard against SSR
  if (typeof window === "undefined") return "md"; // Default fallback

  const width = window.innerWidth;

  if (width >= 1024) return "lg";
  if (width >= 768) return "md";
  if (width >= 640) return "sm"; // Fixed: Tailwind's sm breakpoint is 640px
  return "xs";
};

export const useScreenWidth = (): ScreenWidth => {
  const [screenWidth, setWindowDimensions] = useState(getScreenWidth());
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function handleResize() {
      // Clear the previous timeout
      clearTimeout(timeoutId);

      // Set a new timeout to update the state after 150ms of no resize events
      timeoutId = setTimeout(() => {
        setWindowDimensions(getScreenWidth());
      }, 150);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId); // Clean up timeout on unmount
    };
  }, []);

  return screenWidth;
};
