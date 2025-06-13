import GenericComboBox, { ComboBoxEntry } from "./GenericComboBox";
import abilities from "../../../data/abilityData.json";
import { getAbilityName } from "../../../utils/abilityData";
import { useCallback } from "react";
import { IoRibbon } from "react-icons/io5";
import { useFilterStore } from "../../../stores/filterStore";

const abilityIDMap: ComboBoxEntry[] = abilities
  .map((ability) => ({
    id: ability.id,
    name: getAbilityName(ability.id),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

function AbilityCombobox() {
  const abilityValue = useFilterStore((state) => state.abilityId);
  const setAbilityValue = useFilterStore((state) => state.setFilter);

  const handleSelect = useCallback((entry: ComboBoxEntry | null) => {
    if (entry) {
      setAbilityValue("abilityId", entry.id);
    } else setAbilityValue("abilityId", null);
  }, []);
  return (
    <div className="w-full">
      <GenericComboBox
        entries={abilityIDMap}
        onSelect={handleSelect}
        placeholder="Select an ability..."
        icon={<IoRibbon />}
        value={abilityValue}
      />
    </div>
  );
}

export default AbilityCombobox;
