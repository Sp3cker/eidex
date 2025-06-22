import { useCallback, useState } from "react";
import { useGesture } from "@use-gesture/react";
const usePanAndZoom = () => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const bind = useGesture(
    {
      // Handle wheel events for zooming
      onWheel: ({ event, delta: [, dy] }) => {
        event.preventDefault();

        const newZoom = Math.min(Math.max(zoom - dy * 0.01, 1), 5);
        setZoom(newZoom);

        // Reset position when zooming all the way out
        if (newZoom <= 1) {
          setPosition({ x: 0, y: 0 });
        }
      },

      // Handle drag events for panning
      onDrag: ({ offset: [x, y] }) => {
        // Only allow panning when zoomed in
        if (zoom > 1) {
          setPosition({ x, y });
        }
      },

      // Handle pinch events for touch zoom
      onPinch: ({ offset: [scale] }) => {
        const newZoom = Math.min(Math.max(scale, 1), 5);
        setZoom(newZoom);

        if (newZoom <= 1) {
          setPosition({ x: 0, y: 0 });
        }
      },
    },
    {
      // Configuration options
      drag: {
        preventDefault: true,
        filterTaps: true,
        enabled: zoom > 1, // Only enable dragging when zoomed in
      },
      pinch: {
        scaleBounds: { min: 1, max: 5 },
        rubberband: true, // Smooth resistance at boundaries
      },
      wheel: {
        preventDefault: true,
      },
    },
  );
  const reset = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);
  return {
    zoom,
    position,
reset,
    bind,
  };
};

export default usePanAndZoom;
