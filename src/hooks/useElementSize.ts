import { useRef, useState, useEffect } from "react";

interface ElementDimensions {
  width: number;
  height: number;
}

export const useElementSize = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ElementDimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(element);

    // Initial measurement
    const { width, height } = element.getBoundingClientRect();

    setDimensions({ width, height });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return {
    ref: elementRef,
    dimensions,
    width: dimensions.width,
    height: dimensions.height,
  };
};
