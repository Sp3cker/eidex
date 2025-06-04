import ItemsListContent from "./ItemListContent";
import { Item } from "@/data/map";
type CoolItem = { scriptName: string; items: Item[]; pokemon: string[] };

const StoryItems = ({ scriptedGives }: { scriptedGives: CoolItem[] }) => {
  // Group by scriptName and sum items by name within each group

  return (
    <div>
      {scriptedGives.map(({ scriptName, items }) => (
        <div key={scriptName}>
          <h3 className="cool-font md:text-md mb-2 mt-2 border-b-2 border-stone-400 pb-1 text-xs font-bold">
            {scriptName}
          </h3>
          {items.length > 0 && <ItemsListContent items={items} />}
        </div>
      ))}
    </div>
  );
};

export default StoryItems;
