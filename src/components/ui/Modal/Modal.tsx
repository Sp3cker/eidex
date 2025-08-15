import { lazy, useEffect, ReactNode } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useSpring, animated } from "@react-spring/web";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import { useMapStore } from "@/stores/useMapStore";
import { ErrorBoundary } from "react-error-boundary";
import CloseButton from "../CloseButton";

const getAnimationFromValues = (isOpen: "upload" | "disclaimer" | null) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  switch (isOpen) {
    case null:
      return { translateX: 0, translateY: 0, scale: 0.95, opacity: 0 };
    case "upload":
      return {
        translateX: -viewportWidth,
        translateY: viewportHeight,
        scale: 0.3,
        opacity: 0,
      };
    case "disclaimer":
      return {
        translateX: viewportWidth,
        translateY: viewportHeight,
        scale: 0.3,
        opacity: 0,
      };
    default:
      return { translateX: 0, translateY: 0, scale: 1, opacity: 0 };
  }
};

// Lazy load modal content components
const Disclaimer = lazy(() => import("./Disclaimer"));
const UploadSave = lazy(() => import("./UploadSaveFile"));

interface ModalProps {
  isOpen: "upload" | "disclaimer" | null;
  setIsOpen: (isOpen: "upload" | "disclaimer" | null) => void;
  isHoveringOpenButton: boolean;
}
const openState = {
  translateX: 0,
  translateY: 0,
  scale: 1,
  opacity: 1,
};
const closedState = {
  translateX: 0,
  translateY: 0,
  scale: 0.95,
  opacity: 0,
};
const Modal = ({ isOpen, setIsOpen, isHoveringOpenButton }: ModalProps) => {
  const deselectMap = useMapStore((state) => state.deselectMap);

  const [springs] = useSpring(
    {
      from: getAnimationFromValues(null), // Start from closed state
      to: isOpen ? openState : closedState,
      config: {
        tension: 220,
        damping: 0.2,
        mass: isOpen === "upload" ? 0.5 : 0.75,
      },
    },
    [isOpen],
  );

  useBodyScrollLock(typeof isOpen === "string");

  useEffect(() => {
    if (typeof isOpen === "string") {
      deselectMap();
    }
  }, [isOpen, deselectMap]);

  const handleClose = () => {
    setIsOpen(null);
  };

  const renderModalContent = (): ReactNode => {
    switch (isOpen) {
      case "disclaimer":
        return <Disclaimer />;
      case "upload":
        return <UploadSave />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={typeof isOpen === "string"} onClose={handleClose}>
      <div
        className="fade-in-background fixed inset-0 z-[2] bg-black/80"
        aria-hidden="true"
      />

      <animated.div
        style={springs}
        className={`${isHoveringOpenButton && "will-transform"} z-3 absolute inset-0 flex items-start justify-center overflow-y-auto p-4 ${
          isOpen === "disclaimer" ? "origin-bottom-right" : "origin-bottom-left"
        }`}
      >
        <DialogPanel className="relative my-8 w-full max-w-lg rounded-lg bg-zinc-900 p-6 transition">
          <CloseButton
            onClick={handleClose}
            className="absolute right-5 top-5"
          />
          <ErrorBoundary
            fallback={<div className="text-red-500">Something went wrong</div>}
          >
            {renderModalContent()}
          </ErrorBoundary>
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="hover-active-button rounded-sm bg-slate-700 px-4 py-1 text-base text-white sm:text-lg"
              >
                <p>Close</p>
              </button>
            </div>
          </div>
        </DialogPanel>
      </animated.div>
    </Dialog>
  );
};

export default Modal;
