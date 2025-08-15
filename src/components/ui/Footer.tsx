import { lazy, memo, Suspense, useState } from "react";
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
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const handleClick = (to: string) => {
    if (to === "upload") {
      setIsOpen("upload");
    } else {
      setIsOpen("disclaimer");
    }
  };
  const handleUploadButtonHover = () => {
    setIsHoveringButton(true);
  };
  const handleUploadButtonHoverExit = () => {
    setIsHoveringButton(false);
  };
  return (
    <div
      style={PaddingStyles}
      className="footer-bg-text fade-in-footer fixed bottom-0 left-0 right-0 z-10 flex w-full items-center justify-between bg-gray-700 ring md:relative md:bottom-auto"
    >
      {/* ...existing code... */}
      <div className="font-pkmnem pkmnem-face-shadow text-sm/3 text-neutral-100">
        <div
          onMouseEnter={handleUploadButtonHover}
          onMouseLeave={handleUploadButtonHoverExit}
        >
          <Suspense
            fallback={
              <button className="rounded-xs m-1 cursor-pointer bg-gray-600 p-1 font-bold hover:bg-gray-500 active:bg-zinc-600">
                <p>⚗ Coming soon...</p>
              </button>
            }
          >
            <SaveFileUploadButton isOpen={isOpen} onClick={handleClick} />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col sm:w-80">
        <p className="font-pkmnem leading-xs text-sm/3 text-white">
          Data for EI 1.3
        </p>
        <p className="font-pkmnem leading-xs text-sm/3 text-white">
          hows it goin man
        </p>
      </div>
      <div className="flex items-center justify-end gap-5">
        <div className="md:w-full">
          {/* <p className="font-pkmnem leading-xs text-sm/3 text-white">
              Not developed by the Emerald Imperium team.
            </p> */}
          <p className="font-pkmnem leading-xs pr-1 text-sm/3 text-white">
            <button
              onClick={() => handleClick("disclaimer")}
              className="cursor-pointer text-sm/3 text-white underline transition-colors hover:text-emerald-400"
            >
              View disclaimer
            </button>
            <Modal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isHoveringOpenButton={isHoveringButton}
            />
          </p>
        </div>
      </div>
    </div>
  );
});

export default Footer;
