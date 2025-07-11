import { memo } from "react";
import type { DisplayTrainer } from "@/data/map/trainers";
import { aiFlags } from "./aiFlags";

// background:linear-gradient(120deg, #de8c8c 0%, #daa4a4 100%)
// 'background-image: linear-gradient( 135deg, #FDEB71 10%, #F8D800 100%);';
// const superRareColor = "#F2C46D";
// const eliteColor = "#58238C";
const rarityColors = [
  "normal-ai-flag",
  "rare-ai-flag",
  "elite-ai-flag",
  "hard-ai-flag",
];

const AIFlagsLabel = memo(function ({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-35 shadow-xs relative flex h-full min-h-40 rounded-lg p-1 pt-4 ring-1 ring-gray-300">
      <div
        style={{ top: "-0.5rem", left: "0.5rem" }}
        className="absolute h-5 rounded rounded-sm bg-cyan-900 px-2 text-stone-300 ring-1 ring-zinc-500"
      >
        <p style={{ fontSize: 10 }} className="font-calamity leading-5">
          AI Flags
        </p>
      </div>
      {children}
    </div>
  );
});
const AIFlags = ({ flags }: { flags: (keyof typeof aiFlags)[] }) => {
  if (flags.length === 0) {
    return "None";
  }
  return (
    <AIFlagsLabel>
      <div className="font-pkmnem space-y-1 text-sm/4 tracking-wide sm:text-base/4">
        {flags
          .sort((a, b) => aiFlags[b].rarity - aiFlags[a].rarity)
          .filter((flag) => flag !== "SMART_MON_CHOICES")
          .map((flag, index) => {
            const bg = rarityColors[aiFlags[flag].rarity];
            return (
              <p
                className={`text-shadow-sm rounded ${bg} px-2 py-0.5`}
                key={index}
              >
                {aiFlags[flag].desc}
              </p>
            );
          })}
      </div>
    </AIFlagsLabel>
  );
};
const imageStyles: React.CSSProperties = {
  imageRendering: "pixelated",
  filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
  maskImage:
    "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
};
const TrainerInfo = memo(function TrainerInfo({
  trainer,
  className = "",
}: {
  trainer: DisplayTrainer;
  className?: string;
}) {
  return (
    <div
      className={`max-w-100 h-35 flex flex-row justify-between ${className}`}
    >
      {/* Trainer Image and Name */}
      <div className="sm:max-w-30 flex max-w-20 items-start gap-2">
        <div className="relative flex flex-col">
          <img
            src={`/trainers/${trainer.battlePic}`}
            alt={trainer.trainerName}
            className="md:h-30 md:w-30 h-20 w-20 drop-shadow-md"
            style={imageStyles}
          />
          <div className="flex flex-row justify-between">
            <h3
              className={`font-calamity ${trainer.boss && "drop-shadow-(--color-rare)"} w-full text-sm font-bold text-gray-800 md:text-xl`}
            >
              {trainer.trainerName}
            </h3>
            {trainer.trainerName === "X" && (
              <p className="font-pkmnem text-xs/2 inline tracking-tight text-gray-500">
                His name is really X it's not an error
              </p>
            )}
          </div>
          {trainer.boss && (
            <div className="me-2 rounded-sm bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              <p>Hard</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Flags - responsive positioning */}

      <AIFlags flags={trainer.aiFlags as (keyof typeof aiFlags)[]} />
    </div>
  );
});

export default TrainerInfo;
