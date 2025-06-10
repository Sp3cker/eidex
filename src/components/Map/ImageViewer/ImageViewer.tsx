import useMapStore from "@/stores/useMapStore";
import { useMemo, useState, useRef, useEffect } from "react";
import { animated, config, useSprings } from "react-spring";
import { getItemSpriteStyle } from "@/utils/itemSprites";
import itemSearch from "@/utils/itemsData";
import { shallow } from "zustand/shallow";
import "./imageViewer.css";
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
      shallow
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

  if (selectedImageName === null) {
    return null;
  }

  return (
    <div>
      {showImage && (
        <div className="image-viewer-overlay">
          <button
            className="image-viewer-close-button"
            onClick={() => setViewingImage(false)}
            aria-label="Close full screen image"
          >
            ×
          </button>
          <div className="image-viewer-container">
            <img
              ref={imgRef}
              src={`/Archive/${selectedImageName}.webp`}
              className="image-viewer-img"
              alt={`${selectedImageName}`}
              onLoad={(e) => {
                const img = e.currentTarget;
                setImgDimensions({
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
                // Get displayed dimensions
                const rect = img.getBoundingClientRect();
                setDisplayedSize({ width: rect.width, height: rect.height });
              }}
            />
            {/* Render pickup item markers */}
            {pickupItems &&
              imgDimensions &&
              displayedSize &&
              springs.map((spring, idx: number) => {
                // Calculate scale factors
                const scaleX = displayedSize.width / imgDimensions.width;
                const scaleY = displayedSize.height / imgDimensions.height;
                const item = pickupItems[idx];

                return (
                  <animated.div
                    key={idx}
                    className="pickup-item-marker"
                    style={{
                      ...spring,
                      left: (item.coords[0] * 16 + 8) * scaleX, // Apply scale to X coordinate, +8 for center of 16px tile
                      top: (item.coords[1] * 16 + 8) * scaleY, // Apply scale to Y coordinate, +8 for center of 16px tile
                    }}
                  >
                    <div className="pickup-item-tooltip cool-font">
                      <div
                        className="rendering-pixelated"
                        style={getItemSpriteStyle(item.id, 16) || {}}
                      />
                      <span className="item-name">{item.name || "Item"}</span>
                    </div>
                    {/* Pointer triangle */}
                    <div className="pickup-item-arrow" />
                  </animated.div>
                );
              })}
          </div>
          {/* Example: show dimensions for debugging */}
          {imgDimensions && displayedSize && (
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
          )}
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
