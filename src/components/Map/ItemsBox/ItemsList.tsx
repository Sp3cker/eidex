// eidex/src/components/Map/ItemsBox/ItemsList.tsx
import { useState, memo, useEffect } from "react";
import TabNavigation from "./Tabs";
import ItemListContent from "./ItemListContent";
import { TabType, useItemsData } from "./useItemsData";
import StoryItems from "./StoryItems";

// const getEmptyMessage = (tab: TabType): string => {
//   switch (tab) {
//     case "story":
//       return "No story items in this area";
//     case "marts":
//       return "No shop items in this area";
//     case "pickup":
//       return "No pickup items in this area";
//     default:
//       return "No items found";
//   }
// };
const ItemsList = memo(function ItemsList() {
  const [selectedTab, setSelectedTab] = useState<TabType>("story");

  const { whatToShow, items } = useItemsData(selectedTab);
console.log("whatToShow", whatToShow);
  useEffect(() => {

    if (whatToShow.story === false && whatToShow.marts === false) {
      setSelectedTab("pickup"); // pickup could be false too but whatev
    } else if (whatToShow.story && whatToShow.pickup === false) {
      setSelectedTab("story");
    } else if (whatToShow.marts) {
      setSelectedTab("marts");
    }
  }, []);

  // if (items.items.length === 0) {
  //   return <p>{getEmptyMessage(selectedTab)}</p>;
  // }

  return (
    <>
      <TabNavigation
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        whatToShow={whatToShow}
      />
      {whatToShow.story && selectedTab === "story" ? (
        //@ts-ignore
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
