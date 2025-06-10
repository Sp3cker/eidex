import { Pokemon } from "@/types";
import React from "react";

interface FormeViewProps {
  pokemon: Pokemon;
  isShiny: boolean;
  onClickPokemon: (pokemonId: number) => void;
}

export const FormeView: React.FC<FormeViewProps> = ({}) => {
  return (
    <div className="neutral-box flex flex-row flex-wrap justify-evenly gap-2 rounded-md p-2">
      {/* {altFormes.map((form: Pokemon) => (
        // <div
        //   key={form.index}
        //   className="w-25 flex cursor-pointer flex-col items-center rounded-md bg-zinc-700 p-2"
        //   onClick={() => onClickPokemon(form.index)}
        // >
        //   <SpriteImage pokemon={form} />
        //   <span className="font-pixel text-center text-xs text-gray-200">
        //     {form.nameKey}
        //   </span>
        // </div>
      ))} */}
    </div>
  );
};
