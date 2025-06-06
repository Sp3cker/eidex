import { StatArray } from "@/types";
import { animated, useTransition } from "@react-spring/web";
import "./statsBar.css";
const STAT_LABELS = ["HP", "ATK", "DEF", "SPA", "SPD", "SPE"];

export type StatBarsProps = {
  stats: StatArray;
};

const getBarColor = (stat: number) => {
  if (stat <= 20) return "stats-red";
  if (stat < 50) return "stats-orange";
  if (stat < 80) return "stats-yellow";
  if (stat < 120) return "stats-green";
  if (stat < 150) return "stats-teal";
  return "stats-teal";
};

export default function StatBars({ stats }: StatBarsProps) {
  const reorderedStats = [
    { label: "HP", stat: stats[0] },
    { label: "ATK", stat: stats[1] },
    { label: "DEF", stat: stats[2] },
    { label: "SPA", stat: stats[4] },
    { label: "SPD", stat: stats[5] },
    { label: "SPE", stat: stats[3] },
  ];
  const highestStat = Math.max(...reorderedStats.map((x) => x.stat), 150);
  // Create springs for bars and covers
  const transitions = useTransition(reorderedStats, {
    key: (item: any) => item.label,
    from: {
      opacity: 0,
      coverTranslate: 0,
    },
    leave: { opacity: 0 },
    enter: ({ stat }) => ({
      coverTranslate: 10 + (stat / highestStat) * 100,
      background: getBarColor(stat),
      opacity: 1,
    }),
    update: ({ stat }) => ({
      coverTranslate: 10 + (stat / highestStat) * 100,
      background: getBarColor(stat),
    }),
    config: { frequency: 0.21, damping: 1.2 },
    trail: 21,
  });

  return (
    <div className="neutral-box flex h-[136px] w-full select-none flex-col gap-1 rounded-sm p-2">
      {transitions((springs, stat, _, index) => (
        <div
          key={stat.label}
          className="mx-auto flex h-4 w-full items-center gap-2"
        >
          <span className="font-pixel w-8 text-sm text-gray-200">
            {STAT_LABELS[index]}
          </span>
          <div className="relative h-4 flex-1 overflow-hidden">
            <animated.div
              style={{ opacity: springs.opacity }}
              className={`stat-bar ${getBarColor(stat.stat)} absolute h-2 w-full rounded rounded-sm`}
            />
            <animated.div
              className="cover rounded-right absolute h-2 w-full bg-neutral-900"
              style={{
                transform: springs.coverTranslate.to(
                  (t) => `translate3d(${t}%, 0,0)`,
                ),
              }}
            />
          </div>
          <span className="font-pixel w-8 text-right text-sm text-gray-300">
            {stat.stat}
          </span>
        </div>
      ))}
    </div>
  );
}
