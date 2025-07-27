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
  return (
    <table
      title="took me 2 hours to pick these colors lol"
      className="max-w-120 w-full table-fixed border-collapse border-0 text-neutral-800"
    >
      <thead className="font-calamity pkmn-types bg-slate-400">
        <tr className="font-calamity text-center text-[10px]/6 font-bold tracking-wide text-stone-50">
          <th className="w-1/6 rounded-tl-sm pl-2">HP</th>
          <th className="w-1/6">Attack</th>
          <th className="w-1/6">Def</th>
          <th className="w-1/6">Sp.A</th>
          <th className="w-1/6">Sp.Def</th>
          <th className="w-1/6 rounded-tr-sm">Speed</th>
        </tr>
      </thead>
      <tbody className="font-pkmnem bg-slate-600 text-center text-lg/6 font-bold tracking-wide sm:text-xl">
        <tr>
          <td
            className={`pl-1 rounded-bl-sm ${stats[1] === 0 ? "text-blue-300" : stats[2] === 0 ? "text-red-300" : "text-stone-200"}`}
          >
            {stats[0][0]} {stats[1] === 0 ? "↑" : stats[2] === 0 ? "↓" : ""}
          </td>
          <td
            className={`${stats[1] === 1 ? "text-blue-300" : stats[2] === 1 ? "text-red-300" : "text-stone-200"}`}
          >
            {stats[0][1]} {stats[1] === 1 ? "↑" : stats[2] === 1 ? "↓" : ""}
          </td>
          <td
            className={`${stats[1] === 2 ? "text-blue-300" : stats[2] === 2 ? "text-red-300" : "text-stone-200"}`}
          >
            {stats[0][2]} {stats[1] === 2 ? "↑" : stats[2] === 2 ? "↓" : ""}
          </td>
          <td
            className={`${stats[1] === 3 ? "text-blue-300" : stats[2] === 3 ? "text-red-300" : "text-stone-200"}`}
          >
            {stats[0][3]} {stats[1] === 3 ? "↑" : stats[2] === 3 ? "↓" : ""}
          </td>
          <td
            className={`${stats[1] === 4 ? "text-blue-300" : stats[2] === 4 ? "text-red-300" : "text-stone-200"}`}
          >
            {stats[0][4]} {stats[1] === 4 ? "↑" : stats[2] === 4 ? "↓" : ""}
          </td>
          <td
            className={`rounded-br-sm ${stats[1] === 5 ? "text-blue-300" : stats[2] === 5 ? "text-red-300" : "text-stone-200"}`}
          >
            {stats[0][5]} {stats[1] === 5 ? "↑" : stats[2] === 5 ? "↓" : ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
});

export default PartyMonsStats;
