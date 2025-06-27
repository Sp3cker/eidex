import React from "react";

export function useWindowSize() {
  const [size, setSize] = React.useState<Record<string, number>>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useLayoutEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const handleResize = () => {
      // Clear the previous timeout
      clearTimeout(timeoutId);

      // Set a new timeout to update the state after 150ms of no resize events
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      }, 150);
    };

    // Set initial size
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId); // Clean up timeout on unmount
    };
  }, []);

  return size;
}
