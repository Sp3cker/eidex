import { Item, ItemsByMap } from "@/utils/itemsData";
import { useMemo } from "react";
type ItemWithAmount = Item & { amount: number };

const reduceItemsToAmountMap = (items: Item[]) =>
  items.reduce((acc: Record<string, ItemWithAmount>, item: Item) => {
    if (!acc[item.name]) {
      acc[item.name] = { ...item, amount: 0 };
    }
    acc[item.name].amount += 1;
    return acc;
  }, {});

const SelectedItems = ({
  selectedTab,
  items,
}: {
  items: ItemsByMap;
  selectedTab: "story" | "marts" | "pickup";
}) => {
  const summedUpItems = useMemo(() => {
    const scriptedGives = reduceItemsToAmountMap(items.scriptedGives.items);
    const shopItems = reduceItemsToAmountMap(items.shopItems);
    const pickupItems = reduceItemsToAmountMap(items.pickupItems);
  }, [items]);
  if ("story" === selectedTab) {
    return (
      <div className="flex flex-col">
        {items.scriptedGives?.items && items.scriptedGives.items.length > 0 ? (
          <PlaceItems items={items.scriptedGives.items} />
        ) : (
          <p className="cool-font py-2 text-center text-sm text-gray-500">
            No story items in this area
          </p>
        )}
      </div>
    );
  }

  if ("marts" === selectedTab) {
    return (
      <div className="flex flex-col">
        {items.shopItems && items.shopItems.length > 0 ? (
          <PlaceItems items={items.shopItems} />
        ) : (
          <p className="cool-font py-2 text-center text-sm text-gray-500">
            No shop items in this area
          </p>
        )}
      </div>
    );
  }

  if ("pickup" === selectedTab) {
    return (
      <div className="flex flex-col">
        {items.pickupItems && items.pickupItems.length > 0 ? (
          <PlaceItems items={items.pickupItems} />
        ) : (
          <p className="cool-font py-2 text-center text-sm text-gray-500">
            No pickup items in this area
          </p>
        )}
      </div>
    );
  }

  // Default fallback - this was missing!
  return null;
};

const PlacesList = ({ place }: { place: { place: string; items: Item[] } }) => (
  <>
    <p
      key={place.place}
      className="cool-font md:text-md mb-2 mt-2 border-b-2 border-stone-400 pb-1 text-xs font-bold"
    >
      {place.place}
    </p>
    <PlaceItems items={place.items} />
  </>
);
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
export default SelectedItems;
