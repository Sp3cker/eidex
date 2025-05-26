import useMapStore from "@/stores/useMapStore";
import { useState, useMemo } from "react";
import Tabs from "./Tabs";
import { Item } from "@/utils/itemsData";

const ItemsList = () => {
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
        places.map((place) => (
          <PlacesList key={place.place} place={place} />
        ))
      ) : (
        martItems.map((m) => <p key={m.id}>{m.name}</p>)
      )}
    </>
  );
};
const PlacesList = ({ place }: { place: { place: string; items: Item[] } }) => (
  <>
    <p key={place.place} className="cool-font text-sm font-bold">
      {place.place}
    </p>
    <PlaceItems items={place.items} />
  </>
);
const PlaceItems = ({ items }: { items: Item[] }) => (
  <div>
    {items.map((i) => (
      <p key={i.name}>{i.name}</p>
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
