import useMapStore from "@/stores/useMapStore";
import { useState, useMemo, memo } from "react";
import Tabs from "./Tabs";
import { Item } from "@/utils/itemsData";

const placeLabeltoHuman = (place: string) => {
  const key: Record<string, string> = {
    EventScript: "Story/Quest",
    PrettyPetalFlowerShop: "Pretty Petal Flower Shop",
    WallysHouse: "Wally's House",
    ScottsHouse: "Scott's House",
    PokemonCenter: "Pokémon® Center",
    MoveRelearnersHouse: "Move Relearner's House",
    CreatorHouse: "Creator's House",
    House4: "House 4",
    House2: "House 2",
    StevensRoom: "Steven's Room",
    HerbShop: "Herb Shop",
    BattleTentLobby: "Battle Tent",
    CuttersHouse: "Cutter's House",
    DevonCorp: "Devon Corp®",
    Flat2: "Flat 2",
    PokemonSchool: "Pokemon School",
    OceanicMuseum: "Oceanic Museam",
    PokemonFanClub: "Pokémon® Fan Club",
    SpaceCenter: "Space Center",
    StevensHouse: "Steven's House",
  };
  return key[place] || place;
};
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
        <p className="cool-font py-2 text-center text-sm text-gray-500">
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
      className="cool-font md:text-md mb-2 mt-4 border-b-2 border-stone-400 pb-1 text-xs font-bold"
    >
      {placeLabeltoHuman(place.place)}
    </p>
    <PlaceItems items={place.items} />
  </>
);
const PlaceItems = ({ items }: { items: Item[] }) => (
  <div>
    {items.map((i) => (
      <div key={i.name} className="flex flex-col">
        <p className="my-1 cursor-pointer rounded border border-slate-200 bg-slate-50 px-3 py-0 text-lg font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 md:py-2 md:text-xl">
          {i.name}
        </p>
        <p>{i.description}</p>
      </div>
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
