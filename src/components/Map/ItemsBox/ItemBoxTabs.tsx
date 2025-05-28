type ItemBoxTabsProps = {
  selectedTab: string;
  setSelectedTab: (string: string) => void;
};
import "./itemsBoxTabs.css";
const TABS = [
  { label: "Items", color: "pink" },
  { label: "Trainers", color: "green" },
];
function ItemBoxTabs({ setSelectedTab, selectedTab }: ItemBoxTabsProps) {
  return (
    <div className="flex flex-0 space-x-2">
      {TABS.map((tab) => {
        const isActive = selectedTab === tab.label;
        const base = `rounded-xl px-2  font-bold transition-all cursor-pointer select-none  shadow-sm`;
        const color = isActive
          ? `bg-white text-emerald-700 border-emerald-400 shadow-md -mb-1 z-10`
          : `bg-${tab.color}-100 text-${tab.color}-700 border-${tab.color}-200`;
        return (
          <button
            key={tab.label}
            onClick={() => setSelectedTab(tab.label)}
            className={`${base} ${color}`}
            style={{
              minWidth: "90px",
              boxShadow: isActive
                ? "0 2px 8px 0 rgba(0,0,0,0.10)"
                : "0 1px 2px 0 rgba(0,0,0,0.06)",
            }}
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default ItemBoxTabs;
