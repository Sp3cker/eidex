import { TrainerPartyMon } from "@/data/map/trainers";

const PartyMonsButtons = ({
  party,
  selectedMon,
  setSelectedMon,
}: {
  party: TrainerPartyMon[];
  selectedMon: number;
  setSelectedMon: (index: number) => void;
}) => {
  if (party.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-center text-lg font-bold text-gray-500">
          No Pokémon in this party.
        </p>
      </div>
    );
  }
  return (
    <div className="h-15 flex flex-row items-center justify-center gap-2 overflow-x-auto">
      {party.map((mon, index) => (
        <button
          key={index}
          className={`party-mon-button rounded rounded-sm ring-1 ${selectedMon === index ? "bg-cyan-200 ring-cyan-500" : "bg-stone-200 ring-stone-800"}`}
          onClick={() => setSelectedMon(index)}
        >
          <div className="md:h-13 md:w-13 overflow- relative mb-1 ml-1 h-9 w-9 overflow-hidden">
            <img
              className="pokemon-sprite sprite-animation md:size-22 size-19 aspect-square drop-shadow-md"
              src={`/icon/${mon.id}/icon.webp`}
            />
          </div>
        </button>
      ))}
    </div>
  );
};
export default PartyMonsButtons;
