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
    <>
      {scriptedGives.map(({ items, pokemon, explanation }) => (
        <section key={explanation} itemScope itemType="https://schema.org/gameItem">
          <h3 className="cool-font md:text-md mb-2 mt-2 border-b-2 border-stone-400 pb-1 text-xs/4 font-bold">
            {explanation}
          </h3>
          {items.length > 0 && (
            <ItemsListContent showPrice={false} items={items} />
          )}
          {pokemon.length > 0 && <PokemonListContent pokemon={pokemon} />}
        </section>
      ))}
    </>
  );
};

export default StoryItems;
