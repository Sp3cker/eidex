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
  const isAnyItems =
    items !== null &&
    (items.pickupItems.length > 0 ||
      items.scriptedGives.items.length > 0 ||
      items.scriptedGives.pokemon.length > 0);
  // const itemsToShow = martItems && martItems.length > 0 && selectedTab === "marts" ? martItems : places;
  if (!isAnyItems) {
    return (
      <p className="cool-font py-2 text-center text-sm text-gray-500">
        No items in this area
      </p>
    );
  }
  return (
    <>
      <Tabs
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        isMarts={items.shopItems !== undefined}
      />
      {selectedTab !== "marts" ? (
        <PlaceItems items={items.shopItems} />
      ) : (
        <p>IDK</p>
      )}
    </>
  );
});
const PlacesList = ({ place }: { place: { place: string; items: Item[] } }) => (
  <>
    <p
      key={place.place}
      className="cool-font md:text-md mb-2 mt-2 border-b-2 border-stone-400 pb-1 text-xs font-bold"
    >
      {placeLabeltoHuman(place.place)}
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
export default ItemsList;
// <div key={theirData} className="h-10">
//           <p className="cool-font text-xs font-bold">{item.name}</p>
//           <p className="leading-4">
//             {item.qualifier ? item.qualifier : "Received from quest"}
//           </p>
//         </div>
