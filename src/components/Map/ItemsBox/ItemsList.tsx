// eidex/src/components/Map/ItemsBox/ItemsList.tsx
import { useState, memo, useEffect } from "react";
import TabNavigation from "./Tabs";
import ItemListContent from "./ItemListContent";
import { TabType, useItemsData } from "./hooks/useItemsData";
import StoryItems from "./StoryItems";
import { ItemWithAmount, LevelScriptedEvent } from "@/data/map";

const ItemsList = memo(function ItemsList() {
  const [selectedTab, setSelectedTab] = useState<TabType>("story");

  const { whatToShow, items } = useItemsData(selectedTab);
  useEffect(() => {
    if (whatToShow.story) {
      setSelectedTab("story");
    } else if (whatToShow.pickup) {
      setSelectedTab("pickup");
    } else if (whatToShow.marts) {
      setSelectedTab("marts");
    }
  }, []);

  return (
    <>
      {/* Tab Navigation */}
      <TabNavigation
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        whatToShow={whatToShow}
      />

      {whatToShow.story && selectedTab === "story" ? (
        <StoryItems scriptedGives={items.items as LevelScriptedEvent[]} />
      ) : (
        <ItemListContent
          items={items.items as ItemWithAmount[]}
          showPrice={selectedTab === "marts"}
        />
      )}
    </>
  );
});

export default ItemsList;
