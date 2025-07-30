import { getTypeSnapColor } from "../../utils/typeInfo";
import { TypeBadge } from "../TypeBadges/TypeBadge";
import { getAbilityName } from "../../utils/abilityData";
import { Pokemon } from "../../types";
import chroma from "chroma-js";
import { useUIStore } from "@/stores/uiStore";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import React from "react";
import SpriteImage from "../SpriteImage";

type PokemonCardProps = {
  pokemon: Pokemon;
};

const adjustedBgCache: Record<number, string> = {};

const statLabels = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
export const PokemonCard = React.memo(function Card({
  pokemon,
}: PokemonCardProps) {
  // Get UI State from store
  const openModal = useUIStore((state) => state.openModal);
  const screenWidth = useScreenWidth();

  const { dexId, nameKey, types, stats, abilities } = pokemon;

  // Convert the ID to a string and pad it with leading zeros and a #
  const formattedId = `#${String(dexId).padStart(3, "0")}`;

  // Reorder stats to speed is moved from third to last
  const reorderedStats = [
    stats[0],
    stats[1],
    stats[2],
    stats[3],
    stats[4],
    stats[5],
  ];

  // Calculate the BST (Base Stat Total)
  const bst = React.useMemo(
    () => stats.reduce((sum, stat) => sum + stat, 0),
    [stats],
  );

  let adjustedBg = adjustedBgCache[types[0]];
  if (!adjustedBg) {
    const snapColor = getTypeSnapColor(types[0]);
    const bgColor = chroma(snapColor);
    adjustedBg = bgColor.darken(1.2).mix("black", 0.7).alpha(0.13).css();
    adjustedBgCache[types[0]] = adjustedBg;
  }

  //If the first ability is repeated, replace repeats with 0
  abilities.forEach((ability, index) => {
    if (abilities.indexOf(ability) !== index) {
      abilities[index] = 0;
    }
  });

  return (
    <div
      onClick={() => openModal(pokemon)}
      className="relative w-full cursor-pointer"
    >
      <div className="flex w-full flex-col text-neutral-50">
        {/* Header */}
        <div className="flex justify-between bg-neutral-700/20 py-1 pl-2">
          <div className="flex items-center gap-1">
            {/* Sprite and name  */}
            <SpriteImage pokemon={pokemon} />
            <div className="text-md font-calamity font-bold">{nameKey}</div>

            {/* Types */}
            <div className="mt-1 flex flex-col items-center gap-0 justify-self-end px-2 md:flex-row md:gap-1">
              {types.map((typeId: number, index: number) => (
                <div key={index}>
                  <TypeBadge typeId={typeId} screenWidth={screenWidth} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center px-3">{formattedId}</div>
        </div>
        <div className="px-5 py-6" style={{ backgroundColor: adjustedBg }}>
          <div className="border-3 relative mb-5 mt-3 flex flex-row gap-5 rounded-md border-neutral-600 p-4 py-2">
            <span className="absolute -top-2.5 left-2 h-4 rounded-sm border border-gray-300 bg-gray-800 px-2 py-0 text-xs font-bold text-gray-200 md:-top-3 md:h-5">
              <p className="ios-padding-fix font-calamity -mt-px p-0 md:mt-px">
                Abilities
              </p>
            </span>
            {abilities.map((abilityId: number, index: number) => {
              const name = getAbilityName(abilityId);
              if (name === "None") return null;
              const isHidden = index === abilities.length - 1; // last one = Hidden

              return (
                <div
                  key={index}
                  className={`font-calamity text-left ${
                    isHidden ? "text-amber-400" : ""
                  }`}
                >
                  {name}
                </div>
              );
            })}
          </div>

          {/* Stats here */}
          <div className="flex flex-col">
            <div className="flex items-start gap-2 text-center ">
              {reorderedStats.map((statValue, index) => (
                <div
                  key={index}
                  className="align-start flex min-w-1 flex-col items-center"
                >
                  <div className="font-pkmnem text-xl/4 font-bold tracking-wide">
                    {statValue}
                  </div>
                  <div className="font-calamity text-sm font-bold text-neutral-100/70">
                    {statLabels[index]}
                  </div>
                </div>
              ))}
              {/* BST box, styled identically to stat boxes */}
              <div className="flex flex-col items-center border-l border-amber-400/50 pl-3">
                <div className="font-pkmnem text-xl/4 font-bold">{bst}</div>

                <div className="font-calamity font-xs font-bold text-amber-400">
                  BST
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
