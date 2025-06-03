// eidex/src/components/Map/ItemsBox/ItemsList.tsx
import { useState, memo } from "react";
import TabNavigation from "./Tabs";
import SelectedItems, { EmptyState } from "./SelectedItems";
import { TabType, useItemsData } from "./useItemsData";

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

  const filteredItems = useItemsData(selectedTab);

  if (!filteredItems?.hasItems) {
    return <EmptyState message="No items in this area" />;
  }

  return (
    <>
      <TabNavigation
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        isMarts={filteredItems.hasMarts}
      />
      <ItemsListContent
        selectedTab={selectedTab}
        items={filteredItems.items}
        emptyMessage={getEmptyMessage(selectedTab)}
      />
    </>
  );
});

export default ItemsList;
