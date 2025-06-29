// Row of move prop text

import { Move } from "@/types";
import { capitalize } from "@/utils/miscUtils";

function MovePropBox({ move }: { move: Move }) {
  const moveAttr: string[] = move.properties ? move.properties : ["None"];

  return (
    <div className="flex gap-2 text-white">
      {moveAttr.map((attr) => (
        <span key={attr} className="font-pkmnem text-xs">
          {capitalize(attr)}
        </span>
      ))}
    </div>
  );
}

export default MovePropBox;
