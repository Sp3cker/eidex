import { StatArray } from "@/types";
import { animated, useTransition, useSpring } from "@react-spring/web";
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
  const bstValue = reorderedStats.reduce((sum, stat) => sum + stat.stat, 0);
  const bst = useSpring({
    from: {
      opacity: 0,
      translateX: 0,
    },
    to: {
      opacity: 1,
      translateX: bstValue,
    },
  });

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
    <div className="pkmnem-face-shadow neutral-box flex h-[10rem] w-full flex-col items-center gap-1 rounded-sm p-2">
      {transitions((springs, stat, _, index) => (
        <div key={stat.label} className="flex h-4 w-full items-center gap-3">
          <p className="font-calamity w-5 text-xs text-neutral-200">
            {STAT_LABELS[index]}
          </p>
          <div className="relative h-4 flex-1 overflow-hidden pt-1">
            <animated.div
              style={{ opacity: springs.opacity }}
              className={`stat-bar ${getBarColor(stat.stat)} absolute h-2 w-full rounded rounded-sm transition-colors`}
            />
            <animated.div
              className="cover rounded-right bg-linear-to-r absolute h-2 w-full from-neutral-900/90 to-neutral-900"
              style={{
                transform: springs.coverTranslate.to(
                  (t) => `translateX(${t}%)`,
                ),
              }}
            />
          </div>
          <p className="font-pkmnem pkmnem-face-shadow w-8 text-left text-lg font-bold tracking-wide text-neutral-100">
            {stat.stat}
          </p>
        </div>
      ))}
      <hr className="border-0 bg-neutral-200 dark:bg-neutral-200" />

      <div className="flex h-4 w-full items-center gap-3">
        <p className="font-calamity w-5 text-sm font-bold text-amber-200">
          BST
        </p>
        <div className="relative h-4 flex-1 overflow-hidden pt-1">
          <animated.div
            style={{ opacity: bst.opacity }}
            className={`stat-bar ${getBarColor(bstValue / 5)} absolute h-2 w-full rounded rounded-sm`}
          />
          <animated.div
            className="cover rounded-right absolute h-2 w-full bg-neutral-900"
            style={{
              transform: bst.translateX.to(
                (t) => `translate3d(${(t / 790) * 100}%, 0,0)`,
              ),
            }}
          />
        </div>
        <p
          className={`font-pkmnem pkmnem-face-shadow mt-[-0.1rem] w-8 text-left text-xl font-bold tracking-wide text-neutral-100`}
        >
          {bstValue}
        </p>
      </div>
    </div>
  );
}
