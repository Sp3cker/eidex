import EncounterMonsList from "./EncounterMonsList";
import { useWindowSize } from "@/hooks/useWindowResize";
const EncounterHeader = ({ text }: { text: string }) => (
  <p className="pl-2 text-center font-bold text-neutral-700">{text}</p>
);
const renderList = (selectedTab: string, largeScreen: boolean) => {
  if (largeScreen) {
    return (
      <div className="grid grid-cols-3">
        <div className="flex flex-col items-center">
          <EncounterHeader text="Land" />
          <EncounterMonsList zone="land" />
        </div>
        <div className="flex flex-col items-center">
          <EncounterHeader text="Water" />
          <EncounterMonsList zone="water" />
        </div>
        <div className="flex flex-col items-center">
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
    <div className="flex-1 min-h-80 min-w-40  overflow-y-scroll">
      {renderList(selectedTab, largeOrSmall)}
    </div>
  );
};

export default EncounterMonsContainer;
