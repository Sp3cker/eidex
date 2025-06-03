import useMapStore from "@/stores/useMapStore";
import { useState, useMemo, memo } from "react";
import { useShallow } from "zustand/shallow";
import Tabs from "./Tabs";
import { Item } from "@/utils/itemsData";
import SelectedItems from "./SelectedItems";

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
  const [selectedTab, setSelectedTab] = useState<"story" | "marts" | "pickup">(
    "story",
  );
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
      <SelectedItems items={items} selectedTab={selectedTab} />
    </>
  );
});
export default ItemsList;
