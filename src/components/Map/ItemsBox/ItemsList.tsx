// eidex/src/components/Map/ItemsBox/ItemsList.tsx
import { useState, memo, useEffect } from "react";
import TabNavigation from "./Tabs";
import ItemListContent from "./ItemListContent";
import { TabType, useItemsData } from "./hooks/useItemsData";
import StoryItems from "./StoryItems";
import { ItemWithAmount, LevelScriptedEvent } from "@/data/map";

const ItemsList = memo(function ItemsList({ firstItemRef }: any) {
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
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Tab Navigation */}
      <TabNavigation
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        whatToShow={whatToShow}
      />
      <div ref={firstItemRef}>
        {whatToShow.story && selectedTab === "story" ? (
          <StoryItems 
            scriptedGives={items.items as LevelScriptedEvent[]} 
          />
        ) : (
          <ItemListContent
            items={items.items as ItemWithAmount[]}
            showPrice={selectedTab === "marts"}
          />
        )}
      </div>
    </div>
  );
});

export default ItemsList;
