import useMapStore from "@/stores/useMapStore";
import { useMemo, useState } from "react";

const ImageViewer = () => {
  const { selectedImageName, setViewingImage, showImage, items } = useMapStore(
    (state) => ({
      showImage: state.viewingImage,
      selectedImageName: state.selectedImageName,
      setViewingImage: state.setViewingImage,
      items: state.selectedMapItems,
    }),
  );

  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);

  const pickupItems = useMemo(() => {
    if (!items) return [];

    return items?.pickupItems;
  }, [items?.pickupItems]);
  if (selectedImageName === null) {
    return null;
  }

  return (
    <div>
      {showImage && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-2 sm:p-4">
          <button
            className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-full bg-white/80 p-1 sm:p-2 text-lg sm:text-xl font-bold shadow-lg hover:bg-white"
            onClick={() => setViewingImage(false)}
            aria-label="Close full screen image"
          >
            ×
          </button>
          <div className="relative max-w-[90vw] max-h-[85vh] sm:max-w-[95vw] sm:max-h-[90vh]">
            <img
              src={`/Archive/${selectedImageName}.webp`}
              className="max-h-full max-w-full rounded shadow-lg object-contain"
              alt={`${selectedImageName}`}
              onLoad={e => {
                const img = e.currentTarget;
                setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
              }}
            />
            {/* Render pickup item markers */}
            {pickupItems && pickupItems.map((item, idx: number) => (
              <div
                key={idx}
                className="absolute z-10 flex flex-col items-center"
                style={{
                  left: item.coords[0] * 16 + 6, // shift right by 6px
                  top: item.coords[1] * 16,
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'auto',
                }}
              >
                <div className="bg-yellow-400 cool-font font-bold text-black text-xs px-2 py-1 rounded shadow-lg relative">
                  {item.name || 'Item'}
                </div>
                {/* Pointer triangle */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '8px solid var(--color-yellow-400)', // Tailwind yellow-400
                    marginTop: '-2px',
                  }}
                />
              </div>
            ))}
          </div>
          {/* Example: show dimensions for debugging */}
          {imgDimensions && (
            <div className="text-white text-xs sm:text-sm mt-2">Image size: {imgDimensions.width} x {imgDimensions.height}</div>
          )}
          <p className="cool-font text-white text-sm sm:text-base"> Image viewer isn&apos;t done yet, ok...</p>
          <p className="cool-font text-white text-sm sm:text-base"> Some things are not where they should be.</p>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
