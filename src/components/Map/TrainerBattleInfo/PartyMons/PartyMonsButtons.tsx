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
    <div className="flex flex-row items-center justify-center gap-2 overflow-x-auto">
      {party.map((mon, index) => (
        <button
          key={index}
          className={`party-mon-button ${selectedMon === index ? "selected" : ""}`}
          onClick={() => setSelectedMon(index)}
        >
          <div className="md:h-13 md:w-13 relative ml-1 h-10 w-9 overflow-hidden">
            <img
              className="pokemon-sprite sprite-animation md:size-22 aspect-square size-20 object-contain drop-shadow-md"
              src={`/icon/${mon.id}/icon.webp`}
            />
          </div>
        </button>
      ))}
    </div>
  );
};
export default PartyMonsButtons;
