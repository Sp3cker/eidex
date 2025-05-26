import React, { useCallback } from "react";

const Tabs = React.memo(function Tabs({
  selectedTab,
  setSelectedTab,
  isMarts,
}: {
  selectedTab: string;
  setSelectedTab: (str: string) => void;
  isMarts: boolean;
}) {
  //   const [selectedTab, setSelectedTab] = useState("story");
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const title = target.getAttribute("title");
    if (title) {
      setSelectedTab(title);
    }
  }, []);
  return (
    <div className="font-pkmnem tab-list block text-nowrap">
      <button
        title="EventScript"
        className={`tab-label px-2 text-lg font-bold ${selectedTab === "EventScript" && "story-tab"}`}
        onClick={handleClick}
      >
        Story Items
      </button>
      {isMarts && (
        <button
          title="marts"
          className={`tab-label px-2 text-lg font-bold ${selectedTab === "marts" && "pokemart-tab"}`}
          onClick={handleClick}
        >
          PokéMart
        </button>
      )}
    </div>
  );
});

export default Tabs;
