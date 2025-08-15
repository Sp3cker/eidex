import {
  lazy,
  useEffect,
  ReactNode,
  Suspense,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useSpring, animated } from "@react-spring/web";
import { useMapStore } from "@/stores/useMapStore";
import { ErrorBoundary } from "react-error-boundary";
import CloseButton from "../CloseButton";

import { FadeInWAAPI } from "../FadeInWaapi";

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

const importDisclaimer = () => import("./Disclaimer");
const importUploadSave = () => import("./UploadSaveFile");
// Seperate out so i can lazy-load imperatively
const Disclaimer = lazy(importDisclaimer);
const UploadSave = lazy(importUploadSave);

interface ModalProps {
  isOpen: "upload" | "disclaimer" | null;
  setIsOpen: (isOpen: "upload" | "disclaimer" | null) => void;
  isHoveringButton?: boolean;
}
type ModalHandle = {
  preload: (which: "upload" | "disclaimer") => void;
};
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
const Modal = forwardRef<ModalHandle, ModalProps>(function ModalComponent(
  { isOpen, setIsOpen }: ModalProps,
  ref,
) {
  const deselectMap = useMapStore((state) => state.deselectMap);
  const [isHovering, setIsHovering] = useState<"upload" | "disclaimer" | null>(
    null,
  );
  const [springs] = useSpring(
    () => ({
      from: getAnimationFromValues(null), // Start from closed state
      to: isOpen ? openState : closedState,
      delay: 10,
      config: {
        tension: 220,
        damping: 0.2,
        mass: isOpen === "upload" ? 0.5 : 0.75,
      },
    }),
    [isOpen],
  );
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
  useImperativeHandle(
    ref,
    () => ({
      preload(which) {
        if (which) {
          setIsHovering(which);
          if (which === "upload") {
            importUploadSave();
          }
          if (which === "disclaimer") {
            importDisclaimer();
          }
        }
      },
    }),
    [],
  );

  useEffect(() => {
    if (typeof isOpen === "string") {
      deselectMap();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, deselectMap]);

  return (
    <Dialog open={isOpen !== null} onClose={handleClose}>
      <div
        className={`fade-in-background fixed inset-0 z-[2] bg-black/80 ${isHovering && "will-opacity"}`}
        aria-hidden="true"
      />

      <animated.div
        style={springs}
        className={`${isHovering && "will-transform"} z-3 absolute inset-0 flex items-start justify-center overflow-y-auto p-4 ${
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
            <section className="min-h-[50vh]">
              {isOpen ? (
                <Suspense>
                  <FadeInWAAPI>{renderModalContent()}</FadeInWAAPI>
                </Suspense>
              ) : null}
            </section>
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
});

export default Modal;
