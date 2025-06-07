import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import { useMapStore } from "../../stores/useMapStore";

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const deselectMap = useMapStore((state) => state.deselectMap);

  useBodyScrollLock(isOpen);

  const handleOpen = () => {
    deselectMap(); // Clear selected map when opening modal
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-sm/3 text-white underline transition-colors hover:text-emerald-400"
      >
        Click here
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed inset-0 flex items-start justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-lg rounded-lg bg-zinc-900 p-6 transition my-8 max-h-[calc(100vh-4rem)]">
            <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
            <DialogTitle className="cool-font mb-4 text-xl font-bold text-gray-200">
              Disclaimer
            </DialogTitle>

            <div className="space-y-4 text-gray-300">
              <p className="cool-font text-sm">
                I made this map because Gen 3 is best gen and RR is best
                rom-hack, therefore Emerald Imperium is best gen-3 rom-hack.
                It&#39;s not the &quot;official&quot; map or site or
                anything.{" "}
              </p>
              <small></small>
              <p className="cool-font text-sm">
                In fact, there&#39;s no &quot;official&quot; site! Anyone claiming to be the
                official site is trying to make money on ads! They give fans
                like us bad names! Further, them making a profit from ads could
                bring unwanted attention from Nintendo. All-around, harmful
                actions from malicous, leechful actors.
              </p>
              <p className="cool-font text-sm">
                The source of truth is the Discord and the Pokecommunity post. Stay sharp.
              </p>

              <div className="font-pkmnem leading-tight">
                <h3>
                  <strong>
                    This project is not officially endorsed, sponsored, or
                    affiliated with:
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
                  Pokémon and all related characters, names, marks, and logos
                  are trademarks of Nintendo, Game Freak, and The Pokémon
                  Company.
                </p>

                <p>
                  This tool is provided for educational and informational
                  purposes only. All game data and information is used under
                  fair use principles.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setIsOpen(false)}
                className="rounded bg-emerald-700 px-4 py-2 text-white transition-colors hover:bg-emerald-600"
              >
                Close
              </Button>
            </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default DisclaimerModal;
