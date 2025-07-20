import { memo, useMemo } from "react";
import capStore from "../CapSelector/capStore";
import { calculateStatsOld } from "@/utils/calcStatsByLevel";
type StatsProps = {
  id: number;
  level: number;
  hasIvs: boolean;
  evs: number[];
  nature: string;
};
const StatLevels = ["HP", "Atk", "Def", "SpA", "SpD", "Spd"] as const;

const PartyMonsStats = memo(function PartyMonsStats({
  id,
  level,
  hasIvs,
  evs,
  nature,
}: StatsProps) {
  const currLevelCap = capStore.use.currentCap();
  const stats = useMemo(() => {
    // If mon is above level cap, scale it down to the cap and
    // apply delta to calc its level.
    const scaledLevel = level > 199 ? currLevelCap - (200 - level) : level;
    return calculateStatsOld(id, scaledLevel, hasIvs, evs, nature);
  }, [id, currLevelCap, hasIvs, evs, nature]);
  if (!stats || stats[0] === undefined) {
    return null;
  }

  return stats[0].map((stat, index) => (
    <div
      key={index}
      className={`${index > 0 && stats[1] === index ? "border-1 border-green-500 bg-green-500/15" : stats[2] === index ? "border-1 border-red-500 bg-red-500/15" : "border-1 border-gray-400 bg-stone-100"} md:w-15 flex w-10 flex-col items-center justify-evenly rounded-md p-1`}
    >
      <p className="font-calamity text-[8px]/3 font-bold text-neutral-600">
        {StatLevels[index]}
      </p>
      <p className="pkmn-types font-calamity text-xs/4 tracking-tight">
        {stat}
      </p>
    </div>
  ));
});

export default PartyMonsStats;
