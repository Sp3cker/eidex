import { memo } from "react";
import type { DisplayTrainer } from "@/data/map/trainers";
import { aiFlags } from "./aiFlags";

// background:linear-gradient(120deg, #de8c8c 0%, #daa4a4 100%)
// 'background-image: linear-gradient( 135deg, #FDEB71 10%, #F8D800 100%);';
// const superRareColor = "#F2C46D";
// const eliteColor = "#58238C";
const rarityColors = ["normal-ai-flag", "rare-ai-flag", "elite-ai-flag"];

const AIFlags = ({ flags }: { flags: (keyof typeof aiFlags)[] }) => {
  if (flags.length === 0) {
    return "None";
  }
  return (
    <div className="font-calamity space-y-1 text-xs/4 text-gray-600">
      {[...flags]
        .sort((a, b) => aiFlags[b].rarity - aiFlags[a].rarity)
        .map((flag, index) => {
          const bg = rarityColors[aiFlags[flag].rarity];
          return (
            <p
              className={`pkmn-types rounded ${bg} px-2 py-0.5 text-gray-700`}
              key={index}
            >
              {aiFlags[flag].desc}
            </p>
          );
        })}
    </div>
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
      className={`max-w-100 flex flex-row justify-between gap-2 md:flex-row ${trainer.boss ? "h-40" : "h-35"} ${className}`}
    >
      {/* Trainer Image and Name */}
      <div className="flex w-[45%] items-start gap-2">
        <div className="relative flex flex-col">
          <img
            src={`/trainers/${trainer.battlePic}`}
            alt={trainer.trainerName}
            className="h-20 w-20 md:h-30 md:w-30 drop-shadow-md"
            style={imageStyles}
          />
          <div className="flex flex-row justify-between">
            <h3
              className={`font-calamity ${trainer.boss && "drop-shadow-sm"} w-full text-xl font-bold text-gray-800`}
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
            <span className="me-2 rounded-sm bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              Hard
            </span>
          )}
        </div>
      </div>

      {/* AI Flags - responsive positioning */}

      <AIFlags flags={trainer.aiFlags as (keyof typeof aiFlags)[]} />
    </div>
  );
});

export default TrainerInfo;
