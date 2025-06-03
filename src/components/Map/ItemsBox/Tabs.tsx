import React, { useCallback } from "react";
import { TabType } from "./useItemsData";

interface TabNavigationProps {
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  isMarts: boolean;
}
const TAB_CONFIG = {
  story: { label: "Story Items", className: "story-tab" },
  pickup: { label: "Pickup Items", className: "story-tab" },
  marts: { label: "PokéMart", className: "pokemart-tab" },
};

const TabNavigation = React.memo<TabNavigationProps>(function TabNavigation({
  selectedTab,
  setSelectedTab,
  isMarts,
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget;
      const title = target.getAttribute("title");
      if (title && Object.keys(TAB_CONFIG).includes(title)) {
        setSelectedTab(title as TabType);
      }
    },
    [setSelectedTab],
  );

  return (
    <div className="font-pkmnem tab-list block text-nowrap">
      <button
        title="story"
        className={`tab-label px-2 text-lg font-bold ${
          selectedTab === "story" ? TAB_CONFIG.story.className : ""
        }`}
        onClick={handleClick}
      >
        {TAB_CONFIG.story.label}
      </button>

      <button
        title="pickup"
        className={`tab-label px-2 text-lg font-bold ${
          selectedTab === "pickup" ? TAB_CONFIG.pickup.className : ""
        }`}
        onClick={handleClick}
      >
        {TAB_CONFIG.pickup.label}
      </button>

      {isMarts && (
        <button
          title="marts"
          className={`tab-label px-2 text-lg font-bold ${
            selectedTab === "marts" ? TAB_CONFIG.marts.className : ""
          }`}
          onClick={handleClick}
        >
          {TAB_CONFIG.marts.label}
        </button>
      )}
    </div>
  );
});

export default TabNavigation;
