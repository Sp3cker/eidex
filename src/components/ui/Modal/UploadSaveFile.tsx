import React from "react";
import { DialogTitle } from "@headlessui/react";

import { useRandomizerStore } from "@/stores/randomizerStore";
const RandomizationModesList = [
  { label: "Normal Species", desc: "All species are randomized.", mode: 0 },
  {
    label: "Scaled Species",
    desc: "Species randomize to another species 10.24% of their BST.",
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
    clearEverything,
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
debugger
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
        <p className="leading-0 pb-0 pt-1 text-xs font-bold text-neutral-300">
          Select your Randomization Mode:
        </p>
        <section className="flex flex-col justify-evenly space-x-2 rounded-sm p-2 ring-1 ring-gray-600">
          <div className="flex flex-row justify-evenly space-x-2 rounded-sm py-2 ring-1 ring-gray-800">
            {RandomizationModesList.map((mode) => (
              <div key={mode.mode} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`mode-${mode.mode}`}
                  name="randomizationMode"
                  value={mode.mode ?? undefined}
                  checked={userRandomizerMode === mode.mode}
                  onChange={() => handleModeChange(mode.mode)}
                  className="cursor-pointer"
                />
                <label
                  htmlFor={`mode-${mode.mode}`}
                  className="font-pkmnem cursor-pointer font-bold text-gray-300"
                >
                  {mode.label}
                </label>
              </div>
            ))}
          </div>
          <article className="rounded-xs bg-slate-600 p-1">
            <p className="font-pkmnem bg-slate-600 p-1 text-xl/5 text-stone-200 antialiased">
              {RandomizationModesList[userRandomizerMode ?? 0].desc}
            </p>
          </article>
        </section>
        <div className="flex flex-row space-y-2">
          <input
            type="file"
            accept=".sav,.save"
            onChange={handleFileChange}
            disabled={isUploading || isProcessing}
            className="font-pkmnem file:font-pkmnem block w-full text-lg font-bold text-gray-300 file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-emerald-700 file:px-2 file:py-1 file:font-bold file:text-neutral-50 hover:file:bg-emerald-600 disabled:opacity-50"
          />
        </div>
        <button
          onClick={clearEverything}
          className="font-pkmnem rounded-xs block cursor-pointer text-nowrap px-2 py-0 font-bold text-stone-200 ring-1 ring-amber-500 hover:bg-amber-900"
        >
          Clear Save
        </button>

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
