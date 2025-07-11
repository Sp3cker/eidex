const PartyMonsButtons = ({
  partyIds,
  selectedMon,
  onSelectMon,
}: {
  partyIds: number[];
  selectedMon: number;
  onSelectMon: (index: number) => void;
}) => {
  return (
    <div className="party-mons-buttons">
      {partyIds.map((monId) => (
        <button
          key={monId}
          className={`party-mon-button ${selectedMon === monId ? "selected" : ""}`}
          onClick={() => onSelectMon(monId)}
        >
          <div className="md:h-13 md:w-13 relative ml-1 h-10 w-9 overflow-hidden">
            <img
              className="pokemon-sprite sprite-animation md:size-22 aspect-square size-20 object-contain drop-shadow-md"
              src={`/icon/${monId}/icon.webp`}
            />
          </div>
        </button>
      ))}
    </div>
  );
};
export default PartyMonsButtons;
