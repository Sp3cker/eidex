import ItemsListContent from "./ItemListContent";
import PokemonListContent from "./PokemonListContent";
import { LevelScriptedEvent } from "@/data/map";

const StoryItems = ({
  scriptedGives,
}: {
  scriptedGives: LevelScriptedEvent[];
}) => {
  // Group by scriptName and sum items by name within each group

  return (
    <div>
      {scriptedGives.map(({ items, pokemon, explanation }) => (
        <div key={explanation} itemScope itemType="https://schema.org/gameItem">
          <h3 className="cool-font md:text-md mb-2 mt-2 border-b-2 border-stone-400 pb-1 text-xs font-bold">
            {explanation}
          </h3>
          {items.length > 0 && <ItemsListContent items={items} />}
          {pokemon.length > 0 && <PokemonListContent pokemon={pokemon} />}
        </div>
      ))}
    </div>
  );
};

export default StoryItems;
