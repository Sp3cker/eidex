import EncounterMonsList from "./EncounterMonsList";
import { useWindowSize } from "@/hooks/useWindowResize";
const EncounterHeader = ({ text }: { text: string }) => (
  <p className="text-shadow-xs pl-2 text-center font-bold text-stone-700">
    {text}
  </p>
);
const renderList = (selectedTab: string, largeScreen: boolean) => {
  if (largeScreen) {
    return (
      <div className="grid w-auto grid-cols-3">
        <div className="flex-1 flex-col items-center">
          <EncounterHeader text="Land" />
          <EncounterMonsList zone="land" />
        </div>
        <div className="flex-1 flex-col items-center">
          <EncounterHeader text="Water" />
          <EncounterMonsList zone="water" />
        </div>
        <div className="flex-1 flex-col items-center">
          <EncounterHeader text="Fishing" />
          <EncounterMonsList zone="fishing" />
        </div>
      </div>
    );
  } else {
    return selectedTab === "land" ? (
      <EncounterMonsList zone="land" />
    ) : selectedTab === "water" ? (
      <EncounterMonsList zone="water" />
    ) : selectedTab === "fishing" ? (
      <EncounterMonsList zone="fishing" />
    ) : null;
  }
};
const EncounterMonsContainer = ({ selectedTab }: { selectedTab: string }) => {
  const { width } = useWindowSize();
  const largeOrSmall = width >= 1024;

  return (
    <div className="min-h-80 min-w-40 flex-1">
      {renderList(selectedTab, largeOrSmall)}
    </div>
  );
};

export default EncounterMonsContainer;
