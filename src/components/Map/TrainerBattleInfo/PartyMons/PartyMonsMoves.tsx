type ExpandedMove = {
  id: number;
  description: string;
  name: string;
  power: number;
  typeName: string;
  typeColors: string;
};

const PartyMonsMoves = ({ moves }: { moves: ExpandedMove[] }) => {
  return moves.map((m) => (
    <div key={m.name} title={m.id.toString()}>
      <h3 className="font-calamity text-xs font-bold text-stone-800 sm:text-sm/6">
        {m.name}
      </h3>
      <div className="flex min-h-[3rem] flex-row overflow-x-hidden">
        <div className="min-h-[3rem] w-10 md:w-20">
          <p className="text-base/1 py-1">Power</p>
          <p>{m.power}</p>
        </div>
        <div className="w-50 min-h-[2.5rem]">
          <p className="leading-4">{m.description}</p>
        </div>
        <p
          className={`w-8 text-center ${m.typeColors} font-pkmnem pkmnem-face-shadow h-4 text-sm/4 font-bold`}
        >
          {m.typeName}
        </p>
      </div>
    </div>
  ));
};

export default PartyMonsMoves;
