import React from "react";
import { DialogTitle } from "@headlessui/react";

import { useRandomizerStore } from "@/stores/randomizerStore";
const RandomizationModesList = [
  {
    label: "Normal Species",
    desc: "Species can randomize to any other species.",
    mode: 0,
  },
  {
    label: "Scaled Species",
    desc: "Species can randomize to another species within 10.24% of their BST.",
    mode: 1,
  },
  {
    label: "Legendary-Aware",
    desc: "Normal Mode, but excludes legendaries, Ultra Beasts, and Mythicals.",
    mode: 2,
  },
];

const UploadSave = () => {
  const {
    isRandomiserActive,
    handleUpload,
    isUploading,
    isProcessing,
    error,
    trainerIdInfo,
    clearError,
    reset,
    userRandomizerMode,
    setUserRandomizerMode,
  } = useRandomizerStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };
  const handleModeChange = (mode: number) => {
    // setRandomizationMode(mode);
    setUserRandomizerMode(mode);
  };
  const isRadioDisabled = (mode: number) => {
    // If the selected mode is NOT your mode, disable the radio button
    return mode === 2 || (isRandomiserActive && userRandomizerMode !== mode);
  };
  return (
    <div className="font-calamity space-y-4">
      <DialogTitle className="cool-font mb-4 text-xl font-bold text-gray-200">
        Upload Save File
      </DialogTitle>
      <div className="space-y-3">
        <p className="font-calamity text-sm text-gray-300">
          Upload your Emerald Imperium save file to randomize encounters based
          on your trainer ID and randomizer settings.
        </p>
        <p className=" pb-0 pt-1 text-xs text-neutral-300">
          1. Select the <span className="font-bold">Randomization Mode</span>{" "}
          you chose for your game:
        </p>
        <section>
          <div className="space-2 flex flex-row justify-evenly rounded-t-sm bg-slate-700">
            {RandomizationModesList.map((mode) => (
              <div
                key={mode.mode}
                className={`relative flex items-center space-x-2 bg-slate-700`}
              >
                <input
                  type="radio"
                  disabled={mode.mode === 2 || isRadioDisabled(mode.mode)}
                  id={`mode-${mode.mode}`}
                  name="randomizationMode"
                  value={mode.mode ?? undefined}
                  checked={userRandomizerMode === mode.mode}
                  onChange={() => handleModeChange(mode.mode)}
                  className="-mt-0.75 cursor-pointer disabled:bg-zinc-600 sm:-mt-1"
                />
                {mode.mode == 2 && (
                  <div
                    id="coming-soon"
                    className="frosted-glass absolute h-full w-full text-center text-red-500 ring-1 ring-orange-600"
                  >
                    <p>Coming Soon</p>
                  </div>
                )}
                <label
                  htmlFor={`mode-${mode.mode}`}
                  className={`font-pkmnem cursor-pointer text-sm/3 font-bold text-gray-300 sm:text-base/6 ${isRadioDisabled(mode.mode) ? "cursor-default text-gray-600" : ""}`}
                >
                  {mode.label}
                </label>
              </div>
            ))}
          </div>
          <article className="rounded-b-sm bg-slate-600 p-1">
            <p className="font-pkmnem bg-slate-600 p-1 text-xl/5 text-stone-200 antialiased">
              {userRandomizerMode !== null &&
                RandomizationModesList[userRandomizerMode ?? 0].desc}
            </p>
          </article>
        </section>
        <div className="flex flex-row space-y-2">
          {isRandomiserActive ? (
            <button
              onClick={reset}
              className="font-pkmnem rounded-xs block cursor-pointer text-nowrap px-2 py-0 font-bold text-stone-200 ring-1 ring-amber-500 hover:bg-amber-900"
            >
              Clear Save
            </button>
          ) : (
            <section className="space-evenly flex min-h-10 flex-row items-center">
              <input
                type="button"
                className="hover-active-button font-pkmnem mx-auto block h-10 rounded-sm bg-emerald-700 px-2 py-1 text-center text-base font-bold text-slate-100 disabled:bg-slate-900 sm:text-lg"
                id="loadFileXml"
                value={userRandomizerMode === null ? "" : "Upload Save File"}
                disabled={
                  userRandomizerMode === null || isUploading || isProcessing
                }
                onTouchStart={() =>
                  document.getElementById("upload-save")!.click()
                }
                onClickCapture={() =>
                  document.getElementById("upload-save")!.click()
                }
              />

              <input
                type="file"
                id="upload-save"
                accept=".sav,.save"
                onChange={handleFileChange}
                placeholder="Upload Save File please"
                className="hidden"
              />
              <div>
                <p
                  className={`font-calamity fade-in w-full px-10 text-center text-xs text-gray-300 sm:text-sm ${userRandomizerMode === null ? "hidden" : "block"}`}
                >
                  If you notice the randomizer not matching what's in your game,
                  let me know!!!
                </p>

                <p
                  className={`font-calamity fade-in w-full px-10 text-center text-xs text-gray-300 sm:text-sm ${userRandomizerMode === null ? "hidden" : "block"}`}
                >
                  Thanks vStripxz!
                </p>
              </div>
            </section>
          )}
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
              <p>Randomizer Mode:{userRandomizerMode}</p>
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

export default UploadSave;
