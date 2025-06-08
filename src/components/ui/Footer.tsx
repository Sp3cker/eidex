
import { IconContext } from "react-icons";
import DisclaimerModal from "./DisclaimerModal";

const Footer = () => {
  return (
    <IconContext.Provider
      value={{
        color: "var(--color-slate-200)",
        className: "text-baseline md:text-xl cursor-pointer hover:sepia  ",
      }}
    >
      <div className="z-10 flex w-full select-none items-center justify-between bg-gray-800 px-2 ring">
        <div className="font-pkmnem pkmnem-face-shadow text-sm/3 text-neutral-100">
          <p> Dex by Kildemal{" – "}</p>
          <p>
            <a
              href="https://www.youtube.com/watch?v=Vhh_GeBPOhs"
              target="__blank"
            >
              Map by Specker
            </a>
          </p>
        </div>
        <p className="font-pkmnem leading-xs text-sm/3 text-white sm:w-8">
          Data&nbsp;for version:&nbsp;1.3
        </p>
        <div className="flex items-center justify-end gap-5">
          <div className="md:w-full">
            <p className="font-pkmnem leading-xs text-sm/3 text-white ">
              Not an official project of Emerald Imperium.
            </p>
            <p className="font-pkmnem leading-xs text-sm/3 text-white ">
              <DisclaimerModal /> for more details.
            </p>
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default Footer;
