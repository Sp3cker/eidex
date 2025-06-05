import useMapStore from "@/stores/useMapStore";

const ImageViewer = () => {
  const { selectedImageName, setViewingImage, showImage } = useMapStore(
    (state) => ({
      showImage: state.viewingImage,
      selectedImageName: state.selectedImageName,
      setViewingImage: state.setViewingImage,
    }),
  );

  if (selectedImageName === null) {
    return null;
  }
  return (
    <div>
      {/* <img
        src="/Archive/DesertUnderpass.webp"
        className="cursor-pointer max-w-full max-h-[80vh]"
        onClick={() => setShowFull(true)}
        alt="Desert Underpass"
      /> */}
      {showImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-xl font-bold shadow-lg hover:bg-white"
            onClick={() => setViewingImage(false)}
            aria-label="Close full screen image"
          >
            ×
          </button>
          <img
            src={`/Archive/${selectedImageName}.webp`}
            className="max-h-full max-w-full rounded shadow-lg"
            alt="Desert Underpass Fullscreen"
          />
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
