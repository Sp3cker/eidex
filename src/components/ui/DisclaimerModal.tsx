import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import { useMapStore } from "../../stores/useMapStore";
import { useSpring, animated, useTrail, config } from "@react-spring/web";
import { ErrorBoundary } from "react-error-boundary";
import CloseButton from "./CloseButton";

const paragraphs = (springAnim: any, index: number) => {
  const pars = [
    <animated.p style={springAnim} key="par1">
      This project gets the item locations from the{" "}
      <a
        className="underline hover:text-blue-200"
        href="https://github.com/iriv24/pokeemerald-expansion"
        target="_blank"
      >
        Emerald Imperium Github repository
      </a>{" "}
      using a parser I wrote/vibe-coded called{" "}
      <a
        href="https://github.com/Sp3cker/spory-sparser"
        target="_blank"
        className="underline hover:text-blue-200"
      >
        SporySparser.
      </a>{" "}
      Trainer movesets are pulled using{" "}
      <a
        className="underline hover:text-blue-200"
        href="https://github.com/lhearachel/porydex"
      >
        LheaRachel's Porydex
      </a>
      , with some tweaks on the export format.
      <br /> If you find an error in the data, please report it in the Discord.
    </animated.p>,
    <animated.p style={springAnim} key="par2">
      I made this map because Gen-3 is best gen and Radical Red is best
      rom-hack, therefore Emerald Imperium is best Gen-3 rom-hack.
    </animated.p>,
    <animated.p style={springAnim} key="par3">
      The official site for the project is{" "}
      <a
        href="https://emeraldimperium.info"
        className="underline hover:text-blue-200"
      >
        emeraldimperium.info
      </a>
      .
    </animated.p>,
    <animated.p style={springAnim} key="par4">
      Anyone else claiming to be the official site is <strong>lying</strong>.
      They&#39;re trying to make money on ads and as a result, give fans like us
      bad names!
    </animated.p>,
    <animated.p style={springAnim} key="par5">
      Further, their profits from ads could bring unwanted attention to our
      community from Nintendo. These are malicous, leechful, and explotative
      actors putting the community they prey on at risk.
    </animated.p>,
    <animated.div style={springAnim} key="par6">
      <p className="cool-font text-sm">
        The source of truth is the Discord and the Pokecommunity post. Stay
        sharp.
      </p>
      <hr />
    </animated.div>,
    <animated.div style={springAnim} key="par7">
      <p>
        For projects <em>I&apos;d</em> endorse, checkout Kildemal&#39;s{" "}
        <a
          href="https://dex.emeraldimperium.net"
          className="underline hover:text-blue-200"
        >
          Official Pokédex
        </a>{" "}
        and iamguitar&#39;s{" "}
        <a
          href="https://emeraldimperium.info/"
          className="underline hover:text-blue-200"
        >
          Pokémon Emerald Imperium Homepage.
        </a>
      </p>
      <p>
        I got the map image from{" "}
        <a
          href="https://www.deviantart.com/jaime07/art/Hoenn-Map-HD-464622982"
          className="underline hover:text-blue-200"
        >
          Jamie07&#39;s DeviantArt
        </a>
      </p>
    </animated.div>,
    <animated.div
      style={springAnim}
      className="font-pkmnem leading-tight"
      key="par8"
    >
      <h3>
        <strong>
          This project is not officially endorsed, sponsored, or affiliated
          with:
        </strong>
      </h3>
      <ul className="list-disc pl-6">
        <li>The developers of Pokémon Emerald Imperium</li>
        <li>The Pokémon Company International</li>
        <li>Nintendo Co., Ltd.</li>
        <li>Game Freak Inc.</li>
        <li>Creatures Inc.</li>
      </ul>

      <p>
        Pokémon and all related characters, names, marks, and logos are
        trademarks of Nintendo, Game Freak, and The Pokémon Company.
      </p>

      <p>
        This tool is provided for educational and informational purposes only.
        All game data and information is used under fair use principles.
      </p>
    </animated.div>,
  ];
  return pars[index];
};

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const deselectMap = useMapStore((state) => state.deselectMap);
  const [springs] = useSpring(
    {
      opacity: isOpen ? 1 : 0,
      translateY: isOpen ? 0 : 20,
    },
    [isOpen],
  );

  const wordSprings = useTrail(8, {
    opacity: isOpen ? 1 : 0,
    clipPath: isOpen ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
    delay: 20,

    config: (key: string) =>
      key === "opacity" ? { clamp: true } : config.stiff,
  });

  useBodyScrollLock(isOpen);

  const handleOpen = () => {
    deselectMap(); // Clear selected map when opening modal
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <span className="z-7">
      <button
        onClick={handleOpen}
        className="text-sm/3 text-white underline transition-colors hover:text-emerald-400"
      >
        View disclaimer
      </button>

      <Dialog open={isOpen} onClose={handleClose} className="z-7">
        <div
          style={{
            backdropFilter: "blur(12px) saturate(120%)",
            WebkitBackdropFilter: "blur(12px) saturate(120%)", // Safari support
          }}
          className="fade-in-background fixed inset-0 bg-black/80"
          aria-hidden="true"
        />
        <animated.div
          style={springs}
          className="will-translate z-7 fixed inset-0 flex items-start justify-center overflow-y-auto p-4"
        >
          <DialogPanel className="z-7 relative my-8 max-h-[calc(100vh-4rem)] w-full max-w-lg rounded-lg bg-zinc-900 p-6 transition">
            <div className="z-7 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <DialogTitle className="cool-font mb-4 text-xl font-bold text-gray-200">
                Disclaimer
              </DialogTitle>
              <CloseButton
                onClick={handleClose}
                className="absolute right-5 top-5"
              />
              <ErrorBoundary fallback={<p>whoopsie</p>}>
                <div className="cool-font space-y-2.5 text-xs/5 text-gray-300 sm:text-sm/5">
                  {wordSprings.map(paragraphs)}
                </div>
              </ErrorBoundary>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleClose}
                  className="rounded bg-emerald-700 px-4 py-2 text-white transition-colors hover:bg-emerald-600"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogPanel>
        </animated.div>
      </Dialog>
    </span>
  );
};

export default DisclaimerModal;
