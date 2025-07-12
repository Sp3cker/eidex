import DisclaimerModal from "./DisclaimerModal";
import HiddenFileDrop from "./HiddenFileDrop";
import { memo } from "react";

const Footer = memo(function Footer() {
  return (
    <div
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
      className="fade-in-footer fixed bottom-0 left-0 right-0 z-10 flex w-full items-center justify-between bg-gray-700 px-2 ring md:relative md:bottom-auto"
    >
      <div className="font-pkmnem pkmnem-face-shadow text-sm/3 text-neutral-100">
        <p> Dex by Kildemal</p>
        <p>
          <a href="https://www.youtube.com/watch?v=Vhh_GeBPOhs" target="_blank">
            Map by Specker ☻
          </a>
        </p>
      </div>
      <div className="flex flex-col sm:w-80">
        <HiddenFileDrop />
        <p className="font-pkmnem leading-xs text-sm/3 text-white">
          Nah Blaziken is cool.
        </p>
      </div>
      <div className="flex items-center justify-end gap-5">
        <div className="md:w-full">
          <p className="font-pkmnem leading-xs text-sm/3 text-white">
            Not a project from Emerald Imperium team.
          </p>
          <p className="font-pkmnem leading-xs text-sm/3 text-white">
            <DisclaimerModal /> for more details.
          </p>
        </div>
      </div>
    </div>
  );
});

export default Footer;
