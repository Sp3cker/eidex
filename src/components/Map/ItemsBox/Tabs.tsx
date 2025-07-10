import React, { useCallback } from "react";
import { TabType } from "./hooks/useItemsData";

interface TabNavigationProps {
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  whatToShow: {
    story: boolean;
    marts: boolean;
    pickup: boolean;
  };
}
const TAB_CONFIG = Object.freeze({
  story: { label: "Story Items", className: "story-tab" },
  pickup: { label: "Pickup Items", className: "story-tab" },
  marts: { label: "PokéMart", className: "pokemart-tab" },
});

const TabNavigation = React.memo<TabNavigationProps>(function TabNavigation({
  selectedTab,
  setSelectedTab,
  whatToShow,
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
    <div
      className="font-pkmnem tab-list block text-nowrap"
      role="tablist"
      aria-label="Items tabs"
    >
      <button
        role="tab"
        title="story"
        className={`tab-label font-bold ${
          selectedTab === "story" ? TAB_CONFIG.story.className : ""
        } `}
        aria-selected={selectedTab === "story"}
        onClick={handleClick}
        disabled={!whatToShow.story}
      >
        {TAB_CONFIG.story.label}
      </button>

      <button
        role="tab"
        title="pickup"
        className={`tab-label px-2 font-bold ${
          selectedTab === "pickup" ? TAB_CONFIG.pickup.className : ""
        }`}
        onClick={handleClick}
        disabled={!whatToShow.pickup}
      >
        {TAB_CONFIG.pickup.label}
      </button>

      <button
        role="tab"
        title="marts"
        className={`tab-label font-bold ${
          selectedTab === "marts" ? TAB_CONFIG.marts.className : ""
        }`}
        onClick={handleClick}
        disabled={!whatToShow.marts}
      >
        {TAB_CONFIG.marts.label}
      </button>
    </div>
  );
});

export default TabNavigation;
