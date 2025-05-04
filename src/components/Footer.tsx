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
      <div className="footer ring-fieldset font-pkmnem pkmnem-face-shadow flex select-none items-center justify-between bg-gray-800 px-1 ring">
        <h1 className="text-sm md:text-baseline">
          Brought to you by Kildemal{" "}
          <a
            href="https://www.youtube.com/watch?v=Vhh_GeBPOhs"
            target="__blank"
            className="opacity-0 transition hover:underline hover:opacity-100 hover:drop-shadow-2xl"
          >
            & Specker
          </a>
        </h1>
        <div
          className="w-6"
          onClick={() => {
            const chirp = new Audio("/mono.mp3");
            chirp.volume = 0.5;
            chirp.play();
          }}
        >
          <h1 className="m-0 cursor-pointer p-0 text-xl hover:underline hover:drop-shadow-2xl">
            ♫
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
