import DisclaimerModal from "./DisclaimerModal";
import HiddenFileDrop from "./HiddenFileDrop";
import { memo } from "react";

const Footer = memo(function Footer() {
  return (
    <>
      <style>{`
        .footer-bg-text {
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        .footer-bg-bgtext {
          position: absolute;
          top: -5px;
          left: 0;
          width: 100%;
          // height: 3rem;
          overflow: hidden;
          font-family: 'NBit', sans-serif;
          font-size: 1rem;
          color: var(--color-neutral-100);
          opacity: 0.05;
          white-space: nowrap;
          z-index: -4;
          pointer-events: none;
          overflow: hidden;
          // padding: 0.5rem;
        }
        .footer-bg-bgtext-1 {
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          overflow: hidden;
          font-family: 'NBit', sans-serif;
          font-size: 1rem;
          color: var(--color-neutral-100);
          opacity: 0.05;
          // white-space: nowrap;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          // padding: 0.5rem;
        }
      `}</style>
      <div
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
        className="footer-bg-text fade-in-footer fixed bottom-0 left-0 right-0 z-10 flex w-full items-center justify-between bg-gray-700 px-2 ring md:relative md:bottom-auto"
      >
        <div className="footer-bg-bgtext-1 leading-none">
          {"  "} LFG 1.3 LFG 1.3 LFG GIVE blaziken speed boost back cmon 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 GOATDINOLFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 GOATDINOLFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
        </div>
        {/* ...existing code... */}
        <div className="font-pkmnem pkmnem-face-shadow text-sm/3 text-neutral-100">
          <p>
            {" "}
            Dex by{" "}
            <a
              className="underline hover:bg-gray-600"
              href="https://dex.emeraldimperium.net/"
            >
              Kildemal
            </a>
          </p>
          <p>
            <a
              href="https://www.youtube.com/watch?v=Vhh_GeBPOhs"
              target="_blank"
            >
              Map by Specker ☻
            </a>
          </p>
        </div>
        <div className="flex flex-col sm:w-80">
          <HiddenFileDrop />
          <p className="font-pkmnem leading-xs text-sm/3 text-white">
            Fu*ckin 1.3 FRIDAY!!! GET HYPEEÈ!!
          </p>
        </div>
        <div className="flex items-center justify-end gap-5">
          <div className="md:w-full">
            {/* <p className="font-pkmnem leading-xs text-sm/3 text-white">
              Not developed by the Emerald Imperium team.
            </p> */}
            <p className="font-pkmnem leading-xs pr-1 text-sm/3 text-white">
              <DisclaimerModal />
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

export default Footer;
