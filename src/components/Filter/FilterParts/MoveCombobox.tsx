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
  const selectedMove = useFilterStore((state) => state.moveId);
  const setFilter = useFilterStore((state) => state.setFilter);

  const handleChange = useCallback((entry: ComboBoxEntry | null) => {
    setFilter("moveId", entry);
  }, [setFilter]);

  return (
    <GenericComboBox
      entries={moveEntries}
      onSelect={handleChange}
      value={selectedMove}
      placeholder="Pick a move..."
      icon={<LuSword />}
    />
  );
}
export default MoveCombobox;
