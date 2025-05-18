import { FaDiscord, FaGithubAlt } from "react-icons/fa";
import { IconContext } from "react-icons";

const Footer = () => {
  return (
    <IconContext.Provider
      value={{
        color: "var(--color-slate-200)",
        className: "text-baseline md:text-xl cursor-pointer hover:sepia  ",
      }}
    >
      <div className="fixed bottom-0 left-0 z-10 flex w-full select-none items-center justify-between bg-gray-800 px-1 ring">
        <div className="text-neutral-100 font-calamity pkmnem-face-shadow ">
          <h1 className="md:text-baseline text-sm">
            Dex by Kildemal{" – "}
            <a
              href="https://www.youtube.com/watch?v=Vhh_GeBPOhs"
              target="__blank"
              // className="opacity-0 transition hover:underline hover:opacity-100 hover:drop-shadow-2xl"
            >
              Map by Specker
            </a>
          </h1>
        </div>
        <div className="flex justify-end gap-5 pr-5">
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
