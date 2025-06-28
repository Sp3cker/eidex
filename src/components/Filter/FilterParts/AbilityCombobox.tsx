import GenericComboBox, { ComboBoxEntry } from "./GenericComboBox";
import abilities from "../../../data/abilityData.json";
import { getAbilityName } from "../../../utils/abilityData";
import { useCallback, useMemo } from "react";
import { IoRibbon } from "react-icons/io5";
import { useFilterStore } from "../../../stores/filterStore";

function AbilityCombobox() {
  const abilityValue = useFilterStore((state) => state.abilityId);
  const setAbilityValue = useFilterStore((state) => state.setFilter);
  const abilityIDMap: ComboBoxEntry[] = useMemo(
    () =>
      abilities
        .map((ability) => ({
          id: ability.id,
          name: getAbilityName(ability.id),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  // Convert the stored abilityId back to the full ComboBoxEntry object
  const selectedAbility = useMemo(() => {
    if (!abilityValue) return null;
    return abilityIDMap.find(ability => ability.id === abilityValue) || null;
  }, [abilityValue, abilityIDMap]);

  const handleSelect = useCallback((entry: ComboBoxEntry | null) => {
    if (entry) {
      setAbilityValue("abilityId", entry.id);
    } else setAbilityValue("abilityId", null);
  }, [setAbilityValue]);
  return (
    <div className="w-full">
      <GenericComboBox
        entries={abilityIDMap}
        onSelect={handleSelect}
        placeholder="Select an ability..."
        icon={<IoRibbon />}
        value={selectedAbility}
      />
    </div>
  );
}

export default AbilityCombobox;
