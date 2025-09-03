import { lazy, memo, Suspense, useCallback, useRef, useState } from "react";
import { Modal } from "./Modal";
// import HiddenFileDrop from "./HiddenFileDrop";
const PaddingStyles = Object.freeze({
  paddingBottom: "env(safe-area-inset-bottom)",
  paddingLeft: "env(safe-area-inset-left)",
  paddingRight: "env(safe-area-inset-right)",
});
const SaveFileUploadButton = lazy(() => import("./SaveFileUploadButton"));
const Footer = memo(function Footer() {
  const [isOpen, setIsOpen] = useState<"upload" | "disclaimer" | null>(null);

  const modalRef = useRef<{
    preload: (s: "upload" | "disclaimer" | null) => void;
  } | null>(null);

  const handleUploadButtonHover = useCallback(() => {
    modalRef.current?.preload("upload");
  }, [modalRef]);
  const handleUploadButtonHoverExit = useCallback(() => {}, []);
  const handleUploadClick = useCallback(() => {
    setIsOpen("upload");
  }, []);
  const handleDisclosureButtonHover = useCallback(() => {
    modalRef.current?.preload("disclaimer");
  }, []);
  const handleDisclosureButtonHoverExit = useCallback(() => {}, []);
  const handleDisclosureClick = useCallback(() => {
    setIsOpen("disclaimer");
  }, []);
  return (
    <div
      style={PaddingStyles}
      className="footer-bg-text fade-in-footer fixed bottom-0 left-0 right-0 z-10 flex w-full items-center justify-between bg-gray-700 ring md:relative md:bottom-auto"
    >
      <div className="font-pkmnem pkmnem-face-shadow text-sm/3 text-neutral-100">
        <div
          onMouseEnter={handleUploadButtonHover}
          onMouseLeave={handleUploadButtonHoverExit}
        >
          <Suspense
            fallback={
              <button className="rounded-xs m-1 cursor-pointer bg-gray-600 p-1 font-bold hover:bg-gray-500 active:bg-zinc-600">
                <p>⚗ Upload Save File</p>
              </button>
            }
          >
            <SaveFileUploadButton isOpen={isOpen} onClick={handleUploadClick} />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col sm:w-80">
        <p className="font-pkmnem leading-xs text-sm/3 text-white">
          Data for EI 1.3
        </p>
        <p className="font-pkmnem leading-xs text-sm/3 text-white">
            bottom text
        </p>
      </div>
      <div className="flex items-center justify-end gap-5">
        <div className="md:w-full">
          {/* <p className="font-pkmnem leading-xs text-sm/3 text-white">
              Not developed by the Emerald Imperium team.
            </p> */}
          <p className="font-pkmnem leading-xs pr-1 text-sm/3 text-white">
            <button
              onClick={handleDisclosureClick}
              onMouseEnter={handleDisclosureButtonHover}
              onMouseLeave={handleDisclosureButtonHoverExit}
              className="cursor-pointer text-sm/3 text-white underline transition-colors hover:text-emerald-400"
            >
              View disclaimer
            </button>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} ref={modalRef} />
          </p>
        </div>
      </div>
    </div>
  );
});

export default Footer;
