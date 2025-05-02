//https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  // I need to research if `useLayoutEffect` or `useInsertionEffect` would be better here...
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export const useTailwindWidth = (): string => {
  const { width } = useWindowDimensions();
  if (width < 768) {
    return "sm";
  }
  return "md";
};
