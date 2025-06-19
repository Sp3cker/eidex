// eidex/src/components/Map/ItemsBox/ItemsList.tsx
import { useState, memo, useEffect } from "react";
import TabNavigation from "./Tabs";
import ItemListContent from "./ItemListContent";
import { TabType, useItemsData } from "./useItemsData";
import StoryItems from "./StoryItems";

const ItemsList = memo(function ItemsList() {
  const [selectedTab, setSelectedTab] = useState<TabType>("story");

  const { whatToShow, items } = useItemsData(selectedTab);
  useEffect(() => {

    if (whatToShow.story === false && whatToShow.marts === false) {
      setSelectedTab("pickup"); // pickup could be false too but whatev
    } else if (whatToShow.story) {
      setSelectedTab("story");
    } else if (whatToShow.marts) {
      setSelectedTab("marts");
    }
  }, []);

  return (
    <>
      <TabNavigation
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        whatToShow={whatToShow}
      />
      {whatToShow.story && selectedTab === "story" ? (

        //@ts-ignore
        <StoryItems scriptedGives={items.items} />
      ) : (
        //@ts-ignore
        <ItemListContent items={items.items} />
      )}
    </>
  );
});

export default ItemsList;
