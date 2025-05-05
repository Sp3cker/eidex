import { EvolutionFamily } from "../../../utils/evoFamily";
import getSprite from "../../../utils/getSprite";
import { FaArrowRight } from "react-icons/fa";
import { parseEvolutions } from "../../../utils/parseEvo";
import { getNameKey } from "../../../utils/pokemonData";
import { Pokemon } from "../../../types";
import Evolution from "./Evolution";

// This is a derivative type that sets 'evolutions' to not-undefined.
// This component wont render if 'evolutions' is undefined anyways...

type EvolvingPokemon = Required<Pokemon> & {
  evolutions: NonNullable<Pokemon["evolutions"]>;
};

interface EvolutionViewProps {
  family: EvolutionFamily;
  isShiny: boolean;
  pokemon: EvolvingPokemon;
  onClickPokemon: (pokemonId: number) => void;
}

const EvolutionView: React.FC<EvolutionViewProps> = ({
  family,
  isShiny = false,
  onClickPokemon,
}) => {
  // Group members by stage
  const stages: Record<number, typeof family.members> = {};
  family.members.forEach((member) => {
    if (stages[member.stage] === undefined) {
      stages[member.stage] = [];
    }
    stages[member.stage].push(member);
  });

  const sortedStages: number[] = Object.keys(stages)
    .map(Number) // parseInt wont work :S
    .sort((a, b) => a - b);

  // Build the columns and arrows in a flat array
  const columnsWithArrows: React.ReactNode[] = sortedStages.map(
    (stage, idx) => {
      return (
        <>
          <div
            key={stage}
            className="flex cursor-pointer flex-col items-center"
          >
            {stages[stage].map((member) => {
              return (
                <Evolution
                  key={member.id}
                  sprite={getSprite(member.id, isShiny)}
                  alt={member.name}
                  onClick={() => onClickPokemon(member.id)}
                  requirements={member.requirements}
                />
              );
            })}
          </div>
          {idx < sortedStages.length - 1 && (
            <FaArrowRight key={`arrow-${stage}`} className="mx-2 text-2xl" />
          )}
        </>
      );
    },
  );

  return (
    <div className="border-1 flex flex-row items-center justify-evenly rounded-md border-neutral-600 bg-neutral-900/30 p-2 py-3 text-white">
      {family.members.length > 1 ? columnsWithArrows : <p>No Evolutions</p>}
    </div>
  );
};

export default EvolutionView;
