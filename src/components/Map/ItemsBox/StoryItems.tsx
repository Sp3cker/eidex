import ItemsListContent from "./ItemListContent";
import PokemonListContent from "./PokemonListContent";
import { LevelScriptedEvent } from "@/data/map";
import WildMonListContent from "./WildMonListcontent";

const StoryItems = ({
  scriptedGives,
}: {
  scriptedGives: LevelScriptedEvent[];
}) => {
  return (
    <>
      {scriptedGives.map(({ items, pokemon, wildMon, explanation }) => (
        <section
          key={explanation}
          itemScope
          itemType="https://schema.org/gameItem"
        >
          <h3 className="font-calamity md:text-md border-b-2 border-stone-400 py-2 pb-1 text-sm/3 tracking-tight text-stone-700">
            {explanation}
          </h3>
          {items.length > 0 && (
            <ItemsListContent showPrice={false} items={items} />
          )}
          {pokemon.length > 0 && <PokemonListContent pokemon={pokemon} />}
          {wildMon && wildMon.length > 0 && (
            <WildMonListContent wildMon={wildMon} />
          )}
        </section>
      ))}
    </>
  );
};

export default StoryItems;
