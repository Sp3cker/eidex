import { useEffect } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useSpring, animated, useTrail, config } from "@react-spring/web";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import { useMapStore } from "@/stores/useMapStore";

import { ErrorBoundary } from "react-error-boundary";
import CloseButton from "../CloseButton";
import { useRandomizerStore } from "@/stores/randomizerStore";

// THESE ARE REVERSED BECAUSE REACT-SPRING IS BUGGY
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paragraphs = (springAnim: any, index: number) => {
  const pars = [
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
    <animated.div style={springAnim} key="par6">
      <p className="cool-font text-sm">
        The source of truth is the Discord and the Pokecommunity post. Stay
        sharp.
      </p>
      <hr />
    </animated.div>,
    <animated.p style={springAnim} key="par5">
      Further, their profits from ads could bring unwanted attention to our
      community from Nintendo. These are malicous, leechful, and explotative
      actors putting the community they prey on at risk.
    </animated.p>,
    <animated.p style={springAnim} key="par4">
      Anyone else claiming to be the official site is <strong>lying</strong>.
      They&#39;re trying to make money on ads and as a result, give fans like us
      bad names!
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
    <animated.p style={springAnim} key="par2">
      I made this map because Gen-3 is best gen and Radical Red is best
      rom-hack, therefore Emerald Imperium is best Gen-3 rom-hack.
    </animated.p>,
    <animated.p style={springAnim} key="par1">
      This project gets the item locations from the{" "}
      <a
        className="underline hover:text-blue-200"
        href="https://github.com/iriv24/pokeemerald-expansion"
        target="_blank"
        rel="noreferrer"
      >
        Emerald Imperium Github repository
      </a>{" "}
      using a parser I wrote/vibe-coded called{" "}
      <a
        href="https://github.com/Sp3cker/spory-sparser"
        target="_blank"
        rel="noreferrer"
        className="underline hover:text-blue-200"
      >
        SporySparser.
      </a>{" "}
      Trainer movesets are pulled using{" "}
      <a
        className="underline hover:text-blue-200"
        href="https://github.com/lhearachel/porydex"
      >
        LheaRachel&apos;s Porydex
      </a>
      , with some tweaks on the export format.
      <br /> If you find an error in the data, please report it in the Discord.
    </animated.p>,
  ];
  return pars[index];
};
const Disclaimer = () => {
  const wordSprings = useTrail(8, {
    from: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    to: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
    delay: 20,
    reverse: false,
    config: (key: string) =>
      key === "opacity" ? { clamp: true } : config.stiff,
  });

  return (
    <>
      <DialogTitle className="cool-font mb-4 text-xl font-bold text-gray-200">
        Disclaimer
      </DialogTitle>
      <ErrorBoundary fallback={<p>whoopsie</p>}>
        <div className="cool-font space-y-2.5 text-xs/5 text-gray-300 sm:text-sm/5">
          {wordSprings
            .slice()
            .reverse()
            .map((springAnim, index) => paragraphs(springAnim, 7 - index))}
        </div>
      </ErrorBoundary>
    </>
  );
};
const UploadSave = () => {
  const {
    isRandomiserActive,
    handleUpload,
    isUploading,
    isProcessing,
    error,
    trainerIdInfo,
    clearError,
    clearEverything,
  } = useRandomizerStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-4 font-calamity">
      <DialogTitle className="cool-font mb-4 text-xl font-bold text-gray-200">
        Upload Save File
      </DialogTitle>
      <button onClick={clearEverything}>Clear Everything</button>
      <div className="space-y-3">
        <p className="font-calamity text-sm text-gray-300">
          Upload your Emerald Imperium save file to randomize encounters based
          on your trainer ID and randomizer settings.
        </p>

        <div className="space-y-2">
          <input
            type="file"
            accept=".sav,.save"
            onChange={handleFileChange}
            disabled={isUploading || isProcessing}
            className="font-pkmnem font-bold text-lg block w-full text-gray-300 file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:font-bold file:text-neutral-50 hover:file:bg-emerald-600 disabled:opacity-50"
          />
        </div>

        {(isUploading || isProcessing) && (
          <div className="flex items-center space-x-2 text-sm text-blue-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
            <span>
              {isUploading
                ? "Reading save file..."
                : "Processing data and randomizing encounters..."}
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-500 bg-red-900/50 p-3">
            <div className="flex items-start justify-between">
              <p className="text-sm text-red-200">{error}</p>
              <button
                onClick={clearError}
                className="ml-2 text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {isRandomiserActive && trainerIdInfo && (
          <div className="font-pkmnem space-y-2 rounded-md border border-green-500 bg-green-900/50 p-3 text-xl">
            <p className="font-bold text-green-200">
              Save file processed successfully!
            </p>
            <div className="space-y-1 text-green-300">
              <p>Trainer ID: {trainerIdInfo.trainerId}</p>
              <p>Secret ID: {trainerIdInfo.secretId}</p>
              <p>Full ID: {trainerIdInfo.fullId}</p>
              <p>Randomizer Mode: {trainerIdInfo.randomizerMode}</p>
            </div>
            <p className="text-green-200">
              Encounters have been randomized based on your save data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
const Modal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: string | null;
  setIsOpen: (isOpen: string | null) => void;
}) => {
  const deselectMap = useMapStore((state) => state.deselectMap);
  const [springs] = useSpring(
    {
      opacity: isOpen ? 1 : 0,
      translateY: isOpen ? 0 : 20,
    },
    [isOpen],
  );

  useBodyScrollLock(typeof isOpen === "string");

  useEffect(() => {
    if (typeof isOpen === "string") {
      deselectMap();
    }
  }, [isOpen]);
  const handleClose = () => {
    setIsOpen(null);
  };
  return (
    <span className="z-7">
      <Dialog
        open={typeof isOpen === "string"}
        onClose={handleClose}
        className="z-7"
      >
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
            <CloseButton
              onClick={handleClose}
              className="absolute right-5 top-5"
            />
            {isOpen === "disclaimer" && <Disclaimer />}
            {isOpen === "upload" && <UploadSave />}
            <div className="z-7 max-h-[calc(100vh-8rem)] overflow-y-auto">
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

export default Modal;
