import { TrainerPartyMon } from "@/data/map/trainers";
import { memo } from "react";
// import { useEffect, type Dispatch, type SetStateAction } from "react";

const PartyMonsButtons = memo(
  function PartyMonsButtons({
    party,
    selectedMon,
    setSelectedMon,
  }: {
    party: TrainerPartyMon[];
    selectedMon: number;
    setSelectedMon: (next: number) => void;
  }) {
    // useEffect(() => {
    //   if (selectedMon >= party.length) {
    //     setSelectedMon((prevState) => [
    //       selectedMon,
    //       selectedMon > prevState[0] ? 1 : -1,
    //     ]);
    //   }
    // }, [selectedMon, party.length, setSelectedMon]);
    if (party.length === 0) {
      return (
        <div className="flex-2 flex h-full w-full items-center justify-center">
          <p className="text-center text-lg font-bold text-gray-500">
            No Pokémon in this party.
          </p>
        </div>
      );
    }
    return (
      <div className="h-15 flex-2 flex w-fit flex-row items-center justify-end gap-1 overflow-x-auto sm:justify-center sm:gap-2">
        {party.map((mon, index) => (
          <button
            key={index}
            className={`party-mon-button inset-shadow-xl hover:bg-mon-select cursor-pointer rounded rounded-sm ring-1 ${selectedMon === index ? "bg-mon-select ring-cyan-500" : "bg-stone-200 ring-stone-800"}`}
            onClick={() => setSelectedMon(index)}
          >
            <div className="relative h-8 w-8 overflow-hidden md:h-10 md:w-10">
              <img
                className="aspect-square drop-shadow-lg"
                src={`/icon/${mon.id}/icon.webp`}
              />
            </div>
          </button>
        ))}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.party[0] === next.party[0] &&
      prev.party.length === next.party.length &&
      prev.selectedMon === next.selectedMon
    );
  },
);
export default PartyMonsButtons;
