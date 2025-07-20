import { useState } from "react";
import { Ability } from "../../types";
import AbilityDescription from "./AbilityDescription";
import AbilityBadge from "./AbilityBadge";
import InfoLabelBadge from "../ui/InfoLabelBadge";

type AbilityBoxProps = {
  abilities: Ability[];
};

export default function AbilityBox({ abilities }: AbilityBoxProps) {
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  //If the first ability is repeated, replace repeats with 0
  abilities.forEach((ability, index) => {
    if (abilities.indexOf(ability) !== index) {
      abilities[index] = 0;
    }
  });
  const regularAbilities = abilities.slice(0, 2);
  const hiddenAbility = abilities[2];

  return (
    <div>
      <div className="neutral-box relative flex w-full flex-col rounded-sm px-3 py-7 text-center">
        <InfoLabelBadge text="Abilities" />

        <div className="flex w-full flex-row justify-evenly">
          {regularAbilities.map((ability) => (
            <AbilityBadge
              key={ability}
              ability={ability}
              onClick={() => setSelectedAbility(ability)}
            />
          ))}
          <AbilityBadge
            ability={hiddenAbility}
            onClick={() => setSelectedAbility(abilities[2])}
            isHidden
          />
        </div>
          <div className="mt-3">
            <AbilityDescription
              selectedAbility={selectedAbility}
              onClose={() => setSelectedAbility(null)}
            />
          </div>
      </div>
    </div>
  );
}
