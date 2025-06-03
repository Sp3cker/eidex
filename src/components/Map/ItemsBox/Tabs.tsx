import React, { useCallback } from "react";
type TabType = "story" | "marts" | "pickup";
const [STORY, MARTS, PICKUP] = ["story", "marts", "pickup"];
const Tabs = React.memo(function Tabs({
  selectedTab,
  setSelectedTab,
  isMarts,
}: {
  selectedTab: TabType;
  setSelectedTab: (str: TabType) => void;
  isMarts: boolean;
}) {
  //   const [selectedTab, setSelectedTab] = useState("story");
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const title = target.getAttribute("title");
    if (title) {
      setSelectedTab(title as TabType);
    }
  }, []);
  return (
    <div className="font-pkmnem tab-list block text-nowrap">
      <button
        title={STORY}
        className={`tab-label px-2 text-lg font-bold ${selectedTab === STORY && "story-tab"}`}
        onClick={handleClick}
      >
        Story Items
      </button>
      <button
        title={PICKUP}
        className={`tab-label px-2 text-lg font-bold ${selectedTab === PICKUP && "story-tab"}`}
        onClick={handleClick}
      >
        Story Items
      </button>
      {isMarts && (
        <button
          title={MARTS}
          className={`tab-label px-2 text-lg font-bold ${selectedTab === MARTS && "pokemart-tab"}`}
          onClick={handleClick}
        >
          PokéMart
        </button>
      )}
    </div>
  );
});

export default Tabs;
