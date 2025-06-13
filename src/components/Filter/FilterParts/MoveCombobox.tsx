import GenericComboBox, { ComboBoxEntry } from "./GenericComboBox";
import moveData from "@/data/moveData.json";
import { useCallback, useMemo } from "react";
import { LuSword } from "react-icons/lu";
import { Move } from "@/types";
import { useFilterStore } from "@/stores/filterStore";

const moveIDMap: ComboBoxEntry[] = Object.values(moveData)
  .filter((m) => typeof m === "object" && !!m && "id" in m)
  .map((m) => ({
    id: (m as Move).id,
    name: (m as Move).name,
  }));

function MoveCombobox() {
  const moveEntries: ComboBoxEntry[] = useMemo(() => moveIDMap, []);
  const moveValue = useFilterStore((state) => state.moveValue);
  const setFilter = useFilterStore((state) => state.setFilter);
  const handleChange = useCallback((entry: ComboBoxEntry | null) => {
    if (entry) {
      setFilter("moveId", entry ? entry.id : null);
    } else setFilter("moveId", null);
  }, []);
  return (
    <GenericComboBox
      entries={moveEntries}
      onSelect={handleChange}
      value={moveValue}
      placeholder="Pick a move..."
      icon={<LuSword />}
    />
  );
}
export default MoveCombobox;
