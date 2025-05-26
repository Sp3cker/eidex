import useMapStore from "@/stores/useMapStore";
import { useState, useMemo, memo } from "react";
import Tabs from "./Tabs";
import { Item } from "@/utils/itemsData";

const ItemsList = memo(function ItemsList() {
  const [selectedTab, setSelectedTab] = useState("EventScript");
  const items = useMapStore((state) => state.selectedMapItems);
  const [places, martItems] = useMemo(() => {
    if (items === undefined) {
      return [null, null];
    }
    const places: { place: string; items: Item[] }[] = [];
    const keys = Object.keys(items).filter((p) => p !== "marts");

    keys.forEach((k) => {
      const obj = {
        place: k,
        items: items[k],
      };
      places.push(obj);
    });
    return [places, items["marts"] || null];
  }, [items, selectedTab]);

  // const itemsToShow = martItems && martItems.length > 0 && selectedTab === "marts" ? martItems : places;
  return (
    <>
      <Tabs
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        isMarts={martItems !== null && martItems.length > 0}
      />
      {places === null ? (
        <p className="text-center text-xs font-bold text-neutral-700">
          No items in this area
        </p>
      ) : selectedTab !== "marts" ? (
        places.map((place) => <PlacesList key={place.place} place={place} />)
      ) : (
        martItems.map((m) => (
          <p
            className="my-1 cursor-pointer rounded border border-sky-200 bg-emerald-50 px-3 py-2 text-xl font-bold text-sky-700 shadow-sm transition-colors hover:bg-emerald-100"
            key={m.id}
          >
            {m.name}
          </p>
        ))
      )}
    </>
  );
});
const PlacesList = ({ place }: { place: { place: string; items: Item[] } }) => (
  <>
    <p
      key={place.place}
      className="cool-font mb-2 mt-4 border-b-2 border-emerald-400 pb-1 font-bold tracking-wide"
    >
      {place.place}
    </p>
    <PlaceItems items={place.items} />
  </>
);
const PlaceItems = ({ items }: { items: Item[] }) => (
  <div className="shadow-inner">
    {items.map((i) => (
      <p
        key={i.name}
        className="my-1 cursor-pointer rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xl font-bold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100"
      >
        {i.name}
      </p>
    ))}
  </div>
);
export default ItemsList;
// <div key={theirData} className="h-10">
//           <p className="cool-font text-xs font-bold">{item.name}</p>
//           <p className="leading-4">
//             {item.qualifier ? item.qualifier : "Received from quest"}
//           </p>
//         </div>
