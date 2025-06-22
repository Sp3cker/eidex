import useMapStore from "@/stores/useMapStore";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { config, useSprings } from "@react-spring/web";
import itemSearch from "@/utils/itemsData";
import { shallow } from "zustand/shallow";
import usePanAndZoom from "./usePanAndZoom";
import "./imageViewer.css";
import PickupItemMarker from "./PlaceItemMarker";
const ImageViewer = () => {
  const { selectedImageName, setViewingImage, showImage, items, level } =
    useMapStore(
      (state) => ({
        showImage: state.viewingImage,
        selectedImageName: state.selectedImageName,
        setViewingImage: state.setViewingImage,
        items: state.selectedMapItems,
        level: state.selectedLevelId,
      }),
      shallow,
    );

  const [imgDimensions, setImgDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [displayedSize, setDisplayedSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { zoom, position, reset, bind } = usePanAndZoom();
  const handleImageLoad = useCallback((e: any) => {
    const img = e.currentTarget;
    setImgDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    // Get displayed dimensions
    const rect = img.getBoundingClientRect();
    setDisplayedSize({ width: rect.width, height: rect.height });
  }, []);
  const handleClose = useCallback(() => {
    reset();
    setViewingImage(false);
  }, []);
  const pickupItems = useMemo(() => {
    if (!level) return [];
    const items = itemSearch.byLevel(level);

    if (items) {
      return items;
    }
    return []; // items?.pickupItems;
  }, [items?.pickupItems]);

  const [springs] = useSprings(
    pickupItems.length,
    (index) => ({
      opacity: showImage ? 1 : 0,
      // transform: showImage ? "translateY(0px)" : "translateY(0px)",
      config: config.gentle,
      delay: 21 * index,
    }),
    [pickupItems.length, showImage],
  );

  // Update displayed size on window resize
  useEffect(() => {
    const updateDisplayedSize = () => {
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        setDisplayedSize({ width: rect.width, height: rect.height });
      }
    };

    window.addEventListener("resize", updateDisplayedSize);
    return () => window.removeEventListener("resize", updateDisplayedSize);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setViewingImage]);

  if (selectedImageName === null) {
    return null;
  }
  const contentStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
    transformOrigin: "center center", // Zoom from the center
    cursor: zoom > 1 ? "grab" : "default",
    transition: "transform 0.1s ease-out",
  };
  return (
    <div>
      {showImage && (
        <div className="image-viewer-overlay">
          <button
            className="image-viewer-close-button"
            onClick={handleClose}
            aria-label="Close full screen image"
          >
            ×
          </button>
          <div className="image-viewer-container" {...bind()}>
            <div style={contentStyle}>
              <img
                draggable={false}
                ref={imgRef}
                src={`/Archive/${selectedImageName}.webp`}
                className="image-viewer-img"
                alt={`${selectedImageName}`}
                onLoad={handleImageLoad}
              />
              {/* Render pickup item markers */}
              {showImage &&
                pickupItems &&
                imgDimensions &&
                displayedSize &&
                springs.map((spring, idx: number) => {
                  // Calculate scale factors
                  const scaleX = displayedSize.width / imgDimensions.width;
                  const scaleY = displayedSize.height / imgDimensions.height;
                  const item = pickupItems[idx];

                  return (
                    <PickupItemMarker
                      item={item}
                      scaleX={scaleX}
                      scaleY={scaleY}
                      spring={spring}
                      key={idx}
                    />
                  );
                })}
            </div>
          </div>
          {/* Example: show dimensions for debugging */}
          {/* {imgDimensions && displayedSize && (
            <div className="debug-info">
              <div>
                Original: {imgDimensions.width} x {imgDimensions.height}
              </div>
              <div>
                Displayed: {Math.round(displayedSize.width)} x{" "}
                {Math.round(displayedSize.height)}
              </div>
              <div>
                Scale: {(displayedSize.width / imgDimensions.width).toFixed(3)}{" "}
                x {(displayedSize.height / imgDimensions.height).toFixed(3)}
              </div>
            </div>
          )} */}
          <p className="status-text cool-font">
            {" "}
            Image viewer isn&apos;t done yet, ok...
          </p>
          <p className="status-text cool-font">
            {" "}
            Some things are not where they should be.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
