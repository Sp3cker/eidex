import { FaDiscord, FaGithubAlt } from "react-icons/fa";
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
        <div className="font-pkmnem text-sm/3 pkmnem-face-shadow text-neutral-100">
           <h3> Dex by Kildemal{" – "}
            <a
              href="https://www.youtube.com/watch?v=Vhh_GeBPOhs"
              target="__blank"
              // className="opacity-0 transition hover:underline hover:opacity-100 hover:drop-shadow-2xl"
            >
              Map by Specker
            </a>
          </h3>
        </div>
        <div className="flex justify-end items-center gap-5">
          <p className="font-pkmnem text-white text-sm/3 leading-xs">
            Not an official project of Emerald Imperium. <DisclaimerModal /> for more details.
          </p>
          <FaDiscord />
          <a href="https://github.com/izrofid/eidex" target="__blank">
            <FaGithubAlt />
          </a>
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default Footer;
