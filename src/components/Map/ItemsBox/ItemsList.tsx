// eidex/src/components/Map/ItemsBox/ItemsList.tsx
import { useState, memo } from "react";
import TabNavigation from "./Tabs";
import ItemListContent from "./ItemListContent";
import { isStoryItems, TabType, useItemsData } from "./useItemsData";
import StoryItems from "./StoryItems";

const getEmptyMessage = (tab: TabType): string => {
  switch (tab) {
    case "story":
      return "No story items in this area";
    case "marts":
      return "No shop items in this area";
    case "pickup":
      return "No pickup items in this area";
    default:
      return "No items found";
  }
};
const ItemsList = memo(function ItemsList() {
  const [selectedTab, setSelectedTab] = useState<TabType>("story");

  const items = useItemsData(selectedTab);

  if (!items) {
    return <p>{getEmptyMessage(selectedTab)}</p>;
  }

  return (
    <>
      <TabNavigation
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        isMarts={selectedTab === "marts" && items.items.length > 0}
      />
      {isStoryItems(items) ? (
        <StoryItems scriptedGives={items.items} />
      ) : (
        <ItemListContent items={items.items} />
      )}
    </>
  );
});

export default ItemsList;
