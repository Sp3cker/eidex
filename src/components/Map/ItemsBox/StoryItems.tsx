import { ScriptedGive } from "@/utils/itemsData";
import ItemsListContent from "./ItemListContent";
import { Item } from "@/data/map";
type CoolItem = { scriptName: string; items: Item[]; pokemon: string[] };
const StoryItems = ({ scriptedGives }: { scriptedGives: CoolItem[] }) => {
  const groupedScriptedGives = scriptedGives.reduce(
    (acc, item) => {
      if (!acc[item.scriptName]) {
        acc[item.scriptName] = { items: [], pokemon: [] };
      }
      for (const i of item.items) {
        acc[item.scriptName].items.push(i);
      }
      for (const i of item.pokemon) {
        acc[item.scriptName].pokemon.push(i);
      }
   
      return acc;
    },
    {} as Record<string, { items: Item[]; pokemon: string[] }>,
  );

  return (
    <div>
      {Object.entries(groupedScriptedGives).map(([scriptName, { items }]) => (
        <div key={scriptName}>
          <h3 className="cool-font md:text-md mb-2 mt-2 border-b-2 border-stone-400 pb-1 text-xs font-bold">
            {scriptName}
          </h3>
          {items.length > 0 && <PlaceItems items={items} />}
        </div>
      ))}
    </div>
  );
};
const PlaceItems = ({ items }: { items: Item[] }) => (
  <div>
    {items.map((i) => (
      <div
        key={i.name}
        className="cool-font items-list-item mb-1 flex cursor-pointer flex-col rounded border border-slate-200 p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 md:py-2"
      >
        <p className="text-xs/4 font-bold md:text-sm">{i.name}</p>
        <p className="font-pkmnem text-shadow-2xs leading-4">{i.description}</p>
      </div>
    ))}
  </div>
);
export default StoryItems;
